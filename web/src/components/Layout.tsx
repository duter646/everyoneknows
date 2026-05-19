import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isQuiz = location.pathname === "/quiz";

  return (
    <div className="app">
      {!isQuiz && (
        <header className="nav">
          <button className="brand" onClick={() => navigate("/")}>
            <span className="brand-logo">EK</span>
            <span className="brand-text">EveryoneKnows</span>
          </button>
          <nav className="nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>首页</NavLink>
            <NavLink to="/leaderboard" className={({ isActive }) => (isActive ? "active" : "")}>排行榜</NavLink>
          </nav>
        </header>
      )}
      <main className="main">
        <Outlet />
      </main>
      {!isQuiz && (
        <footer className="footer">
          <span>EveryoneKnows · 用知识点燃胜负欲</span>
          <a href="https://github.com/duter646/everyoneknows" target="_blank" rel="noopener noreferrer">GitHub</a>
        </footer>
      )}
    </div>
  );
}
