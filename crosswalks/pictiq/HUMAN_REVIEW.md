# Human Review - Full 120-word Crosswalk

> **Status: RESOLVED — 2026-09-09.** The decisions below are applied to the canonical research dataset.

Final acceptance of the complete 120-word Toki Pona to Pictiq interoperability crosswalk.

Final mapping counts: **0 DIRECT / 19 PARTIAL / 2 COMPOSED / 11 CONTEXTUAL / 88 NONE**. Confidence remains **98 high / 19 medium / 3 low**. One tile: **30**; multiple tiles: **2**; no representation: **88**; unresolved review rows: **0**.

A Toki Pona gap becomes a Pictiq candidate only if the concept would materially improve Pictiq even if the Toki Pona crosswalk did not exist.

## Communication-mode interpretation

Use the body for what the body can express. Use the icon for what must remain after the body is gone.

> **Research finding:** NONE is not a single failure state: embodiment may supply a concept, standalone use may expose a need, or the concept may be outside Pictiq scope.

Semantic mapping class and communication-mode interpretation remain separate dimensions. A word can remain `NONE` while embodiment covers live use and standalone use exposes a future development need.

Across the 88 `NONE` rows: **60 EMBODIED-OMITTABLE**, **21 STANDALONE-GAP**, and **59 OUT-OF-SCOPE** word classifications. State counts overlap by design.

- `EMBODIED-OMITTABLE`: A present person, visible referent, gesture, gaze, voice, or shared situation can reliably supply the concept for the embodied use.
- `STANDALONE-GAP`: The concept must survive in an unattended or remote artifact and existing Pictiq tiles or honest composition do not preserve it.
- `OUT-OF-SCOPE`: Explicit encoding would import language-specific grammar, excessive lexical breadth, or a concept without independent Pictiq utility.

## A. Resolved semantic decisions

The table preserves the review reasoning and historical proposal while recording the applied final decision.

| Word | Meaning | Final Pictiq | Final class | Confidence | Why reviewed? | Historical proposal | Final decision |
|---|---|---|---|---|---|---|---|
| `esun` | trade, exchange, market or shop | `place_shop` + `money_coins` | COMPOSED | medium | The only COMPOSED row; shop plus cash clearly signals practical commerce but narrows barter and exchange. | ACCEPT: CONTEXTUAL for a shopping scene; PARTIAL with place_shop; NONE for abstract exchange. | **ACCEPTED COMPOSED: place_shop + money_coins** |
| `a` | interjection or emotional emphasis | NONE | NONE | low | Urgency is only one possible emotional force and can overstate neutral emphasis. | CHANGE TO NONE: NONE. | **CHANGED TO NONE** |
| `ike` | bad, harmful, unpleasant or unneeded | example: `logic_no` | CONTEXTUAL | medium | logic_no expresses rejection only when the situation supplies the evaluated quality. | ACCEPT: NONE as a lexical result. | **ACCEPTED UNCHANGED** |
| `ken` | ability, permission or possibility | example: `logic_yes` | CONTEXTUAL | medium | logic_yes answers a permission question but does not represent ability or possibility. | ACCEPT: NONE as a lexical result. | **ACCEPTED UNCHANGED** |
| `lape` | sleep or rest | example: `place_hotel` | CONTEXTUAL | medium | A hotel suggests sleep only in a travel or lodging context. | ACCEPT: NONE outside a known lodging use case. | **ACCEPTED UNCHANGED** |
| `nasa` | strange, unusual, silly or intoxicated | NONE | NONE | low | Beer suggests only one possible cause of intoxication and risks a misleading stereotype. | CHANGE TO NONE: NONE. | **CHANGED TO NONE** |
| `o` | vocative or imperative particle | NONE | NONE | low | Urgency may reinforce a command but is not a general imperative or vocative marker. | CHANGE TO NONE: NONE; rely on pointing and interaction. | **CHANGED TO NONE** |
| `pakala` | broken, damaged, harmed or mistaken | example: `service_tools` | CONTEXTUAL | medium | A repair tile can imply a broken object, but only within an operational scene. | ACCEPT: NONE for harm or mistake senses. | **ACCEPTED UNCHANGED** |
| `pini` | finish, stop, close or end | example: `logic_no` | CONTEXTUAL | medium | logic_no can mean closed or stopped, while completion and past remain absent. | ACCEPT: PARTIAL if the closed/stopped protocol sense is treated as stable. | **ACCEPTED UNCHANGED** |
| `pona` | good, helpful, pleasant or useful | example: `logic_yes` | CONTEXTUAL | medium | logic_yes communicates approval or OK only within an exchange. | ACCEPT: NONE as a general quality. | **ACCEPTED UNCHANGED** |
| `wile` | want, need, desire or require | example: `need_water` | CONTEXTUAL | medium | need_water is an explicit example of need-intent, not a representation of broad desire. | ACCEPT: NONE as a lexical result. | **ACCEPTED UNCHANGED** |
| `kasi` | plant, vegetation, herb or leaf | `nature_flower` | PARTIAL | medium | A flower is a recognizable plant subtype but covers only a narrow part of the field. | ACCEPT: NONE if subtype overlap is judged too narrow. | **ACCEPTED UNCHANGED** |
| `kili` | fruit, vegetable or mushroom | `need_food` | PARTIAL | medium | need_food is broader and intent-bearing, but the edible-object overlap is useful. | ACCEPT: CONTEXTUAL in a food request. | **ACCEPTED UNCHANGED** |
| `musi` | fun, play, game, art or entertainment | example: `place_disco` | CONTEXTUAL | medium | A disco is one venue and activity; it does not represent general fun, play or art. | CHANGE TO CONTEXTUAL: CONTEXTUAL for nightlife; NONE generally. | **CHANGED TO CONTEXTUAL: example place_disco** |
| `mute` | many, several, quantity, very or twenty | `qty_5` + `qty_plus` | COMPOSED | medium | qty_5 can pragmatically signal many but still depicts a specific number. | ACCEPT: COMPOSED qty_5 + qty_plus for an explicit many expression. | **CHANGED TO COMPOSED: qty_5 + qty_plus** |
| `open` | begin, start, open or turn on | `logic_yes` | PARTIAL | medium | logic_yes has a stable open reading but misses beginning and activation broadly. | ACCEPT: CONTEXTUAL where open/closed is established. | **ACCEPTED UNCHANGED** |
| `pan` | grain, bread or starchy food | `need_food` | PARTIAL | medium | need_food is much broader and carries need intent, but includes the central edible field. | ACCEPT: CONTEXTUAL in a food request. | **ACCEPTED UNCHANGED** |
| `pilin` | emotion, feeling, touch or heart | `love_heart` | PARTIAL | medium | love_heart covers affection only, leaving physical sensation and most emotions outside. | ACCEPT: NONE if affection is too narrow to count as useful overlap. | **ACCEPTED UNCHANGED** |
| `toki` | communication, speech, thought, story or language | example: `comm_phone` | CONTEXTUAL | medium | A phone is a channel/device for one communication mode, not communication itself. | CHANGE TO CONTEXTUAL: CONTEXTUAL for calling; NONE generally. | **CHANGED TO CONTEXTUAL: example comm_phone** |
| `unpa` | sex or sexual activity | example: `item_condom` | CONTEXTUAL | medium | A condom is a related protection object, creating contextual association rather than semantic overlap. | CHANGE TO CONTEXTUAL: NONE outside a safer-sex context. | **CHANGED TO CONTEXTUAL: example item_condom** |
| `wawa` | power, energy, strength or intensity | example: `power_plug` | CONTEXTUAL | medium | A power outlet represents access to electricity, not power or strength generally. | CHANGE TO CONTEXTUAL: CONTEXTUAL for electrical-power requests; NONE generally. | **CHANGED TO CONTEXTUAL: example power_plug** |

## B. NONE concept clusters

All 88 final `NONE` rows appear exactly once below. Gap-state word lists may overlap; future Pictiq candidates do not change the semantic mapping.

| Cluster | Toki Pona words | Semantic concepts | Mode classification | Current workaround | Independent utility | Research disposition |
|---|---|---|---|---|---|---|
| people and social roles | `jan`, `kulupu`, `mama`, `meli`, `mije` | neutral person, group, parent/caretaker and gendered roles | `EMBODIED-OMITTABLE`: `jan`, `mama`, `meli`, `mije`<br>`STANDALONE-GAP`: `jan`<br>`OUT-OF-SCOPE`: `kulupu`, `mama`, `meli`, `mije` | Pointing and conversational context; no generic person tile. | HIGH | **STRONG CANDIDATE** - Advance only a neutral person concept; do not infer separate role or gender tiles. |
| pronouns and deixis | `mi`, `ni`, `ona`, `sina` | I/we, this/that, third person and you | `EMBODIED-OMITTABLE`: `mi`, `ni`, `ona`, `sina`<br>`OUT-OF-SCOPE`: `mi`, `ni`, `ona`, `sina` | Pointing, speaker roles and surrounding context. | LOW | **COMPOSITION / CONTEXT** - Lexical pronoun tiles would add grammar that Pictiq currently avoids. |
| body, perception and clothing | `kute`, `len`, `lukin`, `nena`, `selo`, `sijelo`, `uta` | hearing, clothing, sight, body, skin and mouth | `EMBODIED-OMITTABLE`: `kute`, `len`, `lukin`, `nena`, `selo`, `sijelo`, `uta`<br>`STANDALONE-GAP`: `kute`, `len`, `lukin`, `nena`, `sijelo`, `uta`<br>`OUT-OF-SCOPE`: `selo` | safety_medical for help; place_fashion_shopping only for retail clothing. | MEDIUM | **POSSIBLE CANDIDATE** - Eye/attention, basic clothing and body-location concepts need separate use-case tests. |
| buildings, places and surfaces | `lupa`, `ma`, `supa`, `tomo` | opening, land/place, horizontal surface and building/home | `EMBODIED-OMITTABLE`: `lupa`, `ma`, `supa`, `tomo`<br>`STANDALONE-GAP`: `tomo`<br>`OUT-OF-SCOPE`: `lupa`, `ma`, `supa` | Specific hotel, shop, park, airport and landmark tiles. | HIGH | **STRONG CANDIDATE** - Generic building/home is strong; the other concepts remain unproven. |
| spatial relations and orientation | `anpa`, `insa`, `monsi`, `poka`, `sewi`, `sinpin` | below, inside, behind, beside, above and front | `EMBODIED-OMITTABLE`: `anpa`, `insa`, `monsi`, `poka`, `sewi`, `sinpin`<br>`OUT-OF-SCOPE`: `anpa`, `insa`, `monsi`, `poka`, `sewi`, `sinpin` | Physical arrangement, pointing and layout position. | MEDIUM | **COMPOSITION / CONTEXT** - A directional system would require independent protocol research. |
| animals | `akesi`, `kala`, `pipi`, `soweli`, `waso` | reptiles, fish, insects, land animals and birds | `EMBODIED-OMITTABLE`: `akesi`, `kala`, `pipi`, `soweli`, `waso` | No generic animal tile; use the visible referent when present. | MEDIUM | **POSSIBLE CANDIDATE** - Test a generic animal/wildlife need before taxonomic icon work. |
| everyday objects and documents | `ijo`, `lipu`, `poki` | generic thing, document/card and container | `EMBODIED-OMITTABLE`: `ijo`, `lipu`, `poki` | Point to the object; existing money_card is payment-specific. | MEDIUM | **POSSIBLE CANDIDATE** - Container or document may be useful, but generic thing is too unspecific. |
| materials and geometric forms | `kiwen`, `ko`, `linja`, `palisa`, `sike` | hard material, semi-solid, flexible line, rigid rod and round form | `EMBODIED-OMITTABLE`: `kiwen`, `ko`, `linja`, `palisa`, `sike`<br>`OUT-OF-SCOPE`: `kiwen`, `ko`, `linja`, `palisa`, `sike` | Pointing or use-case-specific object tiles. | LOW | **POSSIBLE CANDIDATE** - No shared candidate follows from these broad material bundles. |
| environment, sky and light | `kon`, `mun`, `suno` | air/wind, celestial bodies and light/sun | `EMBODIED-OMITTABLE`: `kon`, `mun`, `suno`<br>`STANDALONE-GAP`: `suno`<br>`OUT-OF-SCOPE`: `kon`, `mun` | No generic environmental tile; physical context may supply the referent. | MEDIUM | **POSSIBLE CANDIDATE** - Light/visibility is more practical than copying the full lexical fields. |
| temperature, physical state and danger | `jaki`, `lete`, `moli`, `seli`, `utala` | unclean/toxic, cold, death, heat/fire and conflict | `STANDALONE-GAP`: `lete`, `seli`<br>`OUT-OF-SCOPE`: `jaki`, `moli`, `utala` | safety_medical or safety_police only for requesting help after a problem. | HIGH | **POSSIBLE CANDIDATE** - Hot/fire and cold warrant tests; help tiles do not represent the underlying states. |
| colors and visual appearance | `jelo`, `kule`, `laso`, `loje`, `pimeja`, `walo` | color category plus yellow, blue/green, red, dark and light | `EMBODIED-OMITTABLE`: `jelo`, `kule`, `laso`, `loje`, `pimeja`, `walo`<br>`STANDALONE-GAP`: `jelo`, `kule`, `laso`, `loje`, `pimeja`, `walo` | Point to a visible color or use the colored object itself. | MEDIUM | **POSSIBLE CANDIDATE** - Evaluate a compact modifier system rather than unrelated noun-like icons. |
| communication and cognition | `a`, `kalama`, `mu`, `nimi`, `sitelen`, `sona` | interjection/emphasis, sound, vocalization, name/word, image/writing and knowledge | `EMBODIED-OMITTABLE`: `a`, `kalama`, `mu`, `nimi`, `sitelen`<br>`STANDALONE-GAP`: `kalama`, `sitelen`<br>`OUT-OF-SCOPE`: `a`, `mu`, `nimi`, `sona` | comm_phone and comm_wifi cover specific channels, not these concepts. | MEDIUM | **POSSIBLE CANDIDATE** - A message/communication concept may be useful; abstract cognition remains low priority. |
| actions, change and movement | `alasa`, `ante`, `awen`, `kama`, `nasin`, `pana`, `sin`, `weka` | search, change, wait, arrive, method/path, give, repeat and remove | `EMBODIED-OMITTABLE`: `alasa`, `awen`, `kama`, `pana`, `weka`<br>`OUT-OF-SCOPE`: `alasa`, `ante`, `awen`, `kama`, `nasin`, `pana`, `sin`, `weka` | Situational context and concrete object/transport tiles. | MEDIUM | **COMPOSITION / CONTEXT** - Test concrete actions from product scenarios instead of importing broad verbs. |
| grammar and abstract relations | `anu`, `e`, `en`, `kepeken`, `la`, `li`, `lon`, `pi`, `sama`, `tan`, `taso`, `o` | coordination, argument marking, instrument, context, location, comparison, cause, vocative and imperative grammar | `OUT-OF-SCOPE`: `anu`, `e`, `en`, `kepeken`, `la`, `li`, `lon`, `pi`, `sama`, `tan`, `taso`, `o` | Tile order, layout, pointing and natural-language context. | LOW | **DO NOT ADD** - These would make Pictiq unnecessarily grammatical or import extreme polysemy. |
| size and abstract quantity | `ale`, `lili`, `nanpa`, `suli` | all/100, small/few, number/ordinal and large/important | `EMBODIED-OMITTABLE`: `lili`, `suli`<br>`STANDALONE-GAP`: `lili`, `suli`<br>`OUT-OF-SCOPE`: `ale`, `nanpa` | Existing qty_1, qty_2, qty_5, qty_plus and qty_minus express concrete quantities. | MEDIUM | **POSSIBLE CANDIDATE** - Only large/small modifiers merit testing; do not import age, importance or totality. |
| possession and containment relation | `jo` | have, carry, own or contain | `EMBODIED-OMITTABLE`: `jo`<br>`OUT-OF-SCOPE`: `jo` | Physical possession, pointing and adjacent object context. | LOW | **DO NOT ADD** - A generic possession operator would expand Pictiq grammar without demonstrated demand. |
| polysemous abstract qualities | `lawa`, `suwi`, `nasa` | head/control/law, strange/unusual/intoxicated, and sweet/fragrant/cute | `OUT-OF-SCOPE`: `lawa`, `suwi`, `nasa` | Use concrete people, institutions, foods or situations when available. | LOW | **DO NOT ADD** - Each word bundles unrelated concepts that should not become one tile. |
| Toki Pona-specific culture | `pu` | interaction with the official Toki Pona book | `OUT-OF-SCOPE`: `pu` | Text or a specific book reference outside the protocol. | LOW | **DO NOT ADD** - The concept has no independent Pictiq utility. |

## C. Historical concept shortlist

The pre-acceptance shortlist contained **2 STRONG**, **9 POSSIBLE**, **2 DEFER**, and **2 REJECT** recommendations. It is retained as research history; the accepted architectural backlog below supersedes it for development planning.

| Candidate concept | Source words | Mode classification | Proposed role | Existing workaround | Utility | Historical recommendation | Reason |
|---|---|---|---|---|---|---|---|
| generic person | `jan`, `meli`, `mije` | `EMBODIED-OMITTABLE`<br>`STANDALONE-GAP` | neutral participant for travel, safety and interpersonal composition | pointing and speaker context | HIGH | **STRONG** | Pointing can identify a participant live; a durable safety or travel artifact may still require a neutral person. |
| generic building or home | `tomo` | `EMBODIED-OMITTABLE`<br>`STANDALONE-GAP` | generic shelter/destination distinct from named venue types | specific hotel, shop, airport and landmark tiles | HIGH | **STRONG** | A visible building can be indicated live; an unattended destination or shelter message needs the generic concept to remain. |
| visual attention or eye | `lukin` | `EMBODIED-OMITTABLE`<br>`STANDALONE-GAP` | look/see cue for accessibility and signage | pointing or question context | HIGH | **POSSIBLE** | Gaze and pointing work live; an accessibility or attention cue must encode the concept when unattended. |
| basic clothing | `len` | `EMBODIED-OMITTABLE`<br>`STANDALONE-GAP` | physical clothing need or identification | place_fashion_shopping covers retail only | MEDIUM | **POSSIBLE** | Visible clothing can be pointed to; remote packing or identification instructions may need an explicit object concept. |
| body or body location | `sijelo`, `uta`, `nena` | `EMBODIED-OMITTABLE`<br>`STANDALONE-GAP` | medical/accessibility composition | safety_medical requests help without locating the issue | HIGH | **POSSIBLE** | A person can indicate a body location live; a stored medical message must preserve where the issue is. |
| hot or fire | `seli` | `STANDALONE-GAP` | safety warning or physical-state modifier | no honest generic workaround | HIGH | **POSSIBLE** | Heat is not reliably visible or gestureable, and warnings must remain understandable without a communicator. |
| cold | `lete` | `STANDALONE-GAP` | comfort, weather or safety state | no honest generic workaround | MEDIUM | **POSSIBLE** | Cold is not reliably visible or gestureable, and comfort or safety instructions can outlast the exchange. |
| large and small modifiers | `suli`, `lili` | `EMBODIED-OMITTABLE`<br>`STANDALONE-GAP` | relative physical scale in composition | qty_plus/qty_minus mean more/less, not size | MEDIUM | **POSSIBLE** | Relative scale can be demonstrated live; remote selection instructions may need size encoded. |
| compact color modifier system | `jelo`, `kule`, `laso`, `loje`, `pimeja`, `walo` | `EMBODIED-OMITTABLE`<br>`STANDALONE-GAP` | identify objects by visible color | point to colors or colored objects | MEDIUM | **POSSIBLE** | A visible color can be pointed to live; remote object identification needs the color to survive in the artifact. |
| generic communication or message | `kalama`, `nimi`, `sitelen`, `sona` | `EMBODIED-OMITTABLE`<br>`STANDALONE-GAP` | channel-neutral communication cue | comm_phone and comm_wifi are channel-specific | HIGH | **POSSIBLE** | Voice, phone, or a note can supply the channel live; a channel-neutral interface cue may need an explicit message concept. |
| light or visibility | `suno` | `EMBODIED-OMITTABLE`<br>`STANDALONE-GAP` | lighting, visibility, or access cue distinct from a celestial-body reading | ambient context or pointing works only when the communicator and condition are present | MEDIUM | **POSSIBLE** | Ambient light can be indicated live; an unattended visibility, lighting, or access instruction may need it encoded. |
| generic container | `poki` | `EMBODIED-OMITTABLE` | portable-object and physical request composition | point to the actual container | MEDIUM | **DEFER** | The physical container is usually pointable; standalone demand remains unproven, so keep the proposal deferred. |
| generic animal or wildlife | `akesi`, `kala`, `pipi`, `soweli`, `waso` | `EMBODIED-OMITTABLE` | signage or accessibility warning | visible referent and natural-language signage | LOW | **DEFER** | A visible animal can be indicated directly; standalone warning demand remains too broad and unproven. |
| pronoun and gender system | `meli`, `mije`, `mi`, `ona`, `sina` | `EMBODIED-OMITTABLE`<br>`OUT-OF-SCOPE` | encode grammatical person and gender | neutral person, pointing and conversational roles | LOW | **REJECT** | Speaker roles, pointing, and a neutral person can supply participants; grammatical person and gender are outside current scope. |
| grammar and relation operators | `anu`, `e`, `en`, `kepeken`, `la`, `li`, `pi`, `tan`, `taso` | `OUT-OF-SCOPE` | copy Toki Pona syntax into tiles | Pictiq ordering, layout and context | LOW | **REJECT** | These operators would copy language-specific syntax rather than solve an independently demonstrated Pictiq task. |

## D. Accepted Pictiq architecture backlog

These are accepted development directions, not implemented icons, IDs, modifiers, parameters, entity registries, or canonical lexicon entries.

### Strong development candidates

- **neutral person** (`lexical_tile`) — source: `jan`
- **generic building/home design research** (`lexical_tile`) — source: `tomo`

### Standalone implementation candidates

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

### Protocol mechanisms

- **LARGE/SMALL** (`modifier`) — source: `suli`, `lili`
- **parametric COLOR** (`parametric_tile`) — source: `kule`, `jelo`, `laso`, `loje`, `pimeja`, `walo`
- **entity symbols / scoped identity** (`entity_symbol`)
- **emission-mark visual convention** (`visual_convention`) — source: `kalama`, `toki`, `suno`

### Deferred

- **generic container** (`lexical_tile`) — source: `poki`
- **broad animal categories** (`context_pack`) — source: `akesi`, `kala`, `pipi`, `soweli`, `waso`
- **specialized body-location vocabulary** (`specialized_pack`) — source: `nena`, `sijelo`, `uta`

### Rejected directions

- pronoun system
- grammatical gender
- Toki Pona grammatical particles
- broad possession for lexical completeness
- alphabetic spelling of names
- finite lexical color inventory
- broad Toki-Pona-shaped abstract vocabulary

## E. Final methodological findings

- `NONE` is not a single failure state and does not imply an icon gap.
- `jan`, `lukin`, and color words remain `NONE` even though they expose standalone development mechanisms.
- GOOD/BAD and LARGE/SMALL belong in modifier research rather than noun-like lexical expansion.
- Proper names expose scoped entity symbols rather than lexical or alphabetic completeness.
- Color exposes a proposed parametric mechanism rather than a finite color vocabulary.
- Toki Pona grammar remains outside Pictiq scope.
- Coverage percentages describe interoperability and were not optimization targets.
