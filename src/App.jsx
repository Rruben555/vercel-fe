import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate
} from "react-router-dom";

import api from "./api/api";

import Character from "./Pages/Character";
import Weapon from "./Pages/Weapon";
import TierList from "./Pages/TierList";
import Register from "./Pages/Register";
import Login from "./Pages/Login";

import Posts from "./Pages/Posts";            
import PostDetail from "./Pages/PostDetail";

import "./App.css";

function AppContent() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [logoutPopup, setLogoutPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Proteksi halaman /posts/create
  useEffect(() => {
    if (location.pathname === "/posts/create" && !user) {
      setShowLoginPopup(true);
    }
  }, [location, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <div>

      {/* POPUP LOGIN */}
      {showLoginPopup && (
        <div className="forum-popup-overlay">
          <div className="forum-popup-box">
            <h2>Community Discussion</h2>
            <p>You must Login to create a post.</p>

            <NavLink
              to="/login"
              className="forum-popup-btn"
              onClick={() => setShowLoginPopup(false)}
            >
              Go to Login
            </NavLink>

            <button
              className="forum-popup-close"
              onClick={() => navigate("/posts")}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {logoutPopup && (
        <div className="forum-popup-overlay">
          <div className="forum-popup-box">
            <h2>Logout</h2>
            <p>Are you sure you want to logout?</p>

            <button
              className="forum-popup-btn"
              style={{ cursor: "pointer" }}
              onClick={() => {
                localStorage.removeItem("token");
                setUser(null);
                setLogoutPopup(false);
                navigate("/");
              }}
            >
              Yes, Logout
            </button>

            <button
              className="forum-popup-close"
              onClick={() => setLogoutPopup(false)}
            >
              X
            </button>
          </div>
        </div>
      )}


      {/* NAVBAR */}
      <nav className="navbar">


        <ul className="nav-left">
          <li>
            <NavLink to="/" className="nav-itemLeft">HOME</NavLink>
          </li>

          <button
          className="burger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        </ul>


        <ul className={`nav-right ${menuOpen ? "show" : ""}`}>
          <li><NavLink to="/character" className="nav-item">CHARACTER</NavLink></li>
          <li><NavLink to="/weapon" className="nav-item">WEAPON</NavLink></li>
          <li><NavLink to="/tierlist" className="nav-item">TIER LIST</NavLink></li>

          {!user ? (
            <NavLink to="/login" className="login-btn">LOGIN</NavLink>
          ) : (
            <span
              className="login-btn"
              style={{ cursor: "pointer" }}
              onClick={() => setLogoutPopup(true)}
            >
              {user.username}
            </span>
          )}
        </ul>
      </nav>

      {/* ROUTES */}
      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <main className="content-container">
              <div className="content-box" style={{ marginTop: "4rem" }}>
                <img src="/GenshinImpactLogo.png" alt="Logo" className="content-logo" />
                <h1>Genshin Impact</h1>
                <p>Welcome to the fan-made Genshin Impact Wiki!</p>
              </div>

              <section className="content-box forum-section">
                <NavLink to="/posts" className="tierlist-btn">
                  Community Posts
                </NavLink>
              </section>
            </main>
          }
        />

        {/* NORMAL PAGES */}
        <Route path="/character" element={<Character />} />
        <Route path="/weapon" element={<Weapon />} />
        <Route path="/tierlist" element={<TierList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* POSTS SYSTEM */}
        <Route path="/posts" element={<Posts user={user} />} />
        <Route path="/posts/:postId" element={<PostDetail user={user} />} />
      </Routes>

      <footer className="solid-section">
        <p>Welcome to the Genshin Impact Wiki Fandom!</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

