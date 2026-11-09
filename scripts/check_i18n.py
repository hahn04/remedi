#!/usr/bin/env python3
"""Check published language-page contracts, links, and metadata without a browser."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote, urljoin
import json
import re
import xml.etree.ElementTree as ET
from build_i18n import ROOT, BASE, LOCALES, PAGES, LOCALIZED_IMAGES, route

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.tags=[]; self.ids=[]; self.h1=0; self.scripts=[]; self.json_buffer=None
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs); self.tags.append((tag,attrs))
        if attrs.get('id'): self.ids.append(attrs['id'])
        if tag=='h1': self.h1+=1
        if tag=='script' and attrs.get('type')=='application/ld+json': self.json_buffer=''
    handle_startendtag=handle_starttag
    def handle_data(self,data):
        if self.json_buffer is not None: self.json_buffer+=data
    def handle_endtag(self,tag):
        if tag=='script' and self.json_buffer is not None:
            self.scripts.append(json.loads(self.json_buffer)); self.json_buffer=None

def document_path(path):
    path=unquote(path)
    if path.endswith('/'): return ROOT/(path.lstrip('/')+'index.html')
    direct=ROOT/path.lstrip('/')
    return direct if direct.is_file() else ROOT/(path.lstrip('/')+'.html')

def main():
    pages={}; checked_links=0
    for locale, config in LOCALES.items():
        for name in PAGES:
            path=ROOT/name if locale=='ko' else ROOT/locale/name
            raw=path.read_bytes(); text=raw.decode('utf-8')
            assert '\ufffd' not in text and text.encode('utf-8')==raw,path
            page=Page(text); pages[route(name,locale)]=page
            assert page.h1==1 and len(page.ids)==len(set(page.ids)),path
            assert [a['lang'] for t,a in page.tags if t=='html']==[config['html']],path
            expected=BASE+route(name,locale)
            assert [a['href'] for t,a in page.tags if t=='link' and a.get('rel')=='canonical']==[expected],path
            actual={a['hreflang']:a['href'] for t,a in page.tags if t=='link' and a.get('rel')=='alternate' and 'hreflang' in a}
            desired={c['hreflang']:BASE+route(name,code) for code,c in LOCALES.items()}
            desired['x-default']=BASE+route(name,'ko')
            assert actual==desired,(path,actual)
            select=next(a for t,a in page.tags if t=='select' and a.get('id')=='language-select')
            assert all(select['data-language-'+code]==route(name,code) for code in LOCALES),path
            assert [a['value'] for t,a in page.tags if t=='option' and 'selected' in a]==[locale],path
            assert sum(t=='script' and 'meta-pixel.js' in a.get('src','') for t,a in page.tags)==1,path
            assert sum(t=='img' and 'facebook.com/tr?' in a.get('src','') for t,a in page.tags)==1,path
            assert all('noindex' not in a.get('content','').lower() for t,a in page.tags if t=='meta' and a.get('name')=='robots'),path
            if name=='asymmetry.html':
                assert sum(t=='input' and a.get('type')=='checkbox' for t,a in page.tags)==19,path
                assert 'guide-meta' not in text and 'dateModified' not in text,path
                template=next(a['data-check-count-template'] for t,a in page.tags if 'data-check-count' in a)
                assert '{selected}' in template and '{total}' in template,path
            if locale!='ko':
                assert 'site-header--single' in text,path
                for tag,attrs in page.tags:
                    for key in ('src','href'):
                        value=attrs.get(key,'')
                        assert urlsplit(value).path not in {'/assets/'+name for name in LOCALIZED_IMAGES},(path,value,'untranslated image')
                    if tag=='meta' and (attrs.get('property')=='og:image' or attrs.get('name')=='twitter:image'):
                        assert attrs['content']==BASE+f'/assets/i18n/{locale}/main.jpg',(path,'sharing image')
    for route_path,page in pages.items():
        locale = next((code for code in ('en','zh','ja') if route_path.startswith('/'+code+'/')), 'ko')
        for tag,attrs in page.tags:
            for key in ('href','src'):
                value=attrs.get(key)
                if not value: continue
                url=urlsplit(value)
                if (url.scheme and url.scheme not in ('http','https')) or (url.netloc and url.netloc not in ('k-remedi.com','www.k-remedi.com')): continue
                if not url.path:
                    assert not url.fragment or url.fragment in page.ids,(route_path,value)
                    continue
                url=urlsplit(urljoin(BASE+route_path,value))
                canonical_path = url.path[:-10] if url.path.endswith('/index.html') else url.path.removesuffix('.html')
                if tag=='a' and key=='href' and not attrs.get('hreflang') and canonical_path in pages:
                    target_locale=next((code for code in ('en','zh','ja') if canonical_path.startswith('/'+code+'/')), 'ko')
                    assert target_locale==locale,(route_path,value,'wrong language link')
                target=document_path(url.path)
                assert target.is_file(),(route_path,value,target)
                if tag=='a' and url.fragment and url.path in pages:
                    assert url.fragment in pages[url.path].ids,(route_path,value)
                checked_links+=1
    ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls=[node.text for node in ET.parse(ROOT/'sitemap.xml').findall('s:url/s:loc',ns)]
    assert len(urls)==len(set(urls)) and set(urls)=={BASE+url for url in pages},urls
    for locale in ('en','zh','ja'): ET.parse(ROOT/f'assets/i18n/{locale}/photo-direction.svg')
    for locale in ('en','zh','ja'):
        for name in LOCALIZED_IMAGES:
            assert (ROOT/'assets/i18n'/locale/name).is_file(),(locale,name)
    print(f'PASS: {len(pages)} HTML pages; reciprocal alternates, static body, language selectors, {checked_links} local links/assets, 19-item checklists, Pixel, SVG, and sitemap.')

if __name__=='__main__': main()
