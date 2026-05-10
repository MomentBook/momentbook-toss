# ADR 0006: Toss v1은 비공개 수동 여정 구성으로 유지한다

- Status: Accepted
- Date: 2026-05-10

## Context

MomentBook Toss 미니앱의 제품 목적이 고품질 자동 정리 프로토타입에서 네이티브 MomentBook 앱 전환을 돕는 Apps in Toss acquisition surface로 바뀌었습니다.

새 방향에서는 사용자가 다른 사람의 공개 여정을 둘러본 뒤, 자신의 사진으로 비공개 여정 초안을 만들어 보게 합니다. 실제 공개, 토스 로그인 기반 계정 연결, 서버 업로드는 개인 사업자 등록과 인증/서버 계약이 정리된 뒤 도입합니다.

또한 Apps in Toss 사진 API는 앨범에서 사진을 가져오는 기능을 제공하지만, 현재 미니앱은 EXIF/GPS 메타데이터에 의존하지 않는 쪽이 더 안전합니다. 따라서 자동 클러스터링보다 사용자가 직접 모먼트를 만들고 메모하는 구조가 제품과 런타임 제약에 더 잘 맞습니다.

## Decision

Toss v1에서는 여정 생성 흐름을 비공개 수동 구성으로 유지합니다.

- 공개 여정 탐색은 예시/마케팅 surface로 제공한다.
- 사용자의 여정 생성은 사진 선택, 여정 제목/설명/대표 사진, 수동 모먼트 구성, 비공개 타임라인 프리뷰로 제한한다.
- 완료 단계는 실제 publish가 아니라 비공개 초안 완료 상태로 표현한다.
- 서버 저장, 공개 URL 생성, 토스 로그인 토큰 교환, 네이티브 앱 계정 연결은 구현하지 않는다.
- EXIF/GPS 기반 자동 grouping은 구현하지 않는다.

## Consequences

- Toss 사용자는 공개/로그인 부담 없이 MomentBook의 결과물 구조를 빠르게 경험할 수 있습니다.
- 서버 인증, 업로드, CORS, review/moderation 계약 없이도 WebView 미니앱을 검증할 수 있습니다.
- `photos: read` 권한은 계속 필요하지만, 사진 메타데이터 품질에 제품 흐름이 묶이지 않습니다.
- 기존 `publish` semantics는 제품 언어에서 제거되고, 코드와 문서는 `privateDraft` 중심으로 갱신해야 합니다.
- 실제 공개 기능을 시작할 때는 인증/서버/업로드/콘텐츠 안전 경계를 다루는 새 ADR이 필요합니다.

## Alternatives Considered

- Toss 미니앱에서 바로 공개 publish를 구현한다.
- 토스 로그인 연동을 먼저 붙이고 서버 저장을 시작한다.
- EXIF/GPS를 파싱해 자동 모먼트 grouping을 유지한다.
- 네이티브 앱 전환만 보여주고 Toss 안의 생성 경험은 제공하지 않는다.

## References

- Apps in Toss fetchAlbumPhotos: https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EC%82%AC%EC%A7%84/fetchAlbumPhotos.html
- Apps in Toss permissions: https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EA%B6%8C%ED%95%9C/permission.html
- Apps in Toss appLogin: https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EB%A1%9C%EA%B7%B8%EC%9D%B8/appLogin.html
- TDS TextArea: https://tossmini-docs.toss.im/tds-mobile/components/TextField/text-area/
