const works = [
  {
    key: "none",
    order: 0,
    label: "No books yet",
    shortLabel: "None",
    chapters: 0,
    copy: "Only broad, jacket-safe world context is visible."
  },
  {
    key: "twok",
    order: 1,
    label: "The Way of Kings",
    shortLabel: "Way of Kings",
    chapters: 75,
    copy: "Entries through the selected chapter of book one are visible."
  },
  {
    key: "wor",
    order: 2,
    label: "Words of Radiance",
    shortLabel: "Words of Radiance",
    chapters: 89,
    copy: "Book two entries unlock chapter by chapter after all earlier works."
  },
  {
    key: "edgedancer",
    order: 2.5,
    label: "Edgedancer",
    shortLabel: "Edgedancer",
    chapters: 20,
    copy: "The first Stormlight novella unlocks chapter by chapter."
  },
  {
    key: "ob",
    order: 3,
    label: "Oathbringer",
    shortLabel: "Oathbringer",
    chapters: 122,
    copy: "Book three entries unlock chapter by chapter after earlier works."
  },
  {
    key: "dawnshard",
    order: 3.5,
    label: "Dawnshard",
    shortLabel: "Dawnshard",
    chapters: 21,
    copy: "The second Stormlight novella unlocks chapter by chapter."
  },
  {
    key: "row",
    order: 4,
    label: "Rhythm of War",
    shortLabel: "Rhythm of War",
    chapters: 117,
    copy: "Book four entries unlock chapter by chapter after earlier works."
  },
  {
    key: "wat",
    order: 5,
    label: "Wind and Truth",
    shortLabel: "Wind and Truth",
    chapters: 147,
    copy: "Book five entries unlock chapter by chapter after earlier works."
  }
];

const storageKeys = {
  work: "stormlight-reader-work",
  chapter: "stormlight-reader-chapter",
  legacyLevel: "stormlight-reader-level"
};

const legacyLevelMap = {
  0: "none",
  1: "twok",
  2: "wor",
  2.5: "edgedancer",
  3: "ob",
  3.5: "dawnshard",
  4: "row",
  5: "wat"
};

function gate(work, chapter = 0) {
  return { work, chapter };
}

function workForKey(key) {
  return works.find((work) => work.key === key) || works[0];
}

function clampChapter(work, chapter) {
  const numeric = Number(chapter);
  if (!Number.isFinite(numeric) || work.key === "none") {
    return 0;
  }
  return Math.min(work.chapters, Math.max(0, Math.floor(numeric)));
}

function completePosition(workKey) {
  const work = workForKey(workKey);
  return {
    work: work.key,
    chapter: work.chapters
  };
}

function normalizePosition(position) {
  const work = workForKey(position?.work);
  return {
    work: work.key,
    chapter: clampChapter(work, position?.chapter)
  };
}

function readSavedPosition() {
  const savedWork = localStorage.getItem(storageKeys.work);
  if (savedWork) {
    return normalizePosition({
      work: savedWork,
      chapter: localStorage.getItem(storageKeys.chapter)
    });
  }

  const legacyLevel = localStorage.getItem(storageKeys.legacyLevel);
  const legacyWork = legacyLevelMap[legacyLevel];
  if (legacyWork) {
    return completePosition(legacyWork);
  }

  return gate("none");
}

function savePosition(position) {
  const normalized = normalizePosition(position);
  localStorage.setItem(storageKeys.work, normalized.work);
  localStorage.setItem(storageKeys.chapter, String(normalized.chapter));
  localStorage.removeItem(storageKeys.legacyLevel);
}

function positionScore(position) {
  const normalized = normalizePosition(position);
  const work = workForKey(normalized.work);
  return work.order * 1000 + normalized.chapter;
}

function thresholdLabel(position) {
  const normalized = normalizePosition(position);
  const work = workForKey(normalized.work);

  if (work.key === "none") {
    return "Safe";
  }

  if (normalized.chapter >= work.chapters) {
    return `Through ${work.label}`;
  }

  if (normalized.chapter === 0) {
    return `${work.label} opening`;
  }

  return `${work.shortLabel} ch. ${normalized.chapter}`;
}

function thresholdSentence(position) {
  const normalized = normalizePosition(position);
  const work = workForKey(normalized.work);

  if (work.key === "none") {
    return "the safe starter context";
  }

  if (normalized.chapter >= work.chapters) {
    return `the end of ${work.label}`;
  }

  if (normalized.chapter === 0) {
    return `the opening material of ${work.label}`;
  }

  return `chapter ${normalized.chapter} of ${work.label}`;
}

function currentPositionCopy(position) {
  const normalized = normalizePosition(position);
  const work = workForKey(normalized.work);

  if (work.key === "none") {
    return work.copy;
  }

  if (normalized.chapter >= work.chapters) {
    return `All entries through ${work.label} are visible.`;
  }

  if (normalized.chapter === 0) {
    return `Only opening material for ${work.label} is included.`;
  }

  return `Entries through chapter ${normalized.chapter} of ${work.label} are visible.`;
}

const entries = [
  {
    id: "roshar",
    category: "world",
    threshold: gate("none"),
    title: "Roshar",
    summary: "A storm-shaped continent of stone, city-states, living ecology, and cultures built around survival.",
    body: "Roshar is the primary setting: a harsh world where weather, terrain, ecology, politics, and belief systems all shape how people live.",
    tags: ["Setting", "Geography", "Culture"]
  },
  {
    id: "highstorms",
    category: "world",
    threshold: gate("none"),
    title: "Highstorms",
    summary: "Enormous recurring storms define travel, architecture, agriculture, and everyday risk.",
    body: "Highstorms are the pulse of the continent. Settlements, plants, animals, trade, and military planning all bend around their arrival.",
    tags: ["Weather", "Ecology", "Survival"]
  },
  {
    id: "spren",
    category: "world",
    threshold: gate("twok", 1),
    title: "Spren",
    summary: "Manifestations tied to emotion, nature, and forces that people across Roshar treat as part of daily life.",
    body: "Spren make the world feel visibly responsive. Their presence turns fear, rot, flame, wind, and countless other experiences into something seen.",
    tags: ["Magic", "Culture", "Nature"]
  },
  {
    id: "shattered-plains",
    category: "world",
    threshold: gate("twok", 6),
    title: "The Shattered Plains",
    summary: "A broken expanse of plateaus central to the early warcamps and their campaigns.",
    body: "The Shattered Plains are both battlefield and mystery, forcing armies to move across chasms, bridges, and distant plateau runs.",
    tags: ["Location", "War", "Alethkar"]
  },
  {
    id: "urithiru",
    category: "world",
    threshold: gate("wor", 89),
    title: "Urithiru",
    summary: "A legendary location whose role expands as the series widens beyond the warcamps.",
    body: "Urithiru becomes a major hub for politics, logistics, research, and competing visions of what the future of Roshar should be.",
    tags: ["Location", "History", "Power"]
  },
  {
    id: "kaladin",
    category: "characters",
    threshold: gate("twok", 1),
    title: "Kaladin",
    summary: "A surgeon's son, soldier, and bridgeman whose story centers on duty, trauma, and protection.",
    body: "Kaladin's arc follows the pressure of survival and leadership in a brutal system, with questions of loyalty at the center.",
    tags: ["Character", "Bridge Four", "Alethi"]
  },
  {
    id: "shallan",
    category: "characters",
    threshold: gate("twok", 3),
    title: "Shallan",
    summary: "A young scholar and artist whose curiosity pulls her toward secrets, research, and dangerous patronage.",
    body: "Shallan's chapters blend scholarship, art, family pressure, and a talent for seeing patterns others miss.",
    tags: ["Character", "Scholarship", "Art"]
  },
  {
    id: "dalinar",
    category: "characters",
    threshold: gate("twok", 12),
    title: "Dalinar",
    summary: "A highprince wrestling with honor, command, memory, and the cost of unity.",
    body: "Dalinar sits at the crossroads of military power and moral responsibility, making him a natural anchor for political conflict.",
    tags: ["Character", "Alethkar", "Leadership"]
  },
  {
    id: "jasnah",
    category: "characters",
    threshold: gate("twok", 3),
    title: "Jasnah",
    summary: "A brilliant scholar whose skepticism and research unsettle comfortable answers.",
    body: "Jasnah brings method, nerve, and intellectual force to questions that many powerful people would rather leave untouched.",
    tags: ["Character", "Scholarship", "Kholin"]
  },
  {
    id: "venli",
    category: "characters",
    threshold: gate("ob", 1),
    title: "Venli",
    summary: "A listener whose choices and regrets deepen one side of Roshar's central conflict.",
    body: "Venli's perspective opens important cultural, historical, and moral dimensions that are easy to flatten from the outside.",
    tags: ["Character", "Listeners", "Perspective"]
  },
  {
    id: "lift",
    category: "characters",
    threshold: gate("edgedancer", 1),
    title: "Lift",
    summary: "A young character whose novella expands the series' tone, stakes, and street-level view of power.",
    body: "Lift gives the atlas a different scale: food, movement, instinct, and local politics matter as much as armies and courts.",
    tags: ["Character", "Novella", "Street view"]
  },
  {
    id: "spheres",
    category: "items",
    threshold: gate("none"),
    title: "Spheres",
    summary: "Gem-lit currency used for money, illumination, and hints of deeper systems.",
    body: "Spheres are small gemstones encased in glass. Their everyday use makes the fantastic feel practical and economic.",
    tags: ["Currency", "Light", "Daily Life"]
  },
  {
    id: "shardblade",
    category: "items",
    threshold: gate("twok", 1),
    title: "Shardblade",
    summary: "Rare weapons that reshape social status and battlefield tactics.",
    body: "Shardblades are legendary arms whose political value is almost as important as their battlefield power.",
    tags: ["Weapon", "Power", "Status"]
  },
  {
    id: "shardplate",
    category: "items",
    threshold: gate("twok", 12),
    title: "Shardplate",
    summary: "Armor that turns a fighter into a terrifying presence on the field.",
    body: "Shardplate changes the scale of combat and command, creating a visible gap between ordinary soldiers and elite warriors.",
    tags: ["Armor", "War", "Status"]
  },
  {
    id: "oathgate",
    category: "items",
    threshold: gate("wor", 89),
    title: "Oathgate",
    summary: "A transport system whose importance grows as the map opens.",
    body: "Oathgates connect the geography of Roshar to older systems of power, travel, and control.",
    tags: ["Travel", "Ancient", "Infrastructure"]
  }
];

const moreDetails = {
  roshar: {
    sourceUrl: "https://coppermind.net/wiki/Roshar",
    summary: "Roshar is both the name of the planet and the main continent where the early Stormlight story is set.",
    sections: [
      { title: "World shape", body: "The continent is marked by highstorms, crem buildup, stone ecology, and cities built for survival rather than softness." },
      { title: "People and nations", body: "Roshar contains many nations with distinct languages, dress, religious practice, class systems, and attitudes toward war and scholarship." },
      { title: "Why it matters", body: "The setting is not just a backdrop. Weather, spren, gemstones, social rank, and old history all shape what characters can do." }
    ]
  },
  highstorms: {
    sourceUrl: "https://coppermind.net/wiki/Highstorm",
    summary: "Highstorms are continent-spanning storms that define life, architecture, travel, warfare, and ecology on Roshar.",
    sections: [
      { title: "Daily life", body: "People plan work, trade, shelter, and travel around storm timing. Buildings, plants, and animals are adapted to survive repeated impact." },
      { title: "Stormlight", body: "Highstorms are closely tied to infused gemstones and the practical economy of light, money, and power." },
      { title: "Story role", body: "Storms create both danger and rhythm: they isolate places, interrupt plans, and make Roshar feel alive and hostile." }
    ]
  },
  spren: {
    sourceUrl: "https://coppermind.net/wiki/Spren",
    summary: "Spren are visible manifestations associated with emotions, natural forces, ideas, and living experience on Roshar.",
    sections: [
      { title: "Common spren", body: "People see spren around everyday events such as fear, pain, flame, rot, wind, rain, and anticipation." },
      { title: "Culture", body: "Because spren appear in public, Rosharans treat many inner states and natural forces as visible parts of ordinary life." },
      { title: "Spoiler note", body: "Some spren-related topics become much more important later, so this panel stays broad at early thresholds." }
    ]
  },
  "shattered-plains": {
    sourceUrl: "https://coppermind.net/wiki/Shattered_Plains",
    summary: "The Shattered Plains are a broken plateau region central to the Alethi warcamps and early military campaigns.",
    sections: [
      { title: "Terrain", body: "Deep chasms divide the plateaus, making movement, bridge crews, scouting, and timing central to battle." },
      { title: "Warcamps", body: "The Alethi highprinces maintain large camps there, creating a temporary society of soldiers, officers, workers, merchants, and enslaved crews." },
      { title: "Reader hook", body: "The region begins as a battlefield, but the geography carries larger questions as the series expands." }
    ]
  },
  urithiru: {
    sourceUrl: "https://coppermind.net/wiki/Urithiru",
    summary: "Urithiru is a legendary city whose importance becomes clear only after the story moves beyond the early warcamps.",
    sections: [
      { title: "Function", body: "Once unlocked, Urithiru becomes a hub for travel, politics, research, logistics, and competing plans for Roshar's future." },
      { title: "Cultures", body: "Its later role brings many peoples and national customs into one place, making it a useful lens for comparing Rosharan cultures." },
      { title: "Spoiler note", body: "Most specifics about Urithiru are gated because the location itself is a major expansion of the setting." }
    ]
  },
  kaladin: {
    sourceUrl: "https://coppermind.net/wiki/Kaladin",
    summary: "Kaladin is introduced through war, medicine, class pressure, and the struggle to protect others under brutal systems.",
    sections: [
      { title: "Background", body: "He comes from a surgeon's household, which gives him a practical understanding of bodies, injury, responsibility, and failure." },
      { title: "Early conflict", body: "His early story moves through soldiering and the bridge crews, where leadership becomes inseparable from survival." },
      { title: "Themes", body: "Protection, depression, loyalty, trauma, and the cost of command are central to how his chapters work." }
    ]
  },
  shallan: {
    sourceUrl: "https://coppermind.net/wiki/Shallan_Davar",
    summary: "Shallan Davar is a Veden lighteyes whose story mixes scholarship, art, family pressure, secrets, and dangerous curiosity.",
    sections: [
      { title: "Skills", body: "Her drawing, memory, research instincts, and social improvisation make her a very different viewpoint from the warcamp characters." },
      { title: "Culture", body: "Shallan's chapters show Vorin gender expectations, safehand customs, scholarship, and lighteyed family politics." },
      { title: "Themes", body: "Identity, truth, art, fear, and self-protection shape the way her story reveals information." }
    ]
  },
  dalinar: {
    sourceUrl: "https://coppermind.net/wiki/Dalinar_Kholin",
    summary: "Dalinar Kholin is an Alethi highprince whose public power is tangled with honor, memory, command, and political distrust.",
    sections: [
      { title: "Public role", body: "He sits high in Alethi society, where military reputation, codes of conduct, and highprince rivalry define political life." },
      { title: "Early tension", body: "His ideas about honor and unity do not always fit the aggressive culture around him." },
      { title: "Themes", body: "Leadership, responsibility, violence, reform, and whether a person can change are core to his arc." }
    ]
  },
  jasnah: {
    sourceUrl: "https://coppermind.net/wiki/Jasnah_Kholin",
    summary: "Jasnah Kholin is a scholar, royal figure, and public skeptic whose research challenges comfortable assumptions.",
    sections: [
      { title: "Scholarship", body: "Her work shows how history, religion, philosophy, and evidence can collide in Vorin society." },
      { title: "Public image", body: "Jasnah's intelligence, atheism, and status make her both respected and controversial." },
      { title: "Story role", body: "She often points the reader toward hidden history and questions that are larger than local politics." }
    ]
  },
  venli: {
    sourceUrl: "https://coppermind.net/wiki/Venli",
    summary: "Venli is connected to the listener side of Roshar's conflicts and becomes important as the series widens perspective.",
    sections: [
      { title: "Culture", body: "Her viewpoint helps the reader see non-Alethi assumptions, listener identity, songs, forms, and memory." },
      { title: "Conflict", body: "Her story carries regret, ambition, survival, and the consequences of choices made inside a threatened people." },
      { title: "Spoiler note", body: "The details become increasingly sensitive, so this panel remains high-level until later thresholds." }
    ]
  },
  lift: {
    sourceUrl: "https://coppermind.net/wiki/Lift",
    summary: "Lift brings a street-level, food-centered, impulsive perspective that feels very different from courts and warcamps.",
    sections: [
      { title: "Tone", body: "Her chapters often move quickly, balancing humor, hunger, danger, and sincere compassion." },
      { title: "Viewpoint", body: "She shows how power and religion look from alleys, rooftops, kitchens, and ordinary city life." },
      { title: "Placement", body: "Her entry is gated to the novella because that is where much of her context becomes safer to discuss." }
    ]
  },
  spheres: {
    sourceUrl: "https://coppermind.net/wiki/Sphere",
    summary: "Spheres are gemstone currency used as money, light sources, and practical containers for Stormlight.",
    sections: [
      { title: "Currency", body: "Gem type and size affect value, making spheres both economic objects and everyday tools." },
      { title: "Light", body: "Infused spheres glow, so money and lighting are linked in a way that makes Roshar feel materially different." },
      { title: "Worldbuilding", body: "Spheres connect weather, trade, class, and magic-adjacent systems without needing an explanation every time they appear." }
    ]
  },
  shardblade: {
    sourceUrl: "https://coppermind.net/wiki/Shardblade",
    summary: "Shardblades are rare, legendary weapons with enormous military and political value.",
    sections: [
      { title: "Battlefield role", body: "A Shardblade changes the scale of combat and can make one fighter matter like a battlefield asset." },
      { title: "Status", body: "Owning one is a public sign of power, wealth, legitimacy, and danger." },
      { title: "Spoiler note", body: "Later explanations about Shardblades are sensitive, so early panels describe only their public reputation." }
    ]
  },
  shardplate: {
    sourceUrl: "https://coppermind.net/wiki/Shardplate",
    summary: "Shardplate is rare armor that grants dramatic battlefield advantage and social prestige.",
    sections: [
      { title: "Combat", body: "Plate increases strength, durability, and battlefield presence, making a bearer difficult for ordinary soldiers to face." },
      { title: "Politics", body: "Like Shardblades, Plate is tied to noble status and military command." },
      { title: "Limits", body: "Early-story knowledge focuses on what Plate visibly does, while deeper mechanics are kept gated." }
    ]
  },
  oathgate: {
    sourceUrl: "https://coppermind.net/wiki/Oathgate",
    summary: "Oathgates are ancient transportation devices whose significance becomes safer to discuss after the relevant book two material.",
    sections: [
      { title: "Function", body: "They are tied to large-scale travel and old infrastructure rather than ordinary roads or ships." },
      { title: "Story impact", body: "Once understood, they change what distance, borders, and logistics mean for the wider conflict." },
      { title: "Spoiler note", body: "This entry stays gated because the discovery and use of Oathgates are part of the setting opening up." }
    ]
  }
};

const timelineEvents = [
  {
    id: "event-prelude",
    threshold: gate("twok", 0),
    title: "The Prelude",
    label: "Ancient history",
    body: "A mythic opening frames the old cost of oaths, war, and survival.",
    tags: ["History", "Oaths"]
  },
  {
    id: "event-king-falls",
    threshold: gate("twok", 0),
    title: "A King Falls",
    label: "Book one opening",
    body: "An assassination launches a vengeance pact and pulls nations toward the Shattered Plains.",
    tags: ["Alethkar", "War"]
  },
  {
    id: "event-bridge-four",
    threshold: gate("twok", 6),
    title: "Bridge Four Forms",
    label: "Book one",
    body: "A disposable crew becomes a community with its own loyalties, rituals, and impossible standards.",
    tags: ["Bridge Four", "Found family"]
  },
  {
    id: "event-tower",
    threshold: gate("twok", 68),
    title: "The Tower",
    label: "Book one late",
    body: "A battlefield crisis forces several characters to decide what their honor is worth.",
    tags: ["Battle", "Choice"]
  },
  {
    id: "event-duel",
    threshold: gate("wor", 57),
    title: "A Duel Changes the Board",
    label: "Book two",
    body: "A public contest becomes a turning point for reputation, alliances, and personal risk.",
    tags: ["Warcamps", "Politics"]
  },
  {
    id: "event-everstorm",
    threshold: gate("wor", 89),
    title: "The Everstorm",
    label: "Book two late",
    body: "A new storm changes the map's dangers and raises the stakes for every nation.",
    tags: ["Storms", "Escalation"]
  },
  {
    id: "event-edgedancer",
    threshold: gate("edgedancer", 20),
    title: "Edgedancer Interlude",
    label: "Novella",
    body: "A side journey widens the map and gives several ideas from book two more room to breathe.",
    tags: ["Novella", "Interlude"]
  },
  {
    id: "event-thaylen",
    threshold: gate("ob", 119),
    title: "Thaylen Field",
    label: "Book three late",
    body: "A massive confrontation tests coalitions, memory, leadership, and the meaning of unity.",
    tags: ["Battle", "Unity"]
  },
  {
    id: "event-dawnshard",
    threshold: gate("dawnshard", 21),
    title: "Dawnshard Expedition",
    label: "Novella",
    body: "An expedition story expands the wider world between the third and fourth main books.",
    tags: ["Novella", "Expedition"]
  },
  {
    id: "event-urithiru",
    threshold: gate("row", 10),
    title: "Urithiru Under Pressure",
    label: "Book four",
    body: "The tower becomes a battleground of science, willpower, occupation, and resistance.",
    tags: ["Urithiru", "Resistance"]
  },
  {
    id: "event-book-five-slot",
    threshold: gate("wat", 147),
    title: "Wind and Truth Entry Slot",
    label: "Book five",
    body: "Reserved for verified book five events once the content set is expanded.",
    tags: ["Book five", "Placeholder"]
  }
];

const worldRegions = [
  {
    id: "alethkar",
    name: "Alethkar",
    type: "Vorin kingdom",
    threshold: gate("twok", 0),
    map: {
      path: "M530 145 L690 120 L760 205 L735 325 L605 355 L505 275 Z",
      labelX: 626,
      labelY: 238,
      tone: "storm"
    },
    summary: "A powerful eastern kingdom shaped by warfare, highstorms, brightlord politics, and Vorin social codes.",
    culture: "Alethi society is hierarchical, militarized, and status-conscious. Lighteyes and darkeyes structure public life, while highprinces compete through armies, wealth, and reputation.",
    costumes: "Nobility favor formal coats, uniforms, jewelry, and dresses such as havahs. Vorin women's fashion commonly covers the safehand, while soldiers and officers lean toward practical uniforms and armor.",
    religion: "Vorinism is dominant, with ardents serving religious, scholarly, and social roles. Calling, glory, gendered arts, and eye color all matter in public expectation.",
    physical: "Alethi are often described with tan skin, dark hair, and tall builds.",
    characters: [
      { name: "Kaladin", threshold: gate("twok", 1), note: "A soldier and bridgeman whose story begins in Alethkar's social order." },
      { name: "Jasnah Kholin", threshold: gate("twok", 3), note: "A royal scholar whose reputation cuts against comfortable Vorin assumptions." },
      { name: "Dalinar Kholin", threshold: gate("twok", 12), note: "A highprince caught between conquest, memory, and responsibility." }
    ]
  },
  {
    id: "shattered-plains",
    name: "Shattered Plains",
    type: "War frontier",
    threshold: gate("twok", 6),
    map: {
      path: "M700 190 L875 172 L920 250 L875 345 L735 325 L760 205 Z",
      labelX: 810,
      labelY: 255,
      tone: "violet"
    },
    summary: "A maze of plateaus and chasms where the early warcamps and plateau assaults define much of the first book's conflict.",
    culture: "The warcamps are less a nation than a pressure cooker: soldiers, bridgemen, officers, merchants, scholars, and camp followers build temporary societies around permanent war.",
    costumes: "Military uniforms, bridge crew work clothes, armor, and brightlord finery sit side by side. Practical stormproofing matters as much as rank display.",
    religion: "Vorin practice travels with the armies, but camp life often bends ideals around survival, ambition, and chain of command.",
    physical: "The region brings together many peoples, including Alethi soldiers and the listeners of the Plains.",
    characters: [
      { name: "Bridge Four", threshold: gate("twok", 6), note: "A bridge crew whose identity grows out of the warcamp system." },
      { name: "Adolin Kholin", threshold: gate("twok", 12), note: "A duelist and officer visible inside the highprince world." }
    ]
  },
  {
    id: "jah-keved",
    name: "Jah Keved",
    type: "Vorin kingdom",
    threshold: gate("twok", 3),
    map: {
      path: "M330 160 L505 120 L530 145 L505 275 L380 305 L300 250 Z",
      labelX: 410,
      labelY: 225,
      tone: "amber"
    },
    summary: "A western Vorin kingdom associated early with Shallan's family background, scholarship, and aristocratic pressure.",
    culture: "Veden culture shares many Vorin assumptions with Alethkar while maintaining its own courtly styles, family politics, and scholarly ambitions.",
    costumes: "Vorin safehand customs apply. Bright colors, formal women's dresses, and courtly presentation matter strongly among the lighteyed classes.",
    religion: "Vorinism is central, with ardents, gendered arts, and public piety shaping expectations.",
    physical: "Vedens are commonly associated with pale skin and black hair; red hair can suggest Unkalaki ancestry.",
    characters: [
      { name: "Shallan Davar", threshold: gate("twok", 3), note: "A Veden minor lighteyes whose scholarship pulls her into larger questions." }
    ]
  },
  {
    id: "shinovar",
    name: "Shinovar",
    type: "Western nation",
    threshold: gate("twok", 0),
    map: {
      path: "M90 210 L235 155 L330 160 L300 250 L180 330 L70 295 Z",
      labelX: 195,
      labelY: 240,
      tone: "leaf"
    },
    summary: "A far western land sheltered from the worst highstorms, with soil, grass, and customs that feel strange to much of Roshar.",
    culture: "Shinovar stands apart from eastern highstorm culture. Stone, soil, weapons, and social roles carry meanings that outsiders often misunderstand.",
    costumes: "Clothing is usually presented as simpler and softer than the storm-hardened gear of eastern nations.",
    religion: "Shin beliefs and taboos differ sharply from Vorin assumptions, especially around stone, warriors, and truth.",
    physical: "Shin people are often described by eastern Rosharans as having rounder eyes and a softer appearance.",
    characters: [
      { name: "Szeth", threshold: gate("twok", 0), note: "A Shin man introduced in the opening material." }
    ]
  },
  {
    id: "thaylenah",
    name: "Thaylenah",
    type: "Island nation",
    threshold: gate("twok", 18),
    map: {
      path: "M415 365 L565 355 L625 425 L550 505 L410 475 L365 410 Z",
      labelX: 500,
      labelY: 425,
      tone: "storm"
    },
    summary: "A mercantile island power known for trade, ships, negotiation, and distinctive appearance.",
    culture: "Thaylens are famous as merchants and sailors. Trade, contracts, ports, and reputation shape how outsiders understand the nation.",
    costumes: "Maritime practicality mixes with mercantile display. Eyebrow styling is a major visible cultural marker.",
    religion: "Religious life varies, but commerce and civic identity are often more visible than Vorin courtly codes.",
    physical: "Thaylens are known for long eyebrows that may droop or be styled back around the ears.",
    characters: [
      { name: "Rysn", threshold: gate("twok", 18), note: "A young Thaylen trader seen through travel and apprenticeship." }
    ]
  },
  {
    id: "azir",
    name: "Azir and Makabak",
    type: "Makabaki region",
    threshold: gate("twok", 42),
    map: {
      path: "M260 330 L410 305 L520 365 L365 410 L245 445 L185 385 Z",
      labelX: 340,
      labelY: 370,
      tone: "amber"
    },
    summary: "A broad western and central cultural region where Azir stands out for bureaucracy, law, and political ceremony.",
    culture: "Makabaki cultures are diverse. Azir in particular is associated with paperwork, offices, procedure, and a legalistic political style.",
    costumes: "Attire varies by country and station, with court dress and official presentation carrying bureaucratic weight.",
    religion: "Local traditions differ from Vorin kingdoms; government, law, and civic order often define public identity.",
    physical: "Makabaki peoples are often described with darker skin and dark hair.",
    characters: [
      { name: "Ym", threshold: gate("wor", 2), note: "A later viewpoint connected to everyday life away from the Alethi war." }
    ]
  },
  {
    id: "kharbranth",
    name: "Kharbranth",
    type: "City-state",
    threshold: gate("twok", 3),
    map: {
      path: "M585 430 L675 400 L730 448 L705 520 L605 535 L550 505 Z",
      labelX: 640,
      labelY: 470,
      tone: "violet"
    },
    summary: "A coastal city-state known early for scholarship, healing, bells, and carefully managed neutrality.",
    culture: "Kharbranth's identity rests on hospitals, libraries, learning, and diplomacy. Scholars and healers make the city feel different from the warcamps.",
    costumes: "Scholarly and medical dress sits beside coastal city clothing; practicality and institutional roles matter.",
    religion: "Vorin influence is present, but the city's hospitals and libraries create a public culture centered on service and study.",
    physical: "The city hosts people from many nations, so no single physical profile defines it.",
    characters: [
      { name: "Taravangian", threshold: gate("twok", 3), note: "The king associated with the city and its institutions." },
      { name: "Jasnah Kholin", threshold: gate("twok", 3), note: "Her early research passes through Kharbranth." }
    ]
  },
  {
    id: "purelake",
    name: "Purelake",
    type: "Inland lake region",
    threshold: gate("twok", 13),
    map: {
      path: "M315 520 L480 500 L550 555 L465 625 L300 610 L240 555 Z",
      labelX: 395,
      labelY: 560,
      tone: "leaf"
    },
    summary: "A warm inland lake culture that offers a quieter view of Roshar away from armies and courts.",
    culture: "Purelaker life is shaped by fishing, shallow waters, local food, hospitality, and rhythms that feel intentionally modest beside imperial politics.",
    costumes: "Light, water-friendly clothing fits the warm shallow lake environment.",
    religion: "Local worship has its own flavor and is not simply Vorin court practice moved onto the water.",
    physical: "The region is culturally defined more by place and lifestyle than one uniform appearance.",
    characters: [
      { name: "Ishikk", threshold: gate("twok", 13), note: "A fisherman viewpoint tied to the region's everyday life." }
    ]
  },
  {
    id: "urithiru",
    name: "Urithiru",
    type: "Ancient city",
    threshold: gate("wor", 89),
    map: {
      path: "M690 360 L795 345 L870 405 L840 510 L705 520 L730 448 Z",
      labelX: 775,
      labelY: 435,
      tone: "violet"
    },
    summary: "A legendary location whose importance belongs to later-book exploration and should stay hidden until the right point.",
    culture: "Once unlocked, this panel becomes a hub for old systems, coalition politics, research, logistics, and competing visions for Roshar's future.",
    costumes: "Expect a mix of national clothing, military uniforms, scholarly attire, and practical expedition gear.",
    religion: "Its significance intersects with ancient orders, modern faiths, and arguments about authority.",
    physical: "No single people define the location; it becomes a meeting point for multiple nations.",
    characters: [
      { name: "Dalinar Kholin", threshold: gate("wor", 89), note: "A central figure in the city's later political role." },
      { name: "Navani Kholin", threshold: gate("row", 1), note: "A scholar and leader tied to later tower research." }
    ]
  }
];

const relationshipCharacters = [
  {
    id: "kaladin",
    name: "Kaladin",
    role: "Soldier",
    origin: "Alethkar",
    tone: "storm",
    threshold: gate("twok", 1),
    x: 15,
    y: 42,
    portrait: { skin: "#9f6b4d", hair: "#171717", coat: "#263f45", accent: "#4fb7c5" }
  },
  {
    id: "tien",
    name: "Tien",
    role: "Family",
    origin: "Alethkar",
    tone: "storm",
    threshold: gate("twok", 7),
    x: 13,
    y: 18,
    portrait: { skin: "#a87355", hair: "#1f1a18", coat: "#35535a", accent: "#88a86b" }
  },
  {
    id: "teft",
    name: "Teft",
    role: "Bridge Four",
    origin: "Alethkar",
    tone: "storm",
    threshold: gate("twok", 14),
    x: 30,
    y: 54,
    portrait: { skin: "#9a684d", hair: "#2e2925", coat: "#33434a", accent: "#4fb7c5" }
  },
  {
    id: "shallan",
    name: "Shallan",
    role: "Scholar",
    origin: "Jah Keved",
    tone: "amber",
    threshold: gate("twok", 3),
    x: 36,
    y: 18,
    portrait: { skin: "#d9b29a", hair: "#9c3d2f", coat: "#604354", accent: "#f0a648" }
  },
  {
    id: "jasnah",
    name: "Jasnah",
    role: "Scholar",
    origin: "Alethkar",
    tone: "storm",
    threshold: gate("twok", 3),
    x: 54,
    y: 18,
    portrait: { skin: "#9f6b4d", hair: "#121212", coat: "#222b38", accent: "#ad82ff" }
  },
  {
    id: "dalinar",
    name: "Dalinar",
    role: "Highprince",
    origin: "Alethkar",
    tone: "storm",
    threshold: gate("twok", 12),
    x: 58,
    y: 48,
    portrait: { skin: "#966249", hair: "#1f1f1f", coat: "#253746", accent: "#f0a648" }
  },
  {
    id: "adolin",
    name: "Adolin",
    role: "Duelist",
    origin: "Alethkar",
    tone: "storm",
    threshold: gate("twok", 12),
    x: 76,
    y: 35,
    portrait: { skin: "#a96f4f", hair: "#c8a14c", coat: "#2d4059", accent: "#4fb7c5" }
  },
  {
    id: "renarin",
    name: "Renarin",
    role: "Kholin",
    origin: "Alethkar",
    tone: "storm",
    threshold: gate("twok", 18),
    x: 78,
    y: 62,
    portrait: { skin: "#a06a4e", hair: "#45362c", coat: "#263240", accent: "#88a86b" }
  },
  {
    id: "szeth",
    name: "Szeth",
    role: "Shin",
    origin: "Shinovar",
    tone: "leaf",
    threshold: gate("twok", 0),
    x: 86,
    y: 14,
    portrait: { skin: "#d7c4ae", hair: "#f0f0e9", coat: "#5b6659", accent: "#88a86b" }
  },
  {
    id: "lift",
    name: "Lift",
    role: "Edgedancer",
    origin: "Makabak",
    tone: "amber",
    threshold: gate("edgedancer", 1),
    x: 34,
    y: 78,
    portrait: { skin: "#8f5b3e", hair: "#2b201b", coat: "#4d5130", accent: "#f0a648" }
  },
  {
    id: "venli",
    name: "Venli",
    role: "Listener",
    origin: "Shattered Plains",
    tone: "violet",
    threshold: gate("ob", 1),
    x: 58,
    y: 82,
    portrait: { skin: "#8b6a75", hair: "#3b2a31", coat: "#4c384f", accent: "#ad82ff" }
  }
];

const relationshipLinks = [
  { id: "kaladin-tien", from: "kaladin", to: "tien", type: "family", label: "brothers", threshold: gate("twok", 7) },
  { id: "kaladin-teft", from: "kaladin", to: "teft", type: "crew", label: "Bridge Four", threshold: gate("twok", 14) },
  { id: "shallan-jasnah", from: "shallan", to: "jasnah", type: "mentor", label: "scholarship", threshold: gate("twok", 3) },
  { id: "jasnah-dalinar", from: "jasnah", to: "dalinar", type: "family", label: "Kholin family", threshold: gate("twok", 12) },
  { id: "dalinar-adolin", from: "dalinar", to: "adolin", type: "family", label: "father and son", threshold: gate("twok", 12) },
  { id: "dalinar-renarin", from: "dalinar", to: "renarin", type: "family", label: "father and son", threshold: gate("twok", 18) },
  { id: "adolin-shallan", from: "adolin", to: "shallan", type: "court", label: "court connection", threshold: gate("wor", 12) },
  { id: "szeth-dalinar", from: "szeth", to: "dalinar", type: "conflict", label: "spoiler conflict", threshold: gate("twok", 75) },
  { id: "lift-venli", from: "lift", to: "venli", type: "spoiler", label: "later arc proximity", threshold: gate("row", 1) }
];

const state = {
  position: readSavedPosition(),
  category: "world",
  showLocked: true,
  search: "",
  selectedId: "roshar",
  selectedRegionId: "alethkar",
  regionDrawerOpen: false,
  selectedMoreId: "roshar",
  moreDrawerOpen: false,
  timelineIndex: 0,
  revealed: new Set()
};

const els = {
  workSelect: document.querySelector("#workSelect"),
  chapterSelect: document.querySelector("#chapterSelect"),
  shieldStatus: document.querySelector("#shieldStatus"),
  searchInput: document.querySelector("#searchInput"),
  lockedToggle: document.querySelector("#lockedToggle"),
  segments: [...document.querySelectorAll(".segment")],
  thresholdTitle: document.querySelector("#thresholdTitle"),
  thresholdCopy: document.querySelector("#thresholdCopy"),
  bookMeter: document.querySelector("#bookMeter"),
  cardGrid: document.querySelector("#cardGrid"),
  detailType: document.querySelector("#detailType"),
  detailBook: document.querySelector("#detailBook"),
  detailTitle: document.querySelector("#detailTitle"),
  detailBody: document.querySelector("#detailBody"),
  detailTags: document.querySelector("#detailTags"),
  detailActions: document.querySelector("#detailActions"),
  timelineRange: document.querySelector("#timelineRange"),
  timelineMarkers: document.querySelector("#timelineMarkers"),
  timelineCard: document.querySelector("#timelineCard"),
  mapCanvas: document.querySelector("#mapCanvas"),
  mapLegend: document.querySelector("#mapLegend"),
  relationshipTree: document.querySelector("#relationshipTree"),
  relationshipLegend: document.querySelector("#relationshipLegend"),
  regionDrawer: document.querySelector("#regionDrawer"),
  drawerBackdrop: document.querySelector("#drawerBackdrop"),
  closeRegionDrawer: document.querySelector("#closeRegionDrawer"),
  regionType: document.querySelector("#regionType"),
  regionGate: document.querySelector("#regionGate"),
  regionTitle: document.querySelector("#regionTitle"),
  regionSummary: document.querySelector("#regionSummary"),
  regionContent: document.querySelector("#regionContent"),
  moreDrawer: document.querySelector("#moreDrawer"),
  moreBackdrop: document.querySelector("#moreBackdrop"),
  closeMoreDrawer: document.querySelector("#closeMoreDrawer"),
  moreType: document.querySelector("#moreType"),
  moreGate: document.querySelector("#moreGate"),
  moreTitle: document.querySelector("#moreTitle"),
  moreSummary: document.querySelector("#moreSummary"),
  moreContent: document.querySelector("#moreContent"),
  prevEvent: document.querySelector("#prevEvent"),
  nextEvent: document.querySelector("#nextEvent"),
  timelineScrubber: document.querySelector("#timelineScrubber"),
  revealDialog: document.querySelector("#revealDialog"),
  revealCopy: document.querySelector("#revealCopy"),
  cancelReveal: document.querySelector("#cancelReveal"),
  confirmReveal: document.querySelector("#confirmReveal")
};

let pendingRevealId = null;

function isUnlocked(item) {
  return positionScore(item.threshold) <= positionScore(state.position) || state.revealed.has(item.id);
}

function safeTitle(item) {
  return isUnlocked(item) ? item.title : "Locked entry";
}

function safeSummary(item) {
  return isUnlocked(item)
    ? item.summary || item.body
    : `Reveals material from ${thresholdLabel(item.threshold)}.`;
}

function categoryLabel(category) {
  const labels = {
    world: "World",
    characters: "Character",
    items: "Item",
    timeline: "Timeline"
  };
  return labels[category] || "Entry";
}

function searchableText(item) {
  if (isUnlocked(item)) {
    return [item.title, item.summary, item.body, ...(item.tags || [])].join(" ").toLowerCase();
  }
  return [categoryLabel(item.category), thresholdLabel(item.threshold)].join(" ").toLowerCase();
}

function filteredEntries() {
  const query = state.search.trim().toLowerCase();
  return entries.filter((item) => {
    const categoryMatch = item.category === state.category;
    const lockMatch = state.showLocked || isUnlocked(item);
    const searchMatch = !query || searchableText(item).includes(query);
    return categoryMatch && lockMatch && searchMatch;
  });
}

function renderProgressControls() {
  els.workSelect.innerHTML = works
    .map((work) => `<option value="${work.key}">${work.label}</option>`)
    .join("");
  els.workSelect.value = state.position.work;

  const work = workForKey(state.position.work);
  if (work.key === "none") {
    els.chapterSelect.disabled = true;
    els.chapterSelect.innerHTML = `<option value="0">Not started</option>`;
    return;
  }

  const options = [`<option value="0">Opening material</option>`];
  for (let chapter = 1; chapter <= work.chapters; chapter += 1) {
    const label = chapter === work.chapters ? `Chapter ${chapter} (complete)` : `Chapter ${chapter}`;
    options.push(`<option value="${chapter}">${label}</option>`);
  }

  els.chapterSelect.disabled = false;
  els.chapterSelect.innerHTML = options.join("");
  els.chapterSelect.value = String(state.position.chapter);
}

function renderReaderState() {
  const work = workForKey(state.position.work);
  const currentScore = positionScore(state.position);
  const completeScore = positionScore(completePosition("wat"));
  const currentPercent = work.chapters ? Math.round((state.position.chapter / work.chapters) * 100) : 0;

  renderProgressControls();
  els.thresholdTitle.textContent = thresholdLabel(state.position);
  els.thresholdCopy.textContent = currentPositionCopy(state.position);
  els.shieldStatus.textContent = currentScore >= completeScore ? "Spoiler Shield Set" : "Spoiler Shield Active";

  const steps = works
    .filter((item) => item.key !== "none")
    .map((item) => {
      const itemComplete = positionScore(completePosition(item.key)) <= currentScore;
      const itemCurrent = item.key === state.position.work && state.position.chapter > 0 && !itemComplete;
      const className = [
        "book-step",
        itemComplete ? "is-read" : "",
        itemCurrent ? "is-current" : ""
      ].filter(Boolean).join(" ");

      return `<span class="${className}" title="${item.label}"></span>`;
    })
    .join("");

  const chapterLabel = work.key === "none"
    ? "No chapters selected"
    : `${work.shortLabel}: ${state.position.chapter} of ${work.chapters}`;

  els.bookMeter.innerHTML = `
    <div class="work-steps">${steps}</div>
    <div class="chapter-progress" aria-label="${chapterLabel}">
      <div class="chapter-progress-meta">
        <span>${chapterLabel}</span>
        <span>${currentPercent}%</span>
      </div>
      <div class="chapter-progress-track">
        <span style="width: ${currentPercent}%"></span>
      </div>
    </div>
  `;
}

function renderSegments() {
  els.segments.forEach((button) => {
    const active = button.dataset.category === state.category;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
}

function renderCards() {
  const visible = filteredEntries();

  if (!visible.length) {
    els.cardGrid.innerHTML = `<div class="empty-state">No entries match the current filters.</div>`;
    return;
  }

  if (!visible.some((item) => item.id === state.selectedId)) {
    state.selectedId = visible[0].id;
  }

  els.cardGrid.innerHTML = visible
    .map((item) => {
      const unlocked = isUnlocked(item);
      const selected = item.id === state.selectedId;
      const classes = [
        "entry-card",
        selected ? "is-selected" : "",
        unlocked ? "" : "is-locked"
      ].filter(Boolean).join(" ");

      const meta = unlocked
        ? `<span>${categoryLabel(item.category)}</span><span>${thresholdLabel(item.threshold)}</span>`
        : `<span>Locked</span><span>${thresholdLabel(item.threshold)}</span>`;

      return `
        <button class="${classes}" type="button" data-entry-id="${item.id}">
          <div class="card-meta">${meta}</div>
          <h3>${safeTitle(item)}</h3>
          <p>${safeSummary(item)}</p>
        </button>
      `;
    })
    .join("");
}

function renderDetail() {
  const item = entries.find((entry) => entry.id === state.selectedId) || filteredEntries()[0];

  if (!item) {
    els.detailType.textContent = categoryLabel(state.category);
    els.detailBook.textContent = "";
    els.detailTitle.textContent = "No entry selected";
    els.detailBody.textContent = "Adjust filters to restore entries.";
    els.detailTags.innerHTML = "";
    els.detailActions.innerHTML = "";
    return;
  }

  const unlocked = isUnlocked(item);
  els.detailType.textContent = unlocked ? categoryLabel(item.category) : "Locked";
  els.detailBook.textContent = thresholdLabel(item.threshold);
  els.detailTitle.textContent = safeTitle(item);
  els.detailBody.textContent = unlocked
    ? item.body
    : `This entry stays hidden until your progress reaches ${thresholdSentence(item.threshold)}.`;
  els.detailTags.innerHTML = unlocked
    ? item.tags.map((tag) => `<span>${tag}</span>`).join("")
    : `<span>Protected</span>`;
  els.detailActions.innerHTML = `
    <button class="button-secondary" type="button" data-more-id="${item.id}">More</button>
    ${unlocked ? "" : `<button class="button-primary" type="button" data-reveal-id="${item.id}">Reveal just this</button>`}
  `;
}

function renderTimelineMarkers() {
  const max = timelineEvents.length - 1;
  els.timelineRange.max = String(max);

  els.timelineMarkers.innerHTML = timelineEvents
    .map((event, index) => {
      const left = max === 0 ? 0 : (index / max) * 100;
      const lockedClass = isUnlocked(event) ? "" : " is-locked";
      return `<span class="timeline-marker${lockedClass}" style="left: ${left}%"></span>`;
    })
    .join("");
}

function renderTimelineCard() {
  const event = timelineEvents[state.timelineIndex];
  if (!event) {
    return;
  }

  const unlocked = isUnlocked(event);
  els.timelineRange.value = String(state.timelineIndex);
  els.timelineCard.classList.toggle("is-locked", !unlocked);

  const title = unlocked ? event.title : "Locked event";
  const copy = unlocked
    ? event.body
    : `Timeline details reveal material from ${thresholdLabel(event.threshold)}.`;
  const tags = unlocked
    ? event.tags.map((tag) => `<span>${tag}</span>`).join("")
    : `<span>Protected</span>`;
  const action = unlocked
    ? ""
    : `<div class="detail-actions"><button class="button-primary" type="button" data-reveal-id="${event.id}">Reveal just this</button></div>`;

  els.timelineCard.innerHTML = `
    <span class="timeline-book">${thresholdLabel(event.threshold)}</span>
    <h3>${title}</h3>
    <p>${copy}</p>
    <div class="tag-row">${tags}</div>
    ${action}
  `;
}

function renderTimeline() {
  renderTimelineMarkers();
  renderTimelineCard();
}

function regionById(id) {
  return worldRegions.find((region) => region.id === id) || worldRegions[0];
}

function renderMap() {
  const regionsMarkup = worldRegions
    .map((region) => {
      const unlocked = isUnlocked(region);
      const selected = region.id === state.selectedRegionId;
      const classes = [
        "map-region",
        `tone-${region.map.tone}`,
        unlocked ? "" : "is-locked",
        selected ? "is-selected" : ""
      ].filter(Boolean).join(" ");
      const label = unlocked ? region.name : "Locked";

      return `
        <g class="${classes}" data-region-id="${region.id}" role="button" tabindex="0" aria-label="${label}">
          <path d="${region.map.path}"></path>
          <text x="${region.map.labelX}" y="${region.map.labelY}">${label}</text>
        </g>
      `;
    })
    .join("");

  els.mapCanvas.innerHTML = `
    <svg class="roshar-map" viewBox="0 0 980 680" role="img" aria-label="Schematic map of Roshar regions">
      <defs>
        <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.35"></feDropShadow>
        </filter>
      </defs>
      <rect class="map-ocean" x="0" y="0" width="980" height="680" rx="18"></rect>
      <path class="map-continent" d="M70 295 L90 210 L235 155 L330 160 L505 120 L690 120 L875 172 L935 275 L870 405 L840 510 L705 520 L605 535 L465 625 L300 610 L240 555 L185 385 Z"></path>
      <path class="map-stormline" d="M865 82 C910 145 930 215 920 305 C910 398 865 475 795 575"></path>
      ${regionsMarkup}
    </svg>
  `;

  els.mapLegend.innerHTML = `
    <span><i class="legend-swatch tone-storm"></i>Kingdoms and cities</span>
    <span><i class="legend-swatch tone-amber"></i>Cultural regions</span>
    <span><i class="legend-swatch tone-leaf"></i>Distinct ecologies</span>
    <span><i class="legend-swatch tone-locked"></i>Locked by progress</span>
  `;
}

function relationshipCharacterById(id) {
  return relationshipCharacters.find((character) => character.id === id);
}

function isRelationshipVisible(link) {
  const from = relationshipCharacterById(link.from);
  const to = relationshipCharacterById(link.to);
  return Boolean(from && to && isUnlocked(from) && isUnlocked(to) && isUnlocked(link));
}

function renderPortrait(character, unlocked) {
  if (!unlocked) {
    return `
      <svg class="portrait-svg portrait-placeholder" viewBox="0 0 80 80" aria-hidden="true">
        <rect x="4" y="4" width="72" height="72" rx="18"></rect>
        <circle cx="40" cy="31" r="13"></circle>
        <path d="M20 70 C24 53 56 53 60 70 Z"></path>
      </svg>
    `;
  }

  return `
    <svg class="portrait-svg" viewBox="0 0 80 80" aria-hidden="true"
      style="--skin: ${character.portrait.skin}; --hair: ${character.portrait.hair}; --coat: ${character.portrait.coat}; --accent: ${character.portrait.accent};">
      <rect class="portrait-bg" x="4" y="4" width="72" height="72" rx="18"></rect>
      <path class="portrait-body" d="M16 74 C20 54 60 54 64 74 Z"></path>
      <circle class="portrait-face" cx="40" cy="32" r="15"></circle>
      <path class="portrait-hair" d="M24 31 C26 14 54 12 58 30 C51 25 44 24 34 25 C31 26 28 28 24 31 Z"></path>
      <path class="portrait-accent" d="M23 61 C32 67 49 67 58 61"></path>
    </svg>
  `;
}

function renderRelationshipTree() {
  const links = relationshipLinks.map((link) => {
    const from = relationshipCharacterById(link.from);
    const to = relationshipCharacterById(link.to);
    if (!from || !to) {
      return "";
    }

    const visible = isRelationshipVisible(link);
    const classes = [
      "relationship-line",
      visible ? `type-${link.type}` : "is-locked"
    ].join(" ");
    const label = visible ? link.label : "Protected relationship";

    return `
      <line class="${classes}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}">
        <title>${label}</title>
      </line>
    `;
  }).join("");

  const nodes = relationshipCharacters.map((character) => {
    const unlocked = isUnlocked(character);
    const classes = [
      "relationship-node",
      unlocked ? `origin-${character.tone}` : "is-locked"
    ].join(" ");
    const name = unlocked ? character.name : "Locked character";
    const role = unlocked ? character.role : thresholdLabel(character.threshold);
    const origin = unlocked ? character.origin : "Protected";

    return `
      <article class="${classes}" style="left: ${character.x}%; top: ${character.y}%;">
        <div class="portrait-frame">${renderPortrait(character, unlocked)}</div>
        <h3>${name}</h3>
        <p>${role}</p>
        <span>${origin}</span>
      </article>
    `;
  }).join("");

  els.relationshipTree.innerHTML = `
    <div class="relationship-canvas">
      <svg class="relationship-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        ${links}
      </svg>
      ${nodes}
    </div>
  `;

  els.relationshipLegend.innerHTML = `
    <span><i class="legend-line type-family"></i>Family</span>
    <span><i class="legend-line type-mentor"></i>Mentor or study</span>
    <span><i class="legend-line type-crew"></i>Crew or alliance</span>
    <span><i class="legend-line is-locked"></i>Protected</span>
  `;
}

function renderRegionSection(title, body) {
  return `
    <section class="region-info-block">
      <h3>${title}</h3>
      <p>${body}</p>
    </section>
  `;
}

function renderRegionCharacters(region) {
  const rows = region.characters.map((character) => {
    const unlocked = positionScore(character.threshold) <= positionScore(state.position) || state.revealed.has(region.id);
    const name = unlocked ? character.name : "Locked person of note";
    const note = unlocked ? character.note : `Visible at ${thresholdLabel(character.threshold)}.`;
    return `
      <li>
        <strong>${name}</strong>
        <span>${note}</span>
      </li>
    `;
  }).join("");

  return `
    <section class="region-info-block">
      <h3>Characters of note</h3>
      <ul class="region-character-list">${rows}</ul>
    </section>
  `;
}

function renderRegionDrawer() {
  const region = regionById(state.selectedRegionId);
  const unlocked = isUnlocked(region);

  els.regionDrawer.classList.toggle("is-open", state.regionDrawerOpen);
  els.drawerBackdrop.classList.toggle("is-open", state.regionDrawerOpen);
  els.regionDrawer.setAttribute("aria-hidden", String(!state.regionDrawerOpen));
  els.regionType.textContent = unlocked ? region.type : "Locked";
  els.regionGate.textContent = thresholdLabel(region.threshold);
  els.regionTitle.textContent = unlocked ? region.name : "Locked region";
  els.regionSummary.textContent = unlocked
    ? region.summary
    : `This area stays hidden until your progress reaches ${thresholdSentence(region.threshold)}.`;

  if (!unlocked) {
    els.regionContent.innerHTML = `
      <div class="locked-region-callout">
        <p>Names, cultures, characters, and location details are redacted for this region.</p>
        <button class="button-primary" type="button" data-reveal-id="${region.id}">Reveal just this</button>
      </div>
    `;
    return;
  }

  els.regionContent.innerHTML = [
    renderRegionSection("Culture", region.culture),
    renderRegionSection("Costumes and attire", region.costumes),
    renderRegionSection("Religion and beliefs", region.religion),
    renderRegionSection("Typical physical characteristics", region.physical),
    renderRegionCharacters(region)
  ].join("");
}

function openRegionDrawer(id) {
  state.selectedRegionId = id;
  state.regionDrawerOpen = true;
  state.moreDrawerOpen = false;
  renderMap();
  renderRegionDrawer();
  renderMoreDrawer();
}

function closeRegionDrawer() {
  state.regionDrawerOpen = false;
  renderRegionDrawer();
}

function entryById(id) {
  return entries.find((entry) => entry.id === id) || entries[0];
}

function renderMoreSection(title, body) {
  return `
    <section class="more-info-block">
      <h3>${title}</h3>
      <p>${body}</p>
    </section>
  `;
}

function renderMoreDrawer() {
  const item = entryById(state.selectedMoreId);
  const detail = moreDetails[item.id];
  const unlocked = isUnlocked(item);

  els.moreDrawer.classList.toggle("is-open", state.moreDrawerOpen);
  els.moreBackdrop.classList.toggle("is-open", state.moreDrawerOpen);
  els.moreDrawer.setAttribute("aria-hidden", String(!state.moreDrawerOpen));
  els.moreType.textContent = unlocked ? categoryLabel(item.category) : "Locked";
  els.moreGate.textContent = thresholdLabel(item.threshold);
  els.moreTitle.textContent = unlocked ? item.title : "Locked detail";
  els.moreSummary.textContent = unlocked
    ? detail?.summary || item.summary || item.body
    : `This detail stays hidden until your progress reaches ${thresholdSentence(item.threshold)}.`;

  if (!unlocked) {
    els.moreContent.innerHTML = `
      <div class="locked-region-callout">
        <p>Additional notes from the linked reference are redacted for this entry.</p>
        <button class="button-primary" type="button" data-reveal-id="${item.id}">Reveal just this</button>
      </div>
    `;
    return;
  }

  const sections = detail?.sections?.map((section) => renderMoreSection(section.title, section.body)).join("") || "";
  const source = detail?.sourceUrl
    ? `<a class="source-link" href="${detail.sourceUrl}" target="_blank" rel="noopener noreferrer">Coppermind topic page</a>`
    : "";

  els.moreContent.innerHTML = `
    ${sections}
    ${source ? `<section class="more-source">${source}</section>` : ""}
  `;
}

function openMoreDrawer(id) {
  state.selectedMoreId = id;
  state.moreDrawerOpen = true;
  state.regionDrawerOpen = false;
  renderRegionDrawer();
  renderMoreDrawer();
}

function closeMoreDrawer() {
  state.moreDrawerOpen = false;
  renderMoreDrawer();
}

function render() {
  renderReaderState();
  renderSegments();
  renderCards();
  renderDetail();
  renderTimeline();
  renderMap();
  renderRelationshipTree();
  renderRegionDrawer();
  renderMoreDrawer();
}

function openRevealDialog(id) {
  const item = [...entries, ...timelineEvents, ...worldRegions].find((candidate) => candidate.id === id);
  if (!item) {
    return;
  }

  pendingRevealId = id;
  els.revealCopy.textContent = `This will reveal one entry gated to ${thresholdSentence(item.threshold)}. Your saved reading progress will not change.`;

  if (typeof els.revealDialog.showModal === "function") {
    els.revealDialog.showModal();
  } else if (window.confirm(els.revealCopy.textContent)) {
    confirmReveal();
  }
}

function closeRevealDialog() {
  pendingRevealId = null;
  if (els.revealDialog.open) {
    els.revealDialog.close();
  }
}

function confirmReveal() {
  if (!pendingRevealId) {
    return;
  }

  state.revealed.add(pendingRevealId);
  const revealedEntry = entries.find((item) => item.id === pendingRevealId);
  const revealedRegion = worldRegions.find((item) => item.id === pendingRevealId);
  if (revealedEntry) {
    state.category = revealedEntry.category;
    state.selectedId = revealedEntry.id;
  }
  if (revealedRegion) {
    state.selectedRegionId = revealedRegion.id;
    state.regionDrawerOpen = true;
  }
  closeRevealDialog();
  render();
}

function shiftTimeline(delta) {
  const max = timelineEvents.length - 1;
  state.timelineIndex = Math.min(max, Math.max(0, state.timelineIndex + delta));
  renderTimelineCard();
}

els.workSelect.addEventListener("change", (event) => {
  state.position = normalizePosition({
    work: event.target.value,
    chapter: 0
  });
  savePosition(state.position);
  render();
});

els.chapterSelect.addEventListener("change", (event) => {
  state.position = normalizePosition({
    work: state.position.work,
    chapter: event.target.value
  });
  savePosition(state.position);
  render();
});

els.searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderCards();
  renderDetail();
});

els.lockedToggle.addEventListener("change", (event) => {
  state.showLocked = event.target.checked;
  renderCards();
  renderDetail();
});

els.segments.forEach((button) => {
  button.addEventListener("click", () => {
    state.category = button.dataset.category;
    state.selectedId = filteredEntries()[0]?.id || null;
    if (state.moreDrawerOpen && state.selectedId) {
      state.selectedMoreId = state.selectedId;
    }
    renderSegments();
    renderCards();
    renderDetail();
    renderMoreDrawer();
  });
});

els.cardGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-entry-id]");
  if (!card) {
    return;
  }
  state.selectedId = card.dataset.entryId;
  if (state.moreDrawerOpen) {
    state.selectedMoreId = state.selectedId;
  }
  renderCards();
  renderDetail();
  renderMoreDrawer();
});

document.addEventListener("click", (event) => {
  const moreButton = event.target.closest("[data-more-id]");
  if (moreButton) {
    openMoreDrawer(moreButton.dataset.moreId);
    return;
  }

  const revealButton = event.target.closest("[data-reveal-id]");
  if (revealButton) {
    openRevealDialog(revealButton.dataset.revealId);
  }
});

els.timelineRange.addEventListener("input", (event) => {
  state.timelineIndex = Number(event.target.value);
  renderTimelineCard();
});

els.prevEvent.addEventListener("click", () => shiftTimeline(-1));
els.nextEvent.addEventListener("click", () => shiftTimeline(1));

els.mapCanvas.addEventListener("click", (event) => {
  const region = event.target.closest("[data-region-id]");
  if (region) {
    openRegionDrawer(region.dataset.regionId);
  }
});

els.mapCanvas.addEventListener("keydown", (event) => {
  const region = event.target.closest("[data-region-id]");
  if (!region || !["Enter", " "].includes(event.key)) {
    return;
  }
  event.preventDefault();
  openRegionDrawer(region.dataset.regionId);
});

els.timelineScrubber.addEventListener("wheel", (event) => {
  if (Math.abs(event.deltaY) < 4) {
    return;
  }
  event.preventDefault();
  shiftTimeline(event.deltaY > 0 ? 1 : -1);
}, { passive: false });

els.cancelReveal.addEventListener("click", closeRevealDialog);
els.confirmReveal.addEventListener("click", confirmReveal);
els.closeRegionDrawer.addEventListener("click", closeRegionDrawer);
els.drawerBackdrop.addEventListener("click", closeRegionDrawer);
els.closeMoreDrawer.addEventListener("click", closeMoreDrawer);
els.moreBackdrop.addEventListener("click", closeMoreDrawer);

els.revealDialog.addEventListener("cancel", () => {
  pendingRevealId = null;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.moreDrawerOpen) {
    closeMoreDrawer();
    return;
  }

  if (event.key === "Escape" && state.regionDrawerOpen) {
    closeRegionDrawer();
  }
});

render();
