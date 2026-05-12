# ADR 0007: Codex 중심 문서 체계로 단순화한다

- Status: Accepted
- Date: 2026-05-12

## Context

이 저장소는 앞으로 Codex만 사용하는 작업 공간입니다.
기존 문서 체계에는 `AGENTS.md`, `CLAUDE.md`, `docs/PRODUCT.md`, ADR이 함께 있어 같은 제품 범위와 작업 규칙이 여러 곳에 중복됐습니다. 중복 문서는 시간이 지나면 드리프트가 생기고, Codex가 자동으로 읽는 컨텍스트를 불필요하게 늘립니다.

OpenAI Codex 문서는 `AGENTS.md`를 프로젝트 지침의 자동 로드 파일로 설명합니다. OpenAI의 agent-first 운영 사례도 `AGENTS.md`를 백과사전이 아니라 짧은 목차로 두고, 구조화된 `docs/`를 기록의 기준으로 삼는 패턴을 권장합니다.

## Decision

이 저장소의 AI 작업 문서 체계를 Codex 중심으로 단순화합니다.

- 루트 `AGENTS.md`는 Codex가 자동으로 읽는 짧은 작업 지도와 불변조건만 담습니다.
- 제품 목적, 범위, 현재 설계, 고위험 구현 불변조건은 `docs/DESIGN.md`에 둡니다.
- 지속되는 기술 결정은 ADR에 남기고 `docs/adr/README.md` 인덱스를 갱신합니다.
- 비자명한 작업 기록은 기존 `docs/ai/`에 짧게 남깁니다.
- `CLAUDE.md`는 제거합니다.
- `docs/PRODUCT.md`는 `docs/DESIGN.md`로 통합합니다.
- Codex 전용 사용을 전제로 하므로 별도 fallback instruction filename을 추가하지 않습니다.

## Consequences

- Codex가 매 작업 시작 시 읽는 지침이 짧아지고, 제품/설계 맥락은 필요할 때 명시적으로 열람할 수 있습니다.
- 제품 범위와 설계 불변조건의 canonical 문서는 `docs/DESIGN.md` 하나로 정리됩니다.
- Claude 전용 메모가 제거되어 에이전트별 지침 드리프트가 줄어듭니다.
- 제품 목적이나 설계가 바뀌면 `docs/DESIGN.md`와 관련 ADR을 함께 갱신해야 합니다.
- `docs/PRODUCT.md`를 참조하던 과거 프롬프트나 외부 문서는 `docs/DESIGN.md`로 갱신해야 합니다.

## References

- OpenAI Developers, "Custom instructions with AGENTS.md": https://developers.openai.com/codex/guides/agents-md
- OpenAI Developers, "Best practices": https://developers.openai.com/codex/learn/best-practices
- OpenAI Developers, "Prompting": https://developers.openai.com/codex/prompting
- OpenAI Developers, "Subagents": https://developers.openai.com/codex/concepts/subagents
- OpenAI, "Harness engineering: leveraging Codex in an agent-first world": https://openai.com/index/harness-engineering/
- OpenAI, "Running Codex safely at OpenAI": https://openai.com/index/running-codex-safely/
- OpenAI, "Unrolling the Codex agent loop": https://openai.com/index/unrolling-the-codex-agent-loop/
