import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const formatLabel = (value) => {
  if (!value) return null;
  const labelMap = {
    all_rounder: "All Rounder",
    batsman: "Batsman",
    bowler: "Bowler",
    wicket_keeper: "Wicket Keeper",
    right_handed: "Right Handed",
    left_handed: "Left Handed",
  };
  return labelMap[value.toLowerCase()] || value;
};

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("male");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/items/Players?limit=100000&sort=name`
        );
        setPlayers(response.data.data);
      } catch (err) {
        setError("Failed to fetch players data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter(
    (player) => player.gender?.toLowerCase() === activeTab
  );

  const handlePlayerClick = (playerId) => {
    navigate(`/players/${playerId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading players...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="all-players-page">
      <style>{`
        .all-players-page {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-title {
          text-align: center;
          font-size: 28px;
          color: #333;
          margin-bottom: 24px;
          font-weight: bold;
        }

        .gender-tabs {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .gender-tab {
          padding: 12px 32px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .gender-tab.active {
          background: #2563eb;
          color: white;
          transform: scale(1.05);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .gender-tab.inactive {
          background: #f3f4f6;
          color: #4b5563;
        }

        .gender-tab:hover:not(.active) {
          background: #e5e7eb;
        }

        .players-count {
          text-align: center;
          color: #666;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .players-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
        }

        .player-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          text-align: center;
        }

        .player-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .player-photo-container {
          width: 120px;
          height: 120px;
          margin: 0 auto 12px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #e5e7eb;
        }

        .player-photo {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .player-name {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .player-category {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
          padding: 4px 8px;
          background: #f3f4f6;
          border-radius: 12px;
          display: inline-block;
        }

        .loading-container,
        .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          font-size: 16px;
          color: #666;
        }

        .error-container {
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .all-players-page {
            padding: 12px;
          }

          .page-title {
            font-size: 22px;
          }

          .gender-tabs {
            gap: 10px;
          }

          .gender-tab {
            padding: 10px 24px;
            font-size: 14px;
          }

          .players-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 12px;
          }

          .player-card {
            padding: 12px;
          }

          .player-photo-container {
            width: 90px;
            height: 90px;
          }

          .player-name {
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .players-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .player-photo-container {
            width: 80px;
            height: 80px;
          }

          .player-name {
            font-size: 13px;
          }

          .player-category {
            font-size: 11px;
          }
        }
      `}</style>

      <h2 className="page-title">All Players</h2>

      <div className="gender-tabs">
        <button
          className={`gender-tab ${activeTab === "male" ? "active" : "inactive"}`}
          onClick={() => setActiveTab("male")}
        >
          Male
        </button>
        {/* <button
          className={`gender-tab ${activeTab === "female" ? "active" : "inactive"}`}
          onClick={() => setActiveTab("female")}
        >
          Female
        </button> */}
      </div>

      <p className="players-count">
        Showing {filteredPlayers.length} {activeTab} player{filteredPlayers.length !== 1 ? "s" : ""}
      </p>

      <div className="players-grid">
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            className="player-card"
            onClick={() => handlePlayerClick(player.id)}
          >
            <div className="player-photo-container">
              <img
                className="player-photo"
                src={`${API_BASE_URL}/assets/${player.photo}`}
                alt={player.name}
                onError={(e) => {
                  e.target.src = "/placeholder-player.png";
                }}
              />
            </div>
            <p className="player-name">{player.name}</p>
            {player.category && (
              <span className="player-category">{formatLabel(player.category)}</span>
            )}
          </div>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="loading-container">
          <p>No {activeTab} players found.</p>
        </div>
      )}
    </div>
  );
};

export default PlayersPage;
