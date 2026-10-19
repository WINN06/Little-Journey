const STORAGE_KEY = "little-journey-state-v1";
const LANGUAGE_KEY = "little-journey-language-v1";
const MOTION_KEY = "little-journey-motion-v1";
const $ = (id) => document.getElementById(id);
const ui = {
  todayLabel: $("todayLabel"), sceneClock: $("sceneClock"), sceneStatus: $("sceneStatus"), sceneDistance: $("sceneDistance"), motionButton: $("motionButton"), world: $("world"), journeyCard: $("journeyCard"),
  journeyIdle: $("journeyIdle"), readyView: $("readyView"), readyTask: $("readyTask"), readyMeta: $("readyMeta"), startButton: $("startButton"), changeButton: $("changeButton"),
  activeView: $("activeView"), activeKind: $("activeKind"), activeTask: $("activeTask"), timer: $("timer"), progressTrack: $("progressTrack"), progressFill: $("progressFill"), elapsedLabel: $("elapsedLabel"), remainingLabel: $("remainingLabel"), pauseButton: $("pauseButton"), endButton: $("endButton"),
  resultView: $("resultView"), feedback: $("feedback"), resultNextButton: $("resultNextButton"), storageNote: $("storageNote"), instantForm: $("instantForm"), instantTask: $("instantTask"), instantMinutes: $("instantMinutes"), instantError: $("instantError"),
  planForm: $("planForm"), planTask: $("planTask"), planTime: $("planTime"), planMinutes: $("planMinutes"), planKind: $("planKind"), planError: $("planError"), planList: $("planList"), planCount: $("planCount"),
  collection: $("collection"), friendCard: $("friendCard"), friendName: $("friendName"), friendHint: $("friendHint")
};

const I18N = {
  en: {
    brand: "Little Journey", brandAria: "Little Journey, back to top", local: "LOCAL JOURNEY", introKicker: "A LITTLE FOCUS COMPANION", journeyKicker: "JOURNEY STATUS", routeKicker: "TODAY'S ROUTE", quickKicker: "QUICK CHALLENGE", bagKicker: "LITTLE DISCOVERIES", heroA: "A little progress,", heroB: "together.", heroP: "Choose one thing to do. Your companion will explore while you make time for it.",
    adventureAria: "Journey scene and controls", sceneLabel: "EXPLORATION VIEW", motionOn: "MOTION ON", motionOff: "MOTION OFF", motionAria: "Play journey animation", journeyTitle: "Your journey", idleTitle: "Where shall we go?", idleDescription: "Pick a plan below, or create a quick focus challenge. Your start button will appear here.", chooseRoute: "Choose a route ↓", readyLabel: "READY TO EXPLORE", startJourney: "Start journey", changeChoice: "Choose something else", progressAria: "Journey progress", endEarly: "End early", resultLabel: "JOURNEY REPORT", nextJourney: "Plan another journey", storageError: "This browser could not save your data. Your progress may disappear after a refresh.",
    scheduleTitle: "Today's route", scheduleIntro: "Map out study, work, or a daily break.", planTaskLabel: "Activity", planTaskPlaceholder: "e.g. Go to class", startTime: "Start", minutes: "Minutes", type: "Type", focus: "Focus", daily: "Daily", add: "Add", addPlanAria: "Add plan", scheduleNote: "When it's time, select the plan and start from the journey panel above.",
    instantTitle: "Focus now", instantIntro: "No plan needed. Choose a task and a little time.", instantTaskLabel: "What will you work on?", instantTaskPlaceholder: "e.g. Read one chapter", duration: "Journey length", minuteUnit: "MIN", presetsAria: "Quick durations", demoOne: "TRY 1", prepareChallenge: "Prepare challenge", backpackTitle: "Travel bag", backpackIntro: "Every small step can leave something behind.", footerBrand: "LITTLE JOURNEY / 小小远行", footerNote: "Your plans stay in this browser · Every small step counts",
    planCount: "{count} plans", planCountOne: "1 plan", planUnit: "min", emptyTitle: "No route planned yet", emptyBody: "Add one small thing and begin here.", done: "Done ✓", exploring: "Exploring ···", selected: "Selected ✓", selectRoute: "Select route ↗", due: "Time to go", delete: "Delete {title}", journeyBusy: "Finish or end the current journey first.", planTaskEmpty: "Name this part of your route first.", planTimeEmpty: "Choose a start time.", planMinutesInvalid: "Enter a whole number from 1 to 180 minutes.", planMidnight: "This plan goes past midnight. Shorten it or choose an earlier time.", planOverlap: "Another plan already uses this time. Try a different time or length.", instantTaskEmpty: "Write down one thing you will do first.", instantMinutesInvalid: "Enter a whole number from 1 to 120 minutes.",
    scheduledMeta: "SCHEDULED · {minutes} MIN · {kind}", quickMeta: "QUICK CHALLENGE · {minutes} MIN", paused: "PAUSED", dailyExploring: "DAILY JOURNEY", focusExploring: "FOCUS JOURNEY", travelled: "{minutes} min travelled", remaining: "{minutes} min left", resume: "▶ Resume journey", pause: "Ⅱ Pause", title: "Little Journey · Pixel Focus Companion", runningTitle: "{time} · Little Journey", scenePaused: "Resting by the trail", sceneExploring: "Exploring: {title}", sceneReady: "Ready for: {title}", sceneDue: "{title} is ready to begin", sceneWaiting: "Your companion is waiting", trailProgress: "Trail · {percent}%", trailReady: "Trailhead · ready", trailChosen: "Trailhead · packed and ready", trailDue: "Today's route · time to go", petWaitingAria: "Pixel companion waiting on a path", petRunningAria: "Pixel companion running through a scrolling landscape", petPausedAria: "Pixel companion resting by the path", dateLocale: "en-HK",
    earlyTitle: "Your companion made it home.", earlyShort: "You took a small first step. Come back whenever you're ready.", earlyMinutes: "You travelled for {minutes} minutes. Come back whenever you're ready.", rewardTitle: "Journey complete! Found a {item}.", rewardBody: "You made {minutes} minutes for “{title}”.", rewardNext: "Where to next?", friendFound: "You also met a new friend, Moss!", dailyTitle: "Daily journey complete!", dailyBody: "“{title}” is done. Your companion is ready for the next route.", friendLocked: "An undiscovered friend", friendHint: "Complete {count} more focus journeys to meet them.", friendName: "You met Moss!", friendComplete: "You've completed {count} focus journeys together.", itemFootprint: "Footprint", itemLeaf: "Leaf", itemStar: "Star stone", itemMoon: "Moon shell", rangeFootprint: "1–14 minutes", rangeLeaf: "15–24 minutes", rangeStar: "25–44 minutes", rangeMoon: "45+ minutes"
  },
  zh: {
    brand: "小小远行", brandAria: "小小远行，返回顶部", local: "本地旅程", introKicker: "像素宠物专注伙伴", journeyKicker: "旅程状态", routeKicker: "今日路线", quickKicker: "即刻挑战", bagKicker: "小小发现", heroA: "今天，也一起", heroB: "慢慢前进。", heroP: "选一件事，和小伙伴出发。每一段认真度过的时间，都会留下一个小发现。",
    adventureAria: "探索画面与旅程控制", sceneLabel: "远行画面", motionOn: "动画 开", motionOff: "动画 关", motionAria: "播放远行动画", journeyTitle: "当前旅程", idleTitle: "今天想去哪儿？", idleDescription: "从下方选择一项计划，或准备一个即刻挑战。开始按钮会出现在这里。", chooseRoute: "选择路线 ↓", readyLabel: "准备出发", startJourney: "和小伙伴出发", changeChoice: "换一件事", progressAria: "探索进度", endEarly: "提前收队", resultLabel: "远行报告", nextJourney: "计划下一段旅程", storageError: "浏览器暂时无法保存数据；刷新页面后记录可能消失。",
    scheduleTitle: "今天的路线", scheduleIntro: "把学习、工作或休息放进今天的地图。", planTaskLabel: "安排", planTaskPlaceholder: "例如：去上课", startTime: "开始", minutes: "分钟", type: "类型", focus: "专注", daily: "日常", add: "添加", addPlanAria: "添加安排", scheduleNote: "时间到了就选择这项计划，再到上方的旅程区点击出发。",
    instantTitle: "即刻挑战", instantIntro: "无需预先计划，写下一件事和一点时间。", instantTaskLabel: "这次要做的事", instantTaskPlaceholder: "例如：读一章书", duration: "探索时长", minuteUnit: "分钟", presetsAria: "快捷设置时长", demoOne: "体验 1", prepareChallenge: "准备挑战", backpackTitle: "旅途背包", backpackIntro: "每一小步，都可以留下一个发现。", footerBrand: "小小远行 / LITTLE JOURNEY", footerNote: "你的安排只保存在当前浏览器中 · 给每一小步一点掌声",
    planCount: "{count} 项安排", planCountOne: "1 项安排", planUnit: "分钟", emptyTitle: "今天的路线还是空的", emptyBody: "先写下一件小事，让旅程从这里开始。", done: "已完成 ✓", exploring: "探索中 ···", selected: "已选择 ✓", selectRoute: "选择路线 ↗", due: "已到时间", delete: "删除{title}", journeyBusy: "先完成或结束当前旅程，再开始下一段。", planTaskEmpty: "给这段路线起个名字吧。", planTimeEmpty: "请选择开始时间。", planMinutesInvalid: "时长需要是 1–180 分钟的整数。", planMidnight: "这段安排会跨过午夜，请缩短时长或提前开始。", planOverlap: "这段时间已有安排，请换个时间或调整时长。", instantTaskEmpty: "先写下这次要做的事。", instantMinutesInvalid: "请输入 1–120 分钟的整数时长。",
    scheduledMeta: "今日计划 · {minutes} 分钟 · {kind}", quickMeta: "即刻挑战 · {minutes} 分钟", paused: "旅程暂时暂停", dailyExploring: "日常探索中", focusExploring: "专注探索中", travelled: "已走过 {minutes} 分钟", remaining: "剩余 {minutes} 分钟", resume: "▶ 继续远行", pause: "Ⅱ 暂停一下", title: "小小远行 · 像素宠物专注钟", runningTitle: "{time} · 小小远行", scenePaused: "在路边稍作休息", sceneExploring: "正在探索：{title}", sceneReady: "准备出发：{title}", sceneDue: "「{title}」可以出发了", sceneWaiting: "小伙伴正在等你", trailProgress: "旅途 · {percent}%", trailReady: "起点 · 还未出发", trailChosen: "起点 · 整装待发", trailDue: "今日路线 · 准备出发", petWaitingAria: "像素小宠物在路边等待出发", petRunningAria: "像素小宠物正在横版场景中奔跑探索", petPausedAria: "像素小宠物暂停探索，在路边休息", dateLocale: "zh-CN",
    earlyTitle: "小伙伴平安回来了。", earlyShort: "这次先走了一小段。想继续时，随时可以重新出发。", earlyMinutes: "这次走了 {minutes} 分钟。想继续时，随时可以重新出发。", rewardTitle: "远行完成，带回了「{item}」！", rewardBody: "你为「{title}」留出了 {minutes} 分钟。", rewardNext: "接下来想去哪儿？", friendFound: "这次还遇见了新朋友「小苔」！", dailyTitle: "日常旅程完成！", dailyBody: "「{title}」结束了，小伙伴在起点等你的下一段安排。", friendLocked: "还未遇见的朋友", friendHint: "再完成 {count} 次专注远行，或许会相遇。", friendName: "遇见了小苔", friendComplete: "你们已一起完成 {count} 次专注远行。", itemFootprint: "小脚印", itemLeaf: "叶片", itemStar: "星石", itemMoon: "月贝", rangeFootprint: "1–14 分钟", rangeLeaf: "15–24 分钟", rangeStar: "25–44 分钟", rangeMoon: "45 分钟以上"
  }
};

let language = "en";
try { if (localStorage.getItem(LANGUAGE_KEY) === "zh") language = "zh"; } catch { /* Browser storage is optional. */ }
let motionEnabled = true;
try { motionEnabled = localStorage.getItem(MOTION_KEY) !== "off"; } catch { /* Browser storage is optional. */ }
function t(key, values = {}) { return (I18N[language][key] || key).replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? "")); }
function applyLanguage() {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => { element.placeholder = t(element.dataset.i18nPlaceholder); });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => { element.setAttribute("aria-label", t(element.dataset.i18nAria)); });
  document.querySelectorAll("[data-lang]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.lang === language)));
}

const ITEMS = [
  { id: "footprint", glyph: "▪", name: "itemFootprint", range: "rangeFootprint" },
  { id: "leaf", glyph: "✳", name: "itemLeaf", range: "rangeLeaf" },
  { id: "star", glyph: "✦", name: "itemStar", range: "rangeStar" },
  { id: "moon", glyph: "☾", name: "itemMoon", range: "rangeMoon" }
];
const localDateKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const freshState = () => ({ date: localDateKey(), plans: [], inventory: { footprint: 0, leaf: 0, star: 0, moon: 0 }, focusSessions: 0, prepared: null, active: null, lastResult: null });
let storageAvailable = true;
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || typeof saved !== "object") return freshState();
    const base = freshState();
    const data = { date: saved.date || base.date, plans: Array.isArray(saved.plans) ? saved.plans.filter((p) => p && typeof p.title === "string" && typeof p.time === "string") : [], inventory: { ...base.inventory, ...(saved.inventory || {}) }, focusSessions: Number.isFinite(saved.focusSessions) ? saved.focusSessions : 0, prepared: saved.prepared || null, active: saved.active || null, lastResult: saved.lastResult || null };
    if (data.date !== base.date) { data.date = base.date; data.plans = []; data.prepared = null; data.lastResult = null; }
    if (data.prepared?.planId && !data.plans.some((p) => p.id === data.prepared.planId)) data.prepared = null;
    return data;
  } catch { storageAvailable = false; return freshState(); }
}
let state = loadState();
function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { storageAvailable = false; } }
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
function showError(element, message) { element.textContent = message; element.hidden = !message; }
function minuteValue(value, max) { const n = Number(value); return Number.isInteger(n) && n >= 1 && n <= max ? n : null; }
function timeToMinute(time) { const match = /^(\d{2}):(\d{2})$/.exec(time); if (!match) return null; const h = Number(match[1]), m = Number(match[2]); return h < 24 && m < 60 ? h * 60 + m : null; }
function clockText(seconds) { const s = Math.max(0, seconds); return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; }
function remainingSeconds() { if (!state.active) return 0; return state.active.status === "paused" ? state.active.remainingSeconds : Math.max(0, Math.ceil((state.active.endsAt - Date.now()) / 1000)); }
function currentMinute() { const now = new Date(); return now.getHours() * 60 + now.getMinutes(); }
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
function focusJourneyPanel() { ui.journeyCard.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "center" }); ui.startButton.focus({ preventScroll: true }); }

function prepareJourney(title, minutes, kind, planId = null) {
  if (state.active) return false;
  state.prepared = { title, minutes, kind, planId };
  state.lastResult = null;
  saveState(); renderAll(); focusJourneyPanel(); return true;
}
function startJourney() {
  if (state.active || !state.prepared) return;
  const { title, minutes, kind, planId } = state.prepared;
  const now = Date.now();
  state.active = { id: `${now}-${Math.random().toString(36).slice(2, 7)}`, title, kind, planId, totalSeconds: minutes * 60, remainingSeconds: minutes * 60, endsAt: now + minutes * 60_000, status: "running" };
  const plan = state.plans.find((entry) => entry.id === planId);
  if (plan) plan.status = "active";
  state.prepared = null; state.lastResult = null; saveState(); renderAll();
}
function rewardFor(minutes) { return minutes >= 45 ? "moon" : minutes >= 25 ? "star" : minutes >= 15 ? "leaf" : "footprint"; }
function finishJourney() {
  if (!state.active) return;
  const journey = state.active, minutes = journey.totalSeconds / 60;
  const plan = state.plans.find((entry) => entry.id === journey.planId);
  if (plan) plan.status = "done";
  let rewardId = null, newFriend = false;
  if (journey.kind === "focus") { rewardId = rewardFor(minutes); state.inventory[rewardId] = Math.max(0, Number(state.inventory[rewardId]) || 0) + 1; state.focusSessions += 1; newFriend = state.focusSessions === 3; }
  state.lastResult = { title: journey.title, minutes, rewardId, newFriend, endedEarly: false };
  state.active = null; saveState(); renderAll();
}
function endEarly() {
  if (!state.active) return;
  const journey = state.active, elapsed = Math.floor((journey.totalSeconds - remainingSeconds()) / 60);
  const plan = state.plans.find((entry) => entry.id === journey.planId);
  if (plan) plan.status = "pending";
  state.lastResult = { title: journey.title, minutes: elapsed, endedEarly: true };
  state.active = null; saveState(); renderAll();
}

function renderTimer() {
  if (!state.active) return;
  const journey = state.active, remaining = remainingSeconds(), elapsed = journey.totalSeconds - remaining;
  const percent = Math.min(100, Math.max(0, Math.round(elapsed / journey.totalSeconds * 100)));
  ui.timer.textContent = clockText(remaining); ui.progressFill.style.width = `${percent}%`; ui.progressTrack.setAttribute("aria-valuenow", String(percent));
  ui.elapsedLabel.textContent = t("travelled", { minutes: Math.floor(elapsed / 60) }); ui.remainingLabel.textContent = t("remaining", { minutes: Math.ceil(remaining / 60) });
  ui.pauseButton.textContent = t(journey.status === "paused" ? "resume" : "pause");
  ui.activeKind.textContent = t(journey.status === "paused" ? "paused" : journey.kind === "daily" ? "dailyExploring" : "focusExploring");
}
function renderSchedule() {
  const plans = [...state.plans].sort((a, b) => a.time.localeCompare(b.time));
  ui.planCount.textContent = t(plans.length === 1 ? "planCountOne" : "planCount", { count: plans.length });
  if (!plans.length) { ui.planList.innerHTML = `<div class="empty-plan"><strong>${t("emptyTitle")}</strong>${t("emptyBody")}</div>`; return; }
  const nowMinute = currentMinute();
  ui.planList.innerHTML = plans.map((plan) => {
    const isDue = timeToMinute(plan.time) <= nowMinute, selected = state.prepared?.planId === plan.id;
    const action = plan.status === "done" ? `<span class="status-text">${t("done")}</span>` : plan.status === "active" ? `<span class="status-text">${t("exploring")}</span>` : selected ? `<span class="status-text">${t("selected")}</span>` : `<button type="button" class="mini-button" data-action="select" data-id="${escapeHTML(plan.id)}" ${state.active ? "disabled" : ""}>${t("selectRoute")}</button>`;
    return `<div class="plan-item ${selected ? "is-selected" : ""}"><span class="plan-time">${escapeHTML(plan.time)}</span><div class="plan-details"><span class="plan-title">${escapeHTML(plan.title)}</span><span class="plan-sub">${t(plan.kind === "daily" ? "daily" : "focus")} · ${plan.minutes} ${t("planUnit")}${isDue && plan.status === "pending" ? ` · ${t("due")}` : ""}</span></div><div class="plan-actions">${action}<button type="button" class="icon-button" data-action="delete" data-id="${escapeHTML(plan.id)}" aria-label="${escapeHTML(t("delete", { title: plan.title }))}" ${plan.status === "active" ? "disabled" : ""}>×</button></div></div>`;
  }).join("");
}
function renderCollection() {
  ui.collection.innerHTML = ITEMS.map((item) => { const count = Math.max(0, Number(state.inventory[item.id]) || 0); return `<div class="collectible ${count ? "" : "empty"}" title="${t(item.range)}"><span class="item-glyph" aria-hidden="true">${item.glyph}</span><span class="item-name">${t(item.name)}</span><span class="item-count">× ${count}</span></div>`; }).join("");
  const found = state.focusSessions >= 3;
  ui.friendCard.classList.toggle("found", found); ui.friendCard.querySelector(".friend-icon").textContent = found ? "✿" : "?";
  ui.friendName.textContent = t(found ? "friendName" : "friendLocked"); ui.friendHint.textContent = t(found ? "friendComplete" : "friendHint", { count: found ? state.focusSessions : 3 - state.focusSessions });
}
function renderFeedback() {
  const result = state.lastResult;
  if (!result) { ui.feedback.innerHTML = ""; return; }
  if (result.endedEarly) { ui.feedback.innerHTML = `<strong>${t("earlyTitle")}</strong>${t(result.minutes ? "earlyMinutes" : "earlyShort", { minutes: result.minutes })}`; return; }
  if (!result.rewardId) { ui.feedback.innerHTML = `<strong>${t("dailyTitle")}</strong>${escapeHTML(t("dailyBody", { title: result.title }))}`; return; }
  const item = ITEMS.find((entry) => entry.id === result.rewardId);
  ui.feedback.innerHTML = `<strong>${t("rewardTitle", { item: item ? t(item.name) : "?" })}</strong>${escapeHTML(t("rewardBody", { title: result.title, minutes: result.minutes }))} ${t(result.newFriend ? "friendFound" : "rewardNext")}`;
}
function renderSceneMeta() {
  const now = new Date();
  ui.motionButton.textContent = t(motionEnabled ? "motionOn" : "motionOff");
  ui.motionButton.setAttribute("aria-label", t("motionAria"));
  ui.motionButton.setAttribute("aria-pressed", String(motionEnabled));
  ui.todayLabel.textContent = new Intl.DateTimeFormat(t("dateLocale"), { month: "long", day: "numeric", weekday: "long" }).format(now);
  ui.sceneClock.textContent = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  if (state.active) {
    const percent = Math.round((state.active.totalSeconds - remainingSeconds()) / state.active.totalSeconds * 100);
    ui.sceneStatus.textContent = state.active.status === "paused" ? t("scenePaused") : t("sceneExploring", { title: state.active.title });
    ui.sceneDistance.textContent = t("trailProgress", { percent }); ui.world.setAttribute("aria-label", t(state.active.status === "paused" ? "petPausedAria" : "petRunningAria")); return;
  }
  if (state.prepared) { ui.sceneStatus.textContent = t("sceneReady", { title: state.prepared.title }); ui.sceneDistance.textContent = t("trailChosen"); }
  else { const due = state.plans.find((plan) => plan.status === "pending" && timeToMinute(plan.time) <= currentMinute()); ui.sceneStatus.textContent = due ? t("sceneDue", { title: due.title }) : t("sceneWaiting"); ui.sceneDistance.textContent = t(due ? "trailDue" : "trailReady"); }
  ui.world.setAttribute("aria-label", t("petWaitingAria"));
}
function renderAll() {
  ui.journeyIdle.hidden = Boolean(state.active || state.prepared || state.lastResult);
  ui.readyView.hidden = !state.prepared || Boolean(state.active);
  ui.activeView.hidden = !state.active;
  ui.resultView.hidden = !state.lastResult || Boolean(state.active || state.prepared);
  if (state.prepared) { ui.readyTask.textContent = state.prepared.title; ui.readyMeta.textContent = t(state.prepared.planId ? "scheduledMeta" : "quickMeta", { minutes: state.prepared.minutes, kind: t(state.prepared.kind === "daily" ? "daily" : "focus") }); }
  if (state.active) ui.activeTask.textContent = state.active.title;
  ui.storageNote.hidden = storageAvailable; if (!storageAvailable) ui.storageNote.textContent = t("storageError");
  renderTimer(); renderSchedule(); renderCollection(); renderFeedback(); renderSceneMeta();
  document.title = state.active ? t("runningTitle", { time: clockText(remainingSeconds()) }) : t("title");
}
function tick() {
  if (state.date !== localDateKey() && !state.active) { state.date = localDateKey(); state.plans = []; state.prepared = null; state.lastResult = null; saveState(); renderAll(); }
  if (state.active?.status === "running" && remainingSeconds() <= 0) finishJourney(); else if (state.active) renderTimer();
  renderSceneMeta(); if (new Date().getSeconds() === 0) renderSchedule();
  if (state.active) document.title = t("runningTitle", { time: clockText(remainingSeconds()) });
}

document.querySelectorAll("[data-lang]").forEach((button) => button.addEventListener("click", () => {
  language = button.dataset.lang === "zh" ? "zh" : "en";
  try { localStorage.setItem(LANGUAGE_KEY, language); } catch { storageAvailable = false; }
  applyLanguage(); showError(ui.instantError, ""); showError(ui.planError, ""); renderAll();
}));
ui.startButton.addEventListener("click", startJourney);
ui.changeButton.addEventListener("click", () => { state.prepared = null; saveState(); renderAll(); });
ui.resultNextButton.addEventListener("click", () => { state.lastResult = null; saveState(); renderAll(); $("routes").scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" }); });
ui.instantForm.addEventListener("submit", (event) => {
  event.preventDefault(); const title = ui.instantTask.value.trim(), minutes = minuteValue(ui.instantMinutes.value, 120);
  if (!title) { showError(ui.instantError, t("instantTaskEmpty")); ui.instantTask.focus(); return; }
  if (!minutes) { showError(ui.instantError, t("instantMinutesInvalid")); ui.instantMinutes.focus(); return; }
  if (state.active) { showError(ui.instantError, t("journeyBusy")); return; }
  showError(ui.instantError, ""); prepareJourney(title, minutes, "focus");
});
document.querySelectorAll(".preset").forEach((button) => button.addEventListener("click", () => { ui.instantMinutes.value = button.dataset.minutes; document.querySelectorAll(".preset").forEach((preset) => preset.setAttribute("aria-pressed", String(preset === button))); showError(ui.instantError, ""); }));
ui.instantMinutes.addEventListener("input", () => document.querySelectorAll(".preset").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.minutes === ui.instantMinutes.value))));
ui.planForm.addEventListener("submit", (event) => {
  event.preventDefault(); const title = ui.planTask.value.trim(), time = ui.planTime.value, minutes = minuteValue(ui.planMinutes.value, 180);
  if (!title) { showError(ui.planError, t("planTaskEmpty")); ui.planTask.focus(); return; }
  if (timeToMinute(time) === null) { showError(ui.planError, t("planTimeEmpty")); ui.planTime.focus(); return; }
  if (!minutes) { showError(ui.planError, t("planMinutesInvalid")); ui.planMinutes.focus(); return; }
  const start = timeToMinute(time);
  if (start + minutes > 1440) { showError(ui.planError, t("planMidnight")); return; }
  if (state.plans.some((plan) => { const other = timeToMinute(plan.time); return start < other + plan.minutes && other < start + minutes; })) { showError(ui.planError, t("planOverlap")); return; }
  showError(ui.planError, ""); state.plans.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, title, time, minutes, kind: ui.planKind.value === "daily" ? "daily" : "focus", status: "pending" });
  ui.planTask.value = ""; saveState(); renderAll();
});
ui.planList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]"); if (!button) return;
  const plan = state.plans.find((entry) => entry.id === button.dataset.id); if (!plan) return;
  if (button.dataset.action === "delete") { if (plan.status === "active") return; state.plans = state.plans.filter((entry) => entry.id !== plan.id); if (state.prepared?.planId === plan.id) state.prepared = null; saveState(); renderAll(); }
  else if (button.dataset.action === "select") { if (state.active) showError(ui.planError, t("journeyBusy")); else { showError(ui.planError, ""); prepareJourney(plan.title, plan.minutes, plan.kind, plan.id); } }
});
ui.pauseButton.addEventListener("click", () => { const journey = state.active; if (!journey) return; if (journey.status === "paused") { journey.status = "running"; journey.endsAt = Date.now() + journey.remainingSeconds * 1000; } else { journey.remainingSeconds = remainingSeconds(); journey.endsAt = null; journey.status = "paused"; } saveState(); renderAll(); });
ui.endButton.addEventListener("click", endEarly);
ui.motionButton.addEventListener("click", () => { motionEnabled = !motionEnabled; try { localStorage.setItem(MOTION_KEY, motionEnabled ? "on" : "off"); } catch { /* Animation still works for this visit. */ } renderSceneMeta(); });

const ctx = ui.world.getContext("2d");
const COLORS = { sky: "#e3e8d9", hill: "#d0dccc", far: "#b5c6b2", ink: "#26382d", light: "#f5f7e9" };
const PET_BODY = ["......#.........", ".....###........", "...#######......", "..#########.....", "..##o##o###.....", "..##########.....", "...#########.....", "######.######...", "..############..", "...##########...", "....#######....."];
function rect(x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h)); }
function drawPet(x, y, step, moving) {
  PET_BODY.forEach((row, rowIndex) => [...row].forEach((pixel, column) => { if (pixel === "#") rect(x + column * 2, y + rowIndex * 2, 2, 2, COLORS.ink); if (pixel === "o") rect(x + column * 2, y + rowIndex * 2, 2, 2, COLORS.light); }));
  const legs = moving ? [[4, 19], [8, 15], [15, 8], [18, 14]][step] : [8, 18];
  rect(x + legs[0], y + 21, 5, 6, COLORS.ink); rect(x + legs[1], y + 21, 5, 6, COLORS.ink);
  rect(x + legs[0] - 2, y + 26, 7, 2, COLORS.ink); rect(x + legs[1] + 1, y + 26, 7, 2, COLORS.ink);
}
function drawWorld(now) {
  if (!ctx) return;
  const moving = state.active?.status === "running" && motionEnabled;
  const travel = moving ? now * .09 : 0;
  rect(0, 0, 320, 160, COLORS.sky);
  rect(229, 24, 19, 19, COLORS.light); rect(231, 21, 15, 3, COLORS.light); rect(231, 43, 15, 3, COLORS.light);
  for (const [baseX, baseY] of [[30, 31], [143, 53], [295, 24]]) { const x = ((baseX - travel * .12) % 380 + 380) % 380 - 25; rect(x, baseY, 23, 4, COLORS.light); rect(x + 5, baseY - 4, 13, 4, COLORS.light); }
  for (let i = -1; i < 4; i++) { const x = i * 112 - (travel * .25 % 112); rect(x, 96, 76, 23, COLORS.hill); rect(x + 13, 86, 49, 10, COLORS.hill); rect(x + 27, 79, 23, 7, COLORS.hill); }
  rect(0, 119, 320, 41, COLORS.far); rect(0, 119, 320, 3, COLORS.ink);
  for (let i = -1; i < 8; i++) { const x = i * 57 - (travel % 57); rect(x + 34, 101, 4, 18, COLORS.ink); rect(x + 28, 96, 16, 5, COLORS.ink); rect(x + 31, 91, 10, 5, COLORS.ink); rect(x + 47, 113, 4, 6, COLORS.ink); }
  for (let i = -1; i < 10; i++) { const x = i * 41 - (travel * 1.5 % 41); rect(x + 11, 139, 15, 2, COLORS.hill); rect(x + 31, 151, 7, 2, COLORS.ink); }
  const petX = moving ? 58 + Math.round(Math.sin(now / 430) * 13) : 58;
  rect(petX - 5, 119, 35, 3, COLORS.ink);
  const step = moving ? Math.floor(now / 105) % 4 : 0;
  const bounce = moving ? [0, -3, 0, -2][step] : !reducedMotion.matches ? Math.round(Math.sin(now / 550)) : 0;
  drawPet(petX, 90 + bounce, step, moving);
  if (moving) { const shift = Math.floor(now / 80) % 3; rect(petX - 19 - shift * 2, 102, 10, 2, COLORS.ink); rect(petX - 25 - shift * 2, 110, 14, 2, COLORS.ink); rect(petX - 11 - shift * 2, 117, 4, 3, COLORS.light); }
  else if (!state.active) { rect(92, 81, 2, 2, COLORS.ink); rect(97, 76, 2, 2, COLORS.ink); rect(102, 81, 2, 2, COLORS.ink); }
  if (state.active?.status === "paused") { rect(96, 76, 3, 9, COLORS.ink); rect(102, 76, 3, 9, COLORS.ink); }
  requestAnimationFrame(drawWorld);
}

const now = new Date(); ui.planTime.value = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
applyLanguage();
if (state.active?.status === "running" && remainingSeconds() <= 0) finishJourney();
renderAll(); setInterval(tick, 1000); document.addEventListener("visibilitychange", tick); requestAnimationFrame(drawWorld);
