import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const formatLabel = (value) => {
  if (!value) return "N/A";
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

const PlayerDetailPage = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/items/Players/${playerId}`
        );
        setPlayer(response.data.data);
      } catch (err) {
        setError("Failed to fetch player data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateAge = (dateString) => {
    if (!dateString) return null;
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <style>{styles}</style>
        <p>Loading player details...</p>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="error-container">
        <style>{styles}</style>
        <p>{error || "Player not found"}</p>
        <button className="back-button" onClick={() => navigate("/players")}>
          Back to Players
        </button>
      </div>
    );
  }

  const age = calculateAge(player.date_of_birth);

  return (
    <div className="player-detail-page">
      <style>{styles}</style>

      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Players
      </button>

      <div className="player-detail-card">
        <div className="player-header">
          <div
            className="player-photo-large"
            onClick={() => setIsImageModalOpen(true)}
          >
            <img
              src={`${API_BASE_URL}/assets/${player.photo}`}
              alt={player.name}
              onError={(e) => {
                e.target.src = "/placeholder-player.png";
              }}
            />
          </div>
          <div className="player-basic-info">
            <h1 className="player-name">{player.name}</h1>
            <div className="player-tags">
              {player.gender && (
                <span className={`tag gender-tag ${player.gender?.toLowerCase()}`}>
                  {player.gender}
                </span>
              )}
              {player.category && (
                <span className="tag category-tag">{formatLabel(player.category)}</span>
              )}
            </div>
            <div className="player-meta">
              {player.area && (
                <p>
                  <span className="label">Area:</span> {player.area}
                </p>
              )}
              {player.date_of_birth && (
                <p>
                  <span className="label">Date of Birth:</span>{" "}
                  {formatDate(player.date_of_birth)}
                  {age && ` (${age} years)`}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="stats-container">
          <div className="stats-section">
            <h3 className="section-title">Player Type</h3>
            <div className="stats-grid two-col">
              <div className="stat-item">
                <span className="stat-label">Batting Style</span>
                <span className="stat-value">{formatLabel(player.batsman_type)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Bowling Style</span>
                <span className="stat-value">{formatLabel(player.bowling_type)}</span>
              </div>
            </div>
          </div>

          <div className="stats-section">
            <h3 className="section-title">
              <span className="icon">🏏</span> Batting Statistics
            </h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Matches</span>
                <span className="stat-value highlight">{player.batting_matches || "0"}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Runs</span>
                <span className="stat-value highlight">{player.batting_runs || "0"}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Average</span>
                <span className="stat-value">{player.batting_average || "0.00"}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Strike Rate</span>
                <span className="stat-value">{player.batting_strike_rate || "0.00"}</span>
              </div>
            </div>
          </div>

          <div className="stats-section">
            <h3 className="section-title">
              <span className="icon">⚾</span> Bowling Statistics
            </h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Matches</span>
                <span className="stat-value highlight">{player.bowling_matches || "0"}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Wickets</span>
                <span className="stat-value highlight">{player.bowling_wickets || "0"}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Average</span>
                <span className="stat-value">{player.bowling_average || "0.00"}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Economy</span>
                <span className="stat-value">{player.bowling_economy || "0.00"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isImageModalOpen && (
        <div className="modal" onClick={() => setIsImageModalOpen(false)}>
          <div className="modal-content">
            <img
              src={`${API_BASE_URL}/assets/${player.photo}`}
              alt={player.name}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = `
  .player-detail-page {
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
  }

  .back-button {
    background: #f3f4f6;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    color: #4b5563;
    margin-bottom: 20px;
    transition: background 0.2s;
  }

  .back-button:hover {
    background: #e5e7eb;
  }

  .player-detail-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .player-header {
    display: flex;
    gap: 24px;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid #e5e7eb;
  }

  .player-photo-large {
    flex-shrink: 0;
    width: 180px;
    height: 180px;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .player-photo-large img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s;
  }

  .player-photo-large:hover img {
    transform: scale(1.05);
  }

  .player-basic-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .player-name {
    font-size: 28px;
    font-weight: bold;
    color: #1f2937;
    margin: 0 0 12px 0;
  }

  .player-tags {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .tag {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .gender-tag.male {
    background: #dbeafe;
    color: #1d4ed8;
  }

  .gender-tag.female {
    background: #fce7f3;
    color: #be185d;
  }

  .category-tag {
    background: #f3f4f6;
    color: #4b5563;
  }

  .player-meta p {
    margin: 8px 0;
    color: #6b7280;
    font-size: 14px;
  }

  .player-meta .label {
    font-weight: 600;
    color: #374151;
  }

  .stats-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .stats-section {
    background: #f9fafb;
    border-radius: 12px;
    padding: 20px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 16px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .icon {
    font-size: 20px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .stats-grid.two-col {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-item {
    background: white;
    padding: 16px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .stat-label {
    display: block;
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  .stat-value {
    display: block;
    font-size: 20px;
    font-weight: bold;
    color: #1f2937;
  }

  .stat-value.highlight {
    color: #2563eb;
  }

  .loading-container,
  .error-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    gap: 16px;
  }

  .error-container {
    color: #ef4444;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    cursor: pointer;
  }

  .modal-content {
    background-color: white;
    padding: 4px;
    border-radius: 8px;
    max-width: 90%;
    max-height: 90%;
  }

  .modal-content img {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    display: block;
  }

  @media (max-width: 768px) {
    .player-detail-page {
      padding: 12px;
    }

    .player-detail-card {
      padding: 16px;
    }

    .player-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 16px;
    }

    .player-photo-large {
      width: 150px;
      height: 150px;
    }

    .player-name {
      font-size: 22px;
    }

    .player-tags {
      justify-content: center;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .stats-grid.two-col {
      grid-template-columns: 1fr;
    }

    .stat-item {
      padding: 12px;
    }

    .stat-value {
      font-size: 18px;
    }
  }

  @media (max-width: 480px) {
    .player-photo-large {
      width: 120px;
      height: 120px;
    }

    .player-name {
      font-size: 20px;
    }

    .section-title {
      font-size: 16px;
    }

    .stats-section {
      padding: 12px;
    }

    .stat-item {
      padding: 10px;
    }

    .stat-label {
      font-size: 10px;
    }

    .stat-value {
      font-size: 16px;
    }
  }
`;

export default PlayerDetailPage;
