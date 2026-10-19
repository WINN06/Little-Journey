const STORAGE_KEY = "little-journey-state-v1";
const $ = (id) => document.getElementById(id);
const ui = {
  todayLabel: $("todayLabel"), sceneClock: $("sceneClock"), sceneStatus: $("sceneStatus"), sceneDistance: $("sceneDistance"),
  world: $("world"), instantForm: $("instantForm"), instantTask: $("instantTask"), instantMinutes: $("instantMinutes"),
  instantError: $("instantError"), activeView: $("activeView"), activeKind: $("activeKind"), activeTask: $("activeTask"),
  timer: $("timer"), progressTrack: $("progressTrack"), progressFill: $("progressFill"), elapsedLabel: $("elapsedLabel"),
  remainingLabel: $("remainingLabel"), pauseButton: $("pauseButton"), endButton: $("endButton"), feedback: $("feedback"),
  planForm: $("planForm"), planTask: $("planTask"), planTime: $("planTime"), planMinutes: $("planMinutes"),
  planKind: $("planKind"), planError: $("planError"), planList: $("planList"), planCount: $("planCount"),
  collection: $("collection"), friendCard: $("friendCard"), friendName: $("friendName"), friendHint: $("friendHint")
};

const ITEMS = [
  { id: "footprint", name: "小脚印", glyph: "▪", threshold: "1–14 分钟" },
  { id: "leaf", name: "叶片", glyph: "✳", threshold: "15–24 分钟" },
  { id: "star", name: "星石", glyph: "✦", threshold: "25–44 分钟" },
  { id: "moon", name: "月贝", glyph: "☾", threshold: "45 分钟以上" }
];

function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function freshState() {
  return { date: localDateKey(), plans: [], inventory: { footprint: 0, leaf: 0, star: 0, moon: 0 }, focusSessions: 0, active: null, lastResult: null };
}

let storageAvailable = true;
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || typeof saved !== "object") return freshState();
    const base = freshState();
    const state = {
      date: typeof saved.date === "string" ? saved.date : base.date,
      plans: Array.isArray(saved.plans) ? saved.plans.filter((plan) => plan && typeof plan.title === "string" && typeof plan.time === "string") : [],
      inventory: { ...base.inventory, ...(saved.inventory || {}) },
      focusSessions: Number.isFinite(saved.focusSessions) ? saved.focusSessions : 0,
      active: saved.active && typeof saved.active === "object" ? saved.active : null,
      lastResult: saved.lastResult || null
    };
    if (state.date !== base.date) {
      state.date = base.date;
      state.plans = [];
      state.lastResult = null;
    }
    return state;
  } catch {
    storageAvailable = false;
    return freshState();
  }
}

let state = loadState();
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { storageAvailable = false; }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function showError(element, message) {
  element.textContent = message;
  element.hidden = !message;
}

function minuteValue(value, max) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= max ? number : null;
}

function timeToMinute(time) {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours < 24 && minutes < 60 ? hours * 60 + minutes : null;
}

function clockText(seconds) {
  const safe = Math.max(0, seconds);
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

function remainingSeconds() {
  if (!state.active) return 0;
  if (state.active.status === "paused") return state.active.remainingSeconds;
  return Math.max(0, Math.ceil((state.active.endsAt - Date.now()) / 1000));
}

function startJourney(title, minutes, kind, planId = null) {
  if (state.active) return false;
  const now = Date.now();
  state.active = {
    id: `${now}-${Math.random().toString(36).slice(2, 7)}`,
    title, kind, planId, totalSeconds: minutes * 60, remainingSeconds: minutes * 60,
    endsAt: now + minutes * 60_000, status: "running"
  };
  const plan = state.plans.find((entry) => entry.id === planId);
  if (plan) plan.status = "active";
  state.lastResult = null;
  saveState();
  renderAll();
  return true;
}

function rewardFor(minutes) {
  if (minutes >= 45) return "moon";
  if (minutes >= 25) return "star";
  if (minutes >= 15) return "leaf";
  return "footprint";
}

function finishJourney() {
  if (!state.active) return;
  const journey = state.active;
  const minutes = journey.totalSeconds / 60;
  const plan = state.plans.find((entry) => entry.id === journey.planId);
  if (plan) plan.status = "done";
  let rewardId = null;
  let newFriend = false;
  if (journey.kind === "focus") {
    rewardId = rewardFor(minutes);
    state.inventory[rewardId] = Math.max(0, Number(state.inventory[rewardId]) || 0) + 1;
    state.focusSessions += 1;
    newFriend = state.focusSessions === 3;
  }
  state.lastResult = { title: journey.title, minutes, rewardId, newFriend, endedEarly: false };
  state.active = null;
  saveState();
  renderAll();
}

function endEarly() {
  if (!state.active) return;
  const journey = state.active;
  const elapsed = Math.floor((journey.totalSeconds - remainingSeconds()) / 60);
  const plan = state.plans.find((entry) => entry.id === journey.planId);
  if (plan) plan.status = "pending";
  state.lastResult = { title: journey.title, minutes: elapsed, endedEarly: true };
  state.active = null;
  saveState();
  renderAll();
}

function renderTimer() {
  const journey = state.active;
  if (!journey) return;
  const remaining = remainingSeconds();
  const elapsed = journey.totalSeconds - remaining;
  const percent = Math.min(100, Math.max(0, Math.round(elapsed / journey.totalSeconds * 100)));
  ui.timer.textContent = clockText(remaining);
  ui.progressFill.style.width = `${percent}%`;
  ui.progressTrack.setAttribute("aria-valuenow", String(percent));
  ui.elapsedLabel.textContent = `已走过 ${Math.floor(elapsed / 60)} 分钟`;
  ui.remainingLabel.textContent = `剩余 ${Math.ceil(remaining / 60)} 分钟`;
  ui.pauseButton.textContent = journey.status === "paused" ? "▶ 继续远行" : "Ⅱ 暂停一下";
  ui.activeKind.textContent = journey.status === "paused" ? "旅程暂时暂停" : journey.kind === "daily" ? "日常探索中" : "专注探索中";
}

function currentMinute() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function renderSchedule() {
  const plans = [...state.plans].sort((a, b) => a.time.localeCompare(b.time));
  ui.planCount.textContent = `${plans.length} 项安排`;
  if (!plans.length) {
    ui.planList.innerHTML = '<div class="empty-plan"><strong>今天的路线还是空的</strong>先写下一件小事，让旅程从这里开始。</div>';
    return;
  }
  const nowMinute = currentMinute();
  ui.planList.innerHTML = plans.map((plan) => {
    const isDue = timeToMinute(plan.time) <= nowMinute;
    const activeElsewhere = Boolean(state.active);
    const action = plan.status === "done"
      ? '<span class="status-text">已完成 ✓</span>'
      : plan.status === "active"
        ? '<span class="status-text">探索中 ···</span>'
        : `<button type="button" class="mini-button" data-action="start" data-id="${escapeHTML(plan.id)}" ${activeElsewhere ? "disabled" : ""}>${isDue ? "现在出发" : "提前出发"}</button>`;
    return `<div class="plan-item">
      <span class="plan-time">${escapeHTML(plan.time)}</span>
      <div class="plan-details"><span class="plan-title">${escapeHTML(plan.title)}</span><span class="plan-sub">${plan.kind === "daily" ? "日常" : "专注"} · ${plan.minutes} 分钟${isDue && plan.status === "pending" ? " · 已到时间" : ""}</span></div>
      <div class="plan-actions">${action}<button type="button" class="icon-button" data-action="delete" data-id="${escapeHTML(plan.id)}" aria-label="删除${escapeHTML(plan.title)}" ${plan.status === "active" ? "disabled" : ""}>×</button></div>
    </div>`;
  }).join("");
}

function renderCollection() {
  ui.collection.innerHTML = ITEMS.map((item) => {
    const count = Math.max(0, Number(state.inventory[item.id]) || 0);
    return `<div class="collectible ${count ? "" : "empty"}" title="${item.threshold}"><span class="item-glyph" aria-hidden="true">${item.glyph}</span><span class="item-name">${item.name}</span><span class="item-count">× ${count}</span></div>`;
  }).join("");
  const found = state.focusSessions >= 3;
  ui.friendCard.classList.toggle("found", found);
  ui.friendCard.querySelector(".friend-icon").textContent = found ? "✿" : "?";
  ui.friendName.textContent = found ? "遇见了小苔" : "还未遇见的朋友";
  ui.friendHint.textContent = found ? `你们已一起完成 ${state.focusSessions} 次专注远行。` : `再完成 ${3 - state.focusSessions} 次专注远行，或许会相遇。`;
}

function renderFeedback() {
  const result = state.lastResult;
  if (!result && storageAvailable) { ui.feedback.hidden = true; return; }
  let content = "";
  if (result?.endedEarly) {
    content = `<strong>小伙伴平安回来了。</strong>${result.minutes ? `这次走了 ${result.minutes} 分钟。` : "这次先走了一小段。"}想继续时，随时可以重新出发。`;
  } else if (result?.rewardId) {
    const reward = ITEMS.find((item) => item.id === result.rewardId);
    content = `<strong>远行完成，带回了「${reward.name}」！</strong>你为「${escapeHTML(result.title)}」留出了 ${result.minutes} 分钟。${result.newFriend ? " 这次还遇见了新朋友「小苔」！" : " 接下来想去哪儿？"}`;
  } else if (result) {
    content = `<strong>日常旅程完成！</strong>「${escapeHTML(result.title)}」结束了，小伙伴在起点等你的下一段安排。`;
  }
  if (!storageAvailable) content += `${content ? "<br>" : ""}浏览器暂时无法保存数据；刷新页面后记录可能消失。`;
  ui.feedback.innerHTML = content;
  ui.feedback.hidden = !content;
}

function renderSceneMeta() {
  const now = new Date();
  ui.todayLabel.textContent = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(now);
  ui.sceneClock.textContent = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const journey = state.active;
  if (journey) {
    const percent = Math.round((journey.totalSeconds - remainingSeconds()) / journey.totalSeconds * 100);
    ui.sceneStatus.textContent = journey.status === "paused" ? "在路边稍作休息" : `正在探索：${journey.title}`;
    ui.sceneDistance.textContent = `旅途 · ${percent}%`;
    ui.world.setAttribute("aria-label", journey.status === "paused" ? "像素小宠物暂停探索，在路边休息" : "像素小宠物正在横版场景中奔跑探索");
    return;
  }
  const due = state.plans.find((plan) => plan.status === "pending" && timeToMinute(plan.time) <= currentMinute());
  ui.sceneStatus.textContent = due ? `「${due.title}」可以出发了` : "小伙伴正在等你";
  ui.sceneDistance.textContent = due ? "今日路线 · 准备出发" : "起点 · 还未出发";
  ui.world.setAttribute("aria-label", "像素小宠物在草地上等待出发");
}

function renderAll() {
  ui.instantForm.hidden = Boolean(state.active);
  ui.activeView.hidden = !state.active;
  if (state.active) ui.activeTask.textContent = state.active.title;
  renderTimer();
  renderSchedule();
  renderCollection();
  renderFeedback();
  renderSceneMeta();
  document.title = state.active ? `${clockText(remainingSeconds())} · 小小远行` : "小小远行 · 像素宠物专注钟";
}

function tick() {
  if (state.date !== localDateKey() && !state.active) {
    state.date = localDateKey();
    state.plans = [];
    state.lastResult = null;
    saveState();
    renderAll();
  }
  if (state.active?.status === "running" && remainingSeconds() <= 0) finishJourney();
  else if (state.active) renderTimer();
  renderSceneMeta();
  const now = new Date();
  if (now.getSeconds() === 0) renderSchedule();
  if (state.active) document.title = `${clockText(remainingSeconds())} · 小小远行`;
}

ui.instantForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = ui.instantTask.value.trim();
  const minutes = minuteValue(ui.instantMinutes.value, 120);
  if (!title) { showError(ui.instantError, "先写下这次要做的事，再和小伙伴出发。"); ui.instantTask.focus(); return; }
  if (!minutes) { showError(ui.instantError, "请输入 1–120 分钟的整数时长。"); ui.instantMinutes.focus(); return; }
  showError(ui.instantError, "");
  startJourney(title, minutes, "focus");
});

document.querySelectorAll(".preset").forEach((button) => button.addEventListener("click", () => {
  ui.instantMinutes.value = button.dataset.minutes;
  document.querySelectorAll(".preset").forEach((preset) => preset.setAttribute("aria-pressed", String(preset === button)));
  showError(ui.instantError, "");
}));
ui.instantMinutes.addEventListener("input", () => document.querySelectorAll(".preset").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.minutes === ui.instantMinutes.value))));

ui.planForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = ui.planTask.value.trim();
  const time = ui.planTime.value;
  const minutes = minuteValue(ui.planMinutes.value, 180);
  if (!title) { showError(ui.planError, "给这段路线起个名字吧。"); ui.planTask.focus(); return; }
  if (timeToMinute(time) === null) { showError(ui.planError, "请选择开始时间。"); ui.planTime.focus(); return; }
  if (!minutes) { showError(ui.planError, "时长需要是 1–180 分钟的整数。"); ui.planMinutes.focus(); return; }
  const start = timeToMinute(time);
  if (start + minutes > 24 * 60) { showError(ui.planError, "这段安排会跨过午夜，请缩短时长或提前开始。"); return; }
  const overlap = state.plans.some((plan) => {
    const otherStart = timeToMinute(plan.time);
    return start < otherStart + plan.minutes && otherStart < start + minutes;
  });
  if (overlap) { showError(ui.planError, "这段时间已有安排，请换个时间或调整时长。"); return; }
  showError(ui.planError, "");
  state.plans.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, title, time, minutes, kind: ui.planKind.value === "daily" ? "daily" : "focus", status: "pending" });
  ui.planTask.value = "";
  saveState();
  renderAll();
});

ui.planList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const plan = state.plans.find((entry) => entry.id === button.dataset.id);
  if (!plan) return;
  if (button.dataset.action === "delete") {
    if (plan.status === "active") return;
    state.plans = state.plans.filter((entry) => entry.id !== plan.id);
    saveState();
    renderAll();
  } else if (button.dataset.action === "start") {
    if (plan.status === "done") return;
    if (!startJourney(plan.title, plan.minutes, plan.kind, plan.id)) showError(ui.planError, "先完成或结束当前旅程，再开始下一段。");
    else showError(ui.planError, "");
  }
});

ui.pauseButton.addEventListener("click", () => {
  const journey = state.active;
  if (!journey) return;
  if (journey.status === "paused") {
    journey.status = "running";
    journey.endsAt = Date.now() + journey.remainingSeconds * 1000;
  } else {
    journey.remainingSeconds = remainingSeconds();
    journey.endsAt = null;
    journey.status = "paused";
  }
  saveState();
  renderAll();
});
ui.endButton.addEventListener("click", endEarly);

const ctx = ui.world.getContext("2d");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const COLORS = { sky: "#e3e8d9", hill: "#d0dccc", far: "#b5c6b2", ink: "#26382d", light: "#f5f7e9" };
const PET_FRAMES = [
  ["......#.........", ".....###........", "...#######......", "..#########.....", "..##o##o###.....", "..##########.....", "...#########.....", "######.######...", "..############..", "...##########...", "....#######.....", "....##..##......", "...###..###.....", "...##....##....."],
  ["......#.........", ".....###........", "...#######......", "..#########.....", "..##o##o###.....", "..##########.....", "...#########.....", "######.######...", "..############..", "...##########...", "....#######.....", "...###...###....", "....##..##......", "....##...##....."]
];

function rect(x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h)); }
function drawPet(x, y, frame) {
  const sprite = PET_FRAMES[frame];
  sprite.forEach((row, rowIndex) => [...row].forEach((pixel, column) => {
    if (pixel === "#") rect(x + column * 2, y + rowIndex * 2, 2, 2, COLORS.ink);
    if (pixel === "o") rect(x + column * 2, y + rowIndex * 2, 2, 2, COLORS.light);
  }));
}

function drawWorld(now) {
  if (!ctx) return;
  const moving = state.active?.status === "running" && !reducedMotion.matches;
  const travel = moving ? now * .025 : 0;
  rect(0, 0, 320, 160, COLORS.sky);
  rect(229, 24, 19, 19, COLORS.light);
  rect(231, 21, 15, 3, COLORS.light);
  rect(231, 43, 15, 3, COLORS.light);
  for (const [baseX, baseY] of [[30, 31], [143, 53], [295, 24]]) {
    const x = ((baseX - travel * .16) % 380 + 380) % 380 - 25;
    rect(x, baseY, 23, 4, COLORS.light);
    rect(x + 5, baseY - 4, 13, 4, COLORS.light);
  }
  for (let i = -1; i < 4; i++) {
    const x = i * 112 - (travel * .28 % 112);
    rect(x, 96, 76, 23, COLORS.hill);
    rect(x + 13, 86, 49, 10, COLORS.hill);
    rect(x + 27, 79, 23, 7, COLORS.hill);
  }
  rect(0, 119, 320, 41, COLORS.far);
  rect(0, 119, 320, 3, COLORS.ink);
  for (let i = -1; i < 7; i++) {
    const x = i * 66 - (travel % 66);
    rect(x + 34, 101, 4, 18, COLORS.ink);
    rect(x + 28, 96, 16, 5, COLORS.ink);
    rect(x + 31, 91, 10, 5, COLORS.ink);
    rect(x + 47, 113, 4, 6, COLORS.ink);
    rect(x + 51, 116, 3, 3, COLORS.ink);
  }
  for (let i = -1; i < 9; i++) {
    const x = i * 44 - (travel * 1.35 % 44);
    rect(x + 11, 139, 15, 2, COLORS.hill);
    rect(x + 31, 151, 7, 2, COLORS.ink);
  }
  rect(53, 119, 31, 3, COLORS.ink);
  const bounce = moving ? Math.round(Math.sin(now / 110) * 2) : !reducedMotion.matches ? Math.round(Math.sin(now / 550)) : 0;
  drawPet(54, 90 + bounce, moving && Math.floor(now / 140) % 2 ? 1 : 0);
  if (!moving && !state.active) {
    rect(87, 81, 2, 2, COLORS.ink);
    rect(92, 76, 2, 2, COLORS.ink);
    rect(97, 81, 2, 2, COLORS.ink);
  }
  if (state.active?.status === "paused") {
    rect(91, 76, 3, 9, COLORS.ink);
    rect(97, 76, 3, 9, COLORS.ink);
  }
  requestAnimationFrame(drawWorld);
}

const now = new Date();
ui.planTime.value = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
if (state.active?.status === "running" && remainingSeconds() <= 0) finishJourney();
renderAll();
setInterval(tick, 1000);
document.addEventListener("visibilitychange", tick);
requestAnimationFrame(drawWorld);
