# Pictiq semantic gap report

> **Status: ACCEPTED RESEARCH DIRECTION — IMPLEMENTATION NOT STARTED.**

This report interprets the final 120-word crosswalk through Pictiq's Embodied/Standalone architecture. It does not create canonical icons, IDs, modifiers, parameters, entity symbols, packs, or registries.

> Use the body for what the body can express. Use the icon for what must remain after the body is gone.

> **Research finding:** NONE is not a single failure state: embodiment may supply a concept, standalone use may expose a need, or the concept may be outside Pictiq scope.

All 88 final `NONE` rows are accounted for. Word-level tags overlap: **60 EMBODIED-OMITTABLE**, **21 STANDALONE-GAP**, and **59 OUT-OF-SCOPE**.

## Strong development candidates

- **neutral person** (`lexical_tile`) — source: `jan`
- **generic building/home design research** (`lexical_tile`) — source: `tomo`

## Standalone implementation candidates

- **GOOD** (`modifier`) — source: `pona`
- **BAD** (`modifier`) — source: `ike`
- **hot/fire** (`lexical_tile`) — source: `seli`
- **cold** (`lexical_tile`) — source: `lete`
- **energy/electricity** (`lexical_tile`) — source: `wawa`
- **produce** (`lexical_tile`) — source: `kili`
- **bakery/bread** (`lexical_tile`) — source: `pan`
- **eye/visual attention** (`lexical_tile`) — source: `lukin`
- **clothing** (`lexical_tile`) — source: `len`
- **communication/speaking** (`lexical_tile`) — source: `toki`
- **light** (`lexical_tile`) — source: `suno`
- **sun/day** (`lexical_tile`) — source: `suno`

GOOD/BAD remain separate from YES/NO. Energy/electricity does not include physical strength. Light and sun/day remain separate until tested.

## Protocol mechanisms

- **LARGE/SMALL** (`modifier`) — source: `suli`, `lili`
- **parametric COLOR** (`parametric_tile`) — source: `kule`, `jelo`, `laso`, `loje`, `pimeja`, `walo`
- **entity symbols / scoped identity** (`entity_symbol`)
- **emission-mark visual convention** (`visual_convention`) — source: `kalama`, `toki`, `suno`

LARGE/SMALL are scale modifiers, not aliases for quantity. Emission marks are a visual convention, not a standalone semantic tile.

## Entity-symbol finding

Proper names expose a scoped entity-symbol mechanism: a narrative pack may assign local visual identifiers to entities such as Odysseus, Penelope, and Telemachus without adding lexical Core tiles.

No entity symbols or namespaces are implemented by this research cycle.

## Parametric color finding

Embodied use can point to an actual color; standalone use may carry an arbitrary color value in a proposed parametric tile. Individual lexical color icons are rejected.

No red, yellow, blue, green, or other canonical lexical color icons are proposed.

## Deferred

- **generic container** (`lexical_tile`) — source: `poki`
- **broad animal categories** (`context_pack`) — source: `akesi`, `kala`, `pipi`, `soweli`, `waso`
- **specialized body-location vocabulary** (`specialized_pack`) — source: `nena`, `sijelo`, `uta`

## Rejected directions

- pronoun system
- grammatical gender
- Toki Pona grammatical particles
- broad possession for lexical completeness
- alphabetic spelling of names
- finite lexical color inventory
- broad Toki-Pona-shaped abstract vocabulary

## Final semantic impact

- `esun` remains COMPOSED as `place_shop + money_coins`.
- `mute` is COMPOSED as `qty_5 + qty_plus`.
- `a`, `nasa`, and `o` are NONE.
- `musi`, `toki`, `unpa`, and `wawa` are CONTEXTUAL examples.
- Existing future candidates do not convert any other NONE mapping.
- Final counts are 0 DIRECT / 19 PARTIAL / 2 COMPOSED / 11 CONTEXTUAL / 88 NONE.
