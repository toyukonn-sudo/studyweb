// 1. スクロールプログレスバー
window.addEventListener('scroll', function() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = scrolled + '%';
});

// 2. ダークモード管理
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
  } else {
    document.body.classList.remove('dark-mode');
    if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
  }

  if (themeToggleBtn) {
    themeToggleBtn.onclick = function() {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
    };
  }
}

// 3. ヘッダーポモドーロタイマー
let timeLeft = 25 * 60;
let timerId = null;
let isWorkTime = true;

const display = document.getElementById('timer-display');
const startBtn = document.getElementById('timer-start-btn');
const resetBtn = document.getElementById('timer-reset-btn');
const badge = document.getElementById('timer-status-badge');

function updateTimerDisplay() {
  if (!display) return;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

if (startBtn) {
  startBtn.addEventListener('click', () => {
    if (timerId === null) {
      timerId = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
          clearInterval(timerId);
          timerId = null;
          alert(isWorkTime ? '25分集中終了！5分間休憩しましょう。' : '休憩終了！集中タイムをスタートします。');
          isWorkTime = !isWorkTime;
          timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
          if (badge) badge.textContent = isWorkTime ? '25分集中' : '5分休憩';
          startBtn.textContent = '▶';
          updateTimerDisplay();
        }
      }, 1000);
      startBtn.textContent = '⏸';
    } else {
      clearInterval(timerId);
      timerId = null;
      startBtn.textContent = '▶';
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      clearInterval(timerId);
      timerId = null;
      isWorkTime = true;
      timeLeft = 25 * 60;
      if (badge) badge.textContent = '25分集中';
      if (startBtn) startBtn.textContent = '▶';
      updateTimerDisplay();
    });
  }
}

// 4. スケジュール管理ロジック
function initScheduleApp() {
  const scheduleForm = document.getElementById('schedule-form');
  const scheduleList = document.getElementById('schedule-list');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');

  if (!scheduleForm || !scheduleList) return;

  let tasks = JSON.parse(localStorage.getItem('studylab_schedule_tasks')) || [];

  function saveAndRender() {
    localStorage.setItem('studylab_schedule_tasks', JSON.stringify(tasks));
    renderSchedule();
  }

  function updateDashboard() {
    const totalCount = tasks.length;
    const completedCount = tasks.filter(t => t.completed).length;
    const totalPomo = tasks.reduce((sum, t) => sum + parseInt(t.pomo || 1), 0);

    const totalEl = document.getElementById('dash-total-count');
    const compEl = document.getElementById('dash-completed-count');
    const pomoEl = document.getElementById('dash-total-pomo');

    if (totalEl) totalEl.textContent = totalCount;
    if (compEl) compEl.textContent = completedCount;
    if (pomoEl) pomoEl.textContent = `${totalPomo} コマ (${totalPomo * 25}分)`;
  }

  function renderSchedule() {
    scheduleList.innerHTML = '';
    updateDashboard();

    if (tasks.length === 0) {
      scheduleList.innerHTML = `<div class="empty-msg">📌 今日の計画はまだ登録されていません。<br>上のフォームから学習タスクを入力しましょう！</div>`;
      return;
    }

    tasks.forEach((task, index) => {
      const item = document.createElement('div');
      item.className = `schedule-item ${task.completed ? 'completed' : ''}`;
      
      item.innerHTML = `
        <div class="task-left">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
          <span class="task-badge">${task.subject}</span>
          <span class="task-title-text">${escapeHtml(task.title)}</span>
        </div>
        <div class="task-right">
          <span class="task-pomo-badge">⏱ ${task.pomo}コマ (${task.pomo * 25}分)</span>
          <button class="delete-task-btn" data-index="${index}" title="削除">✕</button>
        </div>
      `;

      scheduleList.appendChild(item);
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  // タスク追加処理
  scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = document.getElementById('task-subject').value;
    const title = document.getElementById('task-title').value.trim();
    const pomo = document.getElementById('task-pomo').value;

    if (!title) return;

    tasks.push({ subject, title, pomo, completed: false });
    saveAndRender();

    document.getElementById('task-title').value = '';
  });

  // タスク完了 toggle & 削除
  scheduleList.addEventListener('click', (e) => {
    const index = e.target.dataset.index;
    if (index === undefined) return;

    if (e.target.classList.contains('task-checkbox')) {
      tasks[index].completed = e.target.checked;
      saveAndRender();
    } else if (e.target.classList.contains('delete-task-btn')) {
      tasks.splice(index, 1);
      saveAndRender();
    }
  });

  // 完了済みを一括消去
  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', () => {
      tasks = tasks.filter(task => !task.completed);
      saveAndRender();
    });
  }

  renderSchedule();
}

// ページのロード完了時に実行
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScheduleApp();
});
