// プログレスバー
window.addEventListener('scroll', function() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = scrolled + '%';
});

// 4. ダークモード切り替え処理
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
  // 保存されたテーマの読み込み
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = '☀️';
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// 1. ポモドーロタイマー処理
let timeLeft = 25 * 60; // 25分
let timerId = null;
let isWorkTime = true;

const display = document.getElementById('timer-display');
const startBtn = document.getElementById('timer-start-btn');
const resetBtn = document.getElementById('timer-reset-btn');
const statusText = document.getElementById('timer-status');

function updateDisplay() {
  if (!display) return;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

if (startBtn) {
  startBtn.addEventListener('click', () => {
    if (timerId === null) {
      // スタート
      timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) {
          clearInterval(timerId);
          timerId = null;
          alert(isWorkTime ? '25分の集中タイム終了！5分間休憩しましょう。' : '休憩終了！次の集中タイムを開始しましょう。');
          isWorkTime = !isWorkTime;
          timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
          statusText.textContent = isWorkTime ? '集中タイム（25分）' : '休憩タイム（5分）';
          startBtn.textContent = 'スタート';
          updateDisplay();
        }
      }, 1000);
      startBtn.textContent = '一時停止';
    } else {
      // 一時停止
      clearInterval(timerId);
      timerId = null;
      startBtn.textContent = '再開';
    }
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = 25 * 60;
    if (statusText) statusText.textContent = '集中タイムをスタートしましょう！';
    if (startBtn) startBtn.textContent = 'スタート';
    updateDisplay();
  });
}
