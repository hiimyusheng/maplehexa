// Per-level incremental fragment cost (level i → i+1). Max level = 30.
var jintonArray = [
  50, 15, 18, 20, 23, 25, 28, 30, 33, 100, 40, 45, 50, 55, 60, 65, 70, 75, 80,
  175, 85, 90, 95, 100, 105, 110, 115, 120, 125, 250,
];

var skillArray = [
  0, 30, 35, 40, 45, 50, 55, 60, 65, 200, 80, 90, 100, 110, 120, 130, 140, 150,
  160, 350, 170, 180, 190, 200, 210, 220, 230, 240, 250, 500,
];

var strongArray = [
  75, 23, 27, 30, 34, 38, 42, 45, 49, 150, 60, 68, 75, 83, 90, 98, 105, 113,
  120, 263, 128, 135, 143, 150, 158, 165, 173, 180, 188, 375,
];

var commonArray = [
  125, 38, 44, 50, 57, 63, 69, 75, 82, 300, 110, 124, 138, 152, 165, 179, 193,
  207, 220, 525, 234, 248, 262, 275, 289, 303, 317, 330, 344, 750,
];

const CORE_GROUPS = [
  {
    containerId: "cores-skill",
    cores: [
      { id: "skill1", label: "技能核心 1", array: skillArray, max: 4400 },
      { id: "skill2", label: "技能核心 2", array: skillArray, max: 4400 },
    ],
  },
  {
    containerId: "cores-mastery",
    cores: [
      { id: "jinton1", label: "精通核心 1", array: jintonArray, max: 2252 },
      { id: "jinton2", label: "精通核心 2", array: jintonArray, max: 2252 },
      { id: "jinton3", label: "精通核心 3", array: jintonArray, max: 2252 },
      { id: "jinton4", label: "精通核心 4", array: jintonArray, max: 2252 },
    ],
  },
  {
    containerId: "cores-enhance",
    cores: [
      { id: "strong1", label: "強化核心 1", array: strongArray, max: 3383 },
      { id: "strong2", label: "強化核心 2", array: strongArray, max: 3383 },
      { id: "strong3", label: "強化核心 3", array: strongArray, max: 3383 },
      { id: "strong4", label: "強化核心 4", array: strongArray, max: 3383 },
    ],
  },
  {
    containerId: "cores-common",
    cores: [
      { id: "common1", label: "共通核心 1", array: commonArray, max: 6268 },
    ],
  },
];

const ALL_CORES = CORE_GROUPS.flatMap((g) => g.cores);
const COMMON_CORE_IDS = new Set(["common1"]);

const TOTAL_MAX = 37608;

// 逐階段諷刺訊息，挑選「通過門檻中的最高者」。
const TAUNTS = [
  { threshold: 1, text: "那麼少，去唱你的祈禱小米豐收歌啦" },
  { threshold: 100, text: "你等級都比碎片多欸…要不要先去農一下再來算" },
  { threshold: 200, text: "一場lol的小兵數量都比你碎片多" },
  { threshold: 500, text: "是該稱讚你農的不錯，但我不要" },
  { threshold: 1000, text: "誇獎你一下，你真棒嘔嘔嘔嘔嘔嘔" },
  { threshold: 2000, text: "作為玩家你很盡力了很棒，但作為好MS寶，呵廢物" },
  { threshold: 3000, text: "超級武器霸王！要你命三千" },
  { threshold: 4000, text: "破4000，我要派鎖鏈的康妮來對付你！" },
  { threshold: 5000, text: "破5000，沒圖沒證據" },
  { threshold: 6000, text: "破6000，有證據我也不會信" },
  { threshold: 7000, text: "破7000，醒來別做夢" },
  { threshold: 8000, text: "破8…8888888爸爸缺兒子嗎" },
  { threshold: 9000, text: "現代魏忠賢，你這小太監" },
  { threshold: 10000, text: "說謊的孩子沒人要" },
];

function coreRowTemplate(core) {
  return `
    <div>
      <div class="flex items-center gap-3">
        <label for="${core.id}_level" class="text-gray-200 w-24 shrink-0 text-sm sm:text-base">${core.label}</label>
        <input
          id="${core.id}_level"
          type="number"
          min="0"
          max="30"
          placeholder="等級 (0-30)"
          class="input-field rounded-md px-3 py-1.5 flex-1 min-w-0"
        />
      </div>
      <div class="flex items-center gap-4 pl-[6.75rem] mt-1.5 text-xs text-gray-400">
        <span>已用 <span id="${core.id}_consume" class="text-white font-medium">0</span></span>
        <span>還缺 <span id="${core.id}_request" class="text-yellow-300 font-medium">${core.max}</span></span>
      </div>
    </div>
  `;
}

function renderCores() {
  for (const group of CORE_GROUPS) {
    const container = document.getElementById(group.containerId);
    if (!container) continue;
    container.innerHTML = group.cores.map(coreRowTemplate).join("");
  }
}

function clampLevel(raw) {
  const n = parseInt(raw, 10);
  if (isNaN(n) || n < 0) return 0;
  if (n > 30) return 30;
  return n;
}

function consumeFor(level, array) {
  let total = 0;
  for (let i = 0; i < level; i++) total += array[i];
  return total;
}

function pickTaunt(alln1) {
  if (alln1 === TOTAL_MAX) return "誇大了吧臭宅。";
  let msg = "";
  for (const t of TAUNTS) if (alln1 > t.threshold) msg = t.text;
  return msg;
}

function go() {
  const consumes = {};
  let totalConsume = 0;
  let commonConsume = 0;
  let totalRequest = 0;

  for (const core of ALL_CORES) {
    const level = clampLevel(document.getElementById(`${core.id}_level`).value);
    const consume = consumeFor(level, core.array);
    const request = core.max - consume;

    document.getElementById(`${core.id}_consume`).textContent = consume;
    document.getElementById(`${core.id}_request`).textContent = request;

    consumes[core.id] = consume;
    totalConsume += consume;
    totalRequest += request;
    if (COMMON_CORE_IDS.has(core.id)) commonConsume += consume;
  }

  let havePieces = parseInt(document.getElementById("havePieces").value, 10);
  if (isNaN(havePieces)) havePieces = 0;

  const alln1 = totalConsume + havePieces;
  const alln2 = totalRequest - havePieces;

  document.getElementById("all").textContent = alln1;
  document.getElementById("all2").textContent = alln2;
  document.getElementById("ooo1").textContent = (alln1 / 376.08).toFixed(2) + "%";
  document.getElementById("ppp1").textContent =
    ((alln1 - commonConsume) / 313.4).toFixed(2) + "%";
  document.getElementById("vvv").value = alln1;
  document.getElementById("xxx").value = alln1 - commonConsume;

  document.getElementById("no1").textContent = pickTaunt(alln1);
  document.getElementById("no2").style.display = "inline-block";
  document.getElementById("no3").style.display = "inline-block";

  if (window.updateChart) {
    window.updateChart(
      consumes.skill1,
      consumes.skill2,
      consumes.jinton1,
      consumes.jinton2,
      consumes.jinton3,
      consumes.jinton4,
      consumes.strong1,
      consumes.strong2,
      consumes.strong3,
      consumes.strong4,
      consumes.common1
    );
  }
}

document.addEventListener("DOMContentLoaded", renderCores);
