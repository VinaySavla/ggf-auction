import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UpdatePage = () => {
  const [loading, setLoading] = useState(true);
  const [playerId, setPlayerId] = useState();
  const [teams, setTeams] = useState([]);
  const [teamStats, setTeamStats] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const playerCardRef = useRef(null);

  const calculateTeamStats = (teamPlayers) => {
    const totalPoints = 400000;
    const requiredPlayers = 11;
    const basePoint = 1000;

    if (!Array.isArray(teamPlayers) || teamPlayers.length === 0) {
      return {
        totalPoints: totalPoints,
        pointsUsed: 0,
        balancedPoints: totalPoints,
        playersBought: 0,
        maxBidAllowed: totalPoints - (requiredPlayers - 1) * basePoint,
      };
    }

    const pointsUsed = teamPlayers.reduce(
      (sum, player) => sum + (player.points || 0),
      0
    );
    const balancedPoints = totalPoints - pointsUsed;
    const playersBought = teamPlayers.length;

    const maxBidAllowed =
      playersBought < requiredPlayers
        ? balancedPoints - (requiredPlayers - playersBought - 1) * basePoint
        : 0;

    return {
      totalPoints,
      pointsUsed,
      balancedPoints,
      playersBought,
      maxBidAllowed,
    };
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setPlayerId(queryParams.get("PlayerId"));
  }, [location]);

  useEffect(() => {
    const fetchTeamsData = async () => {
      try {
        // Fetch teams
        const teamResponse = await axios.get(
          `${API_BASE_URL}/items/Teams?limit=100000`
        );
        const fetchedTeams = teamResponse.data.data;
        
        // Filter only male teams
        const maleTeams = fetchedTeams.filter(
          (team) => team.gender?.toLowerCase() === "male"
        );
        setTeams(maleTeams);

        // Fetch players for each male team and calculate stats
        const stats = {};
        for (const team of maleTeams) {
          const teamPlayersResponse = await axios.get(
            `${API_BASE_URL}/items/Players?filter[team][_eq]=${team.id}&limit=100000`
          );
          stats[team.id] = calculateTeamStats(teamPlayersResponse.data.data);
        }
        setTeamStats(stats);
      } catch (err) {
        console.error("Failed to fetch teams data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsData();
  }, []);

  const handleClickOutside = (event) => {
    if (
      playerCardRef.current &&
      !playerCardRef.current.contains(event.target)
    ) {
      navigate("/"); // Redirect to the home route
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!playerId) {
    return <div className="w-full h-screen flex items-center justify-center">No player data found.</div>;
  }

  const TeamCard = ({ team }) => {
    const stats = teamStats[team.id] || {};
    return (
      <div className="team-stat-card">
        <div className="team-logo-container">
          <img
            src={`${API_BASE_URL}/assets/${team.team_logo}`}
            alt={team.name}
            className="team-logo-small"
          />
        </div>
        <div className="team-stat-info">
          <p className="team-name-small">{team.name}</p>
          <div className="stat-row">
            <span className="stat-label">Players:</span>
            <span className="stat-value">{stats.playersBought || 0}/11</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Kitty:</span>
            <span className="stat-value">{stats.balancedPoints?.toLocaleString() || 0}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Max Bid:</span>
            <span className="stat-value highlight">{stats.maxBidAllowed?.toLocaleString() || 0}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="update-page">
      <style>{`
        .update-page {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          padding: 4px;
          position: relative;
          overflow: hidden;
          gap: 4px;
        }

        .update-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('GGF.png');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.05;
          z-index: 0;
        }

        .teams-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          width: 100%;
          z-index: 1;
        }

        .teams-row {
          display: flex;
          flex-wrap: nowrap;
          justify-content: center;
          gap: 10px;
          width: 100%;
          max-width: 1600px;
          z-index: 1;
          padding: 2px;
        }

        .team-stat-card {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 14px 18px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          gap: 14px;
          min-width: 220px;
          flex: 0 1 auto;
        }

        .team-logo-container {
          width: 70px;
          height: 70px;
          flex-shrink: 0;
        }

        .team-logo-small {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .team-stat-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .team-name-small {
          font-size: 16px;
          font-weight: 700;
          color: #1e3a8a;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 140px;
        }

        .stat-row {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .stat-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        .stat-value {
          font-size: 14px;
          font-weight: 700;
          color: #1f2937;
        }

        .stat-value.highlight {
          color: #059669;
        }

        .player-card-container {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 700px;
          margin: 2px 0;
        }

        .player-card-image {
          width: 100%;
          height: auto;
          max-height: 75vh;
          object-fit: contain;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        /* Tablet view - 3 cards per row */
        @media (max-width: 1024px) {
          .teams-row {
            flex-wrap: wrap;
            gap: 8px;
          }

          .team-stat-card {
            padding: 12px 14px;
            min-width: 200px;
            gap: 12px;
            flex: 0 1 calc(33.33% - 16px);
            max-width: calc(33.33% - 16px);
          }

          .team-logo-container {
            width: 55px;
            height: 55px;
          }

          .team-name-small {
            font-size: 14px;
            max-width: 120px;
          }

          .stat-label {
            font-size: 11px;
          }

          .stat-value {
            font-size: 12px;
          }

          .player-card-container {
            max-width: 500px;
          }

          .player-card-image {
            max-height: 60vh;
          }
        }

        /* Mobile view - 2 cards per row */
        @media (max-width: 768px) {
          .update-page {
            padding: 3px;
            gap: 3px;
          }

          .teams-row {
            gap: 6px;
          }

          .team-stat-card {
            padding: 10px 12px;
            min-width: 160px;
            gap: 10px;
            border-radius: 10px;
            flex: 0 1 calc(50% - 12px);
            max-width: calc(50% - 12px);
          }

          .team-logo-container {
            width: 48px;
            height: 48px;
          }

          .team-name-small {
            font-size: 12px;
            max-width: 100px;
          }

          .stat-label {
            font-size: 10px;
          }

          .stat-value {
            font-size: 11px;
          }

          .player-card-container {
            max-width: 450px;
          }

          .player-card-image {
            max-height: 55vh;
          }
        }

        /* Small mobile - 2 cards per row, smaller */
        @media (max-width: 480px) {
          .teams-row {
            gap: 4px;
          }

          .team-stat-card {
            padding: 8px 10px;
            min-width: 140px;
            border-radius: 8px;
            gap: 8px;
            flex: 0 1 calc(50% - 8px);
            max-width: calc(50% - 8px);
          }

          .team-logo-container {
            width: 40px;
            height: 40px;
          }

          .team-name-small {
            font-size: 11px;
            max-width: 80px;
          }

          .stat-label {
            font-size: 9px;
          }

          .stat-value {
            font-size: 10px;
          }

          .player-card-container {
            max-width: 350px;
          }

          .player-card-image {
            max-height: 50vh;
          }
        }
      `}</style>

      {/* Player Card at Top */}
      <div ref={playerCardRef} className="player-card-container">
        <img
          className="player-card-image"
          src={`PlayerCards/${playerId}.png`}
          alt={playerId}
        />
      </div>

      {/* Teams in 2 rows: 5 on first, 4 on second */}
      <div className="teams-container">
        <div className="teams-row">
          {teams.slice(0, 5).map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
        <div className="teams-row">
          {teams.slice(5, 9).map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdatePage;
