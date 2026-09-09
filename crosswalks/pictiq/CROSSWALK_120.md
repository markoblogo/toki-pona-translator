# Toki Pona x Pictiq: canonical 120-word semantic crosswalk

> **Status: ACCEPTED. Human review resolved 2026-09-09.** Useful overlap is not lexical equivalence.

> Toki Pona primarily compresses vocabulary through broad lexical concepts. Pictiq often compresses short communication through intent and context.

Sources are pinned in `crosswalk-120.json`; notices are in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md). The Pictiq source is commit `5dff34c28231d1261d1aa72022756c4c7a1b8fca`.

## Statistics

These figures describe semantic coverage under the accepted method; they are not a Pictiq score.

| Mapping | Count | Percent |
|---|---:|---:|
| DIRECT | 0 | 0.0% |
| PARTIAL | 19 | 15.8% |
| COMPOSED | 2 | 1.7% |
| CONTEXTUAL | 11 | 9.2% |
| NONE | 88 | 73.3% |

| Confidence | Count | Percent |
|---|---:|---:|
| high | 98 | 81.7% |
| medium | 19 | 15.8% |
| low | 3 | 2.5% |

One tile: **30**. Multiple tiles: **2**. No representation: **88**. Human review: **RESOLVED** across **106** reviewed rows; unresolved: **0**.

## Reference table

| Toki Pona | Meaning | sitelen pona | sitelen emoji | Pictiq | Mapping | Confidence | Notes |
|---|---|---|---|---|---|---|---|
| `a` | (interjection) ah, oh, ha, eh, um, oy; (particle) [placed after something for emphasis or emotion] | ligature `a` -> `U+F1900` | ❗ | **NONE** | **NONE** | low | Face, voice, and gesture carry emotion in embodied communication; punct_exclaim is too narrow as a lexical mapping. |
| `akesi` | reptile, amphibian, scaly creature, crawling creature | ligature `akesi` -> `U+F1901` | 🦎 | **NONE** | **NONE** | high | No current tile represents reptiles, amphibians, or crawling creatures. |
| `ala` | not, nothing, no; (particle) [negates a word or phrase]; (particle) [forms a yes-no question]; (number) zero | ligature `ala` -> `U+F1902` | ❌ | [`logic_no`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/logic_no.svg) | **PARTIAL** | high | logic_no covers no/not, but ala also expresses nothing, zero, absence, and question formation. |
| `alasa` | hunt, forage, search, attempt; (preverb) try to | ligature `alasa` -> `U+F1903` | 🏹 | **NONE** | **NONE** | high | No tile represents hunting, foraging, searching, or attempting as a broad concept. |
| `ale` | all, every, everything, entirety, universe; (number) one hundred | ligature `ale` -> `U+F1904` | ♾️ | **NONE** | **NONE** | high | No tile means all, everything, the universe, or one hundred. |
| `anpa` | bottom, underside; below, beneath; defeated, humble, lowly | ligature `anpa` -> `U+F1905` | ⬇️ | **NONE** | **NONE** | high | No tile represents below, underside, defeat, or humility. |
| `ante` | different, altered; modify, change; other; difference | ligature `ante` -> `U+F1906` | 🔀 | **NONE** | **NONE** | high | No tile represents difference or change as a general concept. |
| `anu` | (particle) [separates multiple possibilities, replacing another particle], or | ligature `anu` -> `U+F1907` | ☯️ | **NONE** | **NONE** | high | Pictiq has no general alternative/or relation. |
| `awen` | stay, remain, wait, pause; protect, keep safe; continue; (preverb) continue to | ligature `awen` -> `U+F1908` | ⚓ | **NONE** | **NONE** | high | No tile represents remaining, waiting, protecting, or continuing broadly. |
| `e` | (particle) [marks the start of a direct object] | ligature `e` -> `U+F1909` | ⏩ | **NONE** | **NONE** | high | A direct-object marker is outside Pictiq's tile vocabulary. |
| `en` | (particle) [separates multiple subjects] | ligature `en` -> `U+F190A` | ➕ | **NONE** | **NONE** | high | A multiple-subject separator is outside Pictiq's tile vocabulary. |
| `esun` | trade, barter, exchange, swap, buy, sell; market, shop, fair, bazaar, place of business | ligature `esun` -> `U+F190B` | 🛒 | [`place_shop`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/place_shop.svg) + [`money_coins`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/money_coins.svg) | **COMPOSED** | medium | Shop plus cash can communicate practical commerce, but not every form of trade or exchange. |
| `ijo` | thing, object, entity, being, matter, phenomenon | ligature `ijo` -> `U+F190C` | 🐚 | **NONE** | **NONE** | high | No current tile represents a generic thing or entity. |
| `ike` | negative quality, e.g. bad, unpleasant, harmful, unneeded | ligature `ike` -> `U+F190D` | 👎 | example: [`logic_no`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/logic_no.svg) | **CONTEXTUAL** | medium | logic_no can reject something in context; it does not mean a bad, harmful, or unneeded quality. |
| `ilo` | tool, implement, machine, device | ligature `ilo` -> `U+F190E` | ⚙️ | [`service_tools`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/service_tools.svg) | **PARTIAL** | high | service_tools covers tools and repair, not the wider class of devices and machines. |
| `insa` | inside, center, between, middle, midpoint, internal | ligature `insa` -> `U+F190F` | ⏺️ | **NONE** | **NONE** | high | No tile represents inside, center, or between. |
| `jaki` | disgusting, unclean, unsanitary, toxic, repulsive, rotten | ligature `jaki` -> `U+F1910` | 💩 | **NONE** | **NONE** | high | No tile represents dirtiness, toxicity, rot, or disgust broadly. |
| `jan` | human being, person, somebody | ligature `jan` -> `U+F1911` | 👤 | **NONE** | **NONE** | high | The current lexicon has no generic person tile. |
| `jelo` | yellow, amber, golden, lime yellow, yellowish orange | ligature `jelo` -> `U+F1912` | 💛 | **NONE** | **NONE** | high | The current lexicon has no generic yellow color tile. |
| `jo` | hold, carry, possess, contain, own | ligature `jo` -> `U+F1913` | 👜 | **NONE** | **NONE** | high | The current protocol has no generic possession or containment relation. |
| `kala` | fish, marine animal, sea creature, swimming creature | ligature `kala` -> `U+F1914` | 🐟 | **NONE** | **NONE** | high | No current tile represents fish or marine animals generally. |
| `kalama` | to produce sound; sound, e.g. sing, thunder, drum, clap, laugh, beep | ligature `kalama` -> `U+F1915` | 🔈 | **NONE** | **NONE** | high | No tile represents sound or sound production broadly. |
| `kama` | arriving, coming, future, summoned; (preverb) to become, manage to, succeed in | ligature `kama` -> `U+F1916` | 🚶 | **NONE** | **NONE** | high | No tile represents arrival, becoming, or future broadly. |
| `kasi` | plant, vegetation; herb, leaf | ligature `kasi` -> `U+F1917` | 🌴 | [`nature_flower`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/nature_flower.svg) | **PARTIAL** | medium | A flower is one plant form; kasi also covers vegetation, herbs, and leaves. |
| `ken` | can, may, ability, permission; possibility, maybe; allow, enable; (preverb) to be able to | ligature `ken` -> `U+F1918` | 💪 | example: [`logic_yes`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/logic_yes.svg) | **CONTEXTUAL** | medium | logic_yes can answer a can-I question affirmatively; it does not encode ability or possibility. |
| `kepeken` | (preposition) using, by means of | ligature `kepeken` -> `U+F1919` | 🔧 | **NONE** | **NONE** | high | The instrumental relation using/by means of is not a Pictiq tile concept. |
| `kili` | fruit, vegetable, mushroom | ligature `kili` -> `U+F191A` | 🍎 | [`need_food`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/need_food.svg) | **PARTIAL** | medium | need_food can indicate an edible item or hunger, while kili is specifically produce or mushrooms. |
| `kiwen` | hard object e.g. metal, stone, wood | ligature `kiwen` -> `U+F191B` | 💎 | **NONE** | **NONE** | high | No tile represents hard material or hard objects generally. |
| `ko` | semi-solid, e.g. paste, powder, goo, sand, soil, clay; squishy, moldable; sticky | ligature `ko` -> `U+F191C` | 🍦 | **NONE** | **NONE** | high | No tile represents paste, powder, soil, or other semi-solids broadly. |
| `kon` | air, breath, wind; essence, spirit, soul, ghost; unseen agent | ligature `kon` -> `U+F191D` | 💨 | **NONE** | **NONE** | high | No tile spans air, breath, wind, spirit, and unseen agency. |
| `kule` | color, pigment; category, genre, flavor; colorful, diverse | ligature `kule` -> `U+F191E` | 🌈 | **NONE** | **NONE** | high | No tile represents color, category, or diversity generally. |
| `kulupu` | group, community, society, company, nation, collection, team, crowd | ligature `kulupu` -> `U+F191F` | 👥 | **NONE** | **NONE** | high | No tile represents a generic group, community, or collection. |
| `kute` | ear, hearing organ; hear, listen, pay attention to, obey | ligature `kute` -> `U+F1920` | 👂 | **NONE** | **NONE** | high | No tile represents hearing, listening, or an ear. |
| `la` | (particle) [mark the previous statement as context to the following statement] | ligature `la` -> `U+F1921` | 🔼 | **NONE** | **NONE** | high | A context-clause marker belongs to grammar, not Pictiq's current lexicon. |
| `lape` | sleep, rest, break from an activity or work | ligature `lape` -> `U+F1922` | 😴 | example: [`place_hotel`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/place_hotel.svg) | **CONTEXTUAL** | medium | A hotel may communicate a place to sleep in travel context; it does not mean sleep or rest. |
| `laso` | turquoise, blue, green, cyan, indigo, lime green | ligature `laso` -> `U+F1923` | 🔵 | **NONE** | **NONE** | high | The current lexicon has no generic blue/green color tile. |
| `lawa` | head, mind, brain; control, lead, guide; government, leader; rule, law | ligature `lawa` -> `U+F1924` | 😶 | **NONE** | **NONE** | high | No tile spans head, mind, leadership, control, and law. |
| `len` | cloth, clothing, fabric, textile; covered, hidden, secret, private | ligature `len` -> `U+F1925` | 👕 | **NONE** | **NONE** | high | No current tile represents clothing, cloth, covering, or privacy broadly. |
| `lete` | cold, cool, frozen; freeze, chill; raw, uncooked | ligature `lete` -> `U+F1926` | ❄️ | **NONE** | **NONE** | high | No tile represents cold, cooling, frozen, or raw. |
| `li` | (particle) [marks the start of an indicative verb (statement)] | ligature `li` -> `U+F1927` | ▶️ | **NONE** | **NONE** | high | An indicative-predicate marker is outside Pictiq's tile vocabulary. |
| `lili` | small, short, young; few; piece, part | ligature `lili` -> `U+F1928` | 🐭 | **NONE** | **NONE** | high | qty_minus means less, not generic smallness, youth, or a small quantity. |
| `linja` | long, flexible thing, e.g. rope, yarn, hair, fur, line, strand | ligature `linja` -> `U+F1929` | 〰️ | **NONE** | **NONE** | high | No tile represents a generic long flexible object or line. |
| `lipu` | flat and bendable object, e.g. paper, card, leaf; written text or document, e.g. book, website, clay tablet | ligature `lipu` -> `U+F192A` | 📄 | **NONE** | **NONE** | high | No tile spans paper, card, book, document, website, and other flat media. |
| `loje` | red, magenta, scarlet, pink, rust-colored, reddish orange | ligature `loje` -> `U+F192B` | 🔴 | **NONE** | **NONE** | high | The current lexicon has no generic red color tile. |
| `lon` | present, existing, real, true; (preposition) located at, in, during, in the context of | ligature `lon` -> `U+F192C` | 📍 | **NONE** | **NONE** | medium | No tile combines existence, truth, presence, and location. |
| `luka` | hand, arm, tactile limb, grasping limb; to grasp, interact with, feel using touch; (number) five | ligature `luka` -> `U+F192D` | ✋ | [`qty_5`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/qty_5.svg) | **PARTIAL** | high | qty_5 covers only the numerical use; it says nothing about hand or arm. |
| `lukin` | see, look, view, examine, read, watch; visual; eye, seeing organ; (preverb) try to | ligature `lukin` -> `U+F192E` | 👀 | **NONE** | **NONE** | high | No current Pictiq tile encodes looking, seeing, or an eye. |
| `lupa` | hole, pit, cave, doorway, window, portal | ligature `lupa` -> `U+F192F` | 🕳️ | **NONE** | **NONE** | high | No tile represents holes, openings, doorways, or portals generally. |
| `ma` | earth, land, soil; country, territory, world; outdoors | ligature `ma` -> `U+F1930` | 🏝️ | **NONE** | **NONE** | high | No tile represents land, country, territory, world, or outdoors broadly. |
| `mama` | parent, ancestor; creator, originator; caretaker, sustainer, guardian | ligature `mama` -> `U+F1931` | 👪 | **NONE** | **NONE** | high | No tile represents a parent, originator, caretaker, or guardian. |
| `mani` | money, currency; thing of value e.g. gold, investment, livestock | ligature `mani` -> `U+F1932` | 💰 | [`money_coins`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/money_coins.svg) | **PARTIAL** | high | money_coins means cash/pay cash and is narrower than money, wealth, or property. |
| `meli` | woman, female, feminine person, wife, girlfriend | ligature `meli` -> `U+F1933` | 👧 | **NONE** | **NONE** | high | No current tile represents woman or female person. |
| `mi` | (pronoun) I, me, we, us | ligature `mi` -> `U+F1934` | 👈 | **NONE** | **NONE** | high | Pictiq currently relies on pointing/context rather than a first-person pronoun tile. |
| `mije` | man, male, masculine person, husband, boyfriend | ligature `mije` -> `U+F1935` | 👨 | **NONE** | **NONE** | high | No current tile represents man or male person. |
| `moku` | eat, drink, consume, swallow, ingest; food, edible thing | ligature `moku` -> `U+F1936` | 🍽️ | [`need_food`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/need_food.svg) | **PARTIAL** | high | need_food expresses food or hunger; moku also acts as eat, drink, and consume. |
| `moli` | death, dead, die, dying; kill, murder | ligature `moli` -> `U+F1937` | 💀 | **NONE** | **NONE** | high | No current tile represents death, dying, or killing. |
| `monsi` | back, behind, rear | ligature `monsi` -> `U+F1938` | ⬅️ | **NONE** | **NONE** | high | No tile represents back, behind, or rear. |
| `mu` | (animal noise or communication, onomatopoeia) | ligature `mu` -> `U+F1939` | 😹 | **NONE** | **NONE** | high | No tile represents animal vocalization or onomatopoeia generally. |
| `mun` | moon, night sky object, star, celestial body | ligature `mun` -> `U+F193A` | 🌙 | **NONE** | **NONE** | high | No tile represents the moon, stars, or celestial bodies generally. |
| `musi` | fun, game, entertainment, art, play, amusing, interesting, comical, silly | ligature `musi` -> `U+F193B` | 😃 | example: [`place_disco`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/place_disco.svg) | **CONTEXTUAL** | medium | A disco is one context for entertainment, not a semantic equivalent for fun, play, games, or art. |
| `mute` | many, several, very; quantity; (number) twenty | ligature `mute` -> `U+F193C` | 👐 | [`qty_5`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/qty_5.svg) + [`qty_plus`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/qty_plus.svg) | **COMPOSED** | medium | qty_5 plus qty_plus communicates 5+ / many / more than several more honestly than a concrete five alone. |
| `nanpa` | number; (particle) [ordinal number], -th | ligature `nanpa` -> `U+F193D` | #️⃣ | **NONE** | **NONE** | high | Specific quantity tiles exist, but no tile represents number or ordinal structure generally. |
| `nasa` | strange, unusual, silly, abnormal, unexpected; drunk, intoxicated | ligature `nasa` -> `U+F193E` | 🌀 | **NONE** | **NONE** | low | drink_beer is not a defensible representation of strange, unusual, silly, abnormal, or intoxicated. |
| `nasin` | method, doctrine, tradition; path, road, way | ligature `nasin` -> `U+F193F` | 🛣️ | **NONE** | **NONE** | high | No tile spans method, doctrine, tradition, path, road, and way. |
| `nena` | protuberances e.g. bump, button, hill, nose | ligature `nena` -> `U+F1940` | 🗻 | **NONE** | **NONE** | high | No tile represents bumps, hills, noses, or protuberances broadly. |
| `ni` | this, that, these, those | ligature `ni` -> `U+F1941` | 👇 | **NONE** | **NONE** | high | Pointing supplies deixis in use; there is no lexical this/that tile. |
| `nimi` | word, name | ligature `nimi` -> `U+F1942` | 💬 | **NONE** | **NONE** | high | No tile represents a generic word or name. |
| `noka` | foot, leg, organ of locomotion, roots | ligature `noka` -> `U+F1943` | 🦵 | [`move_feet`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/move_feet.svg) | **PARTIAL** | high | move_feet represents walking; noka also means foot, leg, and roots. |
| `o` | (particle) [marks the end of a vocative (who is being spoken to)], [marks the start of an imperative (command, wish, instruction)], should | ligature `o` -> `U+F1944` | 👋 | **NONE** | **NONE** | low | Pictiq does not need a lexical vocative or imperative particle; standalone commands may use an action with punct_exclaim where appropriate. |
| `olin` | to have a strong emotional bond with, e.g. affection, appreciation, compassion, respect; platonic, romantic, or familial relationships | ligature `olin` -> `U+F1945` | 💕 | [`love_heart`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/love_heart.svg) | **PARTIAL** | high | love_heart covers affection and romance but not every platonic, familial, or respectful bond. |
| `ona` | (third-person pronoun) he, she, it, they | ligature `ona` -> `U+F1946` | 👆 | **NONE** | **NONE** | high | Pictiq has no third-person pronoun tile. |
| `open` | begin, start, open, turn on; beginning | ligature `open` -> `U+F1947` | 🔓 | [`logic_yes`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/logic_yes.svg) | **PARTIAL** | medium | logic_yes may mean open or accepted, but not beginning, starting, or turning on generally. |
| `pakala` | damaged, broken, botched, harmed, messed up; mistake | ligature `pakala` -> `U+F1948` | 💥 | example: [`service_tools`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/service_tools.svg) | **CONTEXTUAL** | medium | A repair tile can signal that something is broken in context; it does not mean damage or mistake. |
| `pali` | work, activity; create, build, design; put effort toward, take action on | ligature `pali` -> `U+F1949` | ✊ | [`service_tools`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/service_tools.svg) | **PARTIAL** | high | service_tools overlaps with repair work but does not represent general doing or making. |
| `palisa` | long and hard thing e.g. branch, pole, rod, stick, spine, mast | ligature `palisa` -> `U+F194A` | 📏 | **NONE** | **NONE** | high | No tile represents a generic long rigid object. |
| `pan` | grains, starchy foods, baked goods e.g. rice, sorghum, bread, noodles, masa, porridge, injera | ligature `pan` -> `U+F194B` | 🍞 | [`need_food`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/need_food.svg) | **PARTIAL** | medium | need_food covers food/hunger broadly; pan is specifically grain and starchy food. |
| `pana` | give, send, emit, provide, put, release | ligature `pana` -> `U+F194C` | 📤 | **NONE** | **NONE** | high | No tile represents giving, sending, emitting, or providing broadly. |
| `pi` | (particle) [group the following words into one modifier for the previous word] | ligature `pi` -> `U+F194D` | ⏹️ | **NONE** | **NONE** | high | A modifier-grouping particle belongs to grammar, not Pictiq's current lexicon. |
| `pilin` | experience e.g. emotion, feeling, touch; heart (physical or emotional) | ligature `pilin` -> `U+F194E` | ❤️ | [`love_heart`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/love_heart.svg) | **PARTIAL** | medium | love_heart covers affection or romance, only a narrow subset of feeling and sensation. |
| `pimeja` | dark, unlit; dark color, e.g. black, purple, brown | ligature `pimeja` -> `U+F194F` | ⚫ | **NONE** | **NONE** | high | The current lexicon has no generic dark/black color tile. |
| `pini` | finish, stop, prevent; close, disable, turn off; ended, past; edge, end, conclusion | ligature `pini` -> `U+F1950` | 🏁 | example: [`logic_no`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/logic_no.svg) | **CONTEXTUAL** | medium | logic_no can mean closed or stopped in context; it does not lexicalize ending or completion. |
| `pipi` | insect, bug, spider, tiny crawling creature | ligature `pipi` -> `U+F1951` | 🐞 | **NONE** | **NONE** | high | No current tile represents insects, spiders, or small crawling creatures. |
| `poka` | hip, side; next to, nearby, vicinity | ligature `poka` -> `U+F1952` | ↔️ | **NONE** | **NONE** | high | No tile represents side, proximity, or next-to. |
| `poki` | container e.g. bag, bowl, box, cup, cupboard, drawer, folder | ligature `poki` -> `U+F1953` | 📦 | **NONE** | **NONE** | high | No tile represents a generic container. |
| `pona` | positive quality, e.g. good, pleasant, helpful, friendly, useful, peaceful | ligature `pona` -> `U+F1954` | 👍 | example: [`logic_yes`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/logic_yes.svg) | **CONTEXTUAL** | medium | logic_yes can signal approval or OK; it does not lexicalize positive quality or usefulness. |
| `pu` | interacting with the book Toki Pona: The Language of Good by Sonja Lang | ligature `pu` -> `U+F1955` | 📖 | **NONE** | **NONE** | high | A concept specific to interacting with the official Toki Pona book is not independently useful for Pictiq. |
| `sama` | same, similar, alike; peer, fellow, each other; (preposition) similar to, same as | ligature `sama` -> `U+F1956` | ⚖️ | **NONE** | **NONE** | high | No tile represents sameness, similarity, peers, or comparison. |
| `seli` | hot, warm; heat, fire, flame; burn | ligature `seli` -> `U+F1957` | 🔥 | **NONE** | **NONE** | high | No tile represents heat, fire, warmth, or burning generally. |
| `selo` | outer layer, e.g. skin, peel, shell, bark; outer shape, outer form, boundary | ligature `selo` -> `U+F1958` | 🔲 | **NONE** | **NONE** | high | No tile represents skin, shell, boundary, or outer form broadly. |
| `seme` | (particle) [indicate a question by marking missing info in a sentence]; what, which, who | ligature `seme` -> `U+F1959` | ❓ | [`punct_question`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/punct_question.svg) | **PARTIAL** | high | punct_question marks a question but does not encode the unknown argument carried by seme. |
| `sewi` | up, top, above, highest part; divine, sacred, supernatural; awesome, inspiring, excelling | ligature `sewi` -> `U+F195A` | ⬆️ | **NONE** | **NONE** | high | No tile spans above/top and sacred/divine/excellent meanings. |
| `sijelo` | body, shape, physical state, torso, substance, form | ligature `sijelo` -> `U+F195B` | 🏋️ | **NONE** | **NONE** | high | No tile represents a generic body, physical state, or form. |
| `sike` | circle, sphere, spiral, round thing e.g. ball, wheel; repeating thing e.g. cycle, orbit, loop | ligature `sike` -> `U+F195C` | ⭕ | **NONE** | **NONE** | high | No tile represents circles, spheres, cycles, or loops generally. |
| `sin` | new, fresh, update; repeat, do again | ligature `sin` -> `U+F195D` | 🎁 | **NONE** | **NONE** | high | No tile represents newness, freshness, updating, or repetition generally. |
| `sina` | (pronoun) you, y'all | ligature `sina` -> `U+F195E` | 👉 | **NONE** | **NONE** | high | Pictiq has no second-person pronoun tile. |
| `sinpin` | vertical surface e.g. wall, board; front of something e.g. face | ligature `sinpin` -> `U+F195F` | ➡️ | **NONE** | **NONE** | high | No tile represents a front, face, wall, or vertical surface broadly. |
| `sitelen` | image, picture, representation, symbol, mark, writing | ligature `sitelen` -> `U+F1960` | 🖼️ | **NONE** | **NONE** | high | No tile represents images, symbols, marks, or writing generally. |
| `sona` | knowledge, information, data; know, be skilled in, be wise about; (preverb) know how to | ligature `sona` -> `U+F1961` | 🧠 | **NONE** | **NONE** | high | tech_ai is a system type, not a generic representation of knowledge or information. |
| `soweli` | fuzzy creature, land animal, beast | ligature `soweli` -> `U+F1962` | 🐒 | **NONE** | **NONE** | high | No current tile represents land animals generally. |
| `suli` | big, heavy, large, long, tall, wide; important, relevant | ligature `suli` -> `U+F1963` | 🐘 | **NONE** | **NONE** | high | qty_plus means more, not generic physical size, length, or importance. |
| `suno` | light, shine, glow, radiance; sun, light source; brightness | ligature `suno` -> `U+F1964` | ☀️ | **NONE** | **NONE** | high | No tile represents the sun, light, radiance, or brightness generally. |
| `supa` | flat horizontal surface, especially to put or rest things on e.g. bed, floor, desk, plate, table, platform, stage | ligature `supa` -> `U+F1965` | 🛏️ | **NONE** | **NONE** | high | No tile represents a generic horizontal surface such as a table, bed, floor, or platform. |
| `suwi` | sweet, fragrant; cute, adorable | ligature `suwi` -> `U+F1966` | 🍭 | **NONE** | **NONE** | high | No tile spans sweetness, fragrance, and cuteness. |
| `tan` | (preposition) from, because of; cause, origin | ligature `tan` -> `U+F1967` | ↩️ | **NONE** | **NONE** | high | Cause, origin, from, and because-of relations belong to context/grammar in Pictiq. |
| `taso` | only, exclusively; (particle) [marks a sentence as qualifying or contradictory], but, however | ligature `taso` -> `U+F1968` | 🤔 | **NONE** | **NONE** | high | No tile represents only, exclusivity, contrast, or but/however. |
| `tawa` | motion, e.g. walking, shaking, flight, travel; (preposition) to, for, going to, from the perspective of | ligature `tawa` -> `U+F1969` | ↪️ | [`move_feet`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/move_feet.svg) | **PARTIAL** | high | move_feet covers walking or going on foot, not direction, benefit, or viewpoint. |
| `telo` | liquids e.g. water, gasoline, soda, lava, soup, oil, ink | ligature `telo` -> `U+F196A` | 💧 | [`need_water`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/need_water.svg) | **PARTIAL** | high | need_water is water/drink with practical intent; telo also covers many other liquids. |
| `tenpo` | time, event, situation, moment, period, duration | ligature `tenpo` -> `U+F196B` | ⏰ | [`time`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/time.svg) | **PARTIAL** | high | time covers time and when; tenpo also spans events, situations, periods, and duration. |
| `toki` | communicate, say, think; conversation, story; language | ligature `toki` -> `U+F196C` | 🗣️ | example: [`comm_phone`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/comm_phone.svg) | **CONTEXTUAL** | medium | A phone is one communication channel, not communication, speech, thought, story, or language itself. |
| `tomo` | indoor space or shelter e.g. room, building, home, tent, shack | ligature `tomo` -> `U+F196D` | 🏠 | **NONE** | **NONE** | high | Pictiq has specific places such as hotel and shop, but no generic building or home. |
| `tu` | (number) two; separate, divide, split | ligature `tu` -> `U+F196E` | ✌️ | [`qty_2`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/qty_2.svg) | **PARTIAL** | high | qty_2 covers the number two; tu also means separating, dividing, and splitting. |
| `unpa` | sex, to have sex with | ligature `unpa` -> `U+F196F` | 🍆 | example: [`item_condom`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/item_condom.svg) | **CONTEXTUAL** | medium | A condom is associated with safer sex in context but is not sex or sexual activity itself. |
| `uta` | mouth, lips, throat, consuming orifice | ligature `uta` -> `U+F1970` | 👄 | **NONE** | **NONE** | high | No tile represents mouth, lips, throat, or consuming orifice. |
| `utala` | fight, compete, battle; competition, challenge; struggle, strive | ligature `utala` -> `U+F1971` | ⚔️ | **NONE** | **NONE** | high | Police/medical tiles can respond to conflict but do not represent fighting or competition. |
| `walo` | light-colored, white, pale, light gray, cream | ligature `walo` -> `U+F1972` | ⚪ | **NONE** | **NONE** | high | The current lexicon has no generic white/light color tile. |
| `wan` | (number) one; singular; combine, join, mix, fuse | ligature `wan` -> `U+F1973` | 🇬🇺 | [`qty_1`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/qty_1.svg) | **PARTIAL** | high | qty_1 covers one and singular; wan also means combining, joining, or mixing. |
| `waso` | bird, flying creature, winged animal | ligature `waso` -> `U+F1974` | 🦅 | **NONE** | **NONE** | high | No current tile represents birds or flying creatures generally. |
| `wawa` | power, energy, strength; confident, intense, forceful; amazing, impressive | ligature `wawa` -> `U+F1975` | ⚡ | example: [`power_plug`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/power_plug.svg) | **CONTEXTUAL** | medium | A power outlet is an electrical-power context, not a general representation of energy, strength, or intensity. |
| `weka` | absent, away, distant; remove, get rid of | ligature `weka` -> `U+F1976` | 🛫 | **NONE** | **NONE** | high | No tile represents absence, distance, removal, or getting rid of something. |
| `wile` | want, desire, wish, require; (preverb) want to | ligature `wile` -> `U+F1977` | 💭 | example: [`need_water`](https://github.com/markoblogo/pictiq/blob/5dff34c28231d1261d1aa72022756c4c7a1b8fca/icons/svg/need_water.svg) | **CONTEXTUAL** | medium | A concrete need tile is only an example of need-intent in context; it is not a lexical mapping for wile. |

## Pilot consistency

All 20 accepted pilot classifications and ordered Pictiq IDs are unchanged. `pilot-20.json`, `PILOT.md`, and the pilot visual artifacts remain historical and were not regenerated.

## Regenerate

```bash
python3 crosswalks/pictiq/generate_crosswalk.py --pictiq-root /path/to/pictiq
```
