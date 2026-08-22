// プログレスバーの更新
window.addEventListener('scroll', function() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = scrolled + '%';
});

// 改善点2: ダークモード（ナイトモード）の動作ロジック
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

// DOM読み込み完了時にテーマを即時適用
document.addEventListener('DOMContentLoaded', initTheme);

// 改善点1: ヘッダー用ポモドーロタイマーロジック
let timeLeft = 25 * 60; // 25分
let timerId = null;
let isWorkTime = true;

const display = document.getElementById('timer-display');
const startBtn = document.getElementById('timer-start-btn');
const resetBtn = document.getElementById('timer-reset-btn');
const badge = document.getElementById('timer-status-badge');

function updateDisplay() {
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
        updateDisplay();
        if (timeLeft <= 0) {
          clearInterval(timerId);
          timerId = null;
          alert(isWorkTime ? '25分の集中タイム終了！5分間休憩しましょう。' : '休憩終了！次の集中タイムを開始しましょう。');
          isWorkTime = !isWorkTime;
          timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
          if (badge) badge.textContent = isWorkTime ? '25分集中' : '5分休憩';
          startBtn.textContent = '▶';
          updateDisplay();
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
      updateDisplay();
    });
  }
}
// スケジュール機能のロジック
document.addEventListener('DOMContentLoaded', () => {
  const scheduleForm = document.getElementById('schedule-form');
  const scheduleList = document.getElementById('schedule-list');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');

  if (!scheduleForm || !scheduleList) return;

  // ローカルストレージから取得
  let tasks = JSON.parse(localStorage.getItem('studylab_tasks')) || [];

  function saveTasks() {
    localStorage.setItem('studylab_tasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    scheduleList.innerHTML = '';

    if (tasks.length === 0) {
      scheduleList.innerHTML = `<div class="empty-schedule-msg">📌 まだスケジュールが登録されていません。<br>上のフォームから本日の学習タスクを追加しましょう！</div>`;
      return;
    }

    tasks.forEach((task, index) => {
      const item = document.createElement('div');
      item.className = `schedule-item ${task.completed ? 'completed' : ''}`;
      
      item.innerHTML = `
        <div class="task-info-left">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
          <span class="task-badge">${task.subject}</span>
          <span class="task-title-text">${escapeHtml(task.title)}</span>
        </div>
        <div style="display: flex; align-items: center;">
          <span class="task-time-badge">⏱ ${task.time}</span>
          <button class="delete-task-btn" data-index="${index}">✕</button>
        </div>
      `;

      scheduleList.appendChild(item);
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  // タスク追加
  scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = document.getElementById('task-subject').value;
    const title = document.getElementById('task-title').value.trim();
    const time = document.getElementById('task-time').value;

    if (!title) return;

    tasks.push({ subject, title, time, completed: false });
    saveTasks();
    renderTasks();

    document.getElementById('task-title').value = '';
  });

  // チェック・削除イベント
  scheduleList.addEventListener('click', (e) => {
    const index = e.target.dataset.index;
    if (index === undefined) return;

    if (e.target.classList.contains('task-checkbox')) {
      tasks[index].completed = e.target.checked;
      saveTasks();
      renderTasks();
    } else if (e.target.classList.contains('delete-task-btn')) {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }
  });

  // 完了済み削除
  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', () => {
      tasks = tasks.filter(task => !task.completed);
      saveTasks();
      renderTasks();
    });
  }

  renderTasks();
});
