const VOCABULARY = Array.isArray(window.NCE_VOCABULARY) ? window.NCE_VOCABULARY : [];
const STORAGE_KEY = "nce-word-practice-state-v1";
const PROFILE_STORAGE_KEY = "nce-word-practice-profiles-v1";
const MODES = ["enToCn", "cnToEn", "spell", "initials", "sentence", "listen", "dictation", "speak", "judge"];

const dom = {
  brandEyebrow: document.querySelector(".brand .eyebrow"),
  brandTitle: document.querySelector(".brand h1"),
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  interfaceModeButtons: document.querySelectorAll("[data-interface-mode]"),
  themeSelects: document.querySelectorAll("[data-theme-select]"),
  themeColorMeta: document.querySelector('meta[name="theme-color"]'),
  topActions: document.querySelector(".top-actions"),
  bookSelect: document.querySelector("#bookSelect"),
  lessonSelect: document.querySelector("#lessonSelect"),
  lessonRangeInput: document.querySelector("#lessonRangeInput"),
  orderSelect: document.querySelector("#orderSelect"),
  modeSelect: document.querySelector("#modeSelect"),
  groupSizeSelect: document.querySelector("#groupSizeSelect"),
  missionCards: document.querySelectorAll(".mission-card"),
  childCoach: document.querySelector("#childCoach"),
  childCoachTitle: document.querySelector("#childCoachTitle"),
  childCoachText: document.querySelector("#childCoachText"),
  startDailyButton: document.querySelector("#startDailyButton"),
  extendTodayButton: document.querySelector("#extendTodayButton"),
  dueTaskCount: document.querySelector("#dueTaskCount"),
  newTaskCount: document.querySelector("#newTaskCount"),
  weakTaskCount: document.querySelector("#weakTaskCount"),
  freeTaskCount: document.querySelector("#freeTaskCount"),
  dailyStrip: document.querySelector("#dailyStrip"),
  dailyTitle: document.querySelector("#dailyTitle"),
  dailyText: document.querySelector("#dailyText"),
  dailyBar: document.querySelector("#dailyBar"),
  questionMeta: document.querySelector("#questionMeta"),
  questionTitle: document.querySelector("#questionTitle"),
  promptBox: document.querySelector("#promptBox"),
  answerArea: document.querySelector("#answerArea"),
  feedback: document.querySelector("#feedback"),
  speakButton: document.querySelector("#speakButton"),
  skipButton: document.querySelector("#skipButton"),
  nextButton: document.querySelector("#nextButton"),
  streakCount: document.querySelector("#streakCount"),
  accuracyNow: document.querySelector("#accuracyNow"),
  wrongCount: document.querySelector("#wrongCount"),
  groupCount: document.querySelector("#groupCount"),
  reinforceCount: document.querySelector("#reinforceCount"),
  rewardBox: document.querySelector("#rewardBox"),
  wrongList: document.querySelector("#wrongList"),
  practiceWrongButton: document.querySelector("#practiceWrongButton"),
  statsGrid: document.querySelector("#statsGrid"),
  parentAdvice: document.querySelector("#parentAdvice"),
  weeklyChart: document.querySelector("#weeklyChart"),
  weakLessonList: document.querySelector("#weakLessonList"),
  weakWordList: document.querySelector("#weakWordList"),
  bookProgress: document.querySelector("#bookProgress"),
  interfaceModeSelect: document.querySelector("#interfaceModeSelect"),
  dailyGoalInput: document.querySelector("#dailyGoalInput"),
  dailyNewInput: document.querySelector("#dailyNewInput"),
  autoSpeakInput: document.querySelector("#autoSpeakInput"),
  settingsShortcut: document.querySelector("#settingsShortcut"),
  parentStatsButton: document.querySelector("#parentStatsButton"),
  exportButton: document.querySelector("#exportButton"),
  importInput: document.querySelector("#importInput"),
  resetButton: document.querySelector("#resetButton"),
  initializeButton: document.querySelector("#initializeButton"),
  profileSelect: document.querySelector("#profileSelect"),
  manageProfilesButton: document.querySelector("#manageProfilesButton"),
  profileModal: document.querySelector("#profileModal"),
  closeProfileModal: document.querySelector("#closeProfileModal"),
  newProfileNameInput: document.querySelector("#newProfileNameInput"),
  createProfileButton: document.querySelector("#createProfileButton"),
  renameProfileInput: document.querySelector("#renameProfileInput"),
  renameProfileButton: document.querySelector("#renameProfileButton"),
  profileList: document.querySelector("#profileList"),
  groupSummaryModal: document.querySelector("#groupSummaryModal"),
  groupSummaryTitle: document.querySelector("#groupSummaryTitle"),
  groupSummaryAdvice: document.querySelector("#groupSummaryAdvice"),
  groupSummaryStats: document.querySelector("#groupSummaryStats"),
  groupSummaryWords: document.querySelector("#groupSummaryWords"),
  closeGroupSummary: document.querySelector("#closeGroupSummary"),
  startNextGroupButton: document.querySelector("#startNextGroupButton")
};

const UI_THEMES = [
  { id: "default", label: "默认练习" },
  { id: "wild-kingdom", label: "荒野遗迹" },
  { id: "ember-fellowship", label: "中土远征" },
  { id: "pocket-future", label: "未来口袋" }
];

const THEME_COLORS = {
  default: "#1e88e5",
  "wild-kingdom": "#1f8f7a",
  "ember-fellowship": "#8c4e2b",
  "pocket-future": "#2086d7"
};

const THEME_COPY = {
  default: {
    brandEyebrow: "New Concept Words",
    brandTitle: "新概念单词练习",
    tabs: { practice: "练习", wrong: "错词本", stats: "统计" },
    settingsButton: "设置",
    missions: { due: "今日复习", new: "学新词", weak: "错词强化", free: "自由练习" },
    coachTitle: "今日目标",
    coachIdleTitle: "今日任务",
    startDaily: "开始今日任务",
    continueDaily: "继续巩固",
    extendGoal: "加练 10 题",
    extendNew: "加学 5 个新词",
    extendBoth: "加练 10 题 + 新词 5 个",
    dailyDone: "今日已完成",
    dailyTodo: "今日未完成",
    noQuestionMeta: "没有可练习的单词",
    empty: {
      due: "今日复习已清空",
      new: "今日新词额度已完成",
      weak: "当前范围没有薄弱词",
      wrong: "当前范围没有错词",
      free: "请选择有单词的范围"
    },
    feedback: {
      good: "答对了",
      bad: "再记一次",
      reinforce: "已加入强化循环：再做 2 题，第 3 题回来。"
    },
    rewards: {
      empty: "完成练习后出现",
      streak: (count) => `连对 ${count} 题，获得星能徽章`,
      streakDetail: "保持节奏，单词正在变熟。",
      goal: "今日目标完成，获得满格能量卡",
      goalDetail: "今天的基础量已经达标。",
      group: (count) => `完成一组 ${count} 题`,
      groupDetail: (rate) => `本组正确率 ${rate}%。`,
      fallback: "获得奖励",
      fallbackDetail: "继续积累小胜利。"
    },
    summary: {
      eyebrow: "Group Complete",
      noWrong: "本组没有错题，节奏很好。",
      wrongTitle: "本组错题",
      title: (done, rate) => `完成 ${done} 题，正确率 ${rate}%`,
      completeInline: (done, correct) => `本组完成：${done} 题，正确 ${correct} 题。`
    }
  },
  "wild-kingdom": {
    brandEyebrow: "Ruins Word Trial",
    brandTitle: "荒野单词试炼",
    tabs: { practice: "试炼", wrong: "怪物图鉴", stats: "冒险记录" },
    settingsButton: "背包",
    missions: { due: "古塔复习", new: "新词采集", weak: "弱点营地", free: "自由探索" },
    coachTitle: "今日试炼",
    coachIdleTitle: "营地任务",
    startDaily: "进入试炼",
    continueDaily: "继续探索",
    extendGoal: "加开 10 个试炼格",
    extendNew: "再采 5 个新词",
    extendBoth: "加开试炼 + 新词采集",
    dailyDone: "试炼已点亮",
    dailyTodo: "试炼进行中",
    noQuestionMeta: "石板暂时没有新线索",
    empty: {
      due: "古塔复习已经清空",
      new: "今日新词采集已完成",
      weak: "这片营地没有弱点词",
      wrong: "当前图鉴没有错词怪",
      free: "请选择有单词的探索范围"
    },
    feedback: {
      good: "命中弱点",
      bad: "标记怪物",
      reinforce: "已放入回访路线：再走 2 格，第 3 格回来。"
    },
    rewards: {
      empty: "宝箱等待开启",
      streak: (count) => `连对 ${count} 题，点亮古代徽章`,
      streakDetail: "像完成一座小神庙一样稳定。",
      goal: "今日试炼完成，获得能量核心",
      goalDetail: "基础路线已经点亮，可以轻松收队。",
      group: (count) => `完成一轮荒野挑战 ${count} 题`,
      groupDetail: (rate) => `本轮命中率 ${rate}%。`,
      fallback: "获得试炼奖励",
      fallbackDetail: "把小胜利装进背包。"
    },
    summary: {
      eyebrow: "Trial Complete",
      noWrong: "本轮没有掉落错题，路线很稳。",
      wrongTitle: "营地回访清单",
      title: (done, rate) => `试炼 ${done} 题，命中率 ${rate}%`,
      completeInline: (done, correct) => `试炼完成：${done} 题，命中 ${correct} 题。`
    }
  },
  "ember-fellowship": {
    brandEyebrow: "Fellowship Word Quest",
    brandTitle: "远征单词旅记",
    tabs: { practice: "远征", wrong: "暗影册", stats: "旅队记录" },
    settingsButton: "日志",
    missions: { due: "旅途复习", new: "新词招募", weak: "暗影清理", free: "自由巡游" },
    coachTitle: "今日远征",
    coachIdleTitle: "旅队任务",
    startDaily: "启程",
    continueDaily: "继续巡游",
    extendGoal: "再行 10 步",
    extendNew: "招募 5 个新词",
    extendBoth: "再行 10 步 + 新词 5 个",
    dailyDone: "远征已抵达",
    dailyTodo: "远征路上",
    noQuestionMeta: "地图上暂时没有新标记",
    empty: {
      due: "旅途复习已经清空",
      new: "今日新词招募已完成",
      weak: "当前区域没有暗影词",
      wrong: "暗影册里没有错词",
      free: "请选择有单词的巡游范围"
    },
    feedback: {
      good: "火光照亮",
      bad: "暗影标记",
      reinforce: "已写入回程路线：再做 2 题，第 3 题回访。"
    },
    rewards: {
      empty: "徽章盒等待点亮",
      streak: (count) => `连对 ${count} 题，获得火种徽章`,
      streakDetail: "旅队节奏很稳，继续向前。",
      goal: "今日远征完成，获得补给章",
      goalDetail: "今天的基础行程已经抵达。",
      group: (count) => `完成一段远征 ${count} 题`,
      groupDetail: (rate) => `本段正确率 ${rate}%。`,
      fallback: "获得远征奖励",
      fallbackDetail: "旅队又收下一枚小徽记。"
    },
    summary: {
      eyebrow: "Quest Complete",
      noWrong: "本段没有暗影残留，可以继续前进。",
      wrongTitle: "暗影回访清单",
      title: (done, rate) => `远征 ${done} 题，正确率 ${rate}%`,
      completeInline: (done, correct) => `远征完成：${done} 题，点亮 ${correct} 题。`
    }
  },
  "pocket-future": {
    brandEyebrow: "Pocket Word Lab",
    brandTitle: "未来口袋单词机",
    tabs: { practice: "充能", wrong: "维修箱", stats: "实验记录" },
    settingsButton: "控制台",
    missions: { due: "记忆充能", new: "新词胶囊", weak: "错词修理", free: "自由实验" },
    coachTitle: "今日充能",
    coachIdleTitle: "口袋任务",
    startDaily: "开始充能",
    continueDaily: "继续实验",
    extendGoal: "追加 10 格能量",
    extendNew: "再装 5 个胶囊",
    extendBoth: "追加能量 + 胶囊 5 个",
    dailyDone: "能量满格",
    dailyTodo: "正在充能",
    noQuestionMeta: "口袋机器暂时没有新题",
    empty: {
      due: "记忆充能已经满格",
      new: "今日新词胶囊已装满",
      weak: "维修箱里没有薄弱词",
      wrong: "当前没有需要维修的错词",
      free: "请选择有单词的实验范围"
    },
    feedback: {
      good: "充能成功",
      bad: "需要维修",
      reinforce: "已放入维修循环：再做 2 题，第 3 题回来。"
    },
    rewards: {
      empty: "口袋收藏槽空着",
      streak: (count) => `连对 ${count} 题，获得鼓励星章`,
      streakDetail: "记忆灯越来越亮。",
      goal: "今日充能完成，获得满格电池",
      goalDetail: "今天的基础能量已经达标。",
      group: (count) => `完成一次口袋实验 ${count} 题`,
      groupDetail: (rate) => `本次稳定率 ${rate}%。`,
      fallback: "获得口袋奖励",
      fallbackDetail: "把小胜利放进口袋。"
    },
    summary: {
      eyebrow: "Lab Complete",
      noWrong: "本次没有需要维修的错词，机器状态很好。",
      wrongTitle: "维修回访清单",
      title: (done, rate) => `实验 ${done} 题，稳定率 ${rate}%`,
      completeInline: (done, correct) => `实验完成：${done} 题，稳定 ${correct} 题。`
    }
  }
};

const THEME_QUESTION_COPY = {
  default: {
    titles: {
      enToCn: "英文选中文",
      cnToEn: "中文选英文",
      listen: "听音选义",
      sentence: "例句填空",
      dictation: "听音拼写",
      speak: "跟读练习",
      judge: "判断对错",
      initials: "首字母填空",
      spell: "单词填空"
    },
    prompts: {
      listen: "听发音",
      dictation: "听发音，拼单词"
    },
    answers: {
      placeholder: "输入英文单词",
      submit: "提交",
      judgeTrue: "对",
      judgeFalse: "不对",
      speakOk: "读对了",
      speakRetry: "再练一次",
      startSpeech: "开始跟读",
      speechReady: "准备好后点击开始。",
      speechListening: "正在听...",
      speechResult: "识别结果",
      speechEmpty: "未识别",
      speechFailed: "没有识别成功，可以再试一次。"
    }
  },
  "wild-kingdom": {
    titles: {
      enToCn: "符文译义",
      cnToEn: "石板寻词",
      listen: "听声辨物",
      sentence: "旅途填词",
      dictation: "听音刻写",
      speak: "营地跟读",
      judge: "图鉴判断",
      initials: "首字母线索",
      spell: "词义刻写"
    },
    prompts: {
      listen: "听石板发音",
      dictation: "听石板发音，刻下单词"
    },
    answers: {
      placeholder: "刻下英文单词",
      submit: "确认",
      judgeTrue: "匹配",
      judgeFalse: "不匹配",
      speakOk: "读准了",
      speakRetry: "再练一次",
      startSpeech: "开始跟读",
      speechReady: "准备好后点亮石板。",
      speechListening: "正在听...",
      speechResult: "石板识别",
      speechEmpty: "未识别",
      speechFailed: "石板没有听清，可以再试一次。"
    }
  },
  "ember-fellowship": {
    titles: {
      enToCn: "译读卷轴",
      cnToEn: "寻找译名",
      listen: "听声辨义",
      sentence: "旅记填词",
      dictation: "听音誊写",
      speak: "营火跟读",
      judge: "地图核对",
      initials: "首字母线索",
      spell: "词义誊写"
    },
    prompts: {
      listen: "听旅队读音",
      dictation: "听旅队读音，写下单词"
    },
    answers: {
      placeholder: "写下英文单词",
      submit: "封存",
      judgeTrue: "吻合",
      judgeFalse: "不吻合",
      speakOk: "读准了",
      speakRetry: "再试一次",
      startSpeech: "开始跟读",
      speechReady: "准备好后点燃火种。",
      speechListening: "正在听...",
      speechResult: "旅记识别",
      speechEmpty: "未识别",
      speechFailed: "没有听清，可以再试一次。"
    }
  },
  "pocket-future": {
    titles: {
      enToCn: "词义充能",
      cnToEn: "单词胶囊",
      listen: "发音雷达",
      sentence: "句子修补",
      dictation: "听音输入",
      speak: "发音测试",
      judge: "配对检测",
      initials: "首字母扫描",
      spell: "拼写充能"
    },
    prompts: {
      listen: "听发音雷达",
      dictation: "听发音雷达，输入单词"
    },
    answers: {
      placeholder: "输入英文单词",
      submit: "充能",
      judgeTrue: "正确",
      judgeFalse: "不对",
      speakOk: "通过",
      speakRetry: "再试",
      startSpeech: "启动跟读",
      speechReady: "准备好后启动检测。",
      speechListening: "正在听...",
      speechResult: "检测结果",
      speechEmpty: "未识别",
      speechFailed: "没有识别成功，可以再试一次。"
    }
  }
};

let profileStore = loadProfileStore();
let state = loadState();
let runtime = {
  current: null,
  answered: false,
  view: "practice",
  sequence: [],
  sequenceIndex: 0,
  wrongOnly: false,
  studyMode: "due",
  streak: 0,
  lastReward: null,
  reinforceQueue: [],
  recentWordIds: [],
  group: {
    done: 0,
    correct: 0,
    finished: false,
    items: [],
    startedAt: Date.now()
  }
};

function defaultState() {
  return {
    settings: {
      book: "1",
      lesson: "all",
      lessonRange: "",
      order: "smart",
      mode: "adaptive",
      adaptiveModeIntroduced: false,
      groupSize: 30,
      dailyGoal: 30,
      dailyNewWords: 10,
      interfaceMode: "child",
      uiTheme: "default",
      autoSpeak: true
    },
    totals: {
      attempts: 0,
      correct: 0,
      sessions: 0
    },
    words: {},
    daily: {},
    rewards: []
  };
}

function loadProfileStore() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.activeId && parsed.profiles && parsed.profiles[parsed.activeId]) {
        return parsed;
      }
    }
  } catch {
    // Fall through to legacy migration.
  }

  let legacyState = defaultState();
  try {
    const legacy = localStorage.getItem(STORAGE_KEY);
    if (legacy) legacyState = mergeState(defaultState(), JSON.parse(legacy));
  } catch {
    legacyState = defaultState();
  }

  const id = createProfileId();
  return {
    activeId: id,
    profiles: {
      [id]: {
        id,
        name: "默认账户",
        state: legacyState
      }
    }
  };
}

function createProfileId() {
  return `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function activeProfile() {
  return profileStore.profiles[profileStore.activeId];
}

function loadState() {
  return mergeState(defaultState(), activeProfile()?.state || defaultState());
}

function mergeState(base, saved) {
  return {
    ...base,
    ...saved,
    settings: { ...base.settings, ...(saved.settings || {}) },
    totals: { ...base.totals, ...(saved.totals || {}) },
    words: saved.words || {},
    daily: saved.daily || {},
    rewards: saved.rewards || []
  };
}

function saveState() {
  const profile = activeProfile();
  if (profile) profile.state = mergeState(defaultState(), state);
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileStore));
}

function migrateSettings() {
  let changed = false;
  if (!state.settings.adaptiveModeIntroduced) {
    state.settings.mode = "adaptive";
    state.settings.adaptiveModeIntroduced = true;
    changed = true;
  }
  if (!["child", "parent"].includes(state.settings.interfaceMode)) {
    state.settings.interfaceMode = "child";
    changed = true;
  }
  const normalizedTheme = normalizeUiTheme(state.settings.uiTheme);
  if (state.settings.uiTheme !== normalizedTheme) {
    state.settings.uiTheme = normalizedTheme;
    changed = true;
  }
  if (changed) saveState();
}

function resetRuntimeForProfile() {
  runtime.current = null;
  runtime.answered = false;
  runtime.sequence = [];
  runtime.sequenceIndex = 0;
  runtime.sequenceSignature = "";
  runtime.wrongOnly = false;
  runtime.studyMode = "due";
  runtime.streak = 0;
  runtime.lastReward = null;
  runtime.reinforceQueue = [];
  runtime.recentWordIds = [];
  resetGroup({ keepSummaryClosed: true });
}

function profileArray() {
  return Object.values(profileStore.profiles).sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
}

function renderProfileControls() {
  dom.profileSelect.innerHTML = profileArray()
    .map((profile) => `<option value="${profile.id}">${escapeHtml(profile.name)}</option>`)
    .join("");
  dom.profileSelect.value = profileStore.activeId;
  dom.renameProfileInput.value = activeProfile()?.name || "";
  renderProfileList();
}

function renderProfileList() {
  dom.profileList.innerHTML = profileArray()
    .map((profile) => {
      const active = profile.id === profileStore.activeId;
      return `
        <div class="profile-row ${active ? "active" : ""}">
          <strong>${escapeHtml(profile.name)}</strong>
          <button class="${active ? "primary" : "secondary"}" data-profile-id="${profile.id}">
            ${active ? "当前" : "切换"}
          </button>
        </div>
      `;
    })
    .join("");
  dom.profileList.querySelectorAll("[data-profile-id]").forEach((button) => {
    button.addEventListener("click", () => switchProfile(button.dataset.profileId));
  });
}

function normalizeUiTheme(theme) {
  const value = String(theme || "default");
  return UI_THEMES.some((item) => item.id === value) ? value : "default";
}

function currentTheme() {
  return normalizeUiTheme(state.settings.uiTheme);
}

function themeCopy() {
  return THEME_COPY[currentTheme()] || THEME_COPY.default;
}

function themeQuestionCopy() {
  return THEME_QUESTION_COPY[currentTheme()] || THEME_QUESTION_COPY.default;
}

function themedModeTitle(mode) {
  return themeQuestionCopy().titles?.[mode] || THEME_QUESTION_COPY.default.titles[mode] || "";
}

function themedPrompt(key) {
  return themeQuestionCopy().prompts?.[key] || THEME_QUESTION_COPY.default.prompts[key] || "";
}

function themedAnswerText(key) {
  return themeQuestionCopy().answers?.[key] || THEME_QUESTION_COPY.default.answers[key] || "";
}

function renderThemeControls() {
  if (!dom.themeSelects.length) return;
  const value = currentTheme();
  const options = UI_THEMES.map((theme) => `<option value="${theme.id}">${escapeHtml(theme.label)}</option>`).join("");
  dom.themeSelects.forEach((select) => {
    if (select.innerHTML !== options) select.innerHTML = options;
    select.value = value;
  });
}

function applyTheme() {
  const theme = currentTheme();
  if (document.body) {
    if (theme === "default") {
      delete document.body.dataset.uiTheme;
    } else {
      document.body.dataset.uiTheme = theme;
    }
  }
  if (dom.themeColorMeta) {
    dom.themeColorMeta.setAttribute("content", THEME_COLORS[theme] || THEME_COLORS.default);
  }
  renderThemeControls();
  applyThemeCopy();
}

function setUiTheme(theme) {
  const normalized = normalizeUiTheme(theme);
  if (state.settings.uiTheme !== normalized) {
    state.settings.uiTheme = normalized;
    saveState();
  }
  applyTheme();
  updateSummary();
  if (runtime.view === "wrong") renderWrongList();
  if (runtime.view === "stats") renderStats();
  if (!runtime.current) {
    dom.questionMeta.textContent = themeCopy().noQuestionMeta;
    dom.questionTitle.textContent = emptyTaskTitle();
  }
}

function applyThemeCopy() {
  const copy = themeCopy();
  if (dom.brandEyebrow) dom.brandEyebrow.textContent = copy.brandEyebrow;
  if (dom.brandTitle) dom.brandTitle.textContent = copy.brandTitle;
  if (dom.settingsShortcut) dom.settingsShortcut.textContent = copy.settingsButton;
  dom.tabs.forEach((tab) => {
    const label = copy.tabs?.[tab.dataset.view];
    if (label) tab.textContent = label;
  });
  dom.missionCards.forEach((card) => {
    const label = copy.missions?.[card.dataset.studyMode];
    const span = card.querySelector("span");
    if (label && span) {
      span.textContent = label;
      card.setAttribute("aria-label", label);
    }
  });
}

function createProfile(name) {
  const cleanName = String(name || "").trim();
  if (!cleanName) {
    alert("请输入账户名称。");
    return;
  }
  saveState();
  const id = createProfileId();
  profileStore.profiles[id] = {
    id,
    name: cleanName,
    state: defaultState()
  };
  profileStore.activeId = id;
  state = loadState();
  resetRuntimeForProfile();
  migrateSettings();
  saveState();
  refreshAfterProfileChange();
  dom.newProfileNameInput.value = "";
}

function switchProfile(id) {
  if (!profileStore.profiles[id] || id === profileStore.activeId) {
    renderProfileControls();
    return;
  }
  dom.groupSummaryModal.hidden = true;
  saveState();
  profileStore.activeId = id;
  state = loadState();
  resetRuntimeForProfile();
  migrateSettings();
  saveState();
  refreshAfterProfileChange();
}

function renameCurrentProfile(name) {
  const cleanName = String(name || "").trim();
  if (!cleanName) {
    alert("账户名称不能为空。");
    return;
  }
  activeProfile().name = cleanName;
  saveState();
  renderProfileControls();
}

function refreshAfterProfileChange() {
  renderProfileControls();
  syncControls();
  renderBookOptions();
  selectInitialStudyMode();
  updateSummary();
  renderQuestion();
  renderWrongList();
  renderStats();
}

function todayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function emptyDailyRecord() {
  return {
    attempts: 0,
    correct: 0,
    newWords: 0,
    goalAwarded: false,
    extraGoal: 0,
    extraNewWords: 0
  };
}

function dailyRecord() {
  const key = todayKey();
  if (!state.daily[key]) {
    state.daily[key] = emptyDailyRecord();
  }
  normalizeDailyRecord(state.daily[key]);
  return state.daily[key];
}

function normalizeDailyRecord(record) {
  if (record.attempts == null) record.attempts = 0;
  if (record.correct == null) record.correct = 0;
  if (record.newWords == null) record.newWords = 0;
  if (record.goalAwarded == null) record.goalAwarded = false;
  if (record.extraGoal == null) record.extraGoal = 0;
  if (record.extraNewWords == null) record.extraNewWords = 0;
  return record;
}

function baseDailyGoal() {
  return Math.max(5, Number(state.settings.dailyGoal) || 30);
}

function dailyGoalForRecord(record = dailyRecord()) {
  const daily = normalizeDailyRecord(record);
  return baseDailyGoal() + Math.max(0, Number(daily.extraGoal) || 0);
}

function wordStat(id) {
  const defaults = {
    attempts: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    consecutiveWrong: 0,
    tier: 0,
    lastResult: "",
    lastWrongAnswer: "",
    lastSeen: 0,
    stage: "new",
    dueAt: 0,
    intervalDays: 0,
    ease: 2.5,
    lapses: 0,
    lastGrade: 0,
    consecutiveWrong: 0
  };
  state.words[id] = { ...defaults, ...(state.words[id] || {}) };
  return state.words[id];
}

function books() {
  const map = new Map();
  VOCABULARY.forEach((word) => {
    if (!map.has(word.book)) {
      map.set(word.book, word.bookName || `第${word.book}册`);
    }
  });
  return [...map.entries()].sort((a, b) => a[0] - b[0]);
}

function lessonsForBook(book) {
  const lessonSet = new Set();
  VOCABULARY.forEach((word) => {
    if (String(word.book) === String(book)) lessonSet.add(word.lesson);
  });
  return [...lessonSet].sort((a, b) => a - b);
}

function scopedWords() {
  let pool = VOCABULARY.filter((word) => String(word.book) === String(state.settings.book));
  const range = parseLessonRange(state.settings.lessonRange);
  if (range) {
    pool = pool.filter((word) => word.lesson >= range.start && word.lesson <= range.end);
  } else if (state.settings.lesson !== "all") {
    pool = pool.filter((word) => String(word.lesson) === String(state.settings.lesson));
  }
  return pool;
}

function selectedWords() {
  let pool = taskWords(runtime.studyMode, scopedWords());
  if (runtime.wrongOnly) {
    pool = pool.filter((word) => isWrongWord(word.id));
  }
  return pool;
}

function taskWords(mode, pool = scopedWords()) {
  const now = Date.now();
  if (mode === "due") {
    return pool.filter((word) => {
      const stat = state.words[word.id];
      return Boolean(stat && stat.attempts > 0 && (stat.dueAt || 0) <= now);
    });
  }
  if (mode === "new") {
    const remaining = Math.max(0, dailyNewTarget() - dailyRecord().newWords);
    return unstartedWords(pool).slice(0, remaining || 0);
  }
  if (mode === "weak") {
    return pool.filter((word) => isWeakWord(word.id) || isStubbornWord(word.id));
  }
  return pool;
}

function effectiveDailyNewWords() {
  const base = Math.max(0, Number(state.settings.dailyNewWords ?? 10) || 0);
  if (base === 0) return 0;
  const dueCount = taskWords("due", scopedWords()).length;
  if (dueCount > 50) return 0;
  if (dueCount > 20) return Math.ceil(base / 2);
  const recentAccuracy = recentAccuracyRate(3);
  if (recentAccuracy > 0 && recentAccuracy < 65) return Math.max(0, Math.floor(base / 3));
  return base;
}

function dailyNewTarget(record = dailyRecord()) {
  const daily = normalizeDailyRecord(record);
  return effectiveDailyNewWords() + Math.max(0, Number(daily.extraNewWords) || 0);
}

function unstartedWords(pool = scopedWords()) {
  return pool.filter((word) => !state.words[word.id] || state.words[word.id].attempts === 0);
}

function recentAccuracyRate(days = 3) {
  const records = lastNDays(days)
    .map((day) => state.daily[day.key])
    .filter((record) => record && record.attempts > 0);
  const attempts = records.reduce((sum, record) => sum + (record.attempts || 0), 0);
  const correct = records.reduce((sum, record) => sum + (record.correct || 0), 0);
  return attempts ? Math.round((correct / attempts) * 100) : 0;
}

function parseLessonRange(value) {
  const text = String(value || "").trim();
  if (!text) return null;
  const numbers = text.match(/\d+/g);
  if (!numbers || !numbers.length) return null;
  const first = Number(numbers[0]);
  const second = Number(numbers[1] || numbers[0]);
  if (!Number.isFinite(first) || !Number.isFinite(second)) return null;
  return {
    start: Math.max(1, Math.min(first, second)),
    end: Math.max(first, second)
  };
}

function isWrongWord(id) {
  const stat = state.words[id];
  return Boolean(stat && (stat.wrong > 0 || stat.lastResult === "wrong") && stat.tier < 5);
}

function isWeakWord(id) {
  const stat = state.words[id];
  return Boolean(
    stat &&
      stat.attempts > 0 &&
      (stat.lastResult === "wrong" || stat.wrong > 0 || stat.lapses > 0 || (stat.attempts >= 3 && stat.tier < 2))
  );
}

function isStubbornWord(id) {
  const stat = state.words[id];
  return isStubbornStat(stat);
}

function isStubbornStat(stat) {
  if (!stat || stat.attempts < 3) return false;
  const rate = accuracy(stat.correct || 0, stat.attempts || 0);
  return Boolean(
    (stat.wrong || 0) >= 4 ||
      (stat.lapses || 0) >= 3 ||
      (stat.consecutiveWrong || 0) >= 2 ||
      (stat.attempts >= 6 && rate < 60)
  );
}

function stubbornLabel(id) {
  return isStubbornWord(id) ? "顽固词" : "";
}

function masteredWord(id) {
  const stat = state.words[id];
  return Boolean(stat && stat.tier >= 4 && stat.correct >= 3);
}

function stageLabel(stage) {
  const labels = {
    new: "新词",
    learning: "学习中",
    review: "复习中",
    mastered: "已掌握"
  };
  return labels[stage] || "新词";
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sample(items, count) {
  return shuffle(items).slice(0, count);
}

function normalizeAnswer(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9\s'-]/g, "")
    .replace(/\s+/g, " ");
}

function meaningPreview(text) {
  return String(text).replace(/\s+/g, " ").trim();
}

function partOfSpeech(word) {
  const text = `${word.chinese || ""} ${word.english || ""}`.toLowerCase();
  if (/aux\.|aux|情态|助动/.test(text)) return "aux";
  if (/pron\.|代词/.test(text)) return "pron";
  if (/prep\.|介词/.test(text)) return "prep";
  if (/conj\.|连词/.test(text)) return "conj";
  if (/int\.|感叹/.test(text)) return "int";
  if (/ad\.|adv\.|副词/.test(text)) return "adv";
  if (/a\.|adj\.|形容/.test(text)) return "adj";
  if (/v\.|动词/.test(text)) return "verb";
  if (/n\.|名词/.test(text)) return "noun";
  return "other";
}

function articleFor(word) {
  const lower = String(word || "").toLowerCase();
  if (/^(honest|hour|heir)/.test(lower)) return "an";
  if (/^(uni|use|one|euro)/.test(lower)) return "a";
  return /^[aeiou]/i.test(lower) ? "an" : "a";
}

function exampleSentence(word) {
  const answer = word.english;
  const blank = "_____";
  const lower = answer.toLowerCase();
  const pos = partOfSpeech(word);

  if (answer.includes(" ")) {
    return phraseExample(word, blank);
  }

  if (["am", "is", "are", "was", "were", "be"].includes(lower)) {
    return beVerbExample(word, blank);
  }

  if (pos === "prep") {
    return prepositionExample(word, blank);
  }

  if (pos === "pron") {
    return pronounExample(word, blank);
  }

  if (pos === "int") {
    return `She says, "${blank}!"`;
  }

  if (pos === "conj") {
    return Number(word.lesson) >= 90 ? `I stayed at home ${blank} it was raining.` : `I like English ${blank} I practise every day.`;
  }

  if (pos === "aux") {
    return Number(word.lesson) >= 80 ? `You ${blank} finish it before dinner.` : `I ${blank} do it now.`;
  }

  const pattern = grammarBand(word);
  switch (pos) {
    case "noun":
      return nounExample(word, pattern, blank);
    case "verb":
      return verbExample(word, pattern, blank);
    case "adj":
      return adjectiveExample(word, pattern, blank);
    case "adv":
      return adverbExample(word, pattern, blank);
    default:
      return genericExample(word, pattern, blank);
  }
}

function grammarBand(word) {
  const lesson = Number(word.lesson) || 1;
  if (Number(word.book) > 1 || lesson >= 111) return "perfect";
  if (lesson >= 91) return "past";
  if (lesson >= 71) return "future";
  if (lesson >= 51) return "therebe";
  if (lesson >= 31) return "progressive";
  if (lesson >= 15) return "present";
  return "basic";
}

function phraseExample(word, blank) {
  const lower = word.english.toLowerCase();
  if (lower.includes("thank")) return `${blank} for your help.`;
  if (lower.includes("very")) return `This lesson is ${blank} useful.`;
  if (lower.includes("a lot")) return `We practise English ${blank}.`;
  return `Please say "${blank}" again.`;
}

function beVerbExample(word, blank) {
  const lesson = Number(word.lesson) || 1;
  if (lesson >= 91) return `He ${blank} at school yesterday.`;
  if (lesson >= 31) return `She ${blank} reading now.`;
  return `This ${blank} my book.`;
}

function nounExample(word, band, blank) {
  if (band === "basic") return `This is ${articleFor(word.english)} ${blank}.`;
  if (band === "present") return `I have ${articleFor(word.english)} ${blank}.`;
  if (band === "progressive") return `The ${blank} is on the table.`;
  if (band === "therebe") return `There is ${articleFor(word.english)} ${blank} near the door.`;
  if (band === "future") return `I will buy ${articleFor(word.english)} ${blank} tomorrow.`;
  if (band === "past") return `I saw ${articleFor(word.english)} ${blank} yesterday.`;
  return `I have just found ${articleFor(word.english)} ${blank}.`;
}

function verbExample(word, band, blank) {
  if (band === "basic") return `Please ${blank} it.`;
  if (band === "present") return `I usually ${blank} after school.`;
  if (band === "progressive") return `They are going to ${blank} it now.`;
  if (band === "therebe") return `There is no time to ${blank}.`;
  if (band === "future") return `We will ${blank} it tomorrow.`;
  if (band === "past") return `They wanted to ${blank} it yesterday.`;
  return `I have learned to ${blank} carefully.`;
}

function adjectiveExample(word, band, blank) {
  if (band === "basic") return `It is ${blank}.`;
  if (band === "present") return `The story sounds ${blank}.`;
  if (band === "progressive") return `The room is getting ${blank}.`;
  if (band === "therebe") return `There is a ${blank} picture on the wall.`;
  if (band === "future") return `The test will be ${blank}.`;
  if (band === "past") return `The weather was ${blank} yesterday.`;
  return `This has become ${blank} for us.`;
}

function adverbExample(word, band, blank) {
  if (band === "basic") return `Please sit ${blank}.`;
  if (band === "present") return `He usually speaks ${blank}.`;
  if (band === "progressive") return `She is reading ${blank} now.`;
  if (band === "future") return `We will leave ${blank}.`;
  if (band === "past") return `He answered ${blank} yesterday.`;
  return `I have heard it ${blank} before.`;
}

function prepositionExample(word, blank) {
  const lower = word.english.toLowerCase();
  if (["in", "on", "under", "behind", "beside", "near", "between"].includes(lower)) {
    return `The book is ${blank} the desk.`;
  }
  if (["to", "from", "into", "out of"].includes(lower)) {
    return `She walks ${blank} the classroom.`;
  }
  return `I am waiting ${blank} my friend.`;
}

function pronounExample(word, blank) {
  const lower = word.english.toLowerCase();
  if (["my", "your", "his", "her", "our", "their"].includes(lower)) return `This is ${blank} book.`;
  if (["this", "that", "these", "those"].includes(lower)) return `${blank} is my ticket.`;
  return `Look at ${blank}.`;
}

function genericExample(word, band, blank) {
  if (band === "past") return `I used "${blank}" in my answer yesterday.`;
  if (band === "future") return `We will practise "${blank}" tomorrow.`;
  return `This word is "${blank}".`;
}

function optionText(word, field) {
  return field === "english" ? word.english : meaningPreview(word.chinese);
}

function buildOptions(answer, field, pool) {
  const seen = new Set([optionText(answer, field)]);
  const options = [answer];

  const byId = new Map();
  [...pool, ...VOCABULARY.filter((word) => word.book === answer.book), ...VOCABULARY].forEach((word) => {
    if (word.id !== answer.id) byId.set(word.id, word);
  });

  const candidates = [...byId.values()]
    .filter((word) => !seen.has(optionText(word, field)))
    .map((word) => ({ word, score: distractorScore(answer, word, field) }))
    .sort((a, b) => b.score - a.score);

  shuffle(candidates.slice(0, 16))
    .concat(candidates.slice(16))
    .forEach(({ word }) => {
      if (options.length >= 4) return;
      const text = optionText(word, field);
      if (!seen.has(text)) {
        seen.add(text);
        options.push(word);
      }
    });

  return shuffle(options);
}

function distractorScore(answer, candidate, field) {
  let score = 0;
  if (candidate.book === answer.book) score += 8;
  if (candidate.lesson === answer.lesson) score += 6;
  score += Math.max(0, 5 - Math.abs(candidate.lesson - answer.lesson));
  if (partOfSpeech(candidate) === partOfSpeech(answer)) score += 7;
  if (field === "english") {
    score += Math.max(0, 6 - Math.abs(candidate.english.length - answer.english.length));
  } else {
    score += Math.max(0, 6 - Math.abs(candidate.chinese.length - answer.chinese.length));
  }
  return score + Math.random();
}

function pickMode(word) {
  if (state.settings.mode === "adaptive") return adaptiveModeFor(word);
  if (state.settings.mode !== "mixed") return state.settings.mode;
  return MODES[Math.floor(Math.random() * MODES.length)];
}

function adaptiveModeFor(word) {
  const stat = wordStat(word.id);
  if (isStubbornWord(word.id)) {
    return sample(["enToCn", "cnToEn", "listen", "sentence"], 1)[0];
  }

  if (stat.lastResult === "wrong") {
    return sample(["enToCn", "cnToEn", "listen"], 1)[0];
  }

  if (stat.attempts === 0 || stat.tier <= 1) {
    return sample(["enToCn", "cnToEn", "listen"], 1)[0];
  }

  if (stat.tier <= 3) {
    return sample(["cnToEn", "listen", "sentence", "initials", "spell"], 1)[0];
  }

  return sample(["spell", "dictation", "speak", "sentence", "initials", "listen", "judge"], 1)[0];
}

function smartWeight(word) {
  const stat = state.words[word.id];
  if (!stat) return 8;
  const isDue = stat.attempts > 0 && (stat.dueAt || 0) <= Date.now();
  const wrongBoost = stat.wrong * 4 + (stat.lastResult === "wrong" ? 10 : 0);
  const stubbornBoost = isStubbornWord(word.id) ? 10 : 0;
  const dueBoost = isDue ? 12 : 0;
  const weakBoost = isWeakWord(word.id) ? 8 : 0;
  const tierPenalty = stat.tier * 1.8;
  const freshness = Math.max(0, 6 - Math.floor((Date.now() - (stat.lastSeen || 0)) / 60000));
  const masteredPenalty = stat.stage === "mastered" ? 8 : 0;
  return Math.max(1, 8 + dueBoost + weakBoost + wrongBoost + stubbornBoost - tierPenalty - freshness - masteredPenalty);
}

function pickWord(pool) {
  const reinforcement = takeReinforcementWord(scopedWords());
  if (reinforcement) return { word: reinforcement, reinforced: true };

  if (!pool.length) return { word: null, reinforced: false };
  const activePool = cooldownFilteredPool(pool);

  if (state.settings.order === "sequential") {
    const signature = pool.map((word) => word.id).join("|");
    if (runtime.sequenceSignature !== signature) {
      runtime.sequence = [...pool].sort((a, b) => a.lesson - b.lesson || a.id.localeCompare(b.id));
      runtime.sequenceIndex = 0;
      runtime.sequenceSignature = signature;
    }
    const startIndex = runtime.sequenceIndex;
    let word = runtime.sequence[startIndex % runtime.sequence.length];
    for (let i = 0; i < runtime.sequence.length; i += 1) {
      const candidate = runtime.sequence[(startIndex + i) % runtime.sequence.length];
      if (activePool.some((item) => item.id === candidate.id)) {
        word = candidate;
        runtime.sequenceIndex = startIndex + i + 1;
        break;
      }
    }
    if (runtime.sequenceIndex === startIndex) runtime.sequenceIndex = startIndex + 1;
    return { word, reinforced: false };
  }

  if (state.settings.order === "random") {
    return { word: activePool[Math.floor(Math.random() * activePool.length)], reinforced: false };
  }

  const total = activePool.reduce((sum, word) => sum + smartWeight(word), 0);
  let ticket = Math.random() * total;
  for (const word of activePool) {
    ticket -= smartWeight(word);
    if (ticket <= 0) return { word, reinforced: false };
  }
  return { word: activePool[activePool.length - 1], reinforced: false };
}

function cooldownFilteredPool(pool) {
  const recent = new Set(runtime.recentWordIds || []);
  const filtered = pool.filter((word) => !recent.has(word.id));
  return filtered.length >= Math.min(4, pool.length) ? filtered : pool;
}

function rememberRecentWord(wordId) {
  if (!wordId) return;
  runtime.recentWordIds = [wordId].concat((runtime.recentWordIds || []).filter((id) => id !== wordId)).slice(0, 6);
}

function takeReinforcementWord(pool) {
  const index = runtime.reinforceQueue.findIndex(
    (item) => item.remaining <= 0 && pool.some((word) => word.id === item.wordId)
  );
  if (index < 0) return null;
  const [item] = runtime.reinforceQueue.splice(index, 1);
  return pool.find((word) => word.id === item.wordId) || null;
}

function makeQuestion() {
  const pool = selectedWords();
  const picked = pickWord(pool);
  const word = picked.word;
  if (!word) return null;
  const mode = pickMode(word);
  const optionPool = picked.reinforced ? scopedWords() : pool.length ? pool : scopedWords();

  if (mode === "enToCn") {
    return {
      mode,
      word,
      title: themedModeTitle("enToCn"),
      prompt: word.english,
      sub: word.phonetic,
      options: buildOptions(word, "chinese", optionPool),
      optionField: "chinese"
    };
  }

  if (mode === "cnToEn") {
    return {
      mode,
      word,
      title: themedModeTitle("cnToEn"),
      prompt: meaningPreview(word.chinese),
      sub: `第${word.lesson}课`,
      options: buildOptions(word, "english", optionPool),
      optionField: "english"
    };
  }

  if (mode === "listen") {
    return {
      mode,
      word,
      title: themedModeTitle("listen"),
      prompt: themedPrompt("listen"),
      sub: word.phonetic || `第${word.lesson}课`,
      options: buildOptions(word, "chinese", optionPool),
      optionField: "chinese"
    };
  }

  if (mode === "sentence") {
    return {
      mode,
      word,
      title: themedModeTitle("sentence"),
      prompt: exampleSentence(word),
      sub: meaningPreview(word.chinese),
      options: buildOptions(word, "english", optionPool),
      optionField: "english"
    };
  }

  if (mode === "dictation") {
    return {
      mode,
      word,
      title: themedModeTitle("dictation"),
      prompt: themedPrompt("dictation"),
      sub: word.phonetic || `第${word.lesson}课`
    };
  }

  if (mode === "speak") {
    return {
      mode,
      word,
      title: themedModeTitle("speak"),
      prompt: word.english,
      sub: word.phonetic || meaningPreview(word.chinese)
    };
  }

  if (mode === "judge") {
    const pairIsRight = Math.random() > 0.45;
    const other = sample(optionPool.filter((item) => item.id !== word.id), 1)[0] || word;
    return {
      mode,
      word,
      title: themedModeTitle("judge"),
      prompt: word.english,
      sub: pairIsRight ? meaningPreview(word.chinese) : meaningPreview(other.chinese),
      pairIsRight
    };
  }

  if (mode === "initials") {
    return {
      mode,
      word,
      title: themedModeTitle("initials"),
      prompt: maskWord(word.english),
      sub: meaningPreview(word.chinese)
    };
  }

  return {
    mode: "spell",
    word,
    title: themedModeTitle("spell"),
    prompt: meaningPreview(word.chinese),
    sub: word.phonetic || `第${word.lesson}课`
  };
}

function maskWord(text) {
  return String(text)
    .split(" ")
    .map((part) => {
      if (part.length <= 2) return `${part[0] || ""}_`;
      return part
        .split("")
        .map((char, index) => {
          if (!/[a-z]/i.test(char)) return char;
          if (index === 0 || index === part.length - 1) return char;
          return Math.random() > 0.45 ? "_" : char;
        })
        .join(" ");
    })
    .join("   ");
}

function renderQuestion() {
  if (runtime.group.finished) {
    resetGroup();
  }
  const question = makeQuestion();
  runtime.current = question;
  runtime.answered = false;
  dom.feedback.className = "feedback";
  dom.feedback.textContent = "";
  dom.nextButton.textContent = "下一题";

  if (!question) {
    dom.questionMeta.textContent = themeCopy().noQuestionMeta;
    dom.questionTitle.textContent = emptyTaskTitle();
    dom.promptBox.classList.remove("sentence-prompt");
    dom.promptBox.innerHTML = "";
    dom.answerArea.innerHTML = "";
    return;
  }

  const stat = wordStat(question.word.id);
  const stubborn = stubbornLabel(question.word.id);
  dom.questionMeta.textContent = [
    question.word.bookName,
    `第${question.word.lesson}课`,
    stageLabel(stat.stage),
    `已练 ${stat.attempts} 次`,
    `错 ${stat.wrong} 次`,
    `熟练度 ${stat.tier}/5`,
    stubborn
  ]
    .filter(Boolean)
    .join(" · ");
  dom.questionTitle.textContent = question.title;
  dom.promptBox.classList.toggle("sentence-prompt", question.mode === "sentence");
  dom.promptBox.innerHTML = `
    <span class="prompt-main">${escapeHtml(question.prompt)}</span>
    <span class="prompt-sub">${escapeHtml(question.sub || "")}</span>
  `;

  if (["enToCn", "cnToEn", "listen", "sentence"].includes(question.mode)) {
    renderChoices(question);
  } else if (question.mode === "judge") {
    renderJudge(question);
  } else if (question.mode === "speak") {
    renderSpeakAnswer(question);
  } else {
    renderTextAnswer(question);
  }

  if (["listen", "dictation", "speak"].includes(question.mode) || state.settings.autoSpeak) {
    setTimeout(() => speak(question.word.english), 80);
  }

  updateSummary();
}

function emptyTaskTitle() {
  const empty = themeCopy().empty;
  if (runtime.studyMode === "due") return empty.due;
  if (runtime.studyMode === "new") return empty.new;
  if (runtime.studyMode === "weak") return empty.weak;
  return runtime.wrongOnly ? empty.wrong : empty.free;
}

function renderChoices(question) {
  const buttons = question.options
    .map((option) => {
      const text = optionText(option, question.optionField);
      return `<button class="choice" data-answer="${option.id}">${escapeHtml(text)}</button>`;
    })
    .join("");
  dom.answerArea.innerHTML = `<div class="choice-grid">${buttons}</div>`;
  dom.answerArea.querySelectorAll(".choice").forEach((button) => {
    button.addEventListener("click", () => answerChoice(button.dataset.answer));
  });
}

function renderJudge(question) {
  dom.answerArea.innerHTML = `
    <div class="judge-grid">
      <button class="choice" data-judge="true">${escapeHtml(themedAnswerText("judgeTrue"))}</button>
      <button class="choice" data-judge="false">${escapeHtml(themedAnswerText("judgeFalse"))}</button>
    </div>
  `;
  dom.answerArea.querySelectorAll(".choice").forEach((button) => {
    button.addEventListener("click", () => {
      const answer = button.dataset.judge === "true";
      finalizeAnswer(
        answer === question.pairIsRight,
        button,
        answer ? themedAnswerText("judgeTrue") : themedAnswerText("judgeFalse")
      );
    });
  });
}

function renderTextAnswer(question) {
  dom.answerArea.innerHTML = `
    <form class="text-answer" id="textAnswerForm">
      <input id="textAnswerInput" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="${escapeHtml(themedAnswerText("placeholder"))}">
      <button class="primary" type="submit">${escapeHtml(themedAnswerText("submit"))}</button>
    </form>
  `;
  const form = document.querySelector("#textAnswerForm");
  const input = document.querySelector("#textAnswerInput");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const userAnswer = normalizeAnswer(input.value);
    const rightAnswer = normalizeAnswer(question.word.english);
    finalizeAnswer(userAnswer === rightAnswer, input, input.value.trim());
  });
  input.focus({ preventScroll: true });
}

function renderSpeakAnswer(question) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    dom.answerArea.innerHTML = `
      <div class="judge-grid">
        <button class="choice" data-self-speak="true">${escapeHtml(themedAnswerText("speakOk"))}</button>
        <button class="choice" data-self-speak="false">${escapeHtml(themedAnswerText("speakRetry"))}</button>
      </div>
    `;
    dom.answerArea.querySelectorAll(".choice").forEach((button) => {
      button.addEventListener("click", () => {
        const ok = button.dataset.selfSpeak === "true";
        finalizeAnswer(ok, button, ok ? "跟读自评正确" : "跟读自评重练");
      });
    });
    return;
  }

  dom.answerArea.innerHTML = `
    <div class="text-answer">
      <button class="primary" id="startSpeechButton" type="button">${escapeHtml(themedAnswerText("startSpeech"))}</button>
      <div class="feedback" id="speechResult">${escapeHtml(themedAnswerText("speechReady"))}</div>
    </div>
  `;

  const button = dom.answerArea.querySelector("#startSpeechButton");
  const result = dom.answerArea.querySelector("#speechResult");
  button.addEventListener("click", () => {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    button.disabled = true;
    result.textContent = themedAnswerText("speechListening");
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      const ok = spokenMatches(transcript, question.word.english);
      result.textContent = `${themedAnswerText("speechResult")}：${transcript || themedAnswerText("speechEmpty")}`;
      finalizeAnswer(ok, button, transcript || themedAnswerText("speechEmpty"));
    };
    recognition.onerror = () => {
      button.disabled = false;
      result.textContent = themedAnswerText("speechFailed");
    };
    recognition.start();
  });
}

function spokenMatches(transcript, target) {
  const spoken = normalizeAnswer(transcript);
  const answer = normalizeAnswer(target);
  if (!spoken || !answer) return false;
  return spoken === answer || spoken.split(" ").includes(answer);
}

function answerChoice(id) {
  const question = runtime.current;
  if (!question || runtime.answered) return;
  const button = [...dom.answerArea.querySelectorAll("[data-answer]")].find((item) => item.dataset.answer === id);
  const selected = question.options.find((option) => option.id === id);
  const submitted = selected ? optionText(selected, question.optionField) : "";
  finalizeAnswer(id === question.word.id, button, submitted);
}

function finalizeAnswer(isCorrect, target, submitted = "") {
  const question = runtime.current;
  if (!question || runtime.answered) return;
  runtime.answered = true;

  const stat = wordStat(question.word.id);
  const wasNewWord = stat.attempts === 0;
  stat.attempts += 1;
  stat.lastSeen = Date.now();
  stat.lastResult = isCorrect ? "correct" : "wrong";

  state.totals.attempts += 1;
  const daily = dailyRecord();
  daily.attempts += 1;
  if (wasNewWord) {
    daily.newWords += 1;
  }
  runtime.group.done += 1;

  if (isCorrect) {
    stat.correct += 1;
    stat.streak += 1;
    stat.consecutiveWrong = 0;
    stat.tier = Math.min(5, stat.tier + 1);
    stat.lastWrongAnswer = "";
    state.totals.correct += 1;
    daily.correct += 1;
    runtime.group.correct += 1;
    runtime.streak += 1;
  } else {
    stat.wrong += 1;
    stat.streak = 0;
    stat.consecutiveWrong = (stat.consecutiveWrong || 0) + 1;
    stat.tier = Math.max(0, stat.tier - 1);
    stat.lastWrongAnswer = submitted || "未记录";
    runtime.streak = 0;
  }

  runtime.group.items.push({
    wordId: question.word.id,
    english: question.word.english,
    chinese: meaningPreview(question.word.chinese),
    mode: question.mode,
    correct: isCorrect,
    submitted,
    stubborn: isStubbornStat(stat)
  });
  rememberRecentWord(question.word.id);

  scheduleReview(stat, isCorrect, question.mode);
  advanceReinforcementQueue(question.word.id);
  if (isCorrect) {
    clearReinforcement(question.word.id);
  } else {
    addReinforcement(question.word.id);
  }

  markAnswerButtons(question, isCorrect, target);
  showFeedback(question, isCorrect);
  const groupFinished = runtime.group.done >= groupTarget();
  maybeReward(isCorrect, daily, groupFinished);
  if (groupFinished) {
    completeGroup();
  }
  saveState();
  updateSummary();

  if (state.settings.autoSpeak) {
    speak(question.word.english);
  }
}

function markAnswerButtons(question, isCorrect, target) {
  if (target && target.classList) {
    target.classList.add(isCorrect ? "correct" : "wrong");
  }
  dom.answerArea.querySelectorAll("[data-answer]").forEach((button) => {
    if (button.dataset.answer === question.word.id) button.classList.add("correct");
    button.disabled = true;
  });
  dom.answerArea.querySelectorAll("[data-judge]").forEach((button) => {
    const value = button.dataset.judge === "true";
    if (value === question.pairIsRight) button.classList.add("correct");
    button.disabled = true;
  });
  const input = dom.answerArea.querySelector("input");
  if (input) input.disabled = true;
}

function showFeedback(question, isCorrect) {
  const word = question.word;
  const stat = wordStat(word.id);
  const copy = themeCopy().feedback;
  dom.feedback.className = `feedback ${isCorrect ? "good" : "bad"}`;
  const prefix = isCorrect ? copy.good : copy.bad;
  const wrongAnswer = !isCorrect && stat.lastWrongAnswer ? `<br>你的答案：${escapeHtml(stat.lastWrongAnswer)}` : "";
  const reinforce = !isCorrect ? `<br>${escapeHtml(copy.reinforce)}` : "";
  dom.feedback.innerHTML = `
    <strong>${prefix}：</strong>
    ${escapeHtml(word.english)}
    <span class="pill">${escapeHtml(word.phonetic || "音标待补")}</span>
    <br>${escapeHtml(meaningPreview(word.chinese))}
    ${wrongAnswer}
    ${reinforce}
  `;
}

function maybeReward(isCorrect, daily, groupFinished) {
  const copy = themeCopy().rewards;
  if (isCorrect && [5, 10, 20, 40].includes(runtime.streak)) {
    addReward({
      type: "star",
      text: copy.streak(runtime.streak),
      detail: copy.streakDetail
    });
  }
  if (!daily.goalAwarded && daily.attempts >= dailyGoalForRecord(daily)) {
    daily.goalAwarded = true;
    addReward({
      type: "goal",
      text: copy.goal,
      detail: copy.goalDetail
    });
  }
  if (groupFinished) {
    const rate = accuracy(runtime.group.correct, runtime.group.done);
    addReward({
      type: "group",
      text: copy.group(runtime.group.done),
      detail: copy.groupDetail(rate)
    });
  }
}

function addReward(reward) {
  runtime.lastReward = reward;
  state.rewards.unshift({ ...reward, date: new Date().toISOString() });
  state.rewards = state.rewards.slice(0, 30);
  renderReward(reward);
}

function completeGroup() {
  runtime.group.finished = true;
  dom.nextButton.textContent = "开始新一组";
  dom.feedback.innerHTML += `<br><strong>${escapeHtml(themeCopy().summary.completeInline(runtime.group.done, runtime.group.correct))}</strong>`;
  renderGroupSummary();
  dom.groupSummaryModal.hidden = false;
}

function resetGroup(options = {}) {
  runtime.group = {
    done: 0,
    correct: 0,
    finished: false,
    items: [],
    startedAt: Date.now()
  };
  if (options.keepSummaryClosed && dom.groupSummaryModal) dom.groupSummaryModal.hidden = true;
}

function groupTarget() {
  return Math.max(1, Number(state.settings.groupSize) || 30);
}

function renderGroupSummary() {
  const items = runtime.group.items || [];
  const done = runtime.group.done;
  const correct = runtime.group.correct;
  const wrongItems = items.filter((item) => !item.correct);
  const uniqueWords = new Set(items.map((item) => item.wordId)).size;
  const stubbornItems = items.filter((item) => item.stubborn);
  const rate = accuracy(correct, done);
  const summary = themeCopy().summary;
  const summaryEyebrow = dom.groupSummaryModal.querySelector(".group-summary-hero .eyebrow");
  if (summaryEyebrow) summaryEyebrow.textContent = summary.eyebrow;

  dom.groupSummaryTitle.textContent = summary.title(done, rate);
  dom.groupSummaryAdvice.textContent = groupAdvice(rate, wrongItems.length, stubbornItems.length);
  dom.groupSummaryStats.innerHTML = [
    ["本组题数", done],
    ["答对", correct],
    ["错题", wrongItems.length],
    ["练到单词", uniqueWords],
    ["顽固词", stubbornItems.length]
  ]
    .map(([label, value]) => `<div class="summary-metric"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  if (!wrongItems.length) {
    dom.groupSummaryWords.innerHTML = `<div class="empty-state">${escapeHtml(summary.noWrong)}</div>`;
    return;
  }

  const rows = wrongItems.slice(-8).reverse();
  dom.groupSummaryWords.innerHTML = `
    <h3>${escapeHtml(summary.wrongTitle)}</h3>
    <div class="summary-word-list">
      ${rows
        .map(
          (item) => `
            <div class="summary-word">
              <strong>${escapeHtml(item.english)}</strong>
              <span>${escapeHtml(item.chinese)}</span>
              ${item.stubborn ? '<em>顽固词</em>' : ""}
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function groupAdvice(rate, wrongCount, stubbornCount) {
  if (currentTheme() === "wild-kingdom") {
    if (rate >= 90 && wrongCount === 0) return "路线很稳，可以开启下一段探索。";
    if (rate >= 80) return "整体命中不错，继续沿当前路线推进。";
    if (stubbornCount > 0) return "有顽固怪反复出现，建议先回营地清理弱点词。";
    if (rate < 60) return "先放慢脚步，减少新词采集，优先复习路线。";
    return "错题已经标入回访路线，下一轮会再次遇到。";
  }
  if (currentTheme() === "ember-fellowship") {
    if (rate >= 90 && wrongCount === 0) return "旅队状态很好，可以继续下一段路。";
    if (rate >= 80) return "这段远征不错，下一组保持当前节奏。";
    if (stubbornCount > 0) return "暗影词反复出现，建议先做暗影清理。";
    if (rate < 60) return "先扎营放慢速度，减少新词，优先复习。";
    return "错题已经写入回程路线，下一段会再次回访。";
  }
  if (currentTheme() === "pocket-future") {
    if (rate >= 90 && wrongCount === 0) return "机器状态很好，可以启动下一次实验。";
    if (rate >= 80) return "稳定率不错，下一组继续当前参数。";
    if (stubbornCount > 0) return "有词条需要反复维修，建议先进入错词修理。";
    if (rate < 60) return "先降低速度，减少新词胶囊，优先补能。";
    return "错题已放入维修循环，下一次会自动回访。";
  }
  if (rate >= 90 && wrongCount === 0) return "非常稳，可以继续下一组或轻松收工。";
  if (rate >= 80) return "整体不错，下一组可以继续当前节奏。";
  if (stubbornCount > 0) return "有顽固词出现，下一组建议先做错词强化。";
  if (rate < 60) return "先放慢速度，建议减少新词，优先复习。";
  return "错题已经进入强化循环，下一组会再次遇到。";
}

function scheduleReview(stat, isCorrect, mode) {
  const now = Date.now();
  const grade = answerGrade(isCorrect, mode, stat);
  stat.lastGrade = grade;

  if (!isCorrect) {
    stat.stage = "learning";
    stat.lapses = (stat.lapses || 0) + 1;
    stat.ease = Math.max(1.3, (stat.ease || 2.5) - 0.2);
    stat.intervalDays = 0;
    stat.dueAt = now + 5 * 60 * 1000;
    return;
  }

  stat.ease = Math.min(3, Math.max(1.3, (stat.ease || 2.5) + (grade >= 4 ? 0.05 : -0.03)));
  const intervals = [1, 3, 7, 15, 30];
  const index = Math.max(0, Math.min((stat.tier || 1) - 1, intervals.length - 1));
  stat.intervalDays = intervals[index];
  stat.stage = stat.tier >= 5 ? "mastered" : stat.tier >= 2 ? "review" : "learning";
  stat.dueAt = now + stat.intervalDays * 24 * 60 * 60 * 1000;
}

function answerGrade(isCorrect, mode, stat) {
  if (!isCorrect) return 0;
  let grade = ["spell", "initials", "sentence", "speak"].includes(mode) ? 4 : 3;
  if (mode === "dictation") grade = 5;
  if (mode === "listen") grade = 3;
  if ((stat.streak || 0) >= 3) grade += 1;
  if ((stat.tier || 0) >= 4) grade += 1;
  return Math.min(5, grade);
}

function advanceReinforcementQueue(answeredWordId) {
  runtime.reinforceQueue.forEach((item) => {
    if (item.wordId !== answeredWordId) {
      item.remaining -= 1;
    }
  });
}

function addReinforcement(wordId) {
  clearReinforcement(wordId);
  runtime.reinforceQueue.push({ wordId, remaining: 2 });
  runtime.reinforceQueue.push({ wordId, remaining: 7 });
}

function clearReinforcement(wordId) {
  runtime.reinforceQueue = runtime.reinforceQueue.filter((item) => item.wordId !== wordId);
}

function renderReward(reward) {
  const item = normalizeReward(reward);
  if (!item) {
    dom.rewardBox.textContent = themeCopy().rewards.empty;
    return;
  }
  dom.rewardBox.innerHTML = `
    <div class="reward-card">
      <div class="reward-art ${escapeHtml(item.type)}" aria-hidden="true"></div>
      <div class="reward-text">
        <strong>${escapeHtml(item.text)}</strong>
        <span>${escapeHtml(item.detail || themeCopy().rewards.fallbackDetail)}</span>
      </div>
    </div>
  `;
}

function normalizeReward(reward) {
  const copy = themeCopy().rewards;
  if (!reward) return null;
  if (typeof reward === "string") {
    return { type: "star", text: reward, detail: "" };
  }
  return {
    type: reward.type || "star",
    text: reward.text || copy.fallback,
    detail: reward.detail || ""
  };
}

function speak(text) {
  if (!("speechSynthesis" in window) || !text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.82;
  utterance.pitch = 1;
  utterance.onstart = () => setSpeaking(true);
  utterance.onend = () => setSpeaking(false);
  utterance.onerror = () => setSpeaking(false);
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find((voice) => /^en[-_]/i.test(voice.lang));
  if (englishVoice) utterance.voice = englishVoice;
  window.speechSynthesis.speak(utterance);
}

function setSpeaking(isSpeaking) {
  dom.speakButton.classList.toggle("speaking", isSpeaking);
  dom.speakButton.setAttribute("aria-label", isSpeaking ? "正在朗读" : "朗读单词");
  dom.speakButton.title = isSpeaking ? "正在朗读" : "朗读单词";
  dom.speakButton.innerHTML = isSpeaking
    ? '<span class="audio-bars" aria-hidden="true"><i></i><i></i><i></i></span>'
    : "▶";
}

function taskCounts() {
  const pool = scopedWords();
  return {
    due: taskWords("due", pool).length,
    new: taskWords("new", pool).length,
    weak: taskWords("weak", pool).length,
    free: pool.length
  };
}

function updateMissionPanel() {
  const counts = taskCounts();
  dom.dueTaskCount.textContent = counts.due;
  dom.newTaskCount.textContent = counts.new;
  dom.weakTaskCount.textContent = counts.weak;
  dom.freeTaskCount.textContent = counts.free;
  if (runtime.studyMode === "new" && counts.new === 0 && counts.due > 0) {
    runtime.studyMode = "due";
  }
  dom.missionCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.studyMode === runtime.studyMode);
  });
}

function selectInitialStudyMode() {
  const counts = taskCounts();
  runtime.studyMode = counts.due > 0 ? "due" : counts.new > 0 ? "new" : counts.weak > 0 ? "weak" : "free";
}

function updateSummary() {
  const daily = dailyRecord();
  const goal = dailyGoalForRecord(daily);
  const copy = themeCopy();
  const progress = Math.min(100, Math.round((daily.attempts / goal) * 100));
  dom.dailyText.textContent = `${daily.attempts} / ${goal}`;
  dom.dailyBar.style.width = `${progress}%`;
  dom.dailyStrip.classList.toggle("unfinished", daily.attempts < goal);
  dom.dailyTitle.textContent = daily.attempts >= goal ? copy.dailyDone : copy.dailyTodo;

  dom.streakCount.textContent = runtime.streak;
  dom.accuracyNow.textContent = `${accuracy(state.totals.correct, state.totals.attempts)}%`;
  dom.wrongCount.textContent = Object.keys(state.words).filter(isWrongWord).length;
  dom.groupCount.textContent = `${runtime.group.done}/${groupTarget()}`;
  dom.reinforceCount.textContent = new Set(runtime.reinforceQueue.map((item) => item.wordId)).size;
  renderReward(runtime.lastReward || state.rewards[0]);
  updateMissionPanel();
  updateChildCoach();
}

function renderBookOptions() {
  const current = state.settings.book;
  dom.bookSelect.innerHTML = books()
    .map(([book, name]) => `<option value="${book}">${escapeHtml(name)}</option>`)
    .join("");
  const hasCurrent = [...dom.bookSelect.options].some((option) => option.value === String(current));
  state.settings.book = hasCurrent ? current : dom.bookSelect.value || "1";
  dom.bookSelect.value = state.settings.book;
  renderLessonOptions();
}

function renderLessonOptions() {
  const lessons = lessonsForBook(state.settings.book);
  const options = [`<option value="all">全部课次</option>`].concat(
    lessons.map((lesson) => `<option value="${lesson}">第${lesson}课</option>`)
  );
  dom.lessonSelect.innerHTML = options.join("");
  if (state.settings.lesson !== "all" && !lessons.includes(Number(state.settings.lesson))) {
    state.settings.lesson = "all";
  }
  dom.lessonSelect.value = state.settings.lesson;
}

function renderWrongList() {
  const rows = VOCABULARY.filter((word) => isWrongWord(word.id))
    .sort((a, b) => {
      const aw = state.words[a.id]?.wrong || 0;
      const bw = state.words[b.id]?.wrong || 0;
      return bw - aw || a.book - b.book || a.lesson - b.lesson;
    })
    .slice(0, 200);

  if (!rows.length) {
    dom.wrongList.innerHTML = `<div class="empty-state">${escapeHtml(themeCopy().empty.wrong)}</div>`;
    return;
  }

  dom.wrongList.innerHTML = rows
    .map((word) => {
      const stat = wordStat(word.id);
      return `
        <div class="word-row">
          <div>
            <strong>${escapeHtml(word.english)}</strong>
            <br><small>${escapeHtml(word.phonetic || "")}</small>
          </div>
          <div>${escapeHtml(meaningPreview(word.chinese))}</div>
          <div>
            <span class="pill">${escapeHtml(word.bookName)} 第${word.lesson}课</span>
            <br><small>错 ${stat.wrong} 次 · 对 ${stat.correct} 次</small>
            ${stat.lastWrongAnswer ? `<br><small>上次错答：${escapeHtml(stat.lastWrongAnswer)}</small>` : ""}
          </div>
        </div>
      `;
    })
    .join("");
}

function renderStats() {
  const daily = dailyRecord();
  const totalWords = VOCABULARY.length;
  const mastered = VOCABULARY.filter((word) => masteredWord(word.id)).length;
  const wrongs = Object.keys(state.words).filter(isWrongWord).length;
  const stubborns = Object.keys(state.words).filter(isStubbornWord).length;
  const practiced = Object.keys(state.words).filter((id) => state.words[id].attempts > 0).length;
  const streakDays = calcStreakDays();
  const counts = taskCounts();

  dom.statsGrid.innerHTML = [
    ["总刷题", state.totals.attempts],
    ["总正确率", `${accuracy(state.totals.correct, state.totals.attempts)}%`],
    ["已练单词", practiced],
    ["已掌握", `${mastered}/${totalWords}`],
    ["今日刷题", daily.attempts],
    ["今日正确", daily.correct],
    ["今日新词", `${daily.newWords}/${dailyNewTarget(daily)}`],
    ["待复习", counts.due],
    ["连续天数", streakDays],
    ["错词数量", wrongs],
    ["顽固词", stubborns]
  ]
    .map(([label, value]) => `<div class="stat-card"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  dom.bookProgress.innerHTML = books()
    .map(([book, name]) => {
      const words = VOCABULARY.filter((word) => word.book === book);
      const done = words.filter((word) => masteredWord(word.id)).length;
      const percent = words.length ? Math.round((done / words.length) * 100) : 0;
      return `
        <div class="progress-row">
          <header><span>${escapeHtml(name)}</span><span>${done}/${words.length}</span></header>
          <div class="meter"><i style="width:${percent}%"></i></div>
        </div>
      `;
    })
    .join("");

  renderParentDashboard();
}

function renderParentDashboard() {
  renderParentAdvice();
  renderWeeklyChart();
  renderWeakLessons();
  renderWeakWords();
}

function renderParentAdvice() {
  const daily = dailyRecord();
  const counts = taskCounts();
  const goalGap = Math.max(0, dailyGoalForRecord(daily) - daily.attempts);
  const effectiveNew = dailyNewTarget(daily);
  const newGap = Math.max(0, effectiveNew - daily.newWords);
  const stubborns = Object.keys(state.words).filter(isStubbornWord).length;
  const items = [];

  if (goalGap > 0) {
    items.push(["今日任务", `还差 ${goalGap} 题达到每日刷题目标。`]);
  }
  if (counts.due > 0) {
    items.push(["优先复习", `有 ${counts.due} 个到期单词，建议先做“今日复习”。`]);
  }
  if (counts.weak > 0) {
    items.push(["错词强化", `当前范围有 ${counts.weak} 个薄弱词，适合安排一组错词强化。`]);
  }
  if (stubborns > 0) {
    items.push(["顽固词", `有 ${stubborns} 个词反复出错，系统会降低题型难度并提高复现频率。`]);
  }
  if (newGap > 0 && counts.new > 0) {
    items.push(["新词节奏", `今天还可以学习 ${Math.min(newGap, counts.new)} 个新词。`]);
  } else if (state.settings.dailyNewWords > 0 && effectiveNew === 0) {
    items.push(["新词暂停", "复习积压较多，今天先不追加新词。"]);
  }
  if (!items.length) {
    items.push(["状态很好", "今日基础任务已经完成，可以轻量复盘或休息。"]);
  }

  dom.parentAdvice.innerHTML = `<div class="advice-list">${items
    .map(([title, text]) => `<div class="advice-item"><strong>${escapeHtml(title)}</strong>${escapeHtml(text)}</div>`)
    .join("")}</div>`;
}

function renderWeeklyChart() {
  const days = lastSevenDays();
  const maxAttempts = Math.max(1, ...days.map((day) => day.record.attempts || 0));
  dom.weeklyChart.innerHTML = days
    .map((day) => {
      const attempts = day.record.attempts || 0;
      const height = Math.max(8, Math.round((attempts / maxAttempts) * 132));
      const completed = attempts >= dailyGoalForRecord(day.record);
      return `
        <div class="day-bar ${completed ? "completed" : ""}">
          <i style="height:${height}px"></i>
          <b>${attempts}</b>
          <span>${escapeHtml(day.label)}</span>
        </div>
      `;
    })
    .join("");
}

function lastSevenDays() {
  return lastNDays(7);
}

function lastNDays(count) {
  const result = [];
  const cursor = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const day = new Date(cursor);
    day.setDate(cursor.getDate() - i);
    const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    result.push({
      key,
      label: `${day.getMonth() + 1}/${day.getDate()}`,
      record: normalizeDailyRecord(state.daily[key] || emptyDailyRecord())
    });
  }
  return result;
}

function applyInterfaceMode() {
  const mode = state.settings.interfaceMode === "parent" ? "parent" : "child";
  if (document.body) document.body.dataset.interfaceMode = mode;
  dom.interfaceModeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.interfaceMode === mode);
    button.setAttribute("aria-pressed", button.dataset.interfaceMode === mode ? "true" : "false");
  });
  if (dom.interfaceModeSelect) dom.interfaceModeSelect.value = mode;
  if (mode === "child" && runtime.view === "stats") {
    switchView("practice");
  }
  dom.tabs.forEach((tab) => {
    const parentOnly = tab.dataset.view === "stats";
    tab.setAttribute("aria-hidden", mode === "child" && parentOnly ? "true" : "false");
  });
  updateChildCoach();
}

function setInterfaceMode(mode) {
  state.settings.interfaceMode = mode === "parent" ? "parent" : "child";
  saveState();
  applyInterfaceMode();
}

function updateChildCoach() {
  if (!dom.childCoachTitle || !dom.childCoachText) return;
  const copy = themeCopy();
  const daily = dailyRecord();
  const goal = dailyGoalForRecord(daily);
  const counts = taskCounts();
  const remaining = Math.max(0, goal - daily.attempts);
  const newTarget = dailyNewTarget(daily);
  const unstartedCount = unstartedWords(scopedWords()).length;
  const goalCompleted = daily.attempts >= goal;
  const newCompleted = newTarget > 0 && daily.newWords >= newTarget && unstartedCount > 0;
  const newText = newTarget > 0 ? `${copy.missions.new} ${newTarget} 个` : "新词暂缓";
  const reviewParts = [`${copy.missions.due} ${counts.due} 个`];
  if (counts.weak > 0) reviewParts.push(`${copy.missions.weak} ${counts.weak} 个`);
  let title = copy.coachIdleTitle;
  let text = `${newText}，${reviewParts.join("，")}，今日刷题 ${daily.attempts}/${goal}，加油吧！`;
  let targetMode = "free";

  if (goalCompleted || newCompleted) {
    title = goalCompleted && newCompleted ? copy.dailyDone : goalCompleted ? copy.dailyDone : `${copy.missions.new}已完成`;
    const doneParts = [];
    doneParts.push(goalCompleted ? `刷题 ${daily.attempts}/${goal}` : `刷题还差 ${remaining} 题`);
    if (newTarget > 0) doneParts.push(`${copy.missions.new} ${daily.newWords}/${newTarget}`);
    if (counts.due > 0) doneParts.push(`${copy.missions.due} ${counts.due} 个`);
    text = `${doneParts.join(" · ")}。想继续可以加一点。`;
    targetMode = counts.due > 0 ? "due" : counts.weak > 0 ? "weak" : counts.new > 0 ? "new" : "free";
  } else if (counts.due > 0) {
    title = copy.coachTitle;
    targetMode = "due";
  } else if (counts.weak > 0 && daily.attempts >= Math.ceil(goal / 2)) {
    title = copy.coachTitle;
    targetMode = "weak";
  } else if (counts.new > 0 && newTarget > 0) {
    title = copy.coachTitle;
    targetMode = "new";
  } else if (counts.weak > 0) {
    title = copy.coachTitle;
    targetMode = "weak";
  } else {
    title = copy.coachTitle;
  }

  dom.childCoachTitle.textContent = title;
  dom.childCoachText.textContent = text;
  dom.startDailyButton.textContent = goalCompleted ? copy.continueDaily : copy.startDaily;
  dom.startDailyButton.dataset.targetMode = targetMode;
  if (dom.extendTodayButton) {
    const shouldExtendGoal = goalCompleted;
    const shouldExtendNew = newCompleted;
    dom.extendTodayButton.hidden = !(shouldExtendGoal || shouldExtendNew);
    dom.extendTodayButton.textContent = shouldExtendGoal && shouldExtendNew
      ? copy.extendBoth
      : shouldExtendNew
        ? copy.extendNew
        : copy.extendGoal;
  }
}

function extendTodayTarget() {
  const daily = dailyRecord();
  const goalCompleted = daily.attempts >= dailyGoalForRecord(daily);
  const newTarget = dailyNewTarget(daily);
  const newCompleted = newTarget > 0 && daily.newWords >= newTarget && unstartedWords(scopedWords()).length > 0;
  if (!goalCompleted && !newCompleted) return;

  if (goalCompleted) {
    daily.extraGoal += 10;
    daily.goalAwarded = false;
  }
  if (newCompleted) {
    daily.extraNewWords += 5;
    runtime.studyMode = "new";
  }
  saveState();
  updateSummary();
  renderStats();
  renderQuestion();
}

function renderWeakLessons() {
  const groups = new Map();
  for (const word of VOCABULARY) {
    const stat = state.words[word.id];
    if (!stat || stat.attempts === 0) continue;
    const score = weaknessScore(stat);
    if (score <= 0) continue;
    const key = `${word.bookName} 第${word.lesson}课`;
    const item = groups.get(key) || { key, wrong: 0, attempts: 0, score: 0 };
    item.wrong += stat.wrong || 0;
    item.attempts += stat.attempts || 0;
    item.score += score;
    groups.set(key, item);
  }

  const rows = [...groups.values()].sort((a, b) => b.score - a.score).slice(0, 6);
  dom.weakLessonList.innerHTML = renderWeakRows(
    rows,
    (row) => row.key,
    (row) => `错 ${row.wrong} 次 · 已练 ${row.attempts} 次 · 风险 ${Math.round(row.score)}`
  );
}

function renderWeakWords() {
  const rows = VOCABULARY.map((word) => ({ word, stat: state.words[word.id] }))
    .filter((item) => item.stat && item.stat.attempts > 0 && weaknessScore(item.stat) > 0)
    .sort((a, b) => weaknessScore(b.stat) - weaknessScore(a.stat))
    .slice(0, 8);

  dom.weakWordList.innerHTML = renderWeakRows(
    rows,
    (row) => row.word.english,
    (row) => {
      const acc = accuracy(row.stat.correct || 0, row.stat.attempts || 0);
      const last = row.stat.lastWrongAnswer ? ` · 上次错答：${row.stat.lastWrongAnswer}` : "";
      const stubborn = isStubbornStat(row.stat) ? " · 顽固词" : "";
      return `${row.word.bookName} 第${row.word.lesson}课 · 正确率 ${acc}% · 错 ${row.stat.wrong || 0} 次${stubborn}${last}`;
    }
  );
}

function renderWeakRows(rows, titleFor, detailFor) {
  if (!rows.length) {
    return `<div class="empty-state">暂无明显薄弱项。</div>`;
  }
  return `<div class="weak-list">${rows
    .map(
      (row) => `
        <div class="weak-item">
          <strong>${escapeHtml(titleFor(row))}</strong>
          <small>${escapeHtml(detailFor(row))}</small>
        </div>
      `
    )
    .join("")}</div>`;
}

function weaknessScore(stat) {
  return (
    (stat.wrong || 0) * 3 +
    (stat.lapses || 0) * 4 +
    (isStubbornStat(stat) ? 8 : 0) +
    (stat.lastResult === "wrong" ? 5 : 0) +
    Math.max(0, 3 - (stat.tier || 0)) -
    (stat.correct || 0) * 0.25
  );
}

function calcStreakDays() {
  let days = 0;
  const cursor = new Date();
  while (days < 366) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    const record = state.daily[key] ? normalizeDailyRecord(state.daily[key]) : null;
    if (!record || record.attempts < dailyGoalForRecord(record)) break;
    days += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return days;
}

function accuracy(correct, attempts) {
  if (!attempts) return 0;
  return Math.round((correct / attempts) * 100);
}

function switchView(view) {
  runtime.view = view;
  dom.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
  if (dom.settingsShortcut) {
    dom.settingsShortcut.classList.toggle("active", view === "settings");
  }
  dom.views.forEach((panel) => panel.classList.remove("active"));
  document.querySelector(`#${view}View`).classList.add("active");
  if (view === "wrong") renderWrongList();
  if (view === "stats") renderStats();
}

function bindEvents() {
  dom.tabs.forEach((tab) => tab.addEventListener("click", () => switchView(tab.dataset.view)));
  dom.interfaceModeButtons.forEach((button) => {
    button.addEventListener("click", () => setInterfaceMode(button.dataset.interfaceMode));
  });
  dom.themeSelects.forEach((select) => {
    select.addEventListener("change", () => setUiTheme(select.value));
  });
  dom.profileSelect.addEventListener("change", () => switchProfile(dom.profileSelect.value));
  dom.manageProfilesButton.addEventListener("click", () => {
    renderProfileControls();
    dom.profileModal.hidden = false;
    dom.newProfileNameInput.focus({ preventScroll: true });
  });
  dom.closeProfileModal.addEventListener("click", () => {
    dom.profileModal.hidden = true;
  });
  dom.profileModal.addEventListener("click", (event) => {
    if (event.target === dom.profileModal) dom.profileModal.hidden = true;
  });
  dom.createProfileButton.addEventListener("click", () => createProfile(dom.newProfileNameInput.value));
  dom.newProfileNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") createProfile(dom.newProfileNameInput.value);
  });
  dom.renameProfileButton.addEventListener("click", () => renameCurrentProfile(dom.renameProfileInput.value));
  if (dom.settingsShortcut) {
    dom.settingsShortcut.addEventListener("click", () => switchView("settings"));
  }
  if (dom.parentStatsButton) {
    dom.parentStatsButton.addEventListener("click", () => {
      setInterfaceMode("parent");
      switchView("stats");
    });
  }
  dom.startDailyButton.addEventListener("click", () => {
    runtime.studyMode = dom.startDailyButton.dataset.targetMode || "free";
    runtime.wrongOnly = false;
    runtime.sequenceSignature = "";
    runtime.reinforceQueue = [];
    resetGroup();
    switchView("practice");
    renderQuestion();
  });
  if (dom.extendTodayButton) {
    dom.extendTodayButton.addEventListener("click", extendTodayTarget);
  }
  dom.missionCards.forEach((card) => {
    card.addEventListener("click", () => {
      runtime.studyMode = card.dataset.studyMode;
      runtime.wrongOnly = false;
      runtime.sequenceSignature = "";
      runtime.reinforceQueue = [];
      resetGroup();
      renderQuestion();
    });
  });

  dom.bookSelect.addEventListener("change", () => {
    state.settings.book = dom.bookSelect.value;
    state.settings.lesson = "all";
    state.settings.lessonRange = "";
    dom.lessonRangeInput.value = "";
    runtime.wrongOnly = false;
    runtime.reinforceQueue = [];
    resetGroup();
    renderLessonOptions();
    saveState();
    renderQuestion();
  });

  dom.lessonSelect.addEventListener("change", () => {
    state.settings.lesson = dom.lessonSelect.value;
    state.settings.lessonRange = "";
    dom.lessonRangeInput.value = "";
    runtime.wrongOnly = false;
    runtime.reinforceQueue = [];
    resetGroup();
    saveState();
    renderQuestion();
  });

  dom.lessonRangeInput.addEventListener("change", () => {
    state.settings.lessonRange = dom.lessonRangeInput.value.trim();
    if (state.settings.lessonRange) {
      state.settings.lesson = "all";
      dom.lessonSelect.value = "all";
    }
    runtime.wrongOnly = false;
    runtime.reinforceQueue = [];
    resetGroup();
    saveState();
    renderQuestion();
  });

  dom.lessonRangeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      dom.lessonRangeInput.blur();
    }
  });

  dom.orderSelect.addEventListener("change", () => {
    state.settings.order = dom.orderSelect.value;
    runtime.sequenceSignature = "";
    saveState();
    renderQuestion();
  });

  dom.modeSelect.addEventListener("change", () => {
    state.settings.mode = dom.modeSelect.value;
    saveState();
    renderQuestion();
  });

  dom.groupSizeSelect.addEventListener("change", () => {
    state.settings.groupSize = Number(dom.groupSizeSelect.value) || 30;
    runtime.reinforceQueue = [];
    resetGroup();
    saveState();
    updateSummary();
    renderQuestion();
  });

  dom.nextButton.addEventListener("click", renderQuestion);
  dom.skipButton.addEventListener("click", renderQuestion);
  dom.speakButton.addEventListener("click", () => speak(runtime.current?.word?.english || ""));

  dom.practiceWrongButton.addEventListener("click", () => {
    runtime.studyMode = "weak";
    runtime.wrongOnly = true;
    runtime.sequenceSignature = "";
    runtime.reinforceQueue = [];
    resetGroup();
    switchView("practice");
    renderQuestion();
  });

  if (dom.interfaceModeSelect) {
    dom.interfaceModeSelect.addEventListener("change", () => setInterfaceMode(dom.interfaceModeSelect.value));
  }

  dom.dailyGoalInput.addEventListener("change", () => {
    state.settings.dailyGoal = Math.max(5, Number(dom.dailyGoalInput.value) || 30);
    saveState();
    updateSummary();
    renderStats();
  });

  dom.dailyNewInput.addEventListener("change", () => {
    state.settings.dailyNewWords = Math.max(0, Number(dom.dailyNewInput.value) || 0);
    saveState();
    updateSummary();
    renderQuestion();
  });

  dom.autoSpeakInput.addEventListener("change", () => {
    state.settings.autoSpeak = dom.autoSpeakInput.checked;
    saveState();
  });

  dom.exportButton.addEventListener("click", exportRecords);
  dom.importInput.addEventListener("change", importRecords);
  dom.resetButton.addEventListener("click", resetRecords);
  dom.initializeButton.addEventListener("click", initializeCurrentProfile);
  dom.closeGroupSummary.addEventListener("click", () => {
    dom.groupSummaryModal.hidden = true;
  });
  dom.startNextGroupButton.addEventListener("click", () => {
    dom.groupSummaryModal.hidden = true;
    resetGroup();
    renderQuestion();
  });
  dom.groupSummaryModal.addEventListener("click", (event) => {
    if (event.target === dom.groupSummaryModal) dom.groupSummaryModal.hidden = true;
  });
}

function exportRecords() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `nce-word-records-${todayKey()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function importRecords(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(String(reader.result));
      state = mergeState(defaultState(), imported);
      saveState();
      syncControls();
      renderBookOptions();
      renderQuestion();
      renderWrongList();
      renderStats();
      alert("记录已导入。");
    } catch {
      alert("导入失败，请选择正确的记录文件。");
    }
  };
  reader.readAsText(file, "utf-8");
  event.target.value = "";
}

function resetRecords() {
  if (!confirm("确定只清空今天的刷题记录吗？单词熟练度和错词本不会删除。")) return;
  state.daily[todayKey()] = emptyDailyRecord();
  runtime.lastReward = null;
  saveState();
  updateSummary();
  renderStats();
}

function initializeCurrentProfile() {
  if (!confirm("初始化会清空当前账户的全部学习记录、错词、奖励和设置。确定继续吗？")) return;
  const typed = prompt("请输入“初始化”两个字确认。");
  if (typed !== "初始化") return;
  state = defaultState();
  runtime.streak = 0;
  runtime.lastReward = null;
  runtime.reinforceQueue = [];
  runtime.recentWordIds = [];
  dom.groupSummaryModal.hidden = true;
  resetGroup();
  migrateSettings();
  saveState();
  refreshAfterProfileChange();
  renderQuestion();
}

function syncControls() {
  if (dom.interfaceModeSelect) dom.interfaceModeSelect.value = state.settings.interfaceMode || "child";
  applyTheme();
  dom.lessonRangeInput.value = state.settings.lessonRange || "";
  dom.orderSelect.value = state.settings.order;
  dom.modeSelect.value = state.settings.mode;
  dom.groupSizeSelect.value = String(state.settings.groupSize || 30);
  if (dom.groupSizeSelect.value !== String(state.settings.groupSize || 30)) {
    state.settings.groupSize = 30;
    dom.groupSizeSelect.value = "30";
  }
  dom.dailyGoalInput.value = state.settings.dailyGoal;
  dom.dailyNewInput.value = state.settings.dailyNewWords ?? 10;
  dom.autoSpeakInput.checked = state.settings.autoSpeak;
  applyInterfaceMode();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function init() {
  if (!VOCABULARY.length) {
    dom.questionTitle.textContent = "词库还没有生成";
    dom.promptBox.textContent = "请先运行词库提取脚本。";
    return;
  }

  migrateSettings();
  renderProfileControls();
  syncControls();
  renderBookOptions();
  bindEvents();
  applyInterfaceMode();
  selectInitialStudyMode();
  updateSummary();
  renderQuestion();

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
}

init();
