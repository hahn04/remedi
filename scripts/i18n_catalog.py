"""Collect the exact source strings used by static translated pages."""
from __future__ import annotations
from html.parser import HTMLParser
from html import unescape
from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PAGES = ('index.html', 'intro.html', 'asymmetry.html', 'posture.html', 'diet.html', 'bride.html', 'pain.html', 'reviews.html', 'contact.html', 'columns.html') + tuple(
    path.relative_to(ROOT).as_posix() for path in sorted((ROOT/'columns').glob('*.html'))
)
TEXT_ATTRIBUTES = {'alt', 'title', 'aria-label', 'placeholder'}
META_NAMES = {'description', 'keywords', 'author', 'og:title', 'og:description', 'og:site_name', 'twitter:title', 'twitter:description'}
SVG_SOURCE = 'assets/columns/photo-direction.svg'
EXTRA_STRINGS = (
    '{selected} / {total}개 선택',
    '언어 선택',
    '메뉴 열기',
    '언어 버전',
    '예약 서비스와 지도는 외부 사이트에서 열립니다. 연결된 서비스는 한국어로 표시될 수 있습니다.',
)

def normalize(text: str) -> str:
    return re.sub(r'\s+', ' ', unescape(text)).strip()

def strip_managed(text: str) -> str:
    return re.sub(r'[ \t]*<!-- i18n:(?:head|links) -->.*?<!-- /i18n -->\r?\n?', '', text, flags=re.S)

def shared_guide_header(text: str, homepage: str) -> str:
    pattern = r'<header\b[^>]*\bdata-header[^>]*>.*?</header>'
    match = re.search(pattern, homepage, re.S)
    if not match:
        raise ValueError('Homepage shared header is missing')
    return re.sub(pattern, lambda _: match[0], text, count=1, flags=re.S)

def string_id(text: str) -> str:
    return hashlib.sha256(normalize(text).encode('utf-8')).hexdigest()[:12]

def is_text(text: str) -> bool:
    return bool(re.search(r'[A-Za-z\uac00-\ud7a3\u3040-\u30ff\u4e00-\u9fff]', text))

class Catalog(HTMLParser):
    def __init__(self, entries: dict, context: str):
        super().__init__(convert_charrefs=False)
        self.entries = entries
        self.context = context
        self.blocked = None
        self.script_kind = None
        self.script_buffer = ''
        self.option = False

    def add(self, text: str, suffix: str):
        value = normalize(text)
        if not value or not is_text(value):
            return
        key = string_id(value)
        entry = self.entries.setdefault(key, {'source': value, 'contexts': []})
        assert entry['source'] == value
        context = self.context + ':' + suffix
        if context not in entry['contexts']:
            entry['contexts'].append(context)

    def schema(self, value, key=''):
        if isinstance(value, dict):
            for child_key, child in value.items():
                self.schema(child, child_key)
        elif isinstance(value, list):
            for child in value:
                self.schema(child, key)
        elif isinstance(value, str) and re.search(r'[\uac00-\ud7a3]', value):
            self.add(value, 'schema:' + key)

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if tag in ('script', 'style'):
            self.blocked = tag
            self.script_kind = data.get('type')
            self.script_buffer = ''
        if tag == 'option':
            self.option = True
        for key, value in attrs:
            if value and key in TEXT_ATTRIBUTES:
                self.add(value, tag + '@' + key)
        if tag == 'meta' and (data.get('name') in META_NAMES or data.get('property') in META_NAMES):
            self.add(data.get('content', ''), 'meta')

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        if tag == self.blocked:
            if tag == 'script' and self.script_kind == 'application/ld+json':
                self.schema(json.loads(self.script_buffer))
            self.blocked = None
        if tag == 'option':
            self.option = False

    def handle_data(self, data):
        if self.blocked:
            self.script_buffer += data
        elif not self.option:
            self.add(data, 'text')

def collect(sources: dict[str, str]) -> dict:
    entries = {}
    for name, text in sources.items():
        parser = Catalog(entries, name)
        if name == 'asymmetry.html':
            text = shared_guide_header(text, sources['index.html'])
        parser.feed(strip_managed(text))
        parser.close()
    parser = Catalog(entries, 'shared')
    for value in EXTRA_STRINGS:
        parser.add(value, 'interface')
    return entries

def main():
    sources = {name: (ROOT/name).read_bytes().decode('utf-8') for name in (*PAGES, SVG_SOURCE)}
    entries = collect(sources)
    target = ROOT/'content/i18n/catalog.json'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes((json.dumps(entries, ensure_ascii=False, indent=2)+'\n').encode('utf-8'))
    print(f'{len(entries)} source strings; {sum(len(entry["source"]) for entry in entries.values())} source characters')

if __name__ == '__main__':
    main()
