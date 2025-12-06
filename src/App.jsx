// import { useState, useEffect } from "react";
// import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from "react-router-dom";
// import Character from "./Pages/Character";
// import Weapon from "./Pages/Weapon";
// import TierList from "./Pages/TierList";
// import Register from "./Pages/Register";
// import Login from "./Pages/Login";
// import Forum from "./Pages/Forum";
// import CreatePost from "./Pages/CreatePost";
// import Post from "./Pages/Post";
// import "./App.css";

// // Data dummy posts kosong (seperti yang diminta sebelumnya)
// const initialPosts = []; 

// function AppContent() {
//   const [user, setUser] = useState(null); // Mulai dengan user null (belum login)
//   const [posts, setPosts] = useState(initialPosts); 

//   const location = useLocation();
//   const navigate = useNavigate();

//   // --- PERUBAHAN: Nama state popup dikonsolidasikan dan dibuat jelas ---
//   const [showLoginToCreatePopup, setShowLoginToCreatePopup] = useState(false); // Popup untuk /forum/create
//   const [showLoginToForumPopup, setShowLoginToForumPopup] = useState(false); // Popup untuk tombol Home

//   // LOGIN REQUIRED POPUP FOR PROTECTED ROUTES (/forum/create)
//   useEffect(() => {
//     const protectedRoutes = ["/forum/create"];

//     if (protectedRoutes.includes(location.pathname) && !user) {
//       setShowLoginToCreatePopup(true); 
//     } else {
//       setShowLoginToCreatePopup(false);
//     }
//   }, [location, user]);


//   // Handle "Join Community Discussion" button on Home page
//   const handleJoinForum = () => {
//     if (user) {
//       navigate("/forum");
//     } else {
//       // Handler ini sudah benar, menggunakan showLoginToForumPopup
//       setShowLoginToForumPopup(true);
//     }
//   };

//   return (
//     <div>
//       {/* 1. LOGIN REQUIRED POPUP FOR /forum/create (Menggunakan showLoginToCreatePopup) */}
//       {showLoginToCreatePopup && (
//         <div className="forum-popup-overlay">
//           <div className="forum-popup-box">
//             <h2>Community Discussion</h2>
//             <p>You must Login to create a new post.</p>

//             <NavLink to="/login" className="forum-popup-btn" onClick={() => setShowLoginToCreatePopup(false)}>
//               Go to Login
//             </NavLink>

//             <button
//               className="forum-popup-close"
//               onClick={() => navigate("/forum")} 
//             >
//               ×
//             </button>
//           </div>
//         </div>
//       )}

//       {/* 2. LOGIN REQUIRED POPUP TO ENTER FORUM FROM HOME PAGE (Menggunakan showLoginToForumPopup) */}
//       {showLoginToForumPopup && (
//         <div className="forum-popup-overlay">
//           <div className="forum-popup-box">
//             <h2>Community Discussion</h2>
//             <p>You need to Login to join the discussion.</p>

//             <NavLink
//               to="/login"
//               className="forum-popup-btn"
//               onClick={() => setShowLoginToForumPopup(false)}
//             >
//               Login
//             </NavLink>

//             <button
//               className="forum-popup-close"
//               onClick={() => setShowLoginToForumPopup(false)}
//             >
//               ×
//             </button>
//           </div>
//         </div>
//       )}

//       {/* NAVBAR */}
//       <nav className="navbar">
//         <ul className="nav-left">
//           <li>
//             <NavLink to="/" className="nav-itemLeft">
//               HOME
//             </NavLink>
//           </li>
//         </ul>

//         <ul className="nav-right">
//           <li>
//             <NavLink to="/character" className="nav-item">
//               CHARACTER
//             </NavLink>
//           </li>
//           <li>
//             <NavLink to="/weapon" className="nav-item">
//               WEAPON
//             </NavLink>
//           </li>
//           <li>
//             <NavLink to="/tierlist" className="nav-item">
//               TIER LIST
//             </NavLink>
//           </li>

//           {!user ? (
//             <NavLink to="/login" className="login-btn">
//               LOGIN
//             </NavLink>
//           ) : (
//             <span className="login-btn">{user.username}</span>
//           )}
//         </ul>
//       </nav>

//       {/* ROUTES */}
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <main className="content-container">
//               <div className="content-box" style={{ marginTop: "4rem" }}>
//                 <img
//                   src="/GenshinImpactLogo.png"
//                   alt="Logo"
//                   className="content-logo"
//                 />
//                 <h1>Genshin Impact</h1>
//                 <p>Welcome to the fan-made Genshin Impact Wiki!</p>
//               </div>

//               {/* HOME COMMUNITY BUTTON */}
//               <section className="content-box forum-section">
//                 <button
//                   className="tierlist-btn"
//                   onClick={handleJoinForum}
//                 >
//                   Join Community Discussion
//                 </button>
//               </section>
//             </main>
//           }
//         />

//         <Route path="/character" element={<Character />} />
//         <Route path="/weapon" element={<Weapon />} />
//         <Route path="/tierlist" element={<TierList />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login setUser={setUser} />} />

//         {/* FORUM SYSTEM */}
//         <Route path="/forum" element={<Forum posts={posts} />} />
//         <Route 
//           path="/forum/create" 
//           element={<CreatePost posts={posts} setPosts={setPosts} user={user} />}
//         />
//         <Route 
//           path="/forum/post/:id" 
//           element={<Post posts={posts} user={user} setPosts={setPosts}/>}
//         />
//       </Routes>

//       {/* FOOTER */}
//       <footer className="solid-section">
//         <p>Welcome to the Genshin Impact Wiki Fandom!</p>
//       </footer>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AppContent />
//     </BrowserRouter>
//   );
// }

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
        </ul>

        <ul className="nav-right">
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

