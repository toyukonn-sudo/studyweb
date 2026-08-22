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
