# remedi

리메디한의원 홈페이지: https://k-remedi.com/

## 현재 반영 상태

기록일: 2026-10-20. 네이버 SEO와 GEO의 메인 키워드는 **안면비대칭**입니다.

- [x] 안면비대칭 정보 페이지의 원인·증상·진단·질문답변, 탭형 목차, 진료·예약 연결 게시.
- [x] 제목·설명·대표 URL·사이트맵과 병원·의료정보 구조화 데이터 반영.
- [x] 홈페이지에서 안면비대칭 안내 페이지로 연결하는 버튼 게시.
- [x] 네이버 소유확인·사이트맵 제출·수집·색인 완료: 사용자 확인 기준.

대표 페이지: https://k-remedi.com/asymmetry

## 2026-10-20 후속 개선

- 예약 페이지에서 자기 자신을 다시 열던 예약 버튼을 실제 네이버 예약으로 연결하고, 본문 예약 버튼·전화 링크를 추가했습니다.
- 예약 페이지 상단 버튼의 배경·글자·테두리를 보완해 모바일에서도 구분되도록 했습니다.
- 의료진 소개 본문에서 안면비대칭 대표 정보 페이지로 바로 이어지는 링크를 추가했습니다.
- 공식 자료를 바탕으로 상담 전 통증 기록 항목, 치료 후 남을 수 있는 좌우 차이, 갑작스러운 증상이 사라진 경우의 대응 설명을 보완했습니다. 의료진 검수 완료를 의미하지 않습니다.
- 확장자 없는 운영 주소에서도 현재 메뉴가 표시되도록 수정하고, 모바일 메뉴의 숨김·키보드 닫기 동작을 보완했습니다.
- 브라우저 저장소나 자바스크립트를 사용할 수 없는 상황에서도 본문이 보이도록 보완했습니다.
- 실제 번역판이 없는 외국어 페이지 선언을 제거하고, 한국어 본문의 문서 언어를 유지했습니다. 언어 선택기의 일부 접근성 문구 번역은 전체 본문 번역과 구분합니다.

검증: Chrome에서 PC·태블릿·모바일, 예약·전화 링크, 목차 이동, 메뉴·키보드, 저장소 차단, 자바스크립트/IntersectionObserver 비활성 등 20개 항목 통과. 버튼 표시 추가 점검은 320·390·1440px에서 통과했습니다. 스크립트 실행 오류는 없었으며, 실제 예약 제출이나 GA4 전송은 하지 않았습니다. HTML 9개의 내부 경로·앵커·중복 ID와 한글 UTF-8도 별도로 확인했습니다.

## 검색 성과 관찰 기록

점검일: 2026-10-20. 아래 결과는 검색 순위나 AI 추천을 보장하는 기록이 아닙니다.

| 확인 항목 | 결과와 확인 범위 |
| --- | --- |
| 공개 사이트 | 9개 페이지 HTTP 200, UTF-8, 대표 URL, H1 1개씩 확인. robots.txt와 sitemap.xml 응답 정상. |
| 네이버 수집·색인 | 사용자가 완료를 확인함. 로그인된 계정 보고서를 직접 열람한 것은 아님. |
| 일반 웹 검색 도구 | `site:k-remedi.com 안면비대칭`, `"k-remedi.com/asymmetry"`, `"리메디한의원" "안면비대칭"` 세 질의에서 반환 결과 없음. 네이버 순위나 미색인의 증거로 사용하지 않음. |
| 네이버 실제 검색·성과 보고서 | 검색결과 페이지는 현재 도구에서 접근 불가. 계정의 노출·클릭 보고서는 미열람. 미확인 수치를 0으로 기록하지 않음. |
| AI 답변의 실제 홈페이지 인용 | 미측정. 이번 웹 검색을 AI 서비스별 답변 인용 검사로 간주하지 않음. |
| 공개 robots.txt 추가 정책 | Cloudflare가 원본 앞에 관리 정책을 추가함. `search=yes,ai-train=no,use=reference`, `Google-Extended`·`GPTBot` 등의 차단이 있음. 저장소의 `Allow: /`만으로 모든 AI 활용이 허용된다고 판단하지 않음. |
| Cloudflare 기본 AI 정책 | 사용자 확인: Search=`Allow`, Agent=`Allow`, Training=`Disallow`, Bot Preference Sync=`On`. 검색·사용자 요청 접근을 허용하고 학습을 거부하는 기준과 일치하므로 네 항목은 변경하지 않음. 개별 크롤러 규칙과 실제 봇 요청 로그는 별도 확인 대상. |
| Cloudflare 요청 통계 화면 | 2026-10-20 사용자 제공 Overview 화면: 총 93건, Allowed 76건, Unsuccessful 17건. 운영사별 Allowed는 Google 44·Microsoft 23·Baidu 4·Apple 3·OpenAI 1·Perplexity 1·Anthropic 0건. 집계 기간·호스트·경로 필터는 화면에 없어 미확인. 개별 봇이나 `/asymmetry`의 접근·AI 인용 완료로 확대 해석하지 않음. |

공개 robots 규칙상 Yeti·Googlebot·bingbot·OAI-SearchBot은 `/asymmetry`에 접근할 수 있습니다. 이는 실제 봇 IP의 방화벽 통과나 AI 답변 인용을 검증한 결과는 아닙니다. Cloudflare의 `use=reference`는 색인·발췌·링크 범위를 뜻하며, Google-Extended는 Google 검색 노출과 별도로 Gemini 학습 및 일부 grounding 활용을 제어합니다. [Cloudflare 공식 정책](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/), [Google 공식 크롤러 안내](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended)

추후 비교할 때는 조회한 날과 보고서의 업데이트 기준일·집계 기간을 따로 기록합니다. 네이버 노출·클릭 보고서는 반영 시차와 집계 영역 제한이 있으므로 제출 직후 수치만으로 성과를 판단하지 않습니다. [네이버 공식 보고서 안내](https://searchadvisor.naver.com/guide/report-expose-ctr)

AI 인용은 병원명이나 도메인을 미리 제시하지 않은 질문으로 확인합니다. 예: “안면비대칭은 왜 생기나요?”, “안면비대칭은 꼭 치료해야 하나요?”, “안면비대칭 진단은 어떻게 하나요?”. 서비스·모델·검색 기능 사용 여부·날짜·질문·인용 URL을 함께 기록하고, 브랜드명을 넣은 확인 검색은 별도로 구분합니다.

## TODO — 여유 있을 때 진행

분석도구 추가는 사용자 요청으로 보류합니다. SEO·GEO 운영의 필수 조건이 아니며, 현재 GA4는 연결하지 않았습니다. 아래 항목은 자동 실행이나 알림 예약이 아닙니다.

- [ ] **분석도구 추가(선택): GA4 또는 다른 도구 연결**
  - GA4를 선택하면 기존 계정·속성부터 확인하고, 없을 때만 웹 스트림을 생성합니다. 사이트는 `https://k-remedi.com`, 필요한 값은 `G-`로 시작하는 측정 ID입니다.
  - 측정할 흐름: 안면비대칭 페이지 방문 → 진료 안내 확인 → 네이버 예약·전화 클릭.
  - 준비한 이벤트: `clinic_view`, `booking_click`, `phone_click`. 예약·전화 클릭과 실제 예약·통화 완료는 구분합니다.
  - 중복 태그·자동 이벤트와 URL·리퍼러 등 전송 항목을 검토하고, 개인정보나 상담 내용을 보내지 않도록 확인합니다.
  - 실제 이벤트 전송과 GA4 실시간/DebugView 수신까지 확인한 뒤 연결 완료로 표시합니다.
  - 로컬 준비 파일: `conversion-tracking.js`, `GA4_SETUP_TEMP.txt`. 이 두 파일은 현재 저장소 커밋·운영 배포에 포함되지 않았습니다. 기존 검증은 모의 이벤트 테스트이며 실제 수집은 시작하지 않았습니다.
- [ ] **안면비대칭 검색 성과 확인**
  - 공개 사이트 및 일반 검색의 첫 관찰 기록은 위에 남겼습니다. 실제 네이버 수치와 AI 인용 결과는 아직 확인 전입니다.
  - 네이버 서치어드바이저에서 관련 검색어의 노출·클릭·유입 페이지와 보고서 기준일을 기록합니다.
  - AI 검색에서는 질문·서비스·실행일·실제 인용 URL을 기록합니다. 병원명 언급과 홈페이지 출처 인용을 구분합니다.
- [ ] **의료진 확인 후 병원 고유 설명 보강**
  - 실제 초진 평가 순서, 진료 범위, 다른 진료과 평가가 필요한 기준, 기대 변화와 한계를 확인합니다.
  - 확인받은 내용과 실제 검수자·검수일만 반영합니다. 로컬 검토 초안은 `GEO_CLINIC_REVIEW_TEMP.txt`에 있습니다.
- [ ] **Cloudflare의 AI 검색·답변 활용 설정 확인**
  - 2026-10-20 공개 정책 추가 점검 완료: 주요 검색·사용자 요청용 봇 9종의 `/asymmetry` 접근은 robots 규칙상 허용. 학습용 봇 차단을 AI 검색 전체 차단으로 해석하지 않습니다.
  - 2026-10-20 기본 정책 확인 완료(사용자 답변 기준): Search=`Allow`, Agent=`Allow`, Training=`Disallow`, Bot Preference Sync=`On`. 현재 학습 거부를 유지하면서 검색 접근을 허용하는 기준과 일치하므로 이 네 항목은 변경할 필요가 없습니다. `Training=Block`은 혼합목적 검색봇까지 막을 수 있어 구분합니다. [Cloudflare 공식 설명](https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/)
  - 2026-10-20 후속 화면으로 AI Crawl Control의 Overview·Metrics·Security 메뉴 존재를 확인했습니다. 이전의 “메뉴를 찾지 못함” 상태는 해소됐으며, 왼쪽 AI Crawl Control 아래 Security에서 OAI-SearchBot·Claude-SearchBot·PerplexityBot의 Action 값을 확인 요청했습니다. 개별 Block/Charge 여부는 아직 미확인입니다. [공식 크롤러 관리 안내](https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/)
  - Overview의 회사별 카드에는 여러 봇이 묶여 있습니다. Allowed는 2xx 응답 건수이며, Unsuccessful 17건 전체를 방화벽 차단으로 단정하지 않습니다. Anthropic의 Allowed 0건도 Claude-SearchBot 차단의 증거는 아닙니다. [공식 통계 안내](https://developers.cloudflare.com/ai-crawl-control/features/analyze-ai-traffic/)
  - 다음 상세 확인은 Metrics에서 집계 기간·호스트 `k-remedi.com`·경로 `/asymmetry`·개별 크롤러를 구분해 2xx와 기타 응답을 살펴보는 것입니다. 별도 WAF 규칙·검증된 실제 봇 출발지와 AI 답변 인용은 아직 확인하지 않았습니다. 이미 확인한 기본 정책은 유지합니다.
  - 로컬 상세 확인 결과와 절차는 `CLOUDFLARE_GEO_CHECK_TEMP.txt`에 정리했습니다.
  - 현재 공개 관리 정책과 원하는 AI 검색·요약 활용 범위가 일치하는지 확인합니다. 검색용 접근과 학습용 활용을 구분하고, Google-Extended처럼 여러 용도를 함께 제어하는 항목의 영향도 확인합니다.
  - 이번 작업에서는 기존 차단 정책을 변경하지 않았습니다. 로컬 robots에 중복 허용 규칙을 넣어 호스팅 정책이 해제됐다고 간주하지 않습니다.

나중에 재개할 때: **“README TODO의 분석도구 연결부터 진행해줘”**라고 요청하면 됩니다.
