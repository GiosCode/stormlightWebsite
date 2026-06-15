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

const state = {
  position: readSavedPosition(),
  category: "world",
  showLocked: true,
  search: "",
  selectedId: "roshar",
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
  els.detailActions.innerHTML = unlocked
    ? ""
    : `<button class="button-primary" type="button" data-reveal-id="${item.id}">Reveal just this</button>`;
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

function render() {
  renderReaderState();
  renderSegments();
  renderCards();
  renderDetail();
  renderTimeline();
}

function openRevealDialog(id) {
  const item = [...entries, ...timelineEvents].find((candidate) => candidate.id === id);
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
  if (revealedEntry) {
    state.category = revealedEntry.category;
    state.selectedId = revealedEntry.id;
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
    renderSegments();
    renderCards();
    renderDetail();
  });
});

els.cardGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-entry-id]");
  if (!card) {
    return;
  }
  state.selectedId = card.dataset.entryId;
  renderCards();
  renderDetail();
});

document.addEventListener("click", (event) => {
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

els.timelineScrubber.addEventListener("wheel", (event) => {
  if (Math.abs(event.deltaY) < 4) {
    return;
  }
  event.preventDefault();
  shiftTimeline(event.deltaY > 0 ? 1 : -1);
}, { passive: false });

els.cancelReveal.addEventListener("click", closeRevealDialog);
els.confirmReveal.addEventListener("click", confirmReveal);

els.revealDialog.addEventListener("cancel", () => {
  pendingRevealId = null;
});

render();
