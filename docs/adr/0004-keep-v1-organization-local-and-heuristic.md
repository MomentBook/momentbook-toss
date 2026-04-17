# ADR 0004: v1 단계에서는 초안 생성과 publish를 로컬 휴리스틱/시뮬레이션으로 유지한다

- Status: Accepted
- Date: 2026-04-18

## Context

제품 가설은 "여행 사진을 빠르게 이야기 단위로 묶어 공유 가능한 형태로 보여주면, 사용자는 빈 캔버스보다 훨씬 쉽게 기록을 완성할 수 있다"입니다.
하지만 현재 저장소에는 서버 API, 영속 저장소, 실제 공유 페이지 생성 백엔드가 없습니다.

한편 사진 사용 연구는 사람들의 디지털 사진 사용이 단순 저장이 아니라 기억, 공유, 회상 같은 목표를 가진 활동임을 보여줍니다.
또 다른 여행 사진 연구는 편집과 재구성 과정이 여행 경험과 기억에 영향을 준다고 설명합니다.
즉, 이 단계에서 가장 먼저 검증해야 할 것은 "더 정교한 AI"보다 "정리 경험 그 자체가 충분히 빠르고 설득력 있는가"입니다.

현재 구현은 이 검증에 맞춰 단순화되어 있습니다.

- 브라우저 파일 또는 Toss 앨범 사진을 읽습니다.
- 촬영 시각과 순서를 바탕으로 사진을 정렬합니다.
- 최대 4개의 moment로 나누는 결정론적 휴리스틱을 사용합니다.
- organizing과 publish는 짧은 지연과 햅틱으로 상태 전이를 표현합니다.
- 결과는 프리뷰 경로 문자열과 카드 UI로만 제공됩니다.

## Decision

v1 단계에서는 초안 생성과 publish를 로컬 휴리스틱/시뮬레이션으로 유지합니다.

- 원격 AI, 서버 저장, 실제 게시 파이프라인은 나중 단계로 미룹니다.
- 현재 코드는 "핵심 가치 제안 검증용 프로토타입"으로 본다.
- 사용자 가치 검증이 끝나기 전까지는 입력 마찰, 정리 속도, 프리뷰 설득력을 우선 최적화합니다.

## Consequences

- 브라우저와 Sandbox에서 빠르게 반복 개발할 수 있습니다.
- 네트워크/백엔드 없이도 데모와 사용성 검증이 가능합니다.
- 결과물 품질은 휴리스틱에 제한되며, 진짜 공유 링크나 복원 가능한 draft는 제공하지 못합니다.
- 실제 게시, 계정 동기화, AI 캡션, 분석 고도화를 시작할 때는 새로운 ADR이 필요합니다.

## Alternatives considered

- 초기 단계부터 서버 저장과 실제 게시 파이프라인 구축
- 초기 단계부터 LLM/ML 기반 순간 분류 로직 도입
- 자동 정리를 포기하고 완전 수동 편집기로 시작

## References

- From PhotoWork to PhotoUse: https://www.tandfonline.com/doi/abs/10.1080/0144929X.2017.1288266
- The influence of travel photo editing on tourists' experiences: https://www.sciencedirect.com/science/article/pii/S0261517723000444
- Atlassian Product Discovery handbook: https://support.atlassian.com/jira-product-discovery/docs/the-product-management-handbook/
