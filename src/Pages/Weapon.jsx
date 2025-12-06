import React, { useEffect, useState } from "react";
import api from "../api/api";

function Weapon() {
  const [weapons, setWeapons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeapons = async () => {
      try {
        const res = await api.get("/weapons");
        console.log("🔥 DATA FROM BACKEND:", res.data);
        setWeapons(res.data);
      } catch (err) {
        console.error("Failed to load weapons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeapons();
  }, []);

  return (
    <main className="content-container">
      <div className="content-box" style={{ marginTop: "6rem" }}>
        <h1>Genshin Impact Weapons</h1>
        <p>
          Weapons in <strong>Genshin Impact</strong> define each character’s
          fighting style.
        </p>

        {loading ? (
          <p style={{ color: "white", marginTop: "2rem" }}>Loading weapons...</p>
        ) : weapons.length === 0 ? (
          <p style={{ color: "white", marginTop: "2rem" }}>No weapons found.</p>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "2rem",
              marginTop: "2rem",
            }}
          >
            {weapons.map((w, idx) => {
              const id = w.weapon_id || idx;

              const name = w.name || "Unknown Weapon";
              const type = w.type || "Unknown";
              const rarity = w.rarity || 5;

              const image = w.image || w.image_url || "";

              // ✅ FIX: description fallback
              const description =
              w.description 
              ||
              "No description available.";

              return (
                <div
                  key={id}
                  className="weapon-card"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.6)",
                    borderRadius: "10px",
                    padding: "1rem",
                    width: "250px",
                    textAlign: "center",
                    color: "white",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
                    transition:
                      "transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={image}
                    alt={name}
                    className="weapon-img"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "contain",
                      borderRadius: "8px",
                      marginBottom: "1rem",
                      transition: "transform 0.3s ease",
                    }}
                  />

                  <h3>{name}</h3>

                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>
                    {type} • ⭐{rarity}
                  </p>

                  {/* ✅ DESCRIPTION FIXED HERE */}
                  <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>
        {`
          .weapon-card:hover {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
            border: 1px solid rgba(255,255,255,0.5);
          }

          .weapon-card:hover .weapon-img {
            transform: scale(1.1);
          }
        `}
      </style>
    </main>
  );
}

export default Weapon;
