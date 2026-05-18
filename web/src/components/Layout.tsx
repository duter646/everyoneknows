import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="app">
      <header className="nav">
        <button className="brand" onClick={() => navigate("/")}>
          <span>EveryoneKnows</span>
          <em>世界知识擂台</em>
        </button>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>首页</NavLink>
          <NavLink to="/leaderboard" className={({ isActive }) => (isActive ? "active" : "")}>排行榜</NavLink>
          <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>管理端</NavLink>
        </nav>
        <div className="nav-cta">
          {location.pathname !== "/quiz" && (
            <button className="btn" onClick={() => navigate("/quiz?count=20")}>
              开始 20 题挑战
            </button>
          )}
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <span>EveryoneKnows · 用知识点燃胜负欲</span>
        <span>题库可持续扩容 · 排行榜实时更新</span>
      </footer>
    </div>
  );
}
