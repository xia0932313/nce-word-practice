const VOCABULARY = Array.isArray(window.NCE_VOCABULARY) ? window.NCE_VOCABULARY : [];
const STORAGE_KEY = "nce-word-practice-state-v1";
const MODES = ["enToCn", "cnToEn", "spell", "initials", "listen", "judge"];

const dom = {
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  bookSelect: document.querySelector("#bookSelect"),
  lessonSelect: document.querySelector("#lessonSelect"),
  lessonRangeInput: document.querySelector("#lessonRangeInput"),
  orderSelect: document.querySelector("#orderSelect"),
  modeSelect: document.querySelector("#modeSelect"),
  groupSizeSelect: document.querySelector("#groupSizeSelect"),
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
  rewardBox: document.querySelector("#rewardBox"),
  wrongList: document.querySelector("#wrongList"),
  practiceWrongButton: document.querySelector("#practiceWrongButton"),
  statsGrid: document.querySelector("#statsGrid"),
  bookProgress: document.querySelector("#bookProgress"),
  dailyGoalInput: document.querySelector("#dailyGoalInput"),
  autoSpeakInput: document.querySelector("#autoSpeakInput"),
  bookOneOnlyInput: document.querySelector("#bookOneOnlyInput"),
  exportButton: document.querySelector("#exportButton"),
  importInput: document.querySelector("#importInput"),
  resetButton: document.querySelector("#resetButton")
};

let state = loadState();
let runtime = {
  current: null,
  answered: false,
  sequence: [],
  sequenceIndex: 0,
  wrongOnly: false,
  streak: 0,
  lastReward: null,
  group: {
    done: 0,
    correct: 0,
    finished: false
  }
};

function defaultState() {
  return {
    settings: {
      book: "1",
      lesson: "all",
      lessonRange: "",
      order: "smart",
      mode: "mixed",
      groupSize: 30,
      dailyGoal: 30,
      autoSpeak: true,
      bookOneOnly: false
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

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return mergeState(defaultState(), parsed);
  } catch {
    return defaultState();
  }
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function dailyRecord() {
  const key = todayKey();
  if (!state.daily[key]) {
    state.daily[key] = { attempts: 0, correct: 0, goalAwarded: false };
  }
  return state.daily[key];
}

function wordStat(id) {
  if (!state.words[id]) {
    state.words[id] = {
      attempts: 0,
      correct: 0,
      wrong: 0,
      streak: 0,
      tier: 0,
      lastResult: "",
      lastSeen: 0
    };
  }
  return state.words[id];
}

function books() {
  const map = new Map();
  VOCABULARY.forEach((word) => {
    if (state.settings.bookOneOnly && word.book !== 1) return;
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

function selectedWords() {
  let pool = VOCABULARY.filter((word) => String(word.book) === String(state.settings.book));
  const range = parseLessonRange(state.settings.lessonRange);
  if (range) {
    pool = pool.filter((word) => word.lesson >= range.start && word.lesson <= range.end);
  } else if (state.settings.lesson !== "all") {
    pool = pool.filter((word) => String(word.lesson) === String(state.settings.lesson));
  }
  if (runtime.wrongOnly) {
    pool = pool.filter((word) => isWrongWord(word.id));
  }
  return pool;
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
  return Boolean(stat && (stat.wrong > 0 || stat.lastResult === "wrong") && stat.tier < 4);
}

function masteredWord(id) {
  const stat = state.words[id];
  return Boolean(stat && stat.tier >= 4 && stat.correct >= 3);
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

function optionText(word, field) {
  return field === "english" ? word.english : meaningPreview(word.chinese);
}

function buildOptions(answer, field, pool) {
  const seen = new Set([optionText(answer, field)]);
  const candidates = sample(
    pool.filter((word) => word.id !== answer.id && !seen.has(optionText(word, field))),
    8
  );
  const options = [answer];
  candidates.forEach((word) => {
    const text = optionText(word, field);
    if (!seen.has(text) && options.length < 4) {
      seen.add(text);
      options.push(word);
    }
  });
  return shuffle(options);
}

function pickMode() {
  if (state.settings.mode !== "mixed") return state.settings.mode;
  return MODES[Math.floor(Math.random() * MODES.length)];
}

function smartWeight(word) {
  const stat = state.words[word.id];
  if (!stat) return 8;
  const wrongBoost = stat.wrong * 4 + (stat.lastResult === "wrong" ? 10 : 0);
  const tierPenalty = stat.tier * 1.8;
  const freshness = Math.max(0, 6 - Math.floor((Date.now() - (stat.lastSeen || 0)) / 60000));
  return Math.max(1, 8 + wrongBoost - tierPenalty - freshness);
}

function pickWord(pool) {
  if (!pool.length) return null;

  if (state.settings.order === "sequential") {
    const signature = pool.map((word) => word.id).join("|");
    if (runtime.sequenceSignature !== signature) {
      runtime.sequence = [...pool].sort((a, b) => a.lesson - b.lesson || a.id.localeCompare(b.id));
      runtime.sequenceIndex = 0;
      runtime.sequenceSignature = signature;
    }
    const word = runtime.sequence[runtime.sequenceIndex % runtime.sequence.length];
    runtime.sequenceIndex += 1;
    return word;
  }

  if (state.settings.order === "random") {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const total = pool.reduce((sum, word) => sum + smartWeight(word), 0);
  let ticket = Math.random() * total;
  for (const word of pool) {
    ticket -= smartWeight(word);
    if (ticket <= 0) return word;
  }
  return pool[pool.length - 1];
}

function makeQuestion() {
  const pool = selectedWords();
  const word = pickWord(pool);
  if (!word) return null;
  const mode = pickMode();

  if (mode === "enToCn") {
    return {
      mode,
      word,
      title: "英文选中文",
      prompt: word.english,
      sub: word.phonetic,
      options: buildOptions(word, "chinese", pool),
      optionField: "chinese"
    };
  }

  if (mode === "cnToEn") {
    return {
      mode,
      word,
      title: "中文选英文",
      prompt: meaningPreview(word.chinese),
      sub: `第${word.lesson}课`,
      options: buildOptions(word, "english", pool),
      optionField: "english"
    };
  }

  if (mode === "listen") {
    return {
      mode,
      word,
      title: "听音选义",
      prompt: "听发音",
      sub: word.phonetic || `第${word.lesson}课`,
      options: buildOptions(word, "chinese", pool),
      optionField: "chinese"
    };
  }

  if (mode === "judge") {
    const pairIsRight = Math.random() > 0.45;
    const other = sample(pool.filter((item) => item.id !== word.id), 1)[0] || word;
    return {
      mode,
      word,
      title: "判断对错",
      prompt: word.english,
      sub: pairIsRight ? meaningPreview(word.chinese) : meaningPreview(other.chinese),
      pairIsRight
    };
  }

  if (mode === "initials") {
    return {
      mode,
      word,
      title: "首字母填空",
      prompt: maskWord(word.english),
      sub: meaningPreview(word.chinese)
    };
  }

  return {
    mode: "spell",
    word,
    title: "单词填空",
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
    dom.questionMeta.textContent = "没有可练习的单词";
    dom.questionTitle.textContent = runtime.wrongOnly ? "当前范围没有错词" : "请选择有单词的范围";
    dom.promptBox.innerHTML = "";
    dom.answerArea.innerHTML = "";
    return;
  }

  const stat = wordStat(question.word.id);
  dom.questionMeta.textContent = `${question.word.bookName} · 第${question.word.lesson}课 · 已练 ${stat.attempts} 次 · 错 ${stat.wrong} 次 · 熟练度 ${stat.tier}/5`;
  dom.questionTitle.textContent = question.title;
  dom.promptBox.innerHTML = `
    <span class="prompt-main">${escapeHtml(question.prompt)}</span>
    <span class="prompt-sub">${escapeHtml(question.sub || "")}</span>
  `;

  if (["enToCn", "cnToEn", "listen"].includes(question.mode)) {
    renderChoices(question);
  } else if (question.mode === "judge") {
    renderJudge(question);
  } else {
    renderTextAnswer(question);
  }

  if (question.mode === "listen" || state.settings.autoSpeak) {
    setTimeout(() => speak(question.word.english), 80);
  }

  updateSummary();
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
      <button class="choice" data-judge="true">对</button>
      <button class="choice" data-judge="false">不对</button>
    </div>
  `;
  dom.answerArea.querySelectorAll(".choice").forEach((button) => {
    button.addEventListener("click", () => {
      const answer = button.dataset.judge === "true";
      finalizeAnswer(answer === question.pairIsRight, button);
    });
  });
}

function renderTextAnswer(question) {
  dom.answerArea.innerHTML = `
    <form class="text-answer" id="textAnswerForm">
      <input id="textAnswerInput" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="输入英文单词">
      <button class="primary" type="submit">提交</button>
    </form>
  `;
  const form = document.querySelector("#textAnswerForm");
  const input = document.querySelector("#textAnswerInput");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const userAnswer = normalizeAnswer(input.value);
    const rightAnswer = normalizeAnswer(question.word.english);
    finalizeAnswer(userAnswer === rightAnswer, input);
  });
  input.focus({ preventScroll: true });
}

function answerChoice(id) {
  const question = runtime.current;
  if (!question || runtime.answered) return;
  const button = [...dom.answerArea.querySelectorAll("[data-answer]")].find((item) => item.dataset.answer === id);
  finalizeAnswer(id === question.word.id, button);
}

function finalizeAnswer(isCorrect, target) {
  const question = runtime.current;
  if (!question || runtime.answered) return;
  runtime.answered = true;

  const stat = wordStat(question.word.id);
  stat.attempts += 1;
  stat.lastSeen = Date.now();
  stat.lastResult = isCorrect ? "correct" : "wrong";

  state.totals.attempts += 1;
  const daily = dailyRecord();
  daily.attempts += 1;
  runtime.group.done += 1;

  if (isCorrect) {
    stat.correct += 1;
    stat.streak += 1;
    stat.tier = Math.min(5, stat.tier + 1);
    state.totals.correct += 1;
    daily.correct += 1;
    runtime.group.correct += 1;
    runtime.streak += 1;
  } else {
    stat.wrong += 1;
    stat.streak = 0;
    stat.tier = Math.max(0, stat.tier - 1);
    runtime.streak = 0;
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
  dom.feedback.className = `feedback ${isCorrect ? "good" : "bad"}`;
  const prefix = isCorrect ? "答对了" : "再记一次";
  dom.feedback.innerHTML = `
    <strong>${prefix}：</strong>
    ${escapeHtml(word.english)}
    <span class="pill">${escapeHtml(word.phonetic || "音标待补")}</span>
    <br>${escapeHtml(meaningPreview(word.chinese))}
  `;
}

function maybeReward(isCorrect, daily, groupFinished) {
  if (isCorrect && [5, 10, 20, 40].includes(runtime.streak)) {
    addReward({
      type: "star",
      text: `连对 ${runtime.streak} 题，获得星能徽章`,
      detail: "保持节奏，单词正在变熟。"
    });
  }
  if (!daily.goalAwarded && daily.attempts >= state.settings.dailyGoal) {
    daily.goalAwarded = true;
    addReward({
      type: "goal",
      text: "今日目标完成，获得满格能量卡",
      detail: "今天的基础量已经达标。"
    });
  }
  if (groupFinished) {
    addReward({
      type: "group",
      text: `完成一组 ${runtime.group.done} 题`,
      detail: `本组正确率 ${accuracy(runtime.group.correct, runtime.group.done)}%。`
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
  dom.feedback.innerHTML += `<br><strong>本组完成：</strong> ${runtime.group.done} 题，正确 ${runtime.group.correct} 题。`;
}

function resetGroup() {
  runtime.group = {
    done: 0,
    correct: 0,
    finished: false
  };
}

function groupTarget() {
  return Math.max(1, Number(state.settings.groupSize) || 30);
}

function renderReward(reward) {
  const item = normalizeReward(reward);
  if (!item) {
    dom.rewardBox.textContent = "完成练习后出现";
    return;
  }
  dom.rewardBox.innerHTML = `
    <div class="reward-card">
      <div class="reward-art ${escapeHtml(item.type)}" aria-hidden="true"></div>
      <div class="reward-text">
        <strong>${escapeHtml(item.text)}</strong>
        <span>${escapeHtml(item.detail || "继续积累小胜利。")}</span>
      </div>
    </div>
  `;
}

function normalizeReward(reward) {
  if (!reward) return null;
  if (typeof reward === "string") {
    return { type: "star", text: reward, detail: "" };
  }
  return {
    type: reward.type || "star",
    text: reward.text || "获得奖励",
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

function updateSummary() {
  const daily = dailyRecord();
  const goal = Number(state.settings.dailyGoal) || 30;
  const progress = Math.min(100, Math.round((daily.attempts / goal) * 100));
  dom.dailyText.textContent = `${daily.attempts} / ${goal}`;
  dom.dailyBar.style.width = `${progress}%`;
  dom.dailyStrip.classList.toggle("unfinished", daily.attempts < goal);
  dom.dailyTitle.textContent = daily.attempts >= goal ? "今日已完成" : "今日未完成";

  dom.streakCount.textContent = runtime.streak;
  dom.accuracyNow.textContent = `${accuracy(state.totals.correct, state.totals.attempts)}%`;
  dom.wrongCount.textContent = Object.keys(state.words).filter(isWrongWord).length;
  dom.groupCount.textContent = `${runtime.group.done}/${groupTarget()}`;
  renderReward(runtime.lastReward || state.rewards[0]);
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
    dom.wrongList.innerHTML = `<div class="empty-state">暂时没有错词。</div>`;
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
  const practiced = Object.keys(state.words).filter((id) => state.words[id].attempts > 0).length;
  const streakDays = calcStreakDays();

  dom.statsGrid.innerHTML = [
    ["总刷题", state.totals.attempts],
    ["总正确率", `${accuracy(state.totals.correct, state.totals.attempts)}%`],
    ["已练单词", practiced],
    ["已掌握", `${mastered}/${totalWords}`],
    ["今日刷题", daily.attempts],
    ["今日正确", daily.correct],
    ["连续天数", streakDays],
    ["错词数量", wrongs]
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
}

function calcStreakDays() {
  let days = 0;
  const cursor = new Date();
  while (days < 366) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    if (!state.daily[key] || state.daily[key].attempts < state.settings.dailyGoal) break;
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
  dom.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
  dom.views.forEach((panel) => panel.classList.remove("active"));
  document.querySelector(`#${view}View`).classList.add("active");
  if (view === "wrong") renderWrongList();
  if (view === "stats") renderStats();
}

function bindEvents() {
  dom.tabs.forEach((tab) => tab.addEventListener("click", () => switchView(tab.dataset.view)));

  dom.bookSelect.addEventListener("change", () => {
    state.settings.book = dom.bookSelect.value;
    state.settings.lesson = "all";
    state.settings.lessonRange = "";
    dom.lessonRangeInput.value = "";
    runtime.wrongOnly = false;
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
    resetGroup();
    saveState();
    updateSummary();
    renderQuestion();
  });

  dom.nextButton.addEventListener("click", renderQuestion);
  dom.skipButton.addEventListener("click", renderQuestion);
  dom.speakButton.addEventListener("click", () => speak(runtime.current?.word?.english || ""));

  dom.practiceWrongButton.addEventListener("click", () => {
    runtime.wrongOnly = true;
    switchView("practice");
    renderQuestion();
  });

  dom.dailyGoalInput.addEventListener("change", () => {
    state.settings.dailyGoal = Math.max(5, Number(dom.dailyGoalInput.value) || 30);
    saveState();
    updateSummary();
    renderStats();
  });

  dom.autoSpeakInput.addEventListener("change", () => {
    state.settings.autoSpeak = dom.autoSpeakInput.checked;
    saveState();
  });

  dom.bookOneOnlyInput.addEventListener("change", () => {
    state.settings.bookOneOnly = dom.bookOneOnlyInput.checked;
    state.settings.book = "1";
    state.settings.lessonRange = "";
    dom.lessonRangeInput.value = "";
    resetGroup();
    saveState();
    renderBookOptions();
    renderStats();
    renderQuestion();
  });

  dom.exportButton.addEventListener("click", exportRecords);
  dom.importInput.addEventListener("change", importRecords);
  dom.resetButton.addEventListener("click", resetRecords);
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
  if (!confirm("确定清空练习记录吗？词库不会删除。")) return;
  const settings = state.settings;
  state = defaultState();
  state.settings = settings;
  runtime.streak = 0;
  runtime.lastReward = null;
  resetGroup();
  saveState();
  renderQuestion();
  renderWrongList();
  renderStats();
}

function syncControls() {
  dom.lessonRangeInput.value = state.settings.lessonRange || "";
  dom.orderSelect.value = state.settings.order;
  dom.modeSelect.value = state.settings.mode;
  dom.groupSizeSelect.value = String(state.settings.groupSize || 30);
  if (dom.groupSizeSelect.value !== String(state.settings.groupSize || 30)) {
    state.settings.groupSize = 30;
    dom.groupSizeSelect.value = "30";
  }
  dom.dailyGoalInput.value = state.settings.dailyGoal;
  dom.autoSpeakInput.checked = state.settings.autoSpeak;
  dom.bookOneOnlyInput.checked = state.settings.bookOneOnly;
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

  syncControls();
  renderBookOptions();
  bindEvents();
  updateSummary();
  renderQuestion();

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
}

init();
