# Pictiq semantic gap report

This report adds communication mode as a second analytical dimension to the complete 120-word crosswalk. It does not change `crosswalk-120.json` or approve any Pictiq addition.

> Use the body for what the body can express. Use the icon for what must remain after the body is gone.

> **Research finding:** NONE is not a single failure state: embodiment may supply a concept, standalone use may expose a need, or the concept may be outside Pictiq scope.

All 85 `NONE` rows remain accounted for. Word-level tags overlap: **59 EMBODIED-OMITTABLE**, **21 STANDALONE-GAP**, and **56 OUT-OF-SCOPE**.

At concept level the shortlist is **2 STRONG / 9 POSSIBLE / 2 DEFER / 2 REJECT**. It contains **11 standalone-gap concepts** and **2 out-of-scope concepts**; overlap with the **12 embodied-omittable concepts** is intentional.

## How to read the states

- **EMBODIED-OMITTABLE** means a live person or visible situation can supply the meaning; it is not evidence that every standalone use is covered.
- **STANDALONE-GAP** means the meaning must remain after the communicator is gone and no current representation preserves it honestly.
- **OUT-OF-SCOPE** means the proposed encoding would copy grammar, create excessive lexical breadth, or lack independent Pictiq utility.

A concept can be both EMBODIED-OMITTABLE and STANDALONE-GAP. `lukin`, for example, can be communicated by gaze or pointing live but may need an explicit visual-attention cue in an unattended artifact.

## Strong reusable candidates

- **generic person** (`EMBODIED-OMITTABLE + STANDALONE-GAP`): Pointing can identify a participant live; a durable safety or travel artifact may still require a neutral person.
- **generic building or home** (`EMBODIED-OMITTABLE + STANDALONE-GAP`): A visible building can be indicated live; an unattended destination or shelter message needs the generic concept to remain.

## Possible reusable candidates

- **visual attention or eye** (`EMBODIED-OMITTABLE + STANDALONE-GAP`): Gaze and pointing work live; an accessibility or attention cue must encode the concept when unattended.
- **basic clothing** (`EMBODIED-OMITTABLE + STANDALONE-GAP`): Visible clothing can be pointed to; remote packing or identification instructions may need an explicit object concept.
- **body or body location** (`EMBODIED-OMITTABLE + STANDALONE-GAP`): A person can indicate a body location live; a stored medical message must preserve where the issue is.
- **hot or fire** (`STANDALONE-GAP`): Heat is not reliably visible or gestureable, and warnings must remain understandable without a communicator.
- **cold** (`STANDALONE-GAP`): Cold is not reliably visible or gestureable, and comfort or safety instructions can outlast the exchange.
- **large and small modifiers** (`EMBODIED-OMITTABLE + STANDALONE-GAP`): Relative scale can be demonstrated live; remote selection instructions may need size encoded.
- **compact color modifier system** (`EMBODIED-OMITTABLE + STANDALONE-GAP`): A visible color can be pointed to live; remote object identification needs the color to survive in the artifact.
- **generic communication or message** (`EMBODIED-OMITTABLE + STANDALONE-GAP`): Voice, phone, or a note can supply the channel live; a channel-neutral interface cue may need an explicit message concept.
- **light or visibility** (`EMBODIED-OMITTABLE + STANDALONE-GAP`): Ambient light can be indicated live; an unattended visibility, lighting, or access instruction may need it encoded.

## Deferred questions

- **generic container** (`EMBODIED-OMITTABLE`): The physical container is usually pointable; standalone demand remains unproven, so keep the proposal deferred.
- **generic animal or wildlife** (`EMBODIED-OMITTABLE`): A visible animal can be indicated directly; standalone warning demand remains too broad and unproven.

## Out-of-scope proposals

- **pronoun and gender system** (`EMBODIED-OMITTABLE + OUT-OF-SCOPE`): Speaker roles, pointing, and a neutral person can supply participants; grammatical person and gender are outside current scope.
- **grammar and relation operators** (`OUT-OF-SCOPE`): These operators would copy language-specific syntax rather than solve an independently demonstrated Pictiq task.

## Parametric color direction

Color is a strong example of the mode distinction: pointing to a visible color is often sufficient live, while a remote instruction must preserve which color identifies the object. The analytical proposal is one stable parametric visual-modifier family, not separate noun-like icons copied from Toki Pona color words. No form, geometry, palette, ID, syntax, or acceptance decision is proposed here.

## Mapping impact

- No DIRECT, PARTIAL, COMPOSED, CONTEXTUAL, or NONE classification changed.
- The source dataset, pilot, visual dictionary, and headline statistics remain unchanged.
- Candidate priority still requires independent Pictiq use cases and the normal specification, perceptual, and acceptance workflow.
