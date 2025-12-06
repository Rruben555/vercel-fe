import React, { useState, useEffect } from "react";
import api from "../api/api";

// ---------------------- STYLE GLOBAL ----------------------
const buttonStyle = {
  backgroundColor: "#3c3c3c", 
  color: "white",
  border: "none", 
  padding: "10px 25px", 
  borderRadius: "12px", 
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "16px",
  transition: "0.3s ease-in-out",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", 
};

// ---------------------- LOAD CHARACTERS FROM BACKEND ----------------------
function useCharacters() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const res = await api.get("/characters");
        setCharacters(res.data);
      } catch (err) {
        console.error("❌ Error loading characters:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  return { characters, loading };
}

// ---------------------- STATIC TIERLIST ----------------------
function StaticTierList({ showInteractive, setShowInteractive, characters }) {
  if (characters.length === 0)
    return (
      <p style={{ color: "white", marginTop: "5rem", textAlign: "center" }}>
        Loading Characters...
      </p>
    );

  const find = (name) => characters.find((c) => c.name === name)?.profile;

  const tierData = {
    S: [find("Furina"), find("Kazuha")],
    A: [find("Arlecchino")],
    B: [find("Chiori")],
    C: [find("Xianyun")],
    D: [find("Diluc")],
  };

  const tiers = Object.keys(tierData);

  return (
    <div
      style={{
        color: "white",
        padding: "40px 0",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Toggle button */}
      <div style={{ marginBottom: "25px", paddingTop: "2rem" }}>
        <button
          onClick={() => setShowInteractive(!showInteractive)}
          style={{
            ...buttonStyle,
            backgroundColor: showInteractive ? "#555" : "#1976D2",
            border: "1px solid #777",
          }}
        >
          {showInteractive ? "Hide My Tier List" : "Make Your Own Tier List"}
        </button>
      </div>

      {/* Static tierlist container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "100%",
          maxWidth: "800px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
          borderRadius: "15px",
        }}
      >
        {tiers.map((tier) => (
          <div
            key={tier}
            style={{
              display: "flex",
              border: "2px solid #555",
              borderRadius: "10px",
              backgroundColor: "rgba(0,0,0,0.6)", // Background gelap untuk row
              overflow: "hidden",
            }}
          >
            {/* Tier Label (Samping Kiri) */}
            <div
              style={{
                width: "110px",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor: "rgba(255,255,255,0.13)", 
                color: 'white',
                fontWeight: "900",
                fontSize: "1.8rem",
                textShadow: '0 0 5px rgba(0, 0, 0, 0.4)',
              }}
            >
              {tier}
            </div>

            {/* Character Images (Samping Kanan) */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                padding: "10px",
                minHeight: '99px'
              }}
            >
              {tierData[tier].map(
                (img, i) =>
                  img && (
                    <img
                      key={i}
                      src={img}
                      style={{
                        width: "75px",
                        height: "75px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "3px solid #f0f0f0",
                      }}
                    />
                  )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------- INTERACTIVE TIERLIST ----------------------

// Helper component untuk gambar interaktif (galeri dan tier)
const InteractiveImage = ({ src, onClick, isGallery = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    // Gaya dasar untuk elemen gambar
    const imageStyle = {
        width: isGallery ? "100px" : "75px",
        height: isGallery ? "100px" : "75px",
        borderRadius: isGallery ? "10px" : "50%",
        objectFit: "cover",
        border: "3px solid #f0f0f0",
        transition: "0.2s",
    };

    // Gaya dasar untuk wadah gambar
    const containerStyle = {
        position: 'relative',
        width: isGallery ? "100px" : "75px",
        height: isGallery ? "100px" : "75px",
        cursor: "pointer",
    };

    if (isGallery) {
        // Jika gambar ada di GALERI (untuk dipilih)
        return (
            <img
                src={src}
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    ...imageStyle,
                    // Efek hover untuk menandakan gambar bisa dipilih
                    border: isHovered ? "3px solid #1976D2" : "3px solid #f0f0f0",
                    opacity: isHovered ? 0.9 : 1,
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
            />
        );
    }
    
    // Jika gambar ada di TIER (untuk dihapus)
    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={containerStyle}
        >
            <img src={src} style={imageStyle} />
            {/* Tombol 'X' untuk hapus saat hover */}
            {isHovered && (
                <button
                    onClick={onClick} // Fungsi removeCharacter()
                    title="Remove Character"
                    style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        width: '25px',
                        height: '25px',
                        borderRadius: '50%',
                        backgroundColor: '#D32F2F', // Merah
                        color: 'white',
                        border: '2px solid white',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        transition: '0.1s'
                    }}
                >
                    X
                </button>
            )}
        </div>
    );
};


function InteractiveTierList({ characters }) {
  const [tierData, setTierData] = useState({ S: [], A: [], B: [], C: [], D: [] });
  const [showGallery, setShowGallery] = useState(false);
  const [targetTier, setTargetTier] = useState(null);

  const tiers = Object.keys(tierData);

  // Dapatkan semua URL yang sudah digunakan di tier manapun
  const allUsedUrls = Object.values(tierData).flat();
  
  // Filter karakter yang BELUM ADA di tier
  const availableCharacters = characters.filter(c => !allUsedUrls.includes(c.profile));


  const handleAddClick = (tier) => {
    setTargetTier(tier);
    setShowGallery(true);
  };

  const addCharacterToTier = (url) => {
    const isAlreadyAdded = allUsedUrls.includes(url);
    if (isAlreadyAdded) {
        alert("Character already added to a tier.");
        setShowGallery(false);
        return;
    }
    
    setTierData((prev) => ({
      ...prev,
      [targetTier]: [...prev[targetTier], url],
    }));
    setShowGallery(false);
  };

  const removeCharacter = (tier, url, index) => {
    // Menghapus karakter dari tier
    setTierData((prev) => ({
      ...prev,
      [tier]: prev[tier].filter((u, i) => !(u === url && i === index)),
    }));
  };


  return (
    <div style={{ padding: "10px 0", color: "white" }}>
      {/* Character Gallery */}
      {showGallery && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.95)",
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            padding: "20px",
            overflowY: "auto",
            zIndex: 999,
            justifyContent: 'center',
          }}
        >
          <button
            onClick={() => setShowGallery(false)}
            style={{
              ...buttonStyle,
              backgroundColor: "#D32F2F",
              position: "sticky",
              top: "20px",
              right: "20px",
              margin: '10px 0'
            }}
          >
            Close
          </button>
          
          <div style={{width: '100%', maxWidth: '1000px', display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', paddingTop: '80px'}}>
          {
            availableCharacters.length > 0 ? (
                availableCharacters.map((c) => (
                    <InteractiveImage
                        key={c.char_id}
                        src={c.profile}
                        onClick={() => addCharacterToTier(c.profile)}
                        isGallery={true}
                    />
                ))
            ) : (
                <p style={{color: '#ccc'}}>Semua karakter sudah ada di tier!</p>
            )
          }
          </div>
        </div>
      )}

      {/* Interactive Tierlist Container */}
      <div
        style={{
          maxWidth: "800px",
          margin: "auto",
          marginBottom: "100px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
          borderRadius: "15px",
        }}
      >
        {tiers.map((tier) => (
          <div
            key={tier}
            style={{
              display: "flex", 
              border: "2px solid #555",
              borderRadius: "10px",
              backgroundColor: "rgba(0,0,0,0.6)", // Background gelap untuk row
              overflow: "hidden",
            }}
          >
            {/* Tier Label & Add Button (Samping Kiri) */}
            <div
              style={{
                width: "110px",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: "rgba(255,255,255,0.13)", 
                color: 'white',
                fontWeight: "900",
                padding: '12px 0',
                height: "100%",
              }}
            >
                <div style={{ fontSize: "1.8rem", textShadow: '0 0 5px rgba(0, 0, 0, 0.4)' }}>
                    {tier}
                </div>
                <button
                  onClick={() => handleAddClick(tier)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#3c3c3c", 
                    marginTop: "8px",
                    width: "80px",
                    padding: "6px 0",
                    fontSize: "13px",
                  }}
                >
                  Add
                </button>
            </div>

            {/* Character Images (Samping Kanan) */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                padding: "10px",
                minHeight: '99px'
              }}
            >
              {tierData[tier].length > 0 ? (
                tierData[tier].map((img, i) => (
                    <InteractiveImage
                        key={i}
                        src={img}
                        // Saat tombol 'X' diklik, panggil removeCharacter
                        onClick={() => removeCharacter(tier, img, i)}
                    />
                ))
              ) : (
                <span style={{ opacity: 0.6, margin: 'auto 0' }}>Empty — click Add</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------- MAIN COMPONENT ----------------------
export default function TierListApp({ user }) {
  const [showInteractive, setShowInteractive] = useState(false);
  const { characters, loading } = useCharacters();

  // 🔥 Latar belakang dihilangkan, hanya menyisakan kerangka layout
  const appBackgroundStyle = {
    minHeight: "100vh", 
    padding: "20px",
    fontFamily: 'Roboto, sans-serif'
};


  if (loading)
    return (
      <p style={{ color: "white", textAlign: "center", marginTop: "5rem" }}>
        Loading...
      </p>
    );

  return (
    <div style={appBackgroundStyle}>
      <StaticTierList
        showInteractive={showInteractive}
        setShowInteractive={setShowInteractive}
        characters={characters}
      />

      {showInteractive && (
        <InteractiveTierList
          characters={characters}
          user={user}
        />
      )}
    </div>
  );
}