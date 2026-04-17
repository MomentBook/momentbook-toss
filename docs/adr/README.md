# Architecture Decision Records

이 디렉터리는 MomentBook의 중요한 기술 결정을 기록합니다.
형식은 Michael Nygard의 경량 ADR 방식을 따릅니다. 핵심은 장문의 설계서가 아니라, "왜 이 결정을 내렸는지"를 짧고 유지 가능한 형태로 남기는 것입니다.

## 왜 ADR을 쓰는가

- 코드는 현재 상태를 보여주지만, 선택의 이유는 시간이 지나면 금방 사라집니다.
- 이 저장소는 사람과 에이전트가 함께 읽는 작업 공간이므로, 재설명 비용이 큰 결정을 저장소 안에 남겨야 합니다.
- `AGENTS.md`와 `CLAUDE.md`는 짧게 유지하고, 아키텍처 근거는 이 디렉터리에서 관리합니다.

## 상태 규칙

- `Proposed`: 제안되었지만 아직 팀의 기준 결정으로 채택되지 않음
- `Accepted`: 현재 유효한 결정
- `Superseded by ...`: 다른 ADR이 이 결정을 대체함
- `Deprecated`: 더 이상 권장하지 않지만 기록상 보존함

## 작성 규칙

- 문서 하나에는 핵심 결정 하나만 담습니다.
- 제목은 짧은 명사구로 씁니다.
- 번호는 증가만 하고 재사용하지 않습니다.
- 결정이 뒤집혀도 예전 ADR을 지우지 않습니다.
- 코드, 제품 문서, 운영 문서가 바뀌면 ADR과의 정합성도 함께 점검합니다.

## Index

| ADR | Status | Decision |
| --- | --- | --- |
| [0001](0001-use-apps-in-toss-webview-runtime.md) | Accepted | Apps in Toss WebView 런타임과 Granite 설정을 기준 런타임으로 사용한다 |
| [0002](0002-adopt-tds-mobile-and-mobile-first-ui.md) | Accepted | TDS Mobile을 기본 UI 언어로 사용하고 모바일 우선 인터페이스를 유지한다 |
| [0003](0003-model-flow-with-local-state-and-hash-navigation.md) | Accepted | 흐름 제어는 로컬 reducer 상태와 가벼운 hash navigation으로 관리한다 |
| [0004](0004-keep-v1-organization-local-and-heuristic.md) | Accepted | v1 단계에서는 초안 생성과 publish를 로컬 휴리스틱/시뮬레이션으로 유지한다 |

## 참고한 문서

- Michael Nygard, "Documenting Architecture Decisions": https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
- OpenAI, "Introducing Codex": https://openai.com/index/introducing-codex/
- OpenAI, "Harness engineering: leveraging Codex in an agent-first world": https://openai.com/index/harness-engineering/
- Anthropic, "How Claude remembers your project": https://code.claude.com/docs/en/memory
