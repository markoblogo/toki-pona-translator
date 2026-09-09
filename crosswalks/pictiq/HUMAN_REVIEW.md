# Human Review - Full 120-word Crosswalk

> **Decision proposal only.** This document does not change a mapping, approve a candidate, or request a new Pictiq icon.

A Toki Pona gap becomes a Pictiq candidate only if the concept would materially improve Pictiq even if the Toki Pona crosswalk did not exist.

The decision workload is reduced from 106 queued rows to **21 semantic mapping decisions**, **18 NONE clusters**, and a concept-level candidate shortlist.

## A. Semantic mappings requiring judgment

The sole COMPOSED row is **`esun` -> `place_shop + money_coins`**. The sequence communicates practical cash shopping/commerce, but not the full barter/exchange field. Recommendation: **ACCEPT** as a composed approximation; CONTEXTUAL remains the strongest alternative.

| Word | Meaning | Current Pictiq | Class | Confidence | Why review? | Alternative | Recommendation |
|---|---|---|---|---|---|---|---|
| `esun` | trade, exchange, market or shop | `place_shop` + `money_coins` | COMPOSED | medium | The only COMPOSED row; shop plus cash clearly signals practical commerce but narrows barter and exchange. | CONTEXTUAL for a shopping scene; PARTIAL with place_shop; NONE for abstract exchange. | **ACCEPT** |
| `a` | interjection or emotional emphasis | example: `punct_exclaim` | CONTEXTUAL | low | Urgency is only one possible emotional force and can overstate neutral emphasis. | NONE. | **CHANGE TO NONE** |
| `ike` | bad, harmful, unpleasant or unneeded | example: `logic_no` | CONTEXTUAL | medium | logic_no expresses rejection only when the situation supplies the evaluated quality. | NONE as a lexical result. | **ACCEPT** |
| `ken` | ability, permission or possibility | example: `logic_yes` | CONTEXTUAL | medium | logic_yes answers a permission question but does not represent ability or possibility. | NONE as a lexical result. | **ACCEPT** |
| `lape` | sleep or rest | example: `place_hotel` | CONTEXTUAL | medium | A hotel suggests sleep only in a travel or lodging context. | NONE outside a known lodging use case. | **ACCEPT** |
| `nasa` | strange, unusual, silly or intoxicated | example: `drink_beer` | CONTEXTUAL | low | Beer suggests only one possible cause of intoxication and risks a misleading stereotype. | NONE. | **CHANGE TO NONE** |
| `o` | vocative or imperative particle | example: `punct_exclaim` | CONTEXTUAL | low | Urgency may reinforce a command but is not a general imperative or vocative marker. | NONE; rely on pointing and interaction. | **CHANGE TO NONE** |
| `pakala` | broken, damaged, harmed or mistaken | example: `service_tools` | CONTEXTUAL | medium | A repair tile can imply a broken object, but only within an operational scene. | NONE for harm or mistake senses. | **ACCEPT** |
| `pini` | finish, stop, close or end | example: `logic_no` | CONTEXTUAL | medium | logic_no can mean closed or stopped, while completion and past remain absent. | PARTIAL if the closed/stopped protocol sense is treated as stable. | **ACCEPT** |
| `pona` | good, helpful, pleasant or useful | example: `logic_yes` | CONTEXTUAL | medium | logic_yes communicates approval or OK only within an exchange. | NONE as a general quality. | **ACCEPT** |
| `wile` | want, need, desire or require | example: `need_water` | CONTEXTUAL | medium | need_water is an explicit example of need-intent, not a representation of broad desire. | NONE as a lexical result. | **ACCEPT** |
| `kasi` | plant, vegetation, herb or leaf | `nature_flower` | PARTIAL | medium | A flower is a recognizable plant subtype but covers only a narrow part of the field. | NONE if subtype overlap is judged too narrow. | **ACCEPT** |
| `kili` | fruit, vegetable or mushroom | `need_food` | PARTIAL | medium | need_food is broader and intent-bearing, but the edible-object overlap is useful. | CONTEXTUAL in a food request. | **ACCEPT** |
| `musi` | fun, play, game, art or entertainment | `place_disco` | PARTIAL | medium | A disco is one venue and activity; it does not represent general fun, play or art. | CONTEXTUAL for nightlife; NONE generally. | **CHANGE TO CONTEXTUAL** |
| `mute` | many, several, quantity, very or twenty | `qty_5` | PARTIAL | medium | qty_5 can pragmatically signal many but still depicts a specific number. | COMPOSED qty_5 + qty_plus for an explicit many expression. | **ACCEPT** |
| `open` | begin, start, open or turn on | `logic_yes` | PARTIAL | medium | logic_yes has a stable open reading but misses beginning and activation broadly. | CONTEXTUAL where open/closed is established. | **ACCEPT** |
| `pan` | grain, bread or starchy food | `need_food` | PARTIAL | medium | need_food is much broader and carries need intent, but includes the central edible field. | CONTEXTUAL in a food request. | **ACCEPT** |
| `pilin` | emotion, feeling, touch or heart | `love_heart` | PARTIAL | medium | love_heart covers affection only, leaving physical sensation and most emotions outside. | NONE if affection is too narrow to count as useful overlap. | **ACCEPT** |
| `toki` | communication, speech, thought, story or language | `comm_phone` | PARTIAL | medium | A phone is a channel/device for one communication mode, not communication itself. | CONTEXTUAL for calling; NONE generally. | **CHANGE TO CONTEXTUAL** |
| `unpa` | sex or sexual activity | `item_condom` | PARTIAL | medium | A condom is a related protection object, creating contextual association rather than semantic overlap. | NONE outside a safer-sex context. | **CHANGE TO CONTEXTUAL** |
| `wawa` | power, energy, strength or intensity | `power_plug` | PARTIAL | medium | A power outlet represents access to electricity, not power or strength generally. | CONTEXTUAL for electrical-power requests; NONE generally. | **CHANGE TO CONTEXTUAL** |

## B. Candidate concept clusters

All 85 source `NONE` rows appear exactly once below. A candidate label identifies an area for independent Pictiq research; every source mapping remains `NONE`.

| Cluster | Toki Pona words | Semantic concepts | Current workaround | Independent utility | Recommendation |
|---|---|---|---|---|---|
| people and social roles | `jan`, `kulupu`, `mama`, `meli`, `mije` | neutral person, group, parent/caretaker and gendered roles | Pointing and conversational context; no generic person tile. | HIGH | **STRONG CANDIDATE** - Advance only a neutral person concept; do not infer separate role or gender tiles. |
| pronouns and deixis | `mi`, `ni`, `ona`, `sina` | I/we, this/that, third person and you | Pointing, speaker roles and surrounding context. | LOW | **COMPOSITION / CONTEXT** - Lexical pronoun tiles would add grammar that Pictiq currently avoids. |
| body, perception and clothing | `kute`, `len`, `lukin`, `nena`, `selo`, `sijelo`, `uta` | hearing, clothing, sight, body, skin and mouth | safety_medical for help; place_fashion_shopping only for retail clothing. | MEDIUM | **POSSIBLE CANDIDATE** - Eye/attention, basic clothing and body-location concepts need separate use-case tests. |
| buildings, places and surfaces | `lupa`, `ma`, `supa`, `tomo` | opening, land/place, horizontal surface and building/home | Specific hotel, shop, park, airport and landmark tiles. | HIGH | **STRONG CANDIDATE** - Generic building/home is strong; the other concepts remain unproven. |
| spatial relations and orientation | `anpa`, `insa`, `monsi`, `poka`, `sewi`, `sinpin` | below, inside, behind, beside, above and front | Physical arrangement, pointing and layout position. | MEDIUM | **COMPOSITION / CONTEXT** - A directional system would require independent protocol research. |
| animals | `akesi`, `kala`, `pipi`, `soweli`, `waso` | reptiles, fish, insects, land animals and birds | No generic animal tile; use the visible referent when present. | MEDIUM | **POSSIBLE CANDIDATE** - Test a generic animal/wildlife need before taxonomic icon work. |
| everyday objects and documents | `ijo`, `lipu`, `poki` | generic thing, document/card and container | Point to the object; existing money_card is payment-specific. | MEDIUM | **POSSIBLE CANDIDATE** - Container or document may be useful, but generic thing is too unspecific. |
| materials and geometric forms | `kiwen`, `ko`, `linja`, `palisa`, `sike` | hard material, semi-solid, flexible line, rigid rod and round form | Pointing or use-case-specific object tiles. | LOW | **POSSIBLE CANDIDATE** - No shared candidate follows from these broad material bundles. |
| environment, sky and light | `kon`, `mun`, `suno` | air/wind, celestial bodies and light/sun | No generic environmental tile; physical context may supply the referent. | MEDIUM | **POSSIBLE CANDIDATE** - Light/visibility is more practical than copying the full lexical fields. |
| temperature, physical state and danger | `jaki`, `lete`, `moli`, `seli`, `utala` | unclean/toxic, cold, death, heat/fire and conflict | safety_medical or safety_police only for requesting help after a problem. | HIGH | **POSSIBLE CANDIDATE** - Hot/fire and cold warrant tests; help tiles do not represent the underlying states. |
| colors and visual appearance | `jelo`, `kule`, `laso`, `loje`, `pimeja`, `walo` | color category plus yellow, blue/green, red, dark and light | Point to a visible color or use the colored object itself. | MEDIUM | **POSSIBLE CANDIDATE** - Evaluate a compact modifier system rather than unrelated noun-like icons. |
| communication and cognition | `kalama`, `mu`, `nimi`, `sitelen`, `sona` | sound, vocalization, name/word, image/writing and knowledge | comm_phone and comm_wifi cover specific channels, not these concepts. | MEDIUM | **POSSIBLE CANDIDATE** - A message/communication concept may be useful; abstract cognition remains low priority. |
| actions, change and movement | `alasa`, `ante`, `awen`, `kama`, `nasin`, `pana`, `sin`, `weka` | search, change, wait, arrive, method/path, give, repeat and remove | Situational context and concrete object/transport tiles. | MEDIUM | **COMPOSITION / CONTEXT** - Test concrete actions from product scenarios instead of importing broad verbs. |
| grammar and abstract relations | `anu`, `e`, `en`, `kepeken`, `la`, `li`, `lon`, `pi`, `sama`, `tan`, `taso` | coordination, argument marking, instrument, context, location, comparison and cause | Tile order, layout, pointing and natural-language context. | LOW | **DO NOT ADD** - These would make Pictiq unnecessarily grammatical or import extreme polysemy. |
| size and abstract quantity | `ale`, `lili`, `nanpa`, `suli` | all/100, small/few, number/ordinal and large/important | Existing qty_1, qty_2, qty_5, qty_plus and qty_minus express concrete quantities. | MEDIUM | **POSSIBLE CANDIDATE** - Only large/small modifiers merit testing; do not import age, importance or totality. |
| possession and containment relation | `jo` | have, carry, own or contain | Physical possession, pointing and adjacent object context. | LOW | **DO NOT ADD** - A generic possession operator would expand Pictiq grammar without demonstrated demand. |
| polysemous abstract qualities | `lawa`, `suwi` | head/control/law and sweet/fragrant/cute | Use concrete people, institutions, foods or situations when available. | LOW | **DO NOT ADD** - Each word bundles unrelated concepts that should not become one tile. |
| Toki Pona-specific culture | `pu` | interaction with the official Toki Pona book | Text or a specific book reference outside the protocol. | LOW | **DO NOT ADD** - The concept has no independent Pictiq utility. |

## C. Proposed reusable Pictiq concepts

These are concept-level questions, not approved additions or final canonical IDs.

| Candidate concept | Source Toki Pona words | Proposed Pictiq role | Existing workaround | Independent utility | Recommendation |
|---|---|---|---|---|---|
| generic person | `jan`, `meli`, `mije` | neutral participant for travel, safety and interpersonal composition | pointing and speaker context | HIGH | **STRONG** |
| generic building or home | `tomo` | generic shelter/destination distinct from named venue types | specific hotel, shop, airport and landmark tiles | HIGH | **STRONG** |
| visual attention or eye | `lukin` | look/see cue for accessibility and signage | pointing or question context | HIGH | **POSSIBLE** |
| basic clothing | `len` | physical clothing need or identification | place_fashion_shopping covers retail only | MEDIUM | **POSSIBLE** |
| body or body location | `sijelo`, `uta`, `nena` | medical/accessibility composition | safety_medical requests help without locating the issue | HIGH | **POSSIBLE** |
| hot or fire | `seli` | safety warning or physical-state modifier | no honest generic workaround | HIGH | **POSSIBLE** |
| cold | `lete` | comfort, weather or safety state | no honest generic workaround | MEDIUM | **POSSIBLE** |
| large and small modifiers | `suli`, `lili` | relative physical scale in composition | qty_plus/qty_minus mean more/less, not size | MEDIUM | **POSSIBLE** |
| compact color modifier system | `jelo`, `kule`, `laso`, `loje`, `pimeja`, `walo` | identify objects by visible color | point to colors or colored objects | MEDIUM | **POSSIBLE** |
| generic communication or message | `kalama`, `nimi`, `sitelen`, `sona` | channel-neutral communication cue | comm_phone and comm_wifi are channel-specific | HIGH | **POSSIBLE** |
| generic container | `poki` | portable-object and physical request composition | point to the actual container | MEDIUM | **DEFER** |
| generic animal or wildlife | `akesi`, `kala`, `pipi`, `soweli`, `waso` | signage or accessibility warning | visible referent and natural-language signage | LOW | **DEFER** |
| pronoun and gender system | `meli`, `mije`, `mi`, `ona`, `sina` | encode grammatical person and gender | neutral person, pointing and conversational roles | LOW | **REJECT** |
| grammar and relation operators | `anu`, `e`, `en`, `kepeken`, `la`, `li`, `pi`, `tan`, `taso` | copy Toki Pona syntax into tiles | Pictiq ordering, layout and context | LOW | **REJECT** |

## D. Safe to remain NONE

All 85 rows can remain `NONE` by default while concept-level questions are evaluated separately. Individual review is unnecessary in these grouped areas:

- **grammar, possession and language-specific abstraction** (grammar and abstract relations; possession and containment relation; polysemous abstract qualities; Toki Pona-specific culture): These concepts add grammar, copy Toki Pona-specific structure or collapse unrelated senses.
- **pronoun, gender and social-role distinctions** (people and social roles; pronouns and deixis): A neutral person candidate can be tested separately; individual role and pronoun tiles have no demonstrated demand.
- **broad action and spatial vocabulary** (spatial relations and orientation; actions, change and movement): Concrete situations, pointing and layout should remain the default until a recurring Pictiq task proves a gap.
- **under-evidenced physical and nature taxonomies** (animals; everyday objects and documents; materials and geometric forms; environment, sky and light; temperature, physical state and danger): Possible concepts require product evidence; the source words remain safely NONE meanwhile.
- **candidate-bearing modifier and accessibility areas** (body, perception and clothing; buildings, places and surfaces; colors and visual appearance; communication and cognition; size and abstract quantity): Concept-level proposals are review prompts, not reasons to change any current NONE row.

## E. Key methodological observations

- No strict DIRECT lexical equivalents were found in the 120-word dataset.
- Toki Pona minimizes vocabulary through broad lexical concepts; Pictiq minimizes short communication through intent and context.
- NONE remains the correct default when independent Pictiq utility is absent or unproven.
- Coverage percentages describe this crosswalk and must not be optimized as a score.
- Lexical completeness is not a Pictiq goal.
- The most controversial current examples are `a`, `nasa`, and `o`; each is recommended to change to NONE at the later decision stage.
- The strongest reusable questions remain a neutral person and a generic building/home.

## Recommended review order

1. Decide the single `esun` COMPOSED row.
2. Decide the 10 CONTEXTUAL rows, starting with `a`, `nasa`, and `o`.
3. Decide the 10 medium-confidence PARTIAL rows, focusing on `musi`, `toki`, `unpa`, and `wawa`.
4. Review the two STRONG concept candidates, then the POSSIBLE shortlist.
5. Accept the grouped Safe-to-remain-NONE default unless a concrete Pictiq use case reopens a cluster.
