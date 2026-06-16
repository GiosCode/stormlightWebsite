#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";

const SNAPSHOT = "20260304033501";
const ARCHIVE_ROOT = `https://web.archive.org/web/${SNAPSHOT}/https://coppermind.net/wiki/`;
const LIVE_ROOT = "https://coppermind.net/wiki/";
const DEFAULT_MAX_PAGES = 500;
const REQUEST_DELAY_MS = 140;

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = "true"] = arg.replace(/^--/, "").split("=");
    return [key, value];
  })
);

const maxPages = Number(args.get("max-pages") || DEFAULT_MAX_PAGES);
const outputDir = args.get("output-dir") || "data";
const checkpointEvery = Number(args.get("checkpoint-every") || 25);
const reclassifyExistingPath = args.get("reclassify-existing");
let stdoutBroken = false;

process.stdout.on("error", (error) => {
  if (error.code === "EPIPE") {
    stdoutBroken = true;
    return;
  }
  throw error;
});

function writeStatus(message) {
  if (stdoutBroken || !process.stdout.writable) {
    return;
  }

  try {
    process.stdout.write(message);
  } catch (error) {
    if (error.code === "EPIPE") {
      stdoutBroken = true;
      return;
    }
    throw error;
  }
}

const seedTitles = [
  "Coppermind:Welcome",
  "The_Stormlight_Archive",
  "Category:The_Stormlight_Archive",
  "Roshar",
  "The_Way_of_Kings",
  "Words_of_Radiance",
  "Edgedancer_(novella)",
  "Oathbringer",
  "Dawnshard_(novella)",
  "Rhythm_of_War",
  "Wind_and_Truth",
  "Kaladin",
  "Shallan_Davar",
  "Dalinar_Kholin",
  "Adolin_Kholin",
  "Jasnah_Kholin",
  "Navani_Kholin",
  "Szeth",
  "Lift",
  "Venli",
  "Bridge_Four",
  "Alethkar",
  "Kholinar",
  "Shattered_Plains",
  "Urithiru",
  "Shinovar",
  "Jah_Keved",
  "Azir",
  "Thaylenah",
  "Herdaz",
  "Kharbranth",
  "Purelake",
  "Reshi_Isles",
  "Iri",
  "Rira",
  "Tukar",
  "Emul",
  "Marat",
  "Tashikk",
  "Babatharnam",
  "Aimia",
  "Akinah",
  "Narak",
  "Hearthstone",
  "Knights_Radiant",
  "Order_of_Windrunners",
  "Order_of_Skybreakers",
  "Order_of_Dustbringers",
  "Order_of_Edgedancers",
  "Order_of_Truthwatchers",
  "Order_of_Lightweavers",
  "Order_of_Elsecallers",
  "Order_of_Willshapers",
  "Order_of_Stonewards",
  "Order_of_Bondsmiths",
  "Ghostbloods",
  "Sons_of_Honor",
  "The_Diagram",
  "Surgebinding",
  "Nahel_bond",
  "Ideals",
  "Shardblade",
  "Shardplate",
  "Honorblade",
  "Oathgate",
  "Fabrial",
  "Soulcaster",
  "Spanreed",
  "Gemheart",
  "Stormlight",
  "Voidlight",
  "Lifelight",
  "Towerlight",
  "Warlight",
  "Highstorm",
  "Spren",
  "Singers",
  "Listeners",
  "Parshendi",
  "Alethi",
  "Vorinism",
  "Vedens",
  "Shin",
  "Thaylens",
  "Herdazians",
  "Iriali",
  "Azish",
  "Chasmfiend",
  "Chull",
  "Ryshadium",
  "Assassination_of_Gavilar",
  "Recreance",
  "Desolation",
  "Vengeance_Pact",
  "Battle_of_the_Tower"
];

const excludedTitlePrefixes = [
  "Special:",
  "File:",
  "Help:",
  "User:",
  "User_talk:",
  "Talk:",
  "Template:",
  "Template_talk:",
  "Coppermind:",
  "MediaWiki:"
];

const alwaysAllowPrefixes = [
  "Category:The_Stormlight_Archive",
  "Category:Stormlight_Archive"
];

const stormlightSignals = [
  "stormlight",
  "roshar",
  "rosharan",
  "alethi",
  "alethkar",
  "kholin",
  "kholinar",
  "urithiru",
  "shattered plains",
  "knights radiant",
  "radiant",
  "surgebinding",
  "stormlight archive",
  "way of kings",
  "words of radiance",
  "oathbringer",
  "rhythm of war",
  "wind and truth",
  "dawnshard",
  "edgedancer",
  "shardblade",
  "shardplate",
  "highstorm",
  "spren",
  "parshendi",
  "listener",
  "singer",
  "voidbringer",
  "honorspren",
  "cultivationspren",
  "herald",
  "honorblade",
  "oathgate",
  "vorin",
  "shinovar",
  "jah keved",
  "azir",
  "thaylen",
  "kaladin",
  "shallan",
  "dalinar",
  "adolin",
  "renarin",
  "jasnah",
  "navani",
  "szeth",
  "lift",
  "venli",
  "gavilar",
  "sadeas",
  "taravangian",
  "bridge four"
];

const broadTitlesToAvoid = new Set([
  "Cosmere",
  "Brandon_Sanderson",
  "Hoid",
  "Adonalsium",
  "Shard",
  "Realmatic_Theory",
  "Investiture",
  "Mistborn_Era_3"
]);

const metaCategoryPattern = /^(Articles |Update for |Partially complete articles|Stormlight Archive$|Cosmere$|General Cosmere$|List articles$|Cytoverse$)/i;

function cleanHtmlEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html) {
  return cleanHtmlEntities(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<sup[\s\S]*?<\/sup>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleToArchiveUrl(title) {
  const encoded = title
    .split("/")
    .map((part) => encodeURIComponent(part.replace(/ /g, "_")))
    .join("/")
    .replace(/%3A/g, ":")
    .replace(/%28/g, "(")
    .replace(/%29/g, ")");

  return `${ARCHIVE_ROOT}${encoded}`;
}

function normalizeTitle(rawTitle) {
  return cleanHtmlEntities(rawTitle)
    .replace(/^\/wiki\//, "")
    .replace(/^https?:\/\/coppermind\.net\/wiki\//, "")
    .replace(/[#?].*$/, "")
    .replace(/ /g, "_")
    .trim();
}

function titleFromHref(href) {
  const cleaned = cleanHtmlEntities(href);
  const archiveMatch = cleaned.match(/\/web\/\d+\/https:\/\/coppermind\.net\/wiki\/([^"#?]+)/);
  const liveMatch = cleaned.match(/^https?:\/\/coppermind\.net\/wiki\/([^"#?]+)/);
  const relativeMatch = cleaned.match(/^\/wiki\/([^"#?]+)/);
  const title = archiveMatch?.[1] || liveMatch?.[1] || relativeMatch?.[1];

  if (!title) {
    return null;
  }

  try {
    return normalizeTitle(decodeURIComponent(title));
  } catch {
    return normalizeTitle(title);
  }
}

function shouldSkipTitle(title) {
  return !title
    || title.includes("redlink=1")
    || excludedTitlePrefixes.some((prefix) => title.startsWith(prefix))
    || broadTitlesToAvoid.has(title);
}

function extractLinks(html) {
  const links = new Set();
  for (const match of html.matchAll(/href=["']([^"']+)["']/gi)) {
    const title = titleFromHref(match[1]);
    if (!shouldSkipTitle(title)) {
      links.add(title);
    }
  }
  return [...links];
}

function extractTitle(html, fallbackTitle) {
  const heading = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return stripTags(heading || title || fallbackTitle)
    .replace(/\s+-\s+The Coppermind Wiki.*$/i, "")
    .trim();
}

function extractHeadings(html) {
  return [...html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)]
    .map((match) => stripTags(match[1]).replace(/\s*\[edit\]\s*$/i, ""))
    .filter(Boolean)
    .slice(0, 20);
}

function sliceBetween(value, startNeedle, endNeedles) {
  const start = value.indexOf(startNeedle);
  if (start === -1) {
    return "";
  }

  const end = endNeedles
    .map((needle) => value.indexOf(needle, start))
    .filter((index) => index > start)
    .sort((left, right) => left - right)[0];

  return value.slice(start, end || undefined);
}

function extractCategories(html) {
  const categoryHtml = sliceBetween(html, "id=\"catlinks\"", [
    "<div class=\"visualClear\"",
    "</main>",
    "</body>"
  ]);

  const categories = extractLinks(categoryHtml)
    .filter((title) => title.startsWith("Category:"))
    .map((title) => title.replace(/^Category:/, "").replace(/_/g, " "))
    .slice(0, 20);

  const metaIndex = categories.findIndex((category) => metaCategoryPattern.test(category));
  return (metaIndex === -1 ? categories : categories.slice(0, metaIndex)).slice(0, 20);
}

function extractMainText(html) {
  const content = sliceBetween(html, "class=\"mw-parser-output\"", [
    "<div class=\"printfooter\"",
    "<div id=\"catlinks\"",
    "</main>"
  ]) || html.match(/<div[^>]+id=["']mw-content-text["'][\s\S]*?<\/main>/i)?.[0]
    || html;
  return stripTags(content);
}

function extractLeadText(html) {
  const articleHtml = sliceBetween(html, "class=\"mw-parser-output\"", [
    "<div class=\"printfooter\"",
    "<div id=\"catlinks\"",
    "</main>"
  ]);

  return [...articleHtml.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => stripTags(match[1]))
    .filter((paragraph) => paragraph.length > 80)
    .filter((paragraph) => !/The Coppermind has spoilers/i.test(paragraph))
    .slice(0, 3)
    .join(" ");
}

function makeSnippet(text) {
  return text
    .replace(/\bJump to:.*$/i, "")
    .replace(/^The Coppermind has spoilers for all of Brandon's published works.*?Time Machine!?/i, "")
    .replace(/\s+/g, " ")
    .slice(0, 360)
    .trim();
}

function hasStormlightSignal(title, pageTitle, categories, text) {
  const compactTitle = title.replace(/_/g, " ").toLowerCase();
  const haystack = [
    compactTitle,
    pageTitle,
    categories.join(" "),
    text.slice(0, 12000)
  ].join(" ").toLowerCase();

  return alwaysAllowPrefixes.some((prefix) => title.startsWith(prefix))
    || stormlightSignals.some((signal) => haystack.includes(signal));
}

function linkLooksStormlightRelated(title) {
  const text = title.replace(/_/g, " ").toLowerCase();
  return alwaysAllowPrefixes.some((prefix) => title.startsWith(prefix))
    || stormlightSignals.some((signal) => text.includes(signal))
    || !title.includes(":");
}

function classifyPage(title, categories, text) {
  const titleText = title.replace(/_/g, " ").toLowerCase();
  const categoryText = categories.join(" ").toLowerCase();
  const haystack = [titleText, categoryText, text.slice(0, 2000)].join(" ").toLowerCase();
  const hasCategory = (pattern) => categories.some((category) => pattern.test(category));

  if (title.startsWith("Category:")) return "category";
  if (title.startsWith("The_Stormlight_Archive")) return "series";
  if (/the way of kings|words of radiance|oathbringer|rhythm of war|wind and truth|edgedancer|dawnshard/.test(titleText)) return "book";
  if (hasCategory(/^(Locations|Nations|Settlements|Cities|Celestial bodies|Cosmere planets|Roshar)$/i) || /\b(roshar|alethkar|kholinar|urithiru|shattered plains|shinovar|azir|jah keved|thaylenah|herdaz|marat|riir|aimia|reshi|purelake|narak|hearthstone|kharbranth|yeddaw|sesemalex dar)\b/.test(titleText)) return "place";
  if (hasCategory(/^(Characters|Heralds|Worldhoppers)$/i) || /kholin|kaladin|shallan|dalinar|adolin|jasnah|navani|szeth|lift|venli/.test(titleText)) return "character";
  if (hasCategory(/^(Groups|Armies|Knights Radiant|Bridge Four|Ghostbloods|Singers|Listeners)$/i) || /\b(order of|knights radiant|bridge four|ghostbloods|skybreakers|windrunners|lightweavers|bondsmiths|truthwatchers|elsecallers|willshapers|stonewards|dustbringers|edgedancers|listeners|singers)\b/.test(titleText)) return "faction";
  if (hasCategory(/^(Events|Desolations|Battles)$/i) || /\b(battle|assassination|recreance|vengeance pact|contest of champions|desolation)\b/.test(titleText)) return "event";
  if (hasCategory(/^(Magic|Magic systems|Objects and Materials|Weapons|Shardblades|Spren|Surgebinding)$/i) || /\b(surgebinding|surge|spren|stormlight|voidlight|lifelight|towerlight|warlight|shardblade|shardplate|honorblade|oathgate|fabrial|gemheart|soulcaster|spanreed|dawnshard)\b/.test(titleText)) return "magic-or-item";
  if (/\b(vorinism|alethi|azish|veden|thaylen|shin|listener|singer|parshendi|unseen court|safehand|lighteyes|darkeyes)\b/.test(titleText) || hasCategory(/^(Religion|Rosharan culture|Culture)$/i)) return "culture";
  if (hasCategory(/^(Rosharan lifeforms|Lifeforms|Sapient beings|Greatshells|Aimians|Sleepless)$/i) || /\b(chull|chasmfiend|ryshadium|greatshell|larkin|sleepless|siah aimian|aimian|iriali|fused|regal)\b/.test(titleText)) return "people-or-lifeform";
  return "other";
}

async function fetchPage(title) {
  const archivedUrl = titleToArchiveUrl(title);
  const response = await fetch(archivedUrl, {
    headers: {
      "User-Agent": "stormlight-atlas-local-crawler/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return {
    archivedUrl,
    html: await response.text()
  };
}

function summarizePages(pages) {
  const byKind = pages.reduce((counts, page) => {
    counts[page.kind] = (counts[page.kind] || 0) + 1;
    return counts;
  }, {});

  const pageTitles = new Set(pages.map((page) => page.title));
  const linkGraph = pages.map((page) => ({
    title: page.title,
    kind: page.kind,
    links: page.links.filter((link) => pageTitles.has(link))
  }));

  return { byKind, linkGraph };
}

async function writeOutputs(pages, rejected, { partial = false } = {}) {
  const generatedAt = new Date().toISOString();
  const { byKind, linkGraph } = summarizePages(pages);

  await mkdir(outputDir, { recursive: true });
  await writeFile(`${outputDir}/coppermind-stormlight-index.json`, JSON.stringify({
    generatedAt,
    source: "Internet Archive Wayback Machine",
    snapshot: SNAPSHOT,
    seedUrl: `${ARCHIVE_ROOT}Coppermind:Welcome`,
    pageCount: pages.length,
    status: partial ? "partial" : "complete",
    byKind,
    pages
  }, null, 2));

  await writeFile(`${outputDir}/coppermind-stormlight-link-graph.json`, JSON.stringify({
    generatedAt,
    snapshot: SNAPSHOT,
    status: partial ? "partial" : "complete",
    nodes: pages.map((page) => ({ title: page.title, label: page.pageTitle, kind: page.kind })),
    edges: linkGraph.flatMap((page) => page.links.map((target) => ({ source: page.title, target })))
  }, null, 2));

  await writeFile(`${outputDir}/coppermind-stormlight-crawl-report.md`, [
    "# Coppermind Stormlight Crawl",
    "",
    `Generated: ${generatedAt}`,
    `Snapshot: ${SNAPSHOT}`,
    `Status: ${partial ? "partial checkpoint" : "complete"}`,
    `Relevant pages: ${pages.length}`,
    "",
    "## Counts",
    "",
    ...Object.entries(byKind).sort().map(([kind, count]) => `- ${kind}: ${count}`),
    "",
    "## Notes",
    "",
    "- This is a local structured index of archived Coppermind pages, not a full article mirror.",
    "- Snippets are intentionally short and should be paraphrased before being shown in the app.",
    "- Spoiler filtering still needs to be mapped from page data to book/chapter gates before direct display.",
    "",
    "## Rejected Or Failed Samples",
    "",
    ...rejected.slice(0, 40).map((item) => `- ${item.title}: ${item.reason}`)
  ].join("\n"));

  return byKind;
}

async function reclassifyExisting(indexPath) {
  const existing = JSON.parse(await readFile(indexPath, "utf8"));
  const pages = existing.pages.map((page) => ({
    ...page,
    kind: classifyPage(page.title, page.categories || [], page.snippet || "")
  }));
  const byKind = await writeOutputs(pages, []);

  writeStatus(`Reclassified ${pages.length} existing pages from ${indexPath}\n`);
  writeStatus(`Kinds: ${JSON.stringify(byKind)}\n`);
}

async function main() {
  if (reclassifyExistingPath) {
    await reclassifyExisting(reclassifyExistingPath);
    return;
  }

  const queue = [...seedTitles];
  const queued = new Set(queue);
  const visited = new Set();
  const pages = [];
  const rejected = [];

  while (queue.length && pages.length < maxPages) {
    const title = queue.shift();
    if (visited.has(title) || shouldSkipTitle(title)) {
      continue;
    }

    visited.add(title);

    try {
      const { archivedUrl, html } = await fetchPage(title);
      const links = extractLinks(html);
      const categories = extractCategories(html);
      const pageTitle = extractTitle(html, title);
      const text = extractMainText(html);
      const relevant = hasStormlightSignal(title, pageTitle, categories, text);

      if (!relevant) {
        rejected.push({ title, reason: "no Stormlight signal" });
        continue;
      }

      const stormlightLinks = links.filter((link) => linkLooksStormlightRelated(link));
      pages.push({
        title,
        pageTitle,
        kind: classifyPage(title, categories, text),
        liveUrl: `${LIVE_ROOT}${title}`,
        archivedUrl,
        categories,
        headings: extractHeadings(html),
        snippet: makeSnippet(extractLeadText(html) || text),
        links: stormlightLinks.slice(0, 80)
      });

      for (const link of stormlightLinks) {
        if (!queued.has(link) && !visited.has(link) && !shouldSkipTitle(link)) {
          queued.add(link);
          queue.push(link);
        }
      }

      await delay(REQUEST_DELAY_MS);
      if (checkpointEvery > 0 && pages.length % checkpointEvery === 0) {
        await writeOutputs(pages, rejected, { partial: true });
      }
      writeStatus(`\rCrawled ${pages.length}/${maxPages} relevant pages; queued ${queue.length}   `);
    } catch (error) {
      rejected.push({ title, reason: error.message });
    }
  }

  const byKind = await writeOutputs(pages, rejected);
  writeStatus(`\nDone. Wrote ${pages.length} pages to ${outputDir}/coppermind-stormlight-index.json\n`);
  writeStatus(`Kinds: ${JSON.stringify(byKind)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
