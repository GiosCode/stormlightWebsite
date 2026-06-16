#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

const inputPath = "data/coppermind-stormlight-index.json";
const outputPath = "data/stormlight-site-seed.js";
const sourceSnapshot = "https://web.archive.org/web/20260304033501/https://coppermind.net/wiki/Coppermind:Welcome";

function gate(work, chapter = 0) {
  return { work, chapter };
}

const lateGate = gate("wat", 147);

const titleGateOverrides = {
  Roshar: gate("none"),
  Highstorm: gate("none"),
  Spren: gate("twok", 1),
  Alethkar: gate("twok", 0),
  Shinovar: gate("twok", 0),
  Assassination_of_Gavilar: gate("twok", 0),
  Szeth: gate("twok", 0),
  Gavilar_Kholin: gate("twok", 0),
  Kaladin: gate("twok", 1),
  Shallan_Davar: gate("twok", 3),
  Jasnah_Kholin: gate("twok", 3),
  Kharbranth: gate("twok", 3),
  Bridge_Four: gate("twok", 6),
  Shattered_Plains: gate("twok", 6),
  Lirin: gate("twok", 7),
  Hesina: gate("twok", 7),
  Tien: gate("twok", 7),
  Teft: gate("twok", 9),
  Moash: gate("twok", 9),
  Rock: gate("twok", 9),
  Lopen: gate("twok", 9),
  Battle_of_the_Tower: gate("twok", 68),
  Dalinar_Kholin: gate("twok", 12),
  Adolin_Kholin: gate("twok", 12),
  Navani_Kholin: gate("twok", 12),
  Renarin_Kholin: gate("twok", 18),
  Rysn: gate("twok", 18),
  Purelake: gate("twok", 13),
  Thaylenah: gate("twok", 18),
  Azir: gate("twok", 42),
  Shardblade: gate("twok", 1),
  Shardplate: gate("twok", 12),
  Vorinism: gate("twok", 0),
  Lighteyes: gate("twok", 0),
  Darkeyes: gate("twok", 0),
  Alethi: gate("twok", 0),
  Ardent: gate("twok", 3),
  Spheres: gate("none"),
  Fabrial: gate("twok", 3),
  Spanreed: gate("twok", 3),
  Chull: gate("none"),
  Chasmfiend: gate("twok", 6),
  Ryshadium: gate("twok", 12),
  Jah_Keved: gate("twok", 3),
  Urithiru: gate("wor", 89),
  Oathgate: gate("wor", 89),
  Lift: gate("edgedancer", 1),
  Venli: gate("ob", 1),
  Sylphrena: gate("twok", 2)
};

const idOverrides = {
  The_Stormlight_Archive: "stormlight-archive",
  Roshar: "roshar",
  Highstorm: "highstorms",
  Alethkar: "alethkar",
  Kholinar: "kholinar",
  Shattered_Plains: "shattered-plains",
  Urithiru: "urithiru",
  Shinovar: "shinovar",
  Jah_Keved: "jah-keved",
  Azir: "azir",
  Thaylenah: "thaylenah",
  Herdaz: "herdaz",
  Kharbranth: "kharbranth",
  Purelake: "purelake",
  Reshi_Isles: "reshi-isles",
  Iri: "iri",
  Rira: "rira",
  Aimia: "aimia",
  Akinah: "akinah",
  Narak: "narak",
  Hearthstone: "hearthstone",
  Bridge_Four: "bridge-four",
  Knights_Radiant: "knights-radiant",
  Order_of_Windrunners: "order-windrunners",
  Order_of_Skybreakers: "order-skybreakers",
  Order_of_Dustbringers: "order-dustbringers",
  Order_of_Edgedancers: "order-edgedancers",
  Order_of_Truthwatchers: "order-truthwatchers",
  Order_of_Lightweavers: "order-lightweavers",
  Order_of_Elsecallers: "order-elsecallers",
  Order_of_Willshapers: "order-willshapers",
  Order_of_Stonewards: "order-stonewards",
  Order_of_Bondsmiths: "order-bondsmiths",
  Kaladin: "kaladin",
  Shallan_Davar: "shallan",
  Dalinar_Kholin: "dalinar",
  Adolin_Kholin: "adolin",
  Jasnah_Kholin: "jasnah",
  Navani_Kholin: "navani",
  Gavilar_Kholin: "gavilar",
  Renarin_Kholin: "renarin",
  Szeth: "szeth",
  Lift: "lift",
  Venli: "venli",
  Rysn: "rysn",
  Teft: "teft",
  Moash: "moash",
  Sylphrena: "syl",
  Shardblade: "shardblade",
  Shardplate: "shardplate",
  Oathgate: "oathgate",
  Spheres: "spheres",
  Spren: "spren"
};

const kindConfig = {
  place: { category: "world", label: "Location", limit: 90 },
  faction: { category: "world", label: "Faction", limit: 40 },
  culture: { category: "world", label: "Culture", limit: 45 },
  "people-or-lifeform": { category: "world", label: "People or lifeform", limit: 55 },
  character: { category: "characters", label: "Character", limit: 90 },
  "magic-or-item": { category: "items", label: "Item or magic", limit: 65 }
};

const seedKindOverrides = {
  Nahel_bond: "magic-or-item",
  Honorblade: "magic-or-item",
  Soulcaster: "magic-or-item",
  Stormlight: "magic-or-item",
  Voidlight: "magic-or-item",
  Lifelight: "magic-or-item",
  Towerlight: "magic-or-item",
  Warlight: "magic-or-item",
  Ideals: "magic-or-item",
  Spheres: "magic-or-item",
  Lights: "magic-or-item",
  Fused: "people-or-lifeform",
  Herald: "people-or-lifeform",
  Heralds: "people-or-lifeform",
  Alethi: "culture",
  Listener: "people-or-lifeform",
  Singer: "people-or-lifeform",
  Singers: "people-or-lifeform",
  Listeners: "people-or-lifeform",
  Parshendi: "people-or-lifeform"
};

const timelineEventLimit = 20;
const timelineEventExclusions = new Set([
  "Assassination_of_Gavilar",
  "Battle_of_the_Tower",
  "Battle_of_Thaylen_Field"
]);

const nonStormlightCategoryPattern = /\b(Meta|Alcatraz|The Reckoners|Legion|Wheel of Time|Dark One|Mistborn|Elantris|Warbreaker|Skyward|Cytoverse|Disambiguation pages)\b/i;
const nonStormlightTitlePattern = /\b(Alcatraz|Evil Librarians|Reckoners|Steelheart|Firefight|Calamity|Legion|Wheel of Time|Towers of Midnight|Memory of Light|River of Souls|Dark One|Mistborn|Elantris|Warbreaker|Skyward)\b/i;
const stormlightAnchorPattern = /\b(Roshar|Rosharan|Stormlight|Alethi|Veden|Thaylen|Shin|Herdaz|Kharbranth|Kholin|Bridge Four|Knights Radiant|Surgebind|Spren|Shardblade|Shardplate|Highstorm|Listener|Singer|Parshendi|Vorin|Makabaki|Aimia|Urithiru|Oathgate|Fabrial|Herald|Desolation|Shattered Plains)\b/i;

const topicCopy = {
  Shinovar: {
    summary: "A sheltered western nation whose soil, grass, and customs feel alien to much of storm-battered Roshar.",
    body: "Shinovar is separated from the rest of Roshar by mountains, giving it a softer ecology and a culture with different assumptions about stone, warriors, and social order.",
    tags: ["Location", "Shinovar", "Culture", "West"],
    sections: [
      { title: "Ecology", body: "Shinovar is protected from the worst highstorms, so soil, grass, and familiar-looking plants can exist there in ways that seem strange to many eastern Rosharans." },
      { title: "Culture", body: "Shin customs around stone, warriors, and truth differ sharply from Vorin expectations. Early entries keep those differences broad to avoid later revelations." },
      { title: "Appearance", body: "Eastern Rosharans often describe Shin people as having rounder eyes and a softer look than peoples shaped by highstorm country." }
    ]
  },
  Alethkar: {
    summary: "A powerful eastern kingdom organized around warfare, highprinces, Vorin rank, and military reputation.",
    body: "Alethkar sits at the center of the early war story. Its politics are built around lighteyed rule, competing highprinces, armies, dueling, and the public language of honor.",
    tags: ["Location", "Alethkar", "Vorin", "War"],
    sections: [
      { title: "Politics", body: "Alethi power is split among the king, highprinces, brightlords, officers, and family alliances. Reputation and battlefield success carry major weight." },
      { title: "Culture", body: "Lighteyes and darkeyes shape social rank. Vorin ideas about callings, gendered arts, safehands, and glory sit beside an intensely militarized public life." },
      { title: "Known cities", body: "Kholinar is the capital, while the warcamps on the Shattered Plains become the visible center of Alethi ambition early in the story." }
    ]
  },
  Alethi: {
    summary: "The dominant people and culture of Alethkar, strongly shaped by warfare, eye-color rank, and Vorin expectations.",
    body: "Alethi culture values military reputation, highprince politics, social rank, dueling, and public ideas of honor. It is one of the clearest early lenses on Vorin society.",
    tags: ["Culture", "Alethi", "Vorin", "War"],
    sections: [
      { title: "Social structure", body: "Lighteyes and darkeyes define legal and social standing, with brightlords and highprinces holding visible public power." },
      { title: "Military identity", body: "Alethi public life places unusual emphasis on soldiers, officers, Shardbearers, duels, and battlefield glory." },
      { title: "Reader handling", body: "This is safe early context because the first book presents Alethi culture directly." }
    ]
  },
  Kholinar: {
    summary: "Alethkar's capital, associated with the Kholin monarchy, windblades, court politics, and royal power.",
    body: "Kholinar is the symbolic and political heart of Alethkar. Early spoiler-safe context should treat it as the seat of the king and the royal family.",
    tags: ["Location", "Alethkar", "Capital", "Kholin"],
    sections: [
      { title: "Political role", body: "Kholinar is tied to the Alethi throne, royal legitimacy, and the public image of the Kholin dynasty." },
      { title: "Culture", body: "The city reflects Alethi Vorin norms: rank, display, military prestige, and courtly expectations matter." },
      { title: "Spoiler note", body: "Later details about the city are sensitive, so the early entry stays focused on its public role." }
    ]
  },
  Kharbranth: {
    summary: "A sheltered coastal city-state known for bells, hospitals, the Palanaeum, and careful neutrality.",
    body: "Kharbranth gives the early story a scholarly and medical setting, contrasting the warcamps with libraries, hospitals, and diplomacy.",
    tags: ["Location", "City-state", "Scholarship", "Medicine"],
    sections: [
      { title: "Institutions", body: "The Palanaeum and the hospitals define the city's public identity, making it a place of books, healing, and controlled information." },
      { title: "Politics", body: "Kharbranth is small compared with major kingdoms, so neutrality and reputation are important forms of protection." },
      { title: "Atmosphere", body: "The city's bells and sheltered geography give it a distinct feel from the highstorm-hardened eastern war story." }
    ]
  },
  Urithiru: {
    summary: "A legendary tower-city whose role becomes safe to discuss only after the end of Words of Radiance.",
    body: "Urithiru is tied to ancient systems, travel, politics, research, and the widening geography of the series. Its specifics remain gated because discovery is part of the story.",
    tags: ["Location", "Ancient", "Tower", "Gated"],
    sections: [
      { title: "Role", body: "Once unlocked, Urithiru becomes a major hub rather than just a mythic place-name." },
      { title: "Cultures", body: "The location gathers people from many nations, making it useful for comparing dress, religion, scholarship, command, and political priorities." },
      { title: "Spoiler note", body: "Most meaningful details belong after the book two threshold." }
    ]
  },
  Jah_Keved: {
    summary: "A western Vorin kingdom tied early to Shallan's family, Veden court culture, and aristocratic pressure.",
    body: "Jah Keved shares major Vorin assumptions with Alethkar but has its own courtly identity, family politics, and regional expectations.",
    tags: ["Location", "Veden", "Vorin", "Shallan"],
    sections: [
      { title: "Culture", body: "Veden society is Vorin, with lighteyed rank, safehand customs, scholarship, and family reputation shaping public life." },
      { title: "Appearance", body: "Vedens are often associated with pale skin and dark hair, while red hair can signal Unkalaki ancestry." },
      { title: "Story role", body: "The region is most visible early through Shallan's background and the pressure on her family." }
    ]
  },
  Azir: {
    summary: "A Makabaki power known for bureaucracy, law, paperwork, and a very different political style from Alethkar.",
    body: "Azir broadens Roshar beyond Vorin military courts. Its public identity is legalistic, procedural, and deeply invested in offices and documentation.",
    tags: ["Location", "Makabaki", "Bureaucracy", "Law"],
    sections: [
      { title: "Government", body: "Azir is associated with procedure, formal office, written rules, and bureaucratic legitimacy." },
      { title: "Culture", body: "Makabaki cultures are diverse, so Azir should not stand in for the entire region, but it is the most visible bureaucratic example." },
      { title: "Spoiler note", body: "Later political details remain gated." }
    ]
  },
  Thaylenah: {
    summary: "An island nation known for seafaring, trade, contracts, and distinctive Thaylen eyebrows.",
    body: "Thaylenah is a maritime commercial power. Its people are strongly associated with merchant culture, ships, ports, and negotiation.",
    tags: ["Location", "Thaylen", "Trade", "Ships"],
    sections: [
      { title: "Culture", body: "Trade, contracts, practical travel, and reputation are central to how Thaylens are understood by outsiders." },
      { title: "Appearance", body: "Thaylens are known for long eyebrows, often styled or worn in distinctive ways." },
      { title: "Story role", body: "Thaylen viewpoints often show Roshar through trade routes, apprenticeship, and negotiation rather than warcamp command." }
    ]
  },
  Purelake: {
    summary: "A warm inland lake region with a quieter food, fishing, and water-centered way of life.",
    body: "The Purelake offers a grounded view of Roshar away from highprince politics, showing daily rhythms built around shallow water and local custom.",
    tags: ["Location", "Lake", "Food", "Local culture"],
    sections: [
      { title: "Daily life", body: "Fishing, local meals, shallow water travel, and hospitality define much of the region's early texture." },
      { title: "Culture", body: "The Purelake feels intentionally modest beside imperial politics, which makes it valuable worldbuilding." },
      { title: "Spoiler note", body: "Early context stays local and avoids later cosmere-facing details." }
    ]
  },
  Reshi_Isles: {
    summary: "An island region associated with the Reshi people, sea travel, and ways of life far from Alethi courts.",
    body: "The Reshi Isles expand Roshar's cultural range through island communities, travel, and customs that do not follow Vorin court assumptions.",
    tags: ["Location", "Islands", "Reshi", "Travel"],
    sections: [
      { title: "Culture", body: "Reshi communities are best treated as their own island cultures, not as a variant of Alethi or Veden life." },
      { title: "Travel", body: "The region matters to trade, voyages, and broader geography." },
      { title: "Spoiler note", body: "Specific later discoveries are gated." }
    ]
  },
  Aimia: {
    summary: "A mysterious region tied to Aimians and later expedition material, so details are conservatively gated.",
    body: "Aimia is best handled as a late-reader location until the relevant novella and later context are unlocked.",
    tags: ["Location", "Aimia", "Mystery", "Gated"],
    sections: [
      { title: "Reader handling", body: "The name can be indexed safely, but meaningful context should stay behind later thresholds." },
      { title: "Associated peoples", body: "Aimians and related lifeforms connect this region to some of Roshar's stranger histories." },
      { title: "Spoiler note", body: "Avoid expanding this entry early." }
    ]
  },
  Surgebinding: {
    summary: "Roshar's best-known magic system, built around Surges, oaths, Light, and bonds.",
    body: "Surgebinding should stay broad for early readers: it is a system of supernatural abilities associated with Radiants, spren, Light, and specific forces.",
    tags: ["Magic", "Surges", "Radiants", "Gated"],
    sections: [
      { title: "Core idea", body: "The system is organized around Surges and access to Invested power, but the exact rules should unlock gradually." },
      { title: "Reader handling", body: "Early entries can mention public effects and terminology. Deeper mechanics belong behind later gates." },
      { title: "Connected topics", body: "Important linked topics include spren, Nahel bonds, Ideals, Light, and the orders of Knights Radiant." }
    ]
  },
  Nahel_bond: {
    summary: "A bond between a spren and a person, central to later explanations of Radiant power.",
    body: "The Nahel bond is a magic-system concept that should remain late-gated unless the reader has reached the chapters where the relationship is explained.",
    tags: ["Magic", "Spren", "Radiants", "Gated"],
    sections: [
      { title: "Function", body: "At a high level, it links a spren and a person in a way that can grant access to powers and oaths." },
      { title: "Spoiler handling", body: "The bond is easy to over-explain too early, so this entry remains conservatively gated." },
      { title: "Connected topics", body: "Related entries include spren, Surgebinding, Ideals, and the Radiant orders." }
    ]
  },
  Fabrial: {
    summary: "A Light-powered device that uses gemstones, spren, and engineering to produce practical effects.",
    body: "Fabrials make Roshar's magic feel technological: people use devices for communication, heat, movement, measurement, and other tasks.",
    tags: ["Item", "Magic technology", "Gemstones", "Spren"],
    sections: [
      { title: "Use", body: "Modern fabrials often involve captured spren and gemstones, turning supernatural principles into tools." },
      { title: "Worldbuilding", body: "They connect scholarship, engineering, commerce, and daily convenience." },
      { title: "Spoiler handling", body: "Specific advanced mechanics and ancient devices stay gated." }
    ]
  },
  Spanreed: {
    summary: "A paired writing device that lets people communicate across distance.",
    body: "Spanreeds are one of Roshar's clearest examples of practical magical infrastructure: communication becomes faster without modern electronics.",
    tags: ["Item", "Communication", "Fabrial", "Writing"],
    sections: [
      { title: "Function", body: "Spanreeds are used for remote writing, making administration, scholarship, and military coordination easier." },
      { title: "Culture", body: "They reinforce the importance of literacy, scribes, ardents, and written records." },
      { title: "Spoiler note", body: "This entry keeps to public function rather than deeper mechanics." }
    ]
  },
  Soulcaster: {
    summary: "A rare device associated with transforming matter and supporting large-scale logistics.",
    body: "Soulcasters matter because they can affect food, materials, warfare, trade, and religious authority. Details should unlock carefully.",
    tags: ["Item", "Transformation", "Logistics", "Gated"],
    sections: [
      { title: "Public role", body: "Soulcasters are valuable because they can change what a society can supply or build." },
      { title: "Institutions", body: "Their use intersects with ardents, rulers, armies, and secrecy." },
      { title: "Spoiler handling", body: "Mechanics and origin details remain gated." }
    ]
  },
  Oathgate: {
    summary: "An ancient transportation system whose significance becomes safe after late Words of Radiance.",
    body: "Oathgates change how distance, borders, and logistics work once the reader reaches the relevant discovery.",
    tags: ["Item", "Travel", "Ancient", "Gated"],
    sections: [
      { title: "Function", body: "They are tied to large-scale movement rather than ordinary roads, caravans, or ships." },
      { title: "Story impact", body: "Once understood, they reshape the map and make Roshar feel more connected." },
      { title: "Spoiler note", body: "Discovery and use are part of the plot, so early entries stay locked." }
    ]
  },
  Stormlight: {
    summary: "Invested light associated with highstorms, infused gemstones, money, illumination, and magic.",
    body: "Stormlight links weather, currency, technology, and supernatural ability. Early entries should focus on spheres and highstorms rather than advanced mechanics.",
    tags: ["Magic", "Light", "Gemstones", "Highstorms"],
    sections: [
      { title: "Everyday role", body: "Infused spheres glow, so money and lighting are materially connected." },
      { title: "Magic role", body: "Stormlight also powers effects that become clearer as the reader progresses." },
      { title: "Spoiler handling", body: "Advanced Light mechanics are gated." }
    ]
  },
  Shardblade: {
    summary: "A legendary weapon whose battlefield value and political status are obvious from early in the story.",
    body: "Shardblades are rare enough to shape rank, dueling, fear, inheritance, and military planning.",
    tags: ["Item", "Weapon", "Status", "War"],
    sections: [
      { title: "Battlefield role", body: "A Shardblade can change the scale of a fight and the status of its bearer." },
      { title: "Politics", body: "Possession is a public signal of power and legitimacy." },
      { title: "Spoiler handling", body: "Later explanations about what Shardblades are remain gated." }
    ]
  },
  Shardplate: {
    summary: "Rare armor that gives a warrior extraordinary battlefield presence and social prestige.",
    body: "Shardplate changes combat, command, and status. Early context should focus on visible effects, not hidden mechanics.",
    tags: ["Item", "Armor", "Status", "War"],
    sections: [
      { title: "Combat", body: "Plate increases strength and resilience enough to separate a bearer from ordinary soldiers." },
      { title: "Politics", body: "Like Blades, Plate is tied to elite military and noble power." },
      { title: "Spoiler handling", body: "Deeper explanations stay gated." }
    ]
  },
  Vorinism: {
    summary: "The dominant eastern Rosharan religion, shaping gender roles, scholarship, rank, callings, and public morality.",
    body: "Vorinism is central to Alethi and Veden public life. It influences safehand customs, masculine and feminine arts, ardents, lighteyed status, and ideas of glory.",
    tags: ["Culture", "Religion", "Vorin", "Ardents"],
    sections: [
      { title: "Public practice", body: "Vorin culture divides many arts and social expectations by gender, with reading and scholarship coded strongly through that lens." },
      { title: "Institutions", body: "Ardents serve religious, scholarly, and practical roles while being set apart from ordinary social rank." },
      { title: "Reader handling", body: "Early context can discuss culture and practice without explaining later theological history." }
    ]
  },
  Lighteyes: {
    summary: "A high-status social class in Vorin societies, especially visible in Alethkar.",
    body: "Lighteyed rank shapes law, military command, marriage expectations, and daily treatment in Alethi and other Vorin cultures.",
    tags: ["Culture", "Class", "Vorin", "Alethkar"],
    sections: [
      { title: "Social rank", body: "Eye color is not just description; it determines status and opportunity." },
      { title: "Politics", body: "High-ranking lighteyes often hold land, command armies, and define court life." },
      { title: "Reader handling", body: "The class system is safe to discuss from the start because it is foundational world context." }
    ]
  },
  Darkeyes: {
    summary: "The lower-status class in much of Vorin society, including most common soldiers, workers, and servants.",
    body: "Darkeyed status shapes what people can own, command, inherit, and expect from lighteyed authorities.",
    tags: ["Culture", "Class", "Vorin", "Alethkar"],
    sections: [
      { title: "Social rank", body: "Darkeyes are internally ranked, but they remain below lighteyes in the public hierarchy." },
      { title: "Story role", body: "The class divide is central to early Alethi military and civilian life." },
      { title: "Reader handling", body: "Safe early context should focus on lived status and social pressure." }
    ]
  },
  Ardent: {
    summary: "A member of the Vorin ardentia, serving religious, scholarly, medical, and technical roles.",
    body: "Ardents sit outside ordinary family rank and often handle scholarship, soulcasting, engineering, medicine, or religious service.",
    tags: ["Culture", "Religion", "Scholarship", "Vorin"],
    sections: [
      { title: "Role", body: "The ardentia connects faith, education, science, and service." },
      { title: "Status", body: "Ardents are socially distinct from ordinary lighteyed and darkeyed rank." },
      { title: "Reader handling", body: "Specific secrets or institutional history should remain gated." }
    ]
  },
  Singers: {
    summary: "A sapient Rosharan people with rhythms, forms, and carapace, central to the world's deeper conflicts.",
    body: "Singers should be handled carefully for spoilers. At a broad level, they are one of Roshar's native sapient peoples, with biology and culture tied to forms and rhythms.",
    tags: ["People", "Rosharan lifeform", "Forms", "Gated"],
    sections: [
      { title: "Biology", body: "They are associated with carapace, rhythms, and forms, but details unlock gradually." },
      { title: "Culture", body: "Songs, memory, identity, and form changes matter deeply to singer and listener contexts." },
      { title: "Spoiler handling", body: "Because this topic connects to major revelations, the generated entry stays late-gated." }
    ]
  },
  Listeners: {
    summary: "A distinct people of the Shattered Plains whose songs, forms, and choices become increasingly important.",
    body: "Listeners are safest early as the people the Alethi call Parshendi. Their internal culture should unlock with the chapters that reveal it.",
    tags: ["People", "Listeners", "Shattered Plains", "Gated"],
    sections: [
      { title: "Early context", body: "From the Alethi side, they are first understood through war on the Shattered Plains." },
      { title: "Culture", body: "Their own perspective involves songs, forms, memory, and community decisions." },
      { title: "Spoiler handling", body: "Later identity and history details are gated." }
    ]
  },
  Chull: {
    summary: "A common crustacean-like work animal used for labor, transport, and everyday logistics.",
    body: "Chulls make Roshar feel practical: heavy work, wagons, supply lines, and civilian labor depend on animals adapted to the world.",
    tags: ["Lifeform", "Animal", "Labor", "Roshar"],
    sections: [
      { title: "Use", body: "Chulls are used as work animals, especially where strength and endurance matter." },
      { title: "Worldbuilding", body: "They fit Roshar's crustacean-heavy ecology and highstorm-adapted life." },
      { title: "Reader handling", body: "This is safe low-spoiler ecology." }
    ]
  },
  Chasmfiend: {
    summary: "A massive greatshell associated early with the Shattered Plains and high-risk plateau hunts.",
    body: "Chasmfiends connect Roshar's ecology to the military economy of the Shattered Plains.",
    tags: ["Lifeform", "Greatshell", "Shattered Plains", "War"],
    sections: [
      { title: "Ecology", body: "Chasmfiends are one of the most visible examples of Roshar's oversized crustacean life." },
      { title: "Story role", body: "Their appearances drive risk, competition, and resource conflict on the Plains." },
      { title: "Spoiler handling", body: "Deeper biological implications stay gated." }
    ]
  },
  Ryshadium: {
    summary: "Rare, intelligent horses associated with elite riders and unusual bonds.",
    body: "Ryshadium stand out because ordinary horses are not common in much of Roshar, and these animals are treated as exceptional companions.",
    tags: ["Lifeform", "Horse", "Bond", "Elite"],
    sections: [
      { title: "Role", body: "Ryshadium are associated with high-status riders and unusual intelligence." },
      { title: "Culture", body: "Their rarity makes them symbols of trust, command, and distinction." },
      { title: "Spoiler handling", body: "Mechanics behind their nature remain gated." }
    ]
  },
  Rysn: {
    summary: "A Thaylen trader apprentice whose viewpoints show Roshar through travel, trade, and negotiation.",
    body: "Rysn's early value is perspective: she shows merchants, contracts, apprenticeship, and regional cultures outside the warcamp lens.",
    tags: ["Character", "Thaylen", "Trade", "Travel"],
    sections: [
      { title: "Role", body: "Rysn learns through trade journeys and negotiation rather than court command or battlefield rank." },
      { title: "Culture", body: "Her chapters are useful for seeing Thaylen mercantile values and cross-cultural contact." },
      { title: "Spoiler handling", body: "Later material remains gated." }
    ]
  },
  Taravangian: {
    summary: "The king of Kharbranth, associated early with hospitals, diplomacy, and carefully managed public benevolence.",
    body: "Taravangian is safest early as Kharbranth's ruler, connected to healing institutions and political caution.",
    tags: ["Character", "Kharbranth", "King", "Politics"],
    sections: [
      { title: "Public role", body: "He is tied to Kharbranth's hospitals, scholarship, and reputation for compassion." },
      { title: "Politics", body: "His small city-state depends on diplomacy and careful positioning." },
      { title: "Spoiler handling", body: "Later layers of his role are gated." }
    ]
  },
  Eshonai: {
    summary: "A listener figure tied to the Shattered Plains conflict and the reader's growing understanding of listener culture.",
    body: "Eshonai should remain carefully gated until her perspective and context are safe.",
    tags: ["Character", "Listener", "Shattered Plains", "Gated"],
    sections: [
      { title: "Role", body: "She connects the battlefield conflict to listener identity and internal choices." },
      { title: "Culture", body: "Her context opens songs, forms, memory, and leadership from inside listener society." },
      { title: "Spoiler handling", body: "Details should unlock only when the relevant viewpoints are safe." }
    ]
  },
  Szeth: {
    summary: "A Shin assassin introduced in the opening, bound by orders and central to the event that sends Alethkar to war.",
    body: "Szeth enters the story as the Assassin in White. His early role is defined by obedience, violence, guilt, and the mystery of why a Shin man is carrying out impossible orders.",
    tags: ["Character", "Shin", "Assassin", "Opening"],
    sections: [
      { title: "Background", body: "Szeth is a Shin man whose presence immediately connects Alethi politics to a wider Rosharan world. Early context should treat his past carefully and focus on what the opening reveals." },
      { title: "Story role", body: "His assassination of Gavilar Kholin triggers the Vengeance Pact and helps drive the Alethi war on the Shattered Plains." },
      { title: "Themes", body: "His chapters raise questions about obedience, culpability, truth, punishment, and whether following orders can absolve a person." }
    ]
  },
  Gavilar_Kholin: {
    summary: "The Alethi king whose assassination opens the modern conflict and reshapes the Kholin family.",
    body: "Gavilar Kholin is safest early as the murdered king of Alethkar: Dalinar's brother, Navani's husband, and the public reason for the Alethi war of vengeance.",
    tags: ["Character", "Alethkar", "King", "Kholin"],
    sections: [
      { title: "Background", body: "Gavilar is the king of Alethkar at the start of the story and a central figure in the Kholin family's public power." },
      { title: "Story role", body: "His death creates a political and military crisis that pulls Alethkar toward the Shattered Plains." },
      { title: "Themes", body: "Early references to Gavilar involve legacy, ambition, empire, family memory, and the gap between public image and private motives." }
    ]
  },
  Adolin_Kholin: {
    summary: "An Alethi prince, duelist, Shardbearer, and Dalinar's elder son.",
    body: "Adolin is introduced through Alethi nobility, dueling culture, military command, family loyalty, and the pressure of being his father's heir.",
    tags: ["Character", "Kholin", "Duelist", "Alethi"],
    sections: [
      { title: "Background", body: "Adolin is Dalinar Kholin's elder son and Renarin's brother, raised inside the highest ranks of Alethi lighteyed society." },
      { title: "Public role", body: "He is known for dueling, fashion, battlefield competence, and the expectations placed on a Shardbearer prince." },
      { title: "Themes", body: "His early story often tests loyalty, reputation, confidence, and what it means to support a father whose ideals unsettle Alethi norms." }
    ]
  },
  Navani_Kholin: {
    summary: "An Alethi queen and scholar-engineer whose influence reaches politics, family, and fabrial science.",
    body: "Navani is tied to the Kholin family, Alethi court politics, and practical scholarship. Early context should emphasize her intelligence, status, and interest in fabrials.",
    tags: ["Character", "Kholin", "Scholarship", "Fabrials"],
    sections: [
      { title: "Background", body: "Navani is Gavilar's widow and the mother of Jasnah and Elhokar, giving her a central place in Alethi royal politics." },
      { title: "Skills", body: "She is associated with fabrial research, logistics, patronage, and applied scholarship rather than battlefield command." },
      { title: "Themes", body: "Her arc often concerns underestimated intelligence, public usefulness, family duty, and the political value of invention." }
    ]
  },
  Renarin_Kholin: {
    summary: "Dalinar's younger son, an Alethi prince whose quiet presence contrasts with the warlike expectations around him.",
    body: "Renarin is safest early as Adolin's younger brother and Dalinar's son, shaped by a society that prizes martial talent and public confidence.",
    tags: ["Character", "Kholin", "Alethi", "Family"],
    sections: [
      { title: "Background", body: "Renarin belongs to House Kholin but does not fit comfortably into the Alethi ideal of aggressive warrior nobility." },
      { title: "Family role", body: "His relationship with Dalinar and Adolin is central to how the reader first understands him." },
      { title: "Themes", body: "His early material points toward vulnerability, expectation, dignity, and finding a place in a culture that values different strengths." }
    ]
  },
  Talenel: {
    summary: "One of the Heralds, associated with ancient war, endurance, and the mythic history behind the series.",
    body: "Talenel belongs to the ancient layer of Stormlight history. Early entries should keep him broad as a Heraldic figure until later context is safe.",
    tags: ["Character", "Herald", "Ancient", "Gated"],
    sections: [
      { title: "Background", body: "Talenel is one of the ten Heralds known through Vorin tradition and ancient Rosharan history." },
      { title: "Story role", body: "He connects the present-day story to Desolations, oath-bound myth, and the cost of survival across ages." },
      { title: "Spoiler handling", body: "Specifics about his condition and later significance should remain gated." }
    ]
  },
  Shalash: {
    summary: "A Heraldic figure associated with beauty, art, and later mysteries around the Heralds.",
    body: "Shalash should stay conservatively gated beyond broad Herald context because her role becomes clearer later.",
    tags: ["Character", "Herald", "Art", "Gated"],
    sections: [
      { title: "Background", body: "Shalash is known through Vorin Heraldic tradition and is connected with beauty and the Lightweavers." },
      { title: "Reader handling", body: "Early mention should avoid expanding her present-day role." },
      { title: "Themes", body: "Her topic touches identity, memory, worship, and the damage left by ancient burdens." }
    ]
  },
  Lopen: {
    summary: "A Herdazian member of Bridge Four whose humor and confidence add a different texture to the bridge crew.",
    body: "Lopen is safest early as a Bridge Four character: loud, resilient, funny, and deeply tied to the crew's developing community.",
    tags: ["Character", "Bridge Four", "Herdazian", "Humor"],
    sections: [
      { title: "Background", body: "Lopen is Herdazian and becomes part of Bridge Four's social fabric." },
      { title: "Story role", body: "He helps make Bridge Four feel like a living group rather than a list of soldiers." },
      { title: "Themes", body: "His early scenes use humor, confidence, kinship, and resilience to offset the bleakness of the bridge crews." }
    ]
  },
  Teft: {
    summary: "A Bridge Four veteran whose knowledge, scars, and discipline make him important to Kaladin's crew.",
    body: "Teft is one of the most important early Bridge Four members, bringing experience, guarded knowledge, and hard-won loyalty.",
    tags: ["Character", "Bridge Four", "Veteran", "Alethi"],
    sections: [
      { title: "Background", body: "Teft is a darkeyed Alethi soldier in Bridge Four with more knowledge than he first explains." },
      { title: "Crew role", body: "He becomes one of Kaladin's most important supports inside the bridge crew." },
      { title: "Themes", body: "His story involves shame, recovery, loyalty, self-worth, and taking the next step despite failure." }
    ]
  },
  Moash: {
    summary: "A Bridge Four member whose anger and desire for justice complicate Kaladin's early leadership.",
    body: "Moash begins as an Alethi bridgeman in Bridge Four. His early role should focus on loyalty, resentment, class anger, and hard trust.",
    tags: ["Character", "Bridge Four", "Alethi", "Conflict"],
    sections: [
      { title: "Background", body: "Moash is a darkeyed Alethi bridgeman whose past gives him strong reasons to distrust lighteyed authority." },
      { title: "Crew role", body: "He becomes part of Bridge Four and one of the people Kaladin has to lead rather than merely save." },
      { title: "Spoiler handling", body: "Later choices are highly spoiler-sensitive and should remain gated." }
    ]
  },
  Sylphrena: {
    summary: "A windspren-like companion connected to Kaladin, curiosity, memory, and the first hints of deeper spren mysteries.",
    body: "Syl is safest early as Kaladin's unusual spren companion. Specific explanations about what she is should unlock gradually.",
    tags: ["Character", "Spren", "Kaladin", "Gated"],
    sections: [
      { title: "Background", body: "Syl appears around Kaladin and behaves differently from ordinary spren, making her one of the earliest signs that spren have deeper layers." },
      { title: "Story role", body: "She provides companionship, questions, and pressure at moments when Kaladin is isolated." },
      { title: "Spoiler handling", body: "Her exact nature and implications should remain gated by chapter progress." }
    ]
  },
  Pattern: {
    summary: "A strange spren connected to Shallan, truth, memory, and later Lightweaver context.",
    body: "Pattern should remain gated until the story has safely introduced his relationship to Shallan.",
    tags: ["Character", "Spren", "Shallan", "Gated"],
    sections: [
      { title: "Background", body: "Pattern is tied to Shallan's later arc and to questions of truth, lies, and memory." },
      { title: "Story role", body: "He helps move Shallan's story from scholarship into deeper magical and personal territory." },
      { title: "Spoiler handling", body: "This entry should not be expanded before the relevant book two material." }
    ]
  },
  Wyndle: {
    summary: "A careful spren connected to Lift and the strange edge where humor, hunger, and Radiant power meet.",
    body: "Wyndle belongs with Lift's later context, so his entry stays broad until the novella material is safe.",
    tags: ["Character", "Spren", "Lift", "Gated"],
    sections: [
      { title: "Background", body: "Wyndle is a spren whose role becomes meaningful through Lift's viewpoint." },
      { title: "Story role", body: "He provides contrast to Lift's instincts, adding worry, explanation, and magical context." },
      { title: "Spoiler handling", body: "Specific bond mechanics and later developments remain gated." }
    ]
  },
  Glys: {
    summary: "A spren connected to Renarin and to later questions about what Radiant bonds can become.",
    body: "Glys is highly spoiler-sensitive because even basic context points toward later revelations.",
    tags: ["Character", "Spren", "Renarin", "Gated"],
    sections: [
      { title: "Background", body: "Glys belongs to Renarin's later arc and should not be explained early." },
      { title: "Story role", body: "The entry is included so the relationship tree can represent later magical ties safely." },
      { title: "Spoiler handling", body: "Details remain locked until the reader reaches the relevant later-book context." }
    ]
  },
  Ivory: {
    summary: "A spren associated with Jasnah and later Elsecaller context.",
    body: "Ivory is best handled as a late-gated spren entry because his role clarifies parts of Jasnah's story that are not safe early.",
    tags: ["Character", "Spren", "Jasnah", "Gated"],
    sections: [
      { title: "Background", body: "Ivory is tied to Jasnah's magical and scholarly context." },
      { title: "Story role", body: "His entry supports later relationship and order information without revealing it too soon." },
      { title: "Spoiler handling", body: "Specifics about the bond and abilities remain gated." }
    ]
  },
  Timbre: {
    summary: "A spren connected to Venli and the later listener side of the story.",
    body: "Timbre belongs to a spoiler-sensitive arc involving listener identity, power, and choice.",
    tags: ["Character", "Spren", "Venli", "Gated"],
    sections: [
      { title: "Background", body: "Timbre is tied to Venli's later development." },
      { title: "Story role", body: "The entry marks a magical and personal connection that should unlock only with later context." },
      { title: "Spoiler handling", body: "Details remain hidden until the relevant listener chapters are safe." }
    ]
  },
  Mayalaran: {
    summary: "A spren tied to Adolin's later story and to deeper questions about Shardblades.",
    body: "Mayalaran should stay late-gated because the basics of the relationship reveal later Shardblade context.",
    tags: ["Character", "Spren", "Adolin", "Gated"],
    sections: [
      { title: "Background", body: "Mayalaran is connected to Adolin and to later explanations around Blades." },
      { title: "Story role", body: "The entry supports later relationship mapping without exposing the discovery early." },
      { title: "Spoiler handling", body: "Mechanics and identity details remain gated." }
    ]
  },
  Stormfather: {
    summary: "A vast storm-related spren tied to highstorms, ancient memory, and later Radiant context.",
    body: "The Stormfather is connected to Roshar's storms and mythic history, but deeper specifics are spoiler-sensitive.",
    tags: ["Character", "Spren", "Highstorms", "Gated"],
    sections: [
      { title: "Background", body: "The Stormfather is one of the most important spren-like presences in Rosharan belief and storm lore." },
      { title: "Story role", body: "He connects weather, visions, oaths, and ancient history as the series opens up." },
      { title: "Spoiler handling", body: "Detailed explanations stay behind later thresholds." }
    ]
  },
  Nightwatcher: {
    summary: "A powerful spren associated with the Old Magic and requests for boons and curses.",
    body: "The Nightwatcher is best treated as folklore and Old Magic context until later details are safe.",
    tags: ["Character", "Spren", "Old Magic", "Gated"],
    sections: [
      { title: "Background", body: "The Nightwatcher is connected to stories of people seeking supernatural intervention." },
      { title: "Story role", body: "The topic helps explain Rosharan beliefs about bargains, consequences, and mysterious powers." },
      { title: "Spoiler handling", body: "Specific encounters and deeper identity details remain gated." }
    ]
  },
  Sibling: {
    summary: "A powerful spren whose importance belongs to later tower and Radiant context.",
    body: "The Sibling is intentionally late-gated because the topic is tied to major later setting revelations.",
    tags: ["Character", "Spren", "Urithiru", "Gated"],
    sections: [
      { title: "Background", body: "The Sibling is connected to later understanding of Urithiru and ancient systems." },
      { title: "Story role", body: "The entry exists for late-reader relationship and magic mapping." },
      { title: "Spoiler handling", body: "Details should not be shown before the tower context is safe." }
    ]
  },
  "Sja-anat": {
    summary: "One of the Unmade, connected to corrupted spren and later conflict around perception and allegiance.",
    body: "Sja-anat is a late-gated entity because even broad details point toward later magical and political complexity.",
    tags: ["Character", "Unmade", "Spren", "Gated"],
    sections: [
      { title: "Background", body: "Sja-anat is associated with the Unmade and altered spren." },
      { title: "Story role", body: "Her entry supports later magical and factional relationship mapping." },
      { title: "Spoiler handling", body: "Motives, abilities, and alliances remain gated." }
    ]
  },
  Jezrien: {
    summary: "A Heraldic figure associated with kingship, ancient oaths, and Vorin tradition.",
    body: "Jezrien should stay broad for early readers as one of the Heralds known through religion and history.",
    tags: ["Character", "Herald", "Vorinism", "Gated"],
    sections: [
      { title: "Background", body: "Jezrien is one of the ten Heralds in Rosharan tradition." },
      { title: "Story role", body: "He helps connect modern Vorin belief to the ancient framework behind the series." },
      { title: "Spoiler handling", body: "Specific later involvement remains gated." }
    ]
  },
  Ishar: {
    summary: "A Heraldic figure tied to oaths, ancient authority, and later high-stakes revelations.",
    body: "Ishar is safest as a Heraldic reference until later context makes his role clear.",
    tags: ["Character", "Herald", "Oaths", "Gated"],
    sections: [
      { title: "Background", body: "Ishar belongs to the ancient Heraldic layer of Rosharan history." },
      { title: "Story role", body: "His topic connects oaths, authority, and the structure of old powers." },
      { title: "Spoiler handling", body: "Later specifics remain gated." }
    ]
  },
  Nale: {
    summary: "A Heraldic figure connected to law, judgment, and later Skybreaker context.",
    body: "Nale should remain late-gated until the series safely introduces his modern role.",
    tags: ["Character", "Herald", "Law", "Gated"],
    sections: [
      { title: "Background", body: "Nale is one of the Heralds and is associated with law and judgment." },
      { title: "Story role", body: "His topic becomes important to later questions about justice and obedience." },
      { title: "Spoiler handling", body: "Specific actions and affiliations remain gated." }
    ]
  },
  "Ba-Ado-Mishram": {
    summary: "One of the Unmade, tied to deep historical mysteries and late-series implications.",
    body: "Ba-Ado-Mishram is highly spoiler-sensitive and should remain locked until late context is safe.",
    tags: ["Character", "Unmade", "History", "Gated"],
    sections: [
      { title: "Background", body: "Ba-Ado-Mishram belongs to the ancient and Unmade side of Roshar's history." },
      { title: "Story role", body: "The topic supports late-reader historical and magical connections." },
      { title: "Spoiler handling", body: "Do not expand this entry early." }
    ]
  },
  Cusicesh: {
    summary: "A mysterious spren-like presence associated with Iri and observed behavior rather than clear answers.",
    body: "Cusicesh adds to Roshar's sense that some spren and entities are not easily categorized.",
    tags: ["Character", "Spren", "Iri", "Mystery"],
    sections: [
      { title: "Background", body: "Cusicesh is known as an unusual spren-like entity." },
      { title: "Story role", body: "The entry supports Roshar's broader ecology of strange, semi-understood beings." },
      { title: "Reader note", body: "Specific explanations remain limited and gated." }
    ]
  },
  Roshar: {
    summary: "The storm-shaped planet and continent where weather, ecology, culture, and old magic define everyday life.",
    body: "Roshar is the primary setting of the series: a world of highstorms, spren, stone ecology, gemstones, nations, and deep history.",
    tags: ["World", "Roshar", "Highstorms", "Culture"],
    sections: [
      { title: "World shape", body: "Highstorms, crem, stone, and adapted lifeforms make Roshar feel physically different from familiar worlds." },
      { title: "Cultures", body: "Roshar contains many nations and peoples with distinct customs, religions, clothing, and power structures." },
      { title: "Reader note", body: "The atlas keeps historical and cosmere-level explanations gated." }
    ]
  },
  Shattered_Plains: {
    summary: "A broken plateau region central to the Alethi warcamps, bridge crews, and early conflict.",
    body: "The Shattered Plains turn geography into strategy: chasms, plateau runs, bridges, and greatshell hunts all shape the early war.",
    tags: ["Location", "War", "Bridge Four", "Alethkar"],
    sections: [
      { title: "Terrain", body: "Deep chasms split the region into plateaus, making movement and timing central to battle." },
      { title: "Culture and use", body: "The warcamps create a temporary society of armies, officers, bridgemen, workers, merchants, and scholars." },
      { title: "Reader note", body: "Later discoveries about the region remain gated." }
    ]
  },
  Herdaz: {
    summary: "A Rosharan nation known through Herdazian characters, resilience, food, family, and borderland identity.",
    body: "Herdaz adds another cultural angle to Roshar, distinct from Alethi and Veden Vorin courts.",
    tags: ["Location", "Herdaz", "Culture", "People"],
    sections: [
      { title: "Culture", body: "Herdazian identity is often shown through family ties, humor, food, and survival under pressure." },
      { title: "Story use", body: "Herdaz helps broaden the map beyond highprinces and scholars." },
      { title: "Reader note", body: "Political and later-war context remains gated." }
    ]
  },
  Iri: {
    summary: "A western Rosharan nation associated with the Iriali people and distinct golden-haired identity.",
    body: "Iri is one of Roshar's culturally distinct nations and is useful for tracking western geography and Iriali identity.",
    tags: ["Location", "Iri", "Iriali", "Culture"],
    sections: [
      { title: "People", body: "The Iriali are visually and culturally distinct within Roshar's national map." },
      { title: "Geography", body: "Iri helps situate western Roshar and its differences from Vorin east." },
      { title: "Reader note", body: "Deeper history stays gated." }
    ]
  },
  Narak: {
    summary: "A city on the Shattered Plains tied to listener history and the region's hidden depth.",
    body: "Narak should stay gated because its importance grows as the Plains become more than a battlefield.",
    tags: ["Location", "Shattered Plains", "Listeners", "Gated"],
    sections: [
      { title: "Place", body: "Narak is connected to the Shattered Plains and listener context." },
      { title: "Story role", body: "It helps shift the Plains from battlefield scenery into a place with history." },
      { title: "Spoiler handling", body: "Specific discoveries remain gated." }
    ]
  },
  Hearthstone: {
    summary: "Kaladin's hometown, a small Alethi settlement shaped by lighteyed rule, medicine, and local obligation.",
    body: "Hearthstone grounds Kaladin's early background in ordinary village life, class pressure, family duty, and local authority.",
    tags: ["Location", "Alethkar", "Kaladin", "Hometown"],
    sections: [
      { title: "Community", body: "Hearthstone shows Alethi society at a smaller scale than courts or warcamps." },
      { title: "Story role", body: "The town gives context for Kaladin's family, training, and early ideas about responsibility." },
      { title: "Reader note", body: "Later returns and changes remain gated." }
    ]
  },
  Highstorm: {
    summary: "The continent-spanning storm system that shapes travel, buildings, ecology, money, and magic on Roshar.",
    body: "Highstorms are one of Roshar's central facts of life: people build, travel, farm, fight, and shelter around them.",
    tags: ["World", "Weather", "Stormlight", "Ecology"],
    sections: [
      { title: "Daily life", body: "Settlements, architecture, plants, animals, and trade are all adapted around recurring highstorms." },
      { title: "Stormlight", body: "Highstorms are tied to infused gemstones and the practical economy of light." },
      { title: "Reader note", body: "Deeper causes and mechanics remain gated." }
    ]
  },
  Everstorm: {
    summary: "A later storm that changes Roshar's danger map and should remain locked until its reveal.",
    body: "The Everstorm is spoiler-sensitive because its arrival and effects are major plot material.",
    tags: ["World", "Storm", "Gated", "Conflict"],
    sections: [
      { title: "Function", body: "This entry tracks a major storm phenomenon that changes travel, war, and safety." },
      { title: "Story role", body: "Its importance belongs to later context, not early worldbuilding." },
      { title: "Spoiler handling", body: "Keep locked until the reveal is safe." }
    ]
  },
  Honorblade: {
    summary: "A legendary blade associated with the Heralds and powers that should remain carefully gated.",
    body: "Honorblades look like weapon entries, but their implications reach into ancient history and magic-system mechanics.",
    tags: ["Item", "Weapon", "Heralds", "Gated"],
    sections: [
      { title: "Function", body: "Honorblades are tracked as rare weapons tied to old powers." },
      { title: "Why it matters", body: "They connect combat, myth, status, and magical ability." },
      { title: "Spoiler handling", body: "Mechanics and ownership details remain gated." }
    ]
  },
  Gemheart: {
    summary: "A valuable gemstone formation inside some Rosharan lifeforms, important to ecology, economics, and conflict.",
    body: "Gemhearts connect living ecology to money, resources, hunting, and military competition.",
    tags: ["Item", "Gemstone", "Ecology", "Economy"],
    sections: [
      { title: "Function", body: "Gemhearts are valuable resources associated with Rosharan creatures." },
      { title: "Why it matters", body: "They turn ecology into economics and battlefield strategy." },
      { title: "Reader note", body: "Deeper biological implications remain gated." }
    ]
  },
  Voidlight: {
    summary: "A later form of Light connected to opposing powers and spoiler-sensitive magic mechanics.",
    body: "Voidlight should stay locked until the reader reaches the books that explain different Lights.",
    tags: ["Magic", "Light", "Gated", "Power"],
    sections: [
      { title: "Function", body: "Voidlight is tracked as a distinct magical Light." },
      { title: "Why it matters", body: "It helps separate Roshar's powers and factions in later magic-system context." },
      { title: "Spoiler handling", body: "Details remain gated." }
    ]
  },
  Lifelight: {
    summary: "A later Light associated with another side of Roshar's magical framework.",
    body: "Lifelight is spoiler-sensitive and should remain locked until multiple-Light mechanics are safe.",
    tags: ["Magic", "Light", "Gated", "Power"],
    sections: [
      { title: "Function", body: "Lifelight is tracked as a distinct magical Light." },
      { title: "Why it matters", body: "It broadens the reader's understanding of Roshar's power sources." },
      { title: "Spoiler handling", body: "Details remain gated." }
    ]
  },
  Towerlight: {
    summary: "A later Light tied to Urithiru and tower context.",
    body: "Towerlight is late-gated because even basic context points to later discoveries.",
    tags: ["Magic", "Light", "Urithiru", "Gated"],
    sections: [
      { title: "Function", body: "Towerlight is tracked as a distinct Light connected to later tower systems." },
      { title: "Why it matters", body: "It supports late-book explanations of place, power, and infrastructure." },
      { title: "Spoiler handling", body: "Keep locked until Urithiru context is safe." }
    ]
  },
  Warlight: {
    summary: "A late-series Light concept tied to combined powers and dangerous magical experimentation.",
    body: "Warlight belongs to late magic-system material and should not be visible early.",
    tags: ["Magic", "Light", "Gated", "Experimentation"],
    sections: [
      { title: "Function", body: "Warlight is tracked as an advanced Light concept." },
      { title: "Why it matters", body: "It matters to later research, conflict, and power interactions." },
      { title: "Spoiler handling", body: "Details remain gated." }
    ]
  },
  Spren: {
    summary: "Visible manifestations tied to emotions, natural forces, ideas, and Roshar's magical ecology.",
    body: "Spren make Roshar feel visibly responsive: fear, wind, flame, rot, anticipation, and many other experiences can draw them.",
    tags: ["World", "Magic", "Spren", "Ecology"],
    sections: [
      { title: "Everyday spren", body: "Many spren are ordinary parts of daily life and public emotion." },
      { title: "Worldbuilding", body: "Spren connect culture, nature, perception, and magic." },
      { title: "Spoiler handling", body: "Specific intelligent spren and bond mechanics stay gated." }
    ]
  },
  Crem: {
    summary: "Mineral-rich stormwater residue that hardens and helps define Roshar's stone-and-storm ecology.",
    body: "Crem is practical worldbuilding: it affects buildings, landscapes, agriculture, and the way highstorms reshape the continent.",
    tags: ["Material", "Highstorms", "Ecology", "Roshar"],
    sections: [
      { title: "Function", body: "Crem is carried by highstorms and can harden after storms pass." },
      { title: "Why it matters", body: "It makes weather a geological and architectural force, not just a hazard." },
      { title: "Reader note", body: "This is safe low-spoiler worldbuilding." }
    ]
  },
  Honorspren: {
    summary: "A spren type associated with honor, oaths, and Windrunner-related context.",
    body: "Honorspren are important to Radiant material, so this entry stays broad until bond details are safe.",
    tags: ["Magic", "Spren", "Oaths", "Gated"],
    sections: [
      { title: "Function", body: "Honorspren are a distinct kind of intelligent spren." },
      { title: "Why it matters", body: "They connect oaths, identity, and Radiant powers." },
      { title: "Spoiler handling", body: "Specific bonds and society details remain gated." }
    ]
  },
  Cryptic: {
    summary: "A spren type associated with truths, lies, and Lightweaver context.",
    body: "Cryptics are tied to later Shallan and Lightweaver material, so details remain gated.",
    tags: ["Magic", "Spren", "Lightweavers", "Gated"],
    sections: [
      { title: "Function", body: "Cryptics are a distinct type of intelligent spren." },
      { title: "Why it matters", body: "They connect magic to truth, lies, memory, and perception." },
      { title: "Spoiler handling", body: "Specific relationships remain gated." }
    ]
  },
  Cultivationspren: {
    summary: "A spren type associated with growth, care, and Edgedancer context.",
    body: "Cultivationspren are best handled as later Radiant context unless the reader has reached the relevant material.",
    tags: ["Magic", "Spren", "Edgedancers", "Gated"],
    sections: [
      { title: "Function", body: "Cultivationspren are a distinct intelligent spren type." },
      { title: "Why it matters", body: "They connect growth, care, and certain Radiant ideals." },
      { title: "Spoiler handling", body: "Specific bonds remain gated." }
    ]
  },
  Surges: {
    summary: "The fundamental forces or abilities organized through Rosharan magic systems.",
    body: "Surges are a useful high-level way to talk about powers without exposing every mechanic early.",
    tags: ["Magic", "Surges", "Radiants", "Gated"],
    sections: [
      { title: "Function", body: "Surges name the powers or forces that different magic users can access." },
      { title: "Why it matters", body: "They let the app compare Radiant orders and abilities once safe." },
      { title: "Spoiler handling", body: "Specific pairings and mechanics remain gated." }
    ]
  },
  Wandersail: {
    summary: "A ship tied to Thaylen travel, trade, and expedition context.",
    body: "The Wandersail is tracked as a vessel entry because ships matter to Roshar's trade routes and later expeditions.",
    tags: ["Item", "Ship", "Travel", "Thaylen"],
    sections: [
      { title: "Function", body: "The ship supports travel, trade, and expedition storytelling." },
      { title: "Why it matters", body: "It links characters to ports, islands, and routes beyond the warcamps." },
      { title: "Spoiler handling", body: "Later expedition details remain gated." }
    ]
  },
  Ideals: {
    summary: "Spoken oaths that shape Radiant identity, power, and personal responsibility.",
    body: "Ideals are central to how Radiant orders connect magic to ethics. Early entries should stay broad because specific oaths are character spoilers.",
    tags: ["Magic", "Oaths", "Radiants", "Gated"],
    sections: [
      { title: "Function", body: "Ideals link magical progress to chosen principles and spoken commitment." },
      { title: "Why it matters", body: "They make power inseparable from character, duty, and interpretation." },
      { title: "Spoiler handling", body: "Specific oaths remain gated by book and chapter." }
    ]
  },
  Odium: {
    summary: "A Shardic power tied to Roshar's larger conflict and therefore heavily spoiler-gated.",
    body: "Odium belongs to the deep power structure behind the series. Early context should avoid explaining motives, vessels, or late-book changes.",
    tags: ["Magic", "Shard", "Conflict", "Gated"],
    sections: [
      { title: "Function", body: "Odium is tracked as a major cosmere-level power affecting Roshar." },
      { title: "Why it matters", body: "The topic connects religion, war, ancient history, and later stakes." },
      { title: "Spoiler handling", body: "Details remain gated." }
    ]
  },
  Honor: {
    summary: "A Shardic power associated with oaths, bonds, and Roshar's ancient magical framework.",
    body: "Honor is fundamental to the language of oaths and bonds, but specifics should unlock gradually.",
    tags: ["Magic", "Shard", "Oaths", "Gated"],
    sections: [
      { title: "Function", body: "Honor is tracked as a major power behind Roshar's oath-centered magic." },
      { title: "Why it matters", body: "The topic connects Radiants, Heralds, bonds, and ancient history." },
      { title: "Spoiler handling", body: "Deeper history remains gated." }
    ]
  },
  Cultivation: {
    summary: "A Shardic power associated with growth, change, and long-view intervention on Roshar.",
    body: "Cultivation is important to Roshar's deeper magical ecology and should be handled carefully for spoilers.",
    tags: ["Magic", "Shard", "Growth", "Gated"],
    sections: [
      { title: "Function", body: "Cultivation is tracked as one of the major powers shaping Roshar." },
      { title: "Why it matters", body: "The topic connects growth, change, Old Magic context, and long-term consequences." },
      { title: "Spoiler handling", body: "Specific actions and relationships remain gated." }
    ]
  },
  Retribution: {
    summary: "A late-series power term that should remain locked until the reader has finished the relevant material.",
    body: "Retribution is included for full-series indexing but is not safe early.",
    tags: ["Magic", "Shard", "Late series", "Gated"],
    sections: [
      { title: "Function", body: "This entry tracks a late-series cosmere power context." },
      { title: "Why it matters", body: "Its meaning depends on later revelations." },
      { title: "Spoiler handling", body: "Keep locked until the full-series threshold." }
    ]
  },
  Spheres: {
    summary: "Gemstone currency used as money, light, and a practical container for Stormlight.",
    body: "Spheres make Roshar's economy feel different: the same object can be coinage, illumination, and a magic-adjacent resource.",
    tags: ["Item", "Currency", "Gemstones", "Stormlight"],
    sections: [
      { title: "Function", body: "Spheres are glass-covered gemstones used as currency." },
      { title: "Why it matters", body: "Infused spheres glow, linking money, lighting, storms, and power." },
      { title: "Reader note", body: "This is safe early worldbuilding." }
    ]
  },
  Mandra: {
    summary: "A spren type connected to Roshar's strange ecology and later explanations of how some creatures move.",
    body: "Mandra are best kept broad until the reader reaches the chapters that make their ecological role clear.",
    tags: ["Magic", "Spren", "Ecology", "Gated"],
    sections: [
      { title: "Function", body: "Mandra are tracked as a spren type involved in Rosharan ecology." },
      { title: "Why it matters", body: "They help connect spren to physical life rather than only emotion or weather." },
      { title: "Spoiler handling", body: "Specific applications remain gated." }
    ]
  },
  Heralds: {
    summary: "The ten ancient figures central to Vorin religion, Desolation history, and Roshar's mythic framework.",
    body: "The Heralds are best introduced broadly as legendary figures; individual roles and later status remain gated.",
    tags: ["World", "Heralds", "Vorinism", "Gated"],
    sections: [
      { title: "Function", body: "The Heralds connect religion, ancient war, and the history behind modern Roshar." },
      { title: "Why it matters", body: "They provide a bridge between myth, theology, and the old systems of power." },
      { title: "Spoiler handling", body: "Specific present-day details remain gated." }
    ]
  },
  Deadeye: {
    summary: "A spoiler-sensitive spren condition tied to deeper Shardblade and Recreance context.",
    body: "Deadeyes should remain locked until the reader has enough context for later spren and Blade revelations.",
    tags: ["Magic", "Spren", "Shardblades", "Gated"],
    sections: [
      { title: "Function", body: "The term tracks a later spren-related condition." },
      { title: "Why it matters", body: "It connects spren, history, and the meaning of certain weapons." },
      { title: "Spoiler handling", body: "Do not expose early." }
    ]
  }
};

function titleLabel(title) {
  return title
    .replace(/_/g, " ")
    .replace(/\s+\((?:novella|book|group|short story)\)$/i, "")
    .trim();
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function idForPage(page) {
  return idOverrides[page.title] || `seed-${slugify(page.title)}`;
}

function thresholdForPage(page) {
  return titleGateOverrides[page.title] || lateGate;
}

function cleanList(values, limit = 5) {
  return [...new Set(values.filter(Boolean))]
    .map((value) => value.replace(/\s*\[ edit \]\s*$/i, "").trim())
    .filter(Boolean)
    .slice(0, limit);
}

function sentenceList(values, fallback) {
  const items = cleanList(values, 6);
  return items.length ? items.join(", ") : fallback;
}

function categoryForPage(page) {
  return kindConfig[effectiveKind(page)]?.category || "world";
}

function labelForPage(page) {
  return kindConfig[effectiveKind(page)]?.label || "Stormlight topic";
}

function effectiveKind(page) {
  return seedKindOverrides[page.title] || page.kind;
}

function copyForPage(page) {
  return topicCopy[page.title] || {};
}

function isStormlightSeedCandidate(page) {
  const title = titleLabel(page.title);
  const categories = (page.categories || []).join(" ");
  const haystack = `${title} ${categories} ${(page.headings || []).join(" ")}`;

  if (nonStormlightTitlePattern.test(title) || nonStormlightCategoryPattern.test(categories)) {
    return stormlightAnchorPattern.test(haystack);
  }

  return stormlightAnchorPattern.test(haystack) || Boolean(topicCopy[page.title]);
}

function firstMatchingCategory(page, pattern) {
  return (page.categories || []).find((category) => pattern.test(category));
}

function articleName(title) {
  return /^[AEIOU]/i.test(title) ? `an ${title}` : `a ${title}`;
}

function descriptorForPage(page, label) {
  const title = titleLabel(page.title);
  const kind = effectiveKind(page);

  if (kind === "character") {
    if (firstMatchingCategory(page, /Heralds/i)) return "Heraldic figure";
    if (firstMatchingCategory(page, /Spren|Splinters|Unmade/i)) return "spren or spren-like being";
    if (firstMatchingCategory(page, /Bridge Four/i)) return "Bridge Four member";
    if (firstMatchingCategory(page, /Kholin|Highprinces|Shardbearers/i)) return "Alethi high-status figure";
    if (firstMatchingCategory(page, /Singers|Listeners|Parshendi/i)) return "listener or singer figure";
    if (firstMatchingCategory(page, /Worldhoppers|Arcanists/i)) return "wider-cosmere scholar";
    return "named character";
  }

  if (kind === "place") {
    if (firstMatchingCategory(page, /Nations/i)) return "Rosharan nation";
    if (firstMatchingCategory(page, /Settlements|Cities/i)) return "Rosharan settlement";
    if (firstMatchingCategory(page, /Mountains/i)) return "Rosharan mountain region";
    if (firstMatchingCategory(page, /Locations/i)) return "Rosharan location";
    return "place on Roshar";
  }

  if (kind === "faction") {
    if (/Order of/i.test(title)) return "Radiant order";
    if (firstMatchingCategory(page, /Armies/i)) return "military group";
    return "faction or organization";
  }

  if (kind === "culture") {
    if (firstMatchingCategory(page, /Religion/i)) return "religious tradition";
    if (firstMatchingCategory(page, /Ethnicities|Nationalities/i)) return "people or nationality";
    return "cultural concept";
  }

  if (kind === "people-or-lifeform") {
    if (firstMatchingCategory(page, /Sapient beings|Ethnicities|Nationalities/i)) return "Rosharan people";
    if (firstMatchingCategory(page, /Greatshells/i)) return "greatshell";
    if (firstMatchingCategory(page, /Lifeforms/i)) return "Rosharan lifeform";
    return "people or lifeform";
  }

  if (kind === "magic-or-item") {
    if (firstMatchingCategory(page, /Magic systems/i)) return "magic system";
    if (firstMatchingCategory(page, /Spren/i)) return "spren type";
    if (firstMatchingCategory(page, /Weapons/i)) return "weapon";
    if (firstMatchingCategory(page, /Objects and Materials|Currencies|Watercraft|Drugs/i)) return "object or material";
    if (firstMatchingCategory(page, /Shards/i)) return "cosmere power";
    return "magic concept or item";
  }

  return label.toLowerCase();
}

function fallbackEntryText(page, title, label) {
  const kind = effectiveKind(page);
  const descriptor = descriptorForPage(page, label);

  if (kind === "character") {
    return {
      summary: `${title} is a ${descriptor} whose details stay matched to the selected reading point.`,
      body: `${title} is tracked as part of the Stormlight character network. This entry focuses on role, origin, and relationships without exposing later-book developments early.`
    };
  }

  if (kind === "place") {
    return {
      summary: `${title} is a ${descriptor} used to track geography, culture, and people of note on Roshar.`,
      body: `${title} helps define Roshar's map and regional variety. The entry keeps political history, local customs, and later discoveries behind the appropriate spoiler gate.`
    };
  }

  if (kind === "faction") {
    return {
      summary: `${title} is a ${descriptor} connected to Roshar's political, military, or magical power structures.`,
      body: `${title} is tracked for membership, hierarchy, alliances, and conflicts. Sensitive details stay hidden until the relevant chapters are safe.`
    };
  }

  if (kind === "culture") {
    return {
      summary: `${title} is a ${descriptor} that shapes how people on Roshar organize identity, belief, rank, or daily life.`,
      body: `${title} is included to explain customs, social expectations, language, religion, or class without revealing later plot context ahead of the reader.`
    };
  }

  if (kind === "people-or-lifeform") {
    return {
      summary: `${title} is a ${descriptor} in Roshar's ecology or society.`,
      body: `${title} adds context for how Roshar's people, animals, and living systems differ from more familiar worlds. Later biological or historical implications remain gated.`
    };
  }

  if (kind === "magic-or-item") {
    return {
      summary: `${title} is ${articleName(descriptor)} connected to Roshar's magic, technology, warfare, or daily life.`,
      body: `${title} is tracked for practical use, cultural importance, and magical implications. Deeper mechanics remain protected until the reader reaches the right threshold.`
    };
  }

  return {
    summary: `${title} is a Stormlight Archive reference topic.`,
    body: `${title} is included for cross-reference support and remains gated where context could reveal later material.`
  };
}

function fallbackSectionsForPage(page, title, label) {
  const kind = effectiveKind(page);
  const descriptor = descriptorForPage(page, label);

  if (kind === "character") {
    return [
      { title: "Background", body: `${title} is tracked as ${articleName(descriptor)} in the Stormlight character index.` },
      { title: "Story role", body: "The entry focuses on safe role, origin, faction, and relationship context at the selected chapter threshold." },
      { title: "Reader note", body: "Later abilities, alliances, deaths, betrayals, or revelations remain hidden until the relevant work is unlocked." }
    ];
  }

  if (kind === "place") {
    return [
      { title: "Geography", body: `${title} is tracked as ${articleName(descriptor)} within the Rosharan atlas.` },
      { title: "Culture and use", body: "The entry is meant to connect location, local customs, politics, travel, ecology, and people of note." },
      { title: "Reader note", body: "Historical reveals and late-book location changes stay behind spoiler gates." }
    ];
  }

  if (kind === "faction") {
    return [
      { title: "Purpose", body: `${title} is tracked as ${articleName(descriptor)} with members, ranks, ideals, or political goals.` },
      { title: "Connections", body: "Faction entries support the relationship tree by clarifying allegiance, hierarchy, alliance, and conflict." },
      { title: "Reader note", body: "Membership changes and hidden motives remain gated." }
    ];
  }

  if (kind === "culture") {
    return [
      { title: "Customs", body: `${title} helps explain Rosharan belief, dress, class, language, etiquette, or identity.` },
      { title: "Story use", body: "Culture entries give context for why characters interpret rank, gender, religion, honor, labor, and scholarship differently." },
      { title: "Reader note", body: "Historical origins and late revelations stay protected." }
    ];
  }

  if (kind === "people-or-lifeform") {
    return [
      { title: "Ecology or identity", body: `${title} is tracked as ${articleName(descriptor)} within Roshar's living world.` },
      { title: "Worldbuilding role", body: "This entry supports the atlas by explaining how local life, biology, food, labor, travel, or society works." },
      { title: "Reader note", body: "Biological, magical, or historical implications stay gated when they become plot-sensitive." }
    ];
  }

  if (kind === "magic-or-item") {
    return [
      { title: "Function", body: `${title} is tracked as ${articleName(descriptor)} in Roshar's systems of magic, technology, materials, or warfare.` },
      { title: "Why it matters", body: "Item and magic entries connect practical use with status, scholarship, travel, combat, infrastructure, or daily life." },
      { title: "Reader note", body: "Mechanics and origins remain gated when they would reveal later-book context." }
    ];
  }

  return [
    { title: "Overview", body: `${title} is included as a Stormlight reference topic.` },
    { title: "Reader note", body: "Details remain gated where context could reveal later material." }
  ];
}

function entryForPage(page) {
  const title = titleLabel(page.title);
  const label = labelForPage(page);
  const copy = copyForPage(page);
  const categories = cleanList(page.categories, 4);
  const headings = cleanList(page.headings, 3);
  const fallback = fallbackEntryText(page, title, label);

  return {
    id: idForPage(page),
    category: categoryForPage(page),
    threshold: thresholdForPage(page),
    title,
    summary: copy.summary || fallback.summary,
    body: copy.body || fallback.body,
    tags: cleanList([...(copy.tags || [label, ...categories.slice(0, 3)]), "Reference"], 6),
    minor: effectiveKind(page) === "character" && !titleGateOverrides[page.title],
    seed: {
      sourceTitle: page.title,
      headings
    }
  };
}

function moreDetailForPage(page) {
  const title = titleLabel(page.title);
  const label = labelForPage(page);
  const copy = copyForPage(page);
  const hasCuratedSections = Array.isArray(copy.sections) && copy.sections.length > 0;
  const fallback = fallbackEntryText(page, title, label);

  return {
    sourceUrl: page.archivedUrl || page.liveUrl,
    summary: copy.detailSummary || copy.summary || fallback.summary,
    sections: hasCuratedSections
      ? copy.sections
      : fallbackSectionsForPage(page, title, label)
  };
}

function timelineEventForPage(page) {
  const title = titleLabel(page.title);
  const categories = sentenceList(page.categories, "Stormlight Archive events");

  return {
    id: `seed-event-${slugify(page.title)}`,
    threshold: thresholdForPage(page),
    title,
    label: "Historical event",
    body: `${title} is an event connected to ${categories}. Full context remains gated until the reader reaches a safe point.`,
    tags: ["Event", ...cleanList(page.categories, 3), "Reference"]
  };
}

function byConfiguredKind(pages) {
  return Object.entries(kindConfig).flatMap(([kind, config]) => (
    pages
      .filter(isStormlightSeedCandidate)
      .filter((page) => effectiveKind(page) === kind)
      .slice(0, config.limit)
  ));
}

const index = JSON.parse(await readFile(inputPath, "utf8"));
const pages = index.pages || [];
const selectedPages = byConfiguredKind(pages);
const entries = selectedPages.map(entryForPage);
const moreDetails = Object.fromEntries(selectedPages.map((page) => [idForPage(page), moreDetailForPage(page)]));
const timelineEvents = pages
  .filter((page) => page.kind === "event")
  .filter((page) => !timelineEventExclusions.has(page.title))
  .slice(0, timelineEventLimit)
  .map(timelineEventForPage);

const payload = {
  generatedAt: new Date().toISOString(),
  source: sourceSnapshot,
  stats: {
    entries: entries.length,
    timelineEvents: timelineEvents.length,
    sourcePages: pages.length
  },
  entries,
  moreDetails,
  timelineEvents
};

await writeFile(outputPath, `window.stormlightSiteSeed = ${JSON.stringify(payload, null, 2)};\n`);
console.log(`Wrote ${entries.length} entries and ${timelineEvents.length} timeline events to ${outputPath}`);
