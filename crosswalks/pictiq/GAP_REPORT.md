# Pictiq semantic gap report

This report analyzes the complete 120-word crosswalk. A `NONE` row is evidence of non-equivalence, not automatically a request for an icon.

> A Toki Pona gap becomes a Pictiq candidate only when the concept is independently useful for Pictiq outside the crosswalk.

## A. Strong reusable Pictiq candidates

- **Generic person** (`jan`; potentially useful for `mi`, `sina`, `ona`, `meli`, `mije` without copying pronoun or gender grammar). Travel, safety and interpersonal messages often need a participant.
- **Generic building/home** (`tomo`). The current lexicon has specific venues but no generic shelter, home or building.

Both require independent use-case evidence, silhouette testing and the Pictiq visual QA workflow before any icon proposal.

## B. Possible Pictiq candidates

- **Look / see / eye** (`lukin`): useful for attention and wayfinding, but an eye can imply surveillance or anatomy.
- **Clothing** (`len`) and **body** (`sijelo`): plausible travel/medical needs; scope and silhouette need testing.
- **Hot/fire** (`seli`) and **cold** (`lete`): plausible safety or comfort states; avoid bundling unrelated senses.
- **Large/small modifiers** (`suli`, `lili`): potentially useful in requests, but must not inherit importance, age or evaluation.
- **Generic communication/message** (`toki`) and **light** (`suno`): independently plausible, but current use cases do not yet justify priority.
- **Color modifiers** (`jelo`, `laso`, `loje`, `pimeja`, `walo`): potentially useful for identification; test whether pointing and surrounding context already suffice.

## C. Composition candidates

- Practical commerce: `place_shop + money_coins` for `esun`, tested as a sequence rather than a generic trade tile.
- Exact number senses: retain `qty_1`, `qty_2`, `qty_5` for `wan`, `tu`, `luka`; do not import the words' other senses.
- Specific food/plant contexts: use existing food or flower tiles when the intended referent is concrete; do not treat them as lexical equivalents for `kili`, `pan`, or `kasi`.
- Future person/building concepts, if independently accepted, may compose roles and destinations without adding pronoun grammar.

## D. Context-only concepts

- Approval/rejection (`pona`, `ike`, `ken`) can use `logic_yes` or `logic_no` only in a concrete exchange.
- Want/need (`wile`) is supplied by a concrete need tile and situation.
- Sleep/rest (`lape`) may be inferred from a hotel in a travel request.
- Broken/end/open (`pakala`, `pini`, `open`) may be conveyed by repair or logic tiles only in a clear operational context.
- Demonstratives and participants (`ni`, `mi`, `sina`, `ona`) are often supplied by pointing and conversational roles.

## E. Do-not-add concepts

- Grammar particles and relations: `e`, `en`, `la`, `li`, `pi`, `anu`, `tan`, `taso`, `kepeken`, `o`.
- Possession as a generic relation (`jo`) and broad modality (`ken`, `wile`).
- Toki Pona-specific book interaction (`pu`).
- Broad bundles whose meanings cannot honestly share one Pictiq tile: `kon`, `lawa`, `nasin`, `sewi`, `suwi`, and grammatical/polysemous readings of `lon`.
- Gendered and person pronoun tiles (`meli`, `mije`, `mi`, `sina`, `ona`) until independent Pictiq research establishes a need; a neutral person concept is the stronger first question.

## Reading the result

High `NONE` coverage is expected because Pictiq targets short intent-oriented communication rather than a general lexicon. Candidate priority must come from Pictiq use cases and perceptual testing, not from maximizing this crosswalk's mapping percentage.
