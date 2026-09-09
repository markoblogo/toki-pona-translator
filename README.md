# Toki Pona Toolkit

[![CI](https://github.com/markoblogo/toki-pona-translator/actions/workflows/monorepo-ci.yml/badge.svg)](https://github.com/markoblogo/toki-pona-translator/actions/workflows/monorepo-ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Stars](https://img.shields.io/github/stars/markoblogo/toki-pona-translator?style=social)](https://github.com/markoblogo/toki-pona-translator)

Translate into **Toki Pona**, render the result as **sitelen pona** or **sitelen emoji**, and reuse the same canonical mapping in apps, websites, and publishing workflows.

**[Try the translator](https://toki.abvx.xyz)** · **[Browse the emoji mapping](https://toki.abvx.xyz/mapping/)**

## What is included

| Product | Use it for | Install / open |
| --- | --- | --- |
| Translator | Translate from many languages into Toki Pona with OpenAI and optional Gemini fallback | [Live app](https://toki.abvx.xyz) |
| [`sitelen-emoji`](packages/sitelen-emoji) | Versioned Toki Pona to emoji data and helpers | `pip install sitelen-emoji` or `npm install sitelen-emoji` |
| [`sitelen-layer-plugin`](packages/sitelen-layer-plugin) | Add Latin, sitelen pona, and emoji display modes to a site | `npm install sitelen-layer-plugin` |
| [`sitelen-layer-static`](packages/sitelen-layer-plugin/python/sitelen-layer-static) | Ship the display layer from Python web apps | `pip install sitelen-layer-static` |
| [`toki-pona-formatting-pass`](skills/toki-pona-formatting-pass) | Audit bilingual ODT manuscripts without changing their wording | Copy the skill into your Codex skills directory |

The packages keep their public names and APIs. Their former Git histories are preserved in this repository under `packages/`.

### Pictiq interoperability research

[Pictiq](https://github.com/markoblogo/pictiq) is a minimal visual protocol for short messages. The [120-word crosswalk](crosswalks/pictiq/CROSSWALK_120.md) studies how Toki Pona's broad lexical concepts correspond—or do not correspond—to an embodied, intent-oriented visual protocol. It is a semantic and interoperability stress test, not a claim of historical influence or lexical equivalence.

## Run the translator locally

Requirements: Node.js 22 (see `.nvmrc`) and an OpenAI API key.

```bash
git clone https://github.com/markoblogo/toki-pona-translator.git
cd toki-pona-translator

cd backend
npm ci
cp .env.example .env
# Add OPENAI_API_KEY to .env
npm start
```

In a second terminal:

```bash
cd toki-pona-translator/frontend
npm ci
npm run dev
```

Open <http://localhost:5173>. Set `GEMINI_API_KEY` in `backend/.env` only if you want Gemini as a fallback.

## Use the libraries

```bash
npm install sitelen-emoji sitelen-layer-plugin
```

```ts
import { createSitelenLayerPlugin } from 'sitelen-layer-plugin';
import 'sitelen-layer-plugin/styles.css';
import 'sitelen-layer-plugin/sitelen-pona-font.css';

createSitelenLayerPlugin({ defaultMode: 'sitelen-emoji' }).init();
```

The display layer is not a translator. It renders existing Toki Pona text and reads the canonical profile from [`packages/sitelen-emoji/profiles/default-stable.v1.json`](packages/sitelen-emoji/profiles/default-stable.v1.json).

Install the manuscript QA skill from a clone:

```bash
mkdir -p ~/.codex/skills
cp -R skills/toki-pona-formatting-pass ~/.codex/skills/
```

## Development

Each product remains independently testable and publishable. Run the same checks as CI:

```bash
bash scripts/check-all.sh
```

See [`AGENTS.md`](AGENTS.md) for repository boundaries and [`docs/REPOSITORY-CONSOLIDATION.md`](docs/REPOSITORY-CONSOLIDATION.md) for migration and release continuity.

## Demo

[![Toki Pona Translator demo](https://img.youtube.com/vi/lCAFiDnP2NQ/hqdefault.jpg)](https://youtu.be/lCAFiDnP2NQ)

## License

MIT. The bundled sitelen pona font keeps its own SIL Open Font License notice.
