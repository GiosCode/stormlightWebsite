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
  Spheres: gate("none"),
  Fabrial: gate("twok", 3),
  Spanreed: gate("twok", 3),
  Jah_Keved: gate("twok", 3),
  Urithiru: gate("wor", 89),
  Oathgate: gate("wor", 89),
  Lift: gate("edgedancer", 1),
  Venli: gate("ob", 1)
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

function titleLabel(title) {
  return title
    .replace(/_/g, " ")
    .replace(/\s+\((?:novella|book|group|short story)\)$/i, "")
    .trim();
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['’]/g, "")
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

function entryForPage(page) {
  const title = titleLabel(page.title);
  const label = labelForPage(page);
  const categories = cleanList(page.categories, 4);
  const headings = cleanList(page.headings, 3);
  const categoryPhrase = sentenceList(categories, "Stormlight Archive");

  return {
    id: idForPage(page),
    category: categoryForPage(page),
    threshold: thresholdForPage(page),
    title,
    summary: `${title} is a ${label.toLowerCase()} topic seeded from the archived Coppermind index.`,
    body: `${title} is indexed with ${categoryPhrase}. Use the More panel for source-backed headings and categories, with details gated by your reading progress.`,
    tags: [label, ...categories.slice(0, 3), "Coppermind seed"],
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
  const categories = sentenceList(page.categories, "Stormlight Archive");
  const headings = sentenceList(page.headings, "the article overview");
  const relatedTopics = sentenceList(
    (page.links || [])
      .filter((link) => !link.startsWith("Category:"))
      .map(titleLabel),
    "the wider Stormlight index"
  );

  return {
    sourceUrl: page.archivedUrl || page.liveUrl,
    summary: `${title} was added from the Stormlight-focused Coppermind crawl as a ${label.toLowerCase()} reference.`,
    sections: [
      {
        title: "Indexed categories",
        body: `${title} is grouped under ${categories}.`
      },
      {
        title: "Useful article sections",
        body: `The source page includes sections such as ${headings}.`
      },
      {
        title: "Connected indexed topics",
        body: `The crawl links ${title} with ${relatedTopics}.`
      },
      {
        title: "Spoiler handling",
        body: "Generated seed entries default to a late spoiler gate unless the app already has a safer chapter-specific threshold for that topic."
      }
    ]
  };
}

function timelineEventForPage(page) {
  const title = titleLabel(page.title);
  const categories = sentenceList(page.categories, "Stormlight Archive events");

  return {
    id: `seed-event-${slugify(page.title)}`,
    threshold: thresholdForPage(page),
    title,
    label: "Seeded event",
    body: `${title} is an event topic indexed with ${categories}. Full context remains gated to avoid accidental spoilers.`,
    tags: ["Event", ...cleanList(page.categories, 3), "Coppermind seed"]
  };
}

function byConfiguredKind(pages) {
  return Object.entries(kindConfig).flatMap(([kind, config]) => (
    pages
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
