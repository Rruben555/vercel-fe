import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import Pagination from "../components/Pagination";

export default function Posts({ user }) {
  const [posts, setPosts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [deletePopup, setDeletePopup] = useState(null);
  const [loginBlockPopup, setLoginBlockPopup] = useState(false);

  const navigate = useNavigate();

  async function loadPosts() {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      setLoginBlockPopup(true);
      return;
    }

    if (!title.trim() || !content.trim()) return;

    try {
      await api.post("/posts", { title, content });
      setTitle("");
      setContent("");
      loadPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    }
  }

  async function deletePost(id) {
    try {
      await api.delete(`/posts/${id}`);
      loadPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage));
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = posts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
      <h1 style={{ color: "white", textAlign: "center", padding: "20px" }}>Community Posts</h1>

      <div
        style={{
          backgroundColor: "#1e1e1e",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <div style={{ display: "grid", gap: "15px", marginBottom: "30px" }}>
          {paginatedPosts.map((post) => (
            <div
              key={post.post_id}
              style={{
                padding: "15px",
                borderRadius: "10px",
                backgroundColor: "#2a2a2a",
                color: "white",

                /* FLEX WRAPPER AGAR DELETE ADA DI KANAN */
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* LEFT CONTENT */}
              <Link
                to={`/posts/${post.post_id}`}
                style={{ textDecoration: "none", color: "white", flex: 1 }}
              >
                <h2>{post.title}</h2>
                <p>{post.content.slice(0, 120)}...</p>
                <small>By: {post.User?.username}</small>
                <br />
                <small>{post.Comments?.length || 0} Comments</small>
              </Link>

              {/* RIGHT DELETE BUTTON */}
              {user && user.id === post.user_id && (
                <button
                  onClick={() => setDeletePopup(post.post_id)}
                  style={{
                    marginLeft: "20px",
                    backgroundColor: "#b30000",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    height: "40px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(num) => setCurrentPage(num)}
        />

        <h2 style={{ color: "white", margin: "20px 0" }}>Create New Post</h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #444",
              backgroundColor: "#2a2a2a",
              color: "white",
            }}
          />

          <textarea
            placeholder="Write your content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              padding: "10px",
              minHeight: "150px",
              borderRadius: "8px",
              border: "1px solid #444",
              backgroundColor: "#2a2a2a",
              color: "white",
            }}
          />

          <button
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Publish
          </button>
        </form>
      </div>

      {/* POPUP DELETE POST */}
      {deletePopup && (
        <div className="forum-popup-overlay">
          <div className="forum-popup-box">
            <h2>Delete Post</h2>
            <p>Are you sure you want to delete this post?</p>

            <button
              className="forum-popup-btn"
              onClick={() => {
                deletePost(deletePopup);
                setDeletePopup(null);
              }}
            >
              Yes, Delete
            </button>

            <button
              className="forum-popup-close"
              onClick={() => setDeletePopup(null)}
            >
              X
            </button>
          </div>
        </div>
      )}

      {/* POPUP BLOCK LOGIN */}
      {loginBlockPopup && (
        <div className="forum-popup-overlay">
          <div className="forum-popup-box">
            <h2>Login Required</h2>
            <p>You must be logged in to publish a post.</p>

            <button
              className="forum-popup-btn"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>

            <button
              className="forum-popup-close"
              onClick={() => setLoginBlockPopup(false)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
