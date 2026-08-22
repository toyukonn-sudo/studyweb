* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

/* 基本カラー変数 */
:root {
  --bg-color: #f8f9fa;
  --card-bg: #ffffff;
  --text-color: #2b2b2b;
  --text-sub: #64748b;
  --border-color: #e2e8f0;
  --primary-color: #0066cc;
  --primary-hover: #0052a3;
  --header-bg: #ffffff;
  --box-bg: #f0f7ff;
}

/* ダークモード設定 */
body.dark-mode {
  --bg-color: #0f172a;
  --card-bg: #1e293b;
  --text-color: #f8fafc;
  --text-sub: #94a3b8;
  --border-color: #334155;
  --primary-color: #38bdf8;
  --primary-hover: #0284c7;
  --header-bg: #1e293b;
  --box-bg: #0c4a6e;
}

body {
  font-family: "Helvetica Neue", Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.85;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s;
}

#progress-bar {
  position: fixed; top: 0; left: 0; height: 4px;
  background-color: var(--primary-color); width: 0%; z-index: 9999;
}

/* ヘッダーレイアウト */
.site-header {
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 12px 0;
  position: sticky; top: 0; z-index: 1000;
  transition: background-color 0.3s, border-color 0.3s;
}

.container { max-width: 960px; margin: 0 auto; padding: 0 20px; }

.header-container {
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
}

.header-left { display: flex; align-items: center; gap: 24px; }
.logo { font-size: 1.4rem; font-weight: 700; color: var(--primary-color); text-decoration: none; }
.nav-menu ul { list-style: none; display: flex; gap: 16px; }
.nav-menu a { text-decoration: none; color: var(--text-sub); font-weight: 600; font-size: 0.95rem; }
.nav-menu a:hover { color: var(--primary-color); }

.header-tools { display: flex; align-items: center; gap: 16px; }

/* 改善点1: ヘッダータイマーのスタイル */
.header-timer {
  display: flex; align-items: center; gap: 8px;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  padding: 4px 12px; border-radius: 20px;
}
.timer-badge { font-size: 0.75rem; font-weight: 700; color: var(--primary-color); }
.timer-digits { font-family: monospace; font-size: 1.1rem; font-weight: 700; color: var(--text-color); min-width: 48px; }
.timer-btn {
  background: none; border: none; cursor: pointer; font-size: 0.9rem;
  color: var(--text-sub); border-radius: 4px; padding: 2px 6px;
}
.timer-btn:hover { color: var(--primary-color); }

/* 改善点2: ダークモード切り替えボタン */
.theme-toggle-btn {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 50%; width: 36px; height: 36px;
  cursor: pointer; font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-color); transition: 0.2s;
}

/* メインコンテンツ */
.main-content { padding: 40px 0 80px; }

.hero-section {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px; padding: 40px; margin-bottom: 40px; text-align: center;
}
.category {
  display: inline-block; background-color: var(--box-bg); color: var(--primary-color);
  font-size: 0.85rem; font-weight: 600; padding: 4px 12px; border-radius: 20px; margin-bottom: 16px;
}
.hero-title { font-size: 2rem; color: var(--text-color); font-weight: 700; margin-bottom: 16px; }
.hero-description { color: var(--text-sub); max-width: 700px; margin: 0 auto; }

/* 記事カード配置 */
.section-heading { font-size: 1.5rem; color: var(--text-color); margin-bottom: 24px; font-weight: 700; }
.related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.related-card {
  display: block; background-color: var(--card-bg); border: 1px solid var(--border-color);
  border-radius: 8px; padding: 24px; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
}
.related-card:hover { transform: translateY(-3px); border-color: var(--primary-color); }
.related-tag { font-size: 0.75rem; font-weight: 700; color: var(--primary-color); margin-bottom: 8px; }
.related-card-title { font-size: 1.05rem; font-weight: 700; color: var(--text-color); margin-bottom: 8px; line-height: 1.4; }
.related-card-snippet { font-size: 0.85rem; color: var(--text-sub); line-height: 1.5; }

.sns-btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 10px 28px; border-radius: 30px; color: #ffffff; text-decoration: none; font-weight: 600;
}

.site-footer {
  text-align: center; padding: 30px 20px; font-size: 0.85rem; color: var(--text-sub);
  border-top: 1px solid var(--border-color); background-color: var(--header-bg);
}

@media (max-width: 768px) {
  .header-container { flex-direction: column; align-items: flex-start; }
  .header-tools { width: 100%; justify-content: space-between; margin-top: 8px; }
  .hero-section { padding: 24px; }
  .hero-title { font-size: 1.5rem; }
}
