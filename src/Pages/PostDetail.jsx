import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Pagination from "../components/Pagination";

export default function PostDetail({ user }) {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;

  // POPUP STATES
  const [deleteCommentPopup, setDeleteCommentPopup] = useState(null);
  const [loginBlockPopup, setLoginBlockPopup] = useState(false);

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); 
  };

  async function loadPost() {
    try {
      const res = await api.get(`/posts/${postId}`);
      setPost(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function submitComment(e) {
    e.preventDefault();

    if (!user) {
      setLoginBlockPopup(true);
      return;
    }

    try {
      await api.post(`/posts/${postId}`, { content: commentText });
      setCommentText("");
      loadPost();
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteComment(id) {
    try {
      await api.delete(`/comments/${id}`);
      loadPost();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadPost();
  }, [postId]);

  if (!post) return <p>Loading...</p>;

  const totalPages = Math.max(1, Math.ceil(post.Comments.length / commentsPerPage));
  const startIndex = (currentPage - 1) * commentsPerPage;
  const paginatedComments = post.Comments.slice(startIndex, startIndex + commentsPerPage);

  return (
    <div
      style={{
        marginTop: "100px",
        padding: "40px",
        maxWidth: "900px",
        marginInline: "auto",
        backgroundColor: "#2a2a2a",
        borderRadius: "16px",
        color: "white",
      }}
    >
      <button
        onClick={handleGoBack}
        style={{
          background: "#444",
          color: "white",
          padding: "8px 15px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          marginBottom: "20px",
          transition: "background-color 0.2s"
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#555'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#444'}
      >
        &larr; Back
      </button> 
      <h1>{post.title}</h1>
      <p>Posted by <strong>{post.User?.username}</strong></p>

      <div
        style={{
          padding: "20px",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.07)",
          marginBottom: "30px",
        }}
      >
        {post.content}
      </div>

      <h2>Comments ({post.Comments.length})</h2>

      {paginatedComments.map((c) => (
        <div
          key={c.comment_id}
          style={{
            padding: "15px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.08)",
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p>{c.content}</p>
            <small>By: {c.User?.username}</small>
          </div>

          {user && user.id === c.user_id && (
            <button
              onClick={() => setDeleteCommentPopup(c.comment_id)}
              style={{
                backgroundColor: "#b30000",
                color: "white",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                height: "36px",
              }}
            >
              Delete
            </button>
          )}
        </div>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(num) => setCurrentPage(num)}
      />

      {/* COMMENT FORM */}
      <form onSubmit={submitComment} style={{ marginTop: "20px" }}>
        <textarea
          placeholder="Write your comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{
            width: "100%",
            minHeight: "120px",
            padding: "12px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.08)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.2)",
            marginBottom: "10px",
          }}
        />

        <button
          type="submit"
          style={{
            background: "rgba(0,0,0,0.65)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.2)",
            cursor: "pointer",
          }}
        >
          Submit Comment
        </button>
      </form>

      {/* POPUP DELETE COMMENT */}
      {deleteCommentPopup && (
        <div className="forum-popup-overlay">
          <div className="forum-popup-box">
            <h2>Delete Comment</h2>
            <p>Are you sure you want to delete this comment?</p>

            <button
              className="forum-popup-btn"
              onClick={() => {
                deleteComment(deleteCommentPopup);
                setDeleteCommentPopup(null);
              }}
            >
              Yes, Delete
            </button>

            <button
              className="forum-popup-close"
              onClick={() => setDeleteCommentPopup(null)}
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
            <p>You must log in to comment.</p>

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
