const books = [
  {
    level: 0,
    label: "No books yet",
    copy: "Only broad, jacket-safe world context is visible."
  },
  {
    level: 1,
    label: "The Way of Kings",
    copy: "Entries introduced by the end of book one are visible."
  },
  {
    level: 2,
    label: "Words of Radiance",
    copy: "Book two material and earlier context are visible."
  },
  {
    level: 2.5,
    label: "Edgedancer",
    copy: "The first Stormlight novella and earlier context are visible."
  },
  {
    level: 3,
    label: "Oathbringer",
    copy: "Book three material and earlier context are visible."
  },
  {
    level: 3.5,
    label: "Dawnshard",
    copy: "The second Stormlight novella and earlier context are visible."
  },
  {
    level: 4,
    label: "Rhythm of War",
    copy: "Book four material and earlier context are visible."
  },
  {
    level: 5,
    label: "Wind and Truth",
    copy: "Published book five slots are available for verified entries."
  }
];

const entries = [
  {
    id: "roshar",
    category: "world",
    level: 0,
    title: "Roshar",
    summary: "A storm-shaped continent of stone, city-states, living ecology, and cultures built around survival.",
    body: "Roshar is the primary setting: a harsh world where weather, terrain, ecology, politics, and belief systems all shape how people live.",
    tags: ["Setting", "Geography", "Culture"]
  },
  {
    id: "highstorms",
    category: "world",
    level: 0,
    title: "Highstorms",
    summary: "Enormous recurring storms define travel, architecture, agriculture, and everyday risk.",
    body: "Highstorms are the pulse of the continent. Settlements, plants, animals, trade, and military planning all bend around their arrival.",
    tags: ["Weather", "Ecology", "Survival"]
  },
  {
    id: "spren",
    category: "world",
    level: 1,
    title: "Spren",
    summary: "Manifestations tied to emotion, nature, and forces that people across Roshar treat as part of daily life.",
    body: "Spren make the world feel visibly responsive. Their presence turns fear, rot, flame, wind, and countless other experiences into something seen.",
    tags: ["Magic", "Culture", "Nature"]
  },
  {
    id: "shattered-plains",
    category: "world",
    level: 1,
    title: "The Shattered Plains",
    summary: "A broken expanse of plateaus central to the early warcamps and their campaigns.",
    body: "The Shattered Plains are both battlefield and mystery, forcing armies to move across chasms, bridges, and distant plateau runs.",
    tags: ["Location", "War", "Alethkar"]
  },
  {
    id: "urithiru",
    category: "world",
    level: 2,
    title: "Urithiru",
    summary: "A legendary location whose role expands as the series widens beyond the warcamps.",
    body: "Urithiru becomes a major hub for politics, logistics, research, and competing visions of what the future of Roshar should be.",
    tags: ["Location", "History", "Power"]
  },
  {
    id: "kaladin",
    category: "characters",
    level: 1,
    title: "Kaladin",
    summary: "A surgeon's son, soldier, and bridgeman whose story centers on duty, trauma, and protection.",
    body: "Kaladin's arc follows the pressure of survival and leadership in a brutal system, with questions of loyalty at the center.",
    tags: ["Character", "Bridge Four", "Alethi"]
  },
  {
    id: "shallan",
    category: "characters",
    level: 1,
    title: "Shallan",
    summary: "A young scholar and artist whose curiosity pulls her toward secrets, research, and dangerous patronage.",
    body: "Shallan's chapters blend scholarship, art, family pressure, and a talent for seeing patterns others miss.",
    tags: ["Character", "Scholarship", "Art"]
  },
  {
    id: "dalinar",
    category: "characters",
    level: 1,
    title: "Dalinar",
    summary: "A highprince wrestling with honor, command, memory, and the cost of unity.",
    body: "Dalinar sits at the crossroads of military power and moral responsibility, making him a natural anchor for political conflict.",
    tags: ["Character", "Alethkar", "Leadership"]
  },
  {
    id: "jasnah",
    category: "characters",
    level: 1,
    title: "Jasnah",
    summary: "A brilliant scholar whose skepticism and research unsettle comfortable answers.",
    body: "Jasnah brings method, nerve, and intellectual force to questions that many powerful people would rather leave untouched.",
    tags: ["Character", "Scholarship", "Kholin"]
  },
  {
    id: "venli",
    category: "characters",
    level: 3,
    title: "Venli",
    summary: "A listener whose choices and regrets deepen one side of Roshar's central conflict.",
    body: "Venli's perspective opens important cultural, historical, and moral dimensions that are easy to flatten from the outside.",
    tags: ["Character", "Listeners", "Perspective"]
  },
  {
    id: "lift",
    category: "characters",
    level: 2.5,
    title: "Lift",
    summary: "A young character whose novella expands the series' tone, stakes, and street-level view of power.",
    body: "Lift gives the atlas a different scale: food, movement, instinct, and local politics matter as much as armies and courts.",
    tags: ["Character", "Novella", "Street view"]
  },
  {
    id: "spheres",
    category: "items",
    level: 0,
    title: "Spheres",
    summary: "Gem-lit currency used for money, illumination, and hints of deeper systems.",
    body: "Spheres are small gemstones encased in glass. Their everyday use makes the fantastic feel practical and economic.",
    tags: ["Currency", "Light", "Daily Life"]
  },
  {
    id: "shardblade",
    category: "items",
    level: 1,
    title: "Shardblade",
    summary: "Rare weapons that reshape social status and battlefield tactics.",
    body: "Shardblades are legendary arms whose political value is almost as important as their battlefield power.",
    tags: ["Weapon", "Power", "Status"]
  },
  {
    id: "shardplate",
    category: "items",
    level: 1,
    title: "Shardplate",
    summary: "Armor that turns a fighter into a terrifying presence on the field.",
    body: "Shardplate changes the scale of combat and command, creating a visible gap between ordinary soldiers and elite warriors.",
    tags: ["Armor", "War", "Status"]
  },
  {
    id: "oathgate",
    category: "items",
    level: 2,
    title: "Oathgate",
    summary: "A transport system whose importance grows as the map opens.",
    body: "Oathgates connect the geography of Roshar to older systems of power, travel, and control.",
    tags: ["Travel", "Ancient", "Infrastructure"]
  }
];

const timelineEvents = [
  {
    id: "event-prelude",
    level: 1,
    title: "The Prelude",
    label: "Ancient history",
    body: "A mythic opening frames the old cost of oaths, war, and survival.",
    tags: ["History", "Oaths"]
  },
  {
    id: "event-king-falls",
    level: 1,
    title: "A King Falls",
    label: "Book one opening",
    body: "An assassination launches a vengeance pact and pulls nations toward the Shattered Plains.",
    tags: ["Alethkar", "War"]
  },
  {
    id: "event-bridge-four",
    level: 1,
    title: "Bridge Four Forms",
    label: "Book one",
    body: "A disposable crew becomes a community with its own loyalties, rituals, and impossible standards.",
    tags: ["Bridge Four", "Found family"]
  },
  {
    id: "event-tower",
    level: 1,
    title: "The Tower",
    label: "Book one late",
    body: "A battlefield crisis forces several characters to decide what their honor is worth.",
    tags: ["Battle", "Choice"]
  },
  {
    id: "event-duel",
    level: 2,
    title: "A Duel Changes the Board",
    label: "Book two",
    body: "A public contest becomes a turning point for reputation, alliances, and personal risk.",
    tags: ["Warcamps", "Politics"]
  },
  {
    id: "event-everstorm",
    level: 2,
    title: "The Everstorm",
    label: "Book two late",
    body: "A new storm changes the map's dangers and raises the stakes for every nation.",
    tags: ["Storms", "Escalation"]
  },
  {
    id: "event-edgedancer",
    level: 2.5,
    title: "Edgedancer Interlude",
    label: "Novella",
    body: "A side journey widens the map and gives several ideas from book two more room to breathe.",
    tags: ["Novella", "Interlude"]
  },
  {
    id: "event-thaylen",
    level: 3,
    title: "Thaylen Field",
    label: "Book three late",
    body: "A massive confrontation tests coalitions, memory, leadership, and the meaning of unity.",
    tags: ["Battle", "Unity"]
  },
  {
    id: "event-dawnshard",
    level: 3.5,
    title: "Dawnshard Expedition",
    label: "Novella",
    body: "An expedition story expands the wider world between the third and fourth main books.",
    tags: ["Novella", "Expedition"]
  },
  {
    id: "event-urithiru",
    level: 4,
    title: "Urithiru Under Pressure",
    label: "Book four",
    body: "The tower becomes a battleground of science, willpower, occupation, and resistance.",
    tags: ["Urithiru", "Resistance"]
  },
  {
    id: "event-book-five-slot",
    level: 5,
    title: "Wind and Truth Entry Slot",
    label: "Book five",
    body: "Reserved for verified book five events once the content set is expanded.",
    tags: ["Book five", "Placeholder"]
  }
];

const state = {
  level: Number(localStorage.getItem("stormlight-reader-level") || 0),
  category: "world",
  showLocked: true,
  search: "",
  selectedId: "roshar",
  timelineIndex: 0,
  revealed: new Set()
};

const els = {
  progressSelect: document.querySelector("#progressSelect"),
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

function bookFor(level) {
  return books.find((book) => book.level === level) || books[0];
}

function entryBookLabel(level) {
  if (level === 0) {
    return "Safe";
  }
  return `Through ${bookFor(level).label}`;
}

function isUnlocked(item) {
  return item.level <= state.level || state.revealed.has(item.id);
}

function safeTitle(item) {
  return isUnlocked(item) ? item.title : "Locked entry";
}

function safeSummary(item) {
  return isUnlocked(item)
    ? item.summary || item.body
    : `Reveals material from ${bookFor(item.level).label}.`;
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
  return [categoryLabel(item.category), bookFor(item.level).label].join(" ").toLowerCase();
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

function renderReaderState() {
  const current = bookFor(state.level);
  els.progressSelect.value = String(state.level);
  els.thresholdTitle.textContent = current.label;
  els.thresholdCopy.textContent = current.copy;
  els.shieldStatus.textContent = state.level === 5 ? "Spoiler Shield Set" : "Spoiler Shield Active";

  els.bookMeter.innerHTML = books
    .filter((book) => book.level > 0)
    .map((book) => {
      const readClass = book.level <= state.level ? " is-read" : "";
      return `<span class="book-step${readClass}" title="${book.label}"></span>`;
    })
    .join("");
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
        ? `<span>${categoryLabel(item.category)}</span><span>${entryBookLabel(item.level)}</span>`
        : `<span>Locked</span><span>${entryBookLabel(item.level)}</span>`;

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
  els.detailBook.textContent = entryBookLabel(item.level);
  els.detailTitle.textContent = safeTitle(item);
  els.detailBody.textContent = unlocked
    ? item.body
    : `This entry stays hidden until your progress is set to ${bookFor(item.level).label}.`;
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
    : `Timeline details reveal material from ${bookFor(event.level).label}.`;
  const tags = unlocked
    ? event.tags.map((tag) => `<span>${tag}</span>`).join("")
    : `<span>Protected</span>`;
  const action = unlocked
    ? ""
    : `<div class="detail-actions"><button class="button-primary" type="button" data-reveal-id="${event.id}">Reveal just this</button></div>`;

  els.timelineCard.innerHTML = `
    <span class="timeline-book">${entryBookLabel(event.level)}</span>
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
  els.revealCopy.textContent = `This will reveal one entry gated to ${bookFor(item.level).label}. Your saved reading progress will not change.`;

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

els.progressSelect.addEventListener("change", (event) => {
  state.level = Number(event.target.value);
  localStorage.setItem("stormlight-reader-level", String(state.level));
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
