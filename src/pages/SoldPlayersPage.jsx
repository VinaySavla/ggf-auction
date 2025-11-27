import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SoldPlayersPage = () => {
  const [soldPlayers, setSoldPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("male");

  useEffect(() => {
    const fetchSoldPlayersAndTeams = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/items/Players?limit=100000&sort=-id`
        );
        const players = response.data.data;

        // Fetch teams data separately if needed
        const teamResponse = await axios.get(`${API_BASE_URL}/items/Teams`);
        const teamsData = teamResponse.data.data;

        // Map team IDs to team names
        const teamMap = teamsData.reduce((map, team) => {
          map[team.id] = team.name;
          return map;
        }, {});

        // Ensure players is an array before filtering
        const sold = players.filter(
          (player) => player.auction_status.toLowerCase() === "sold" || player.team !== null
        );

        // Add team names to players
        const soldWithTeamNames = sold.map((player) => ({
          ...player,
          teamName: player.team ? teamMap[player.team] : "No Team", // If no team, set a default value
        }));

        setSoldPlayers(soldWithTeamNames);
        setTeams(teamsData);
      } catch (err) {
        setError("Failed to fetch players data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSoldPlayersAndTeams();
  }, []);

  if (loading) {
    return <p>Loading sold players...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="players-page">
      <style>{`
  .players-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
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

  .players-card {
    width: 100%;
    max-width: 800px;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    background-color: #fff;
  }

  .players-title {
    text-align: center;
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }

  .players-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }

  .players-table th,
  .players-table td {
    text-align: left;
    padding: 10px;
    border: 1px solid #ddd;
    font-size: 14px;
  }

  .players-table th {
    background-color: #f9f9f9;
    font-weight: bold;
  }

  .players-table tbody tr:nth-child(odd) {
    background-color: #f9f9f9;
  }

  .players-table td {
    vertical-align: middle !important;
  }

  .player-photo {
    height: 80px;
    width: 80px;
    object-fit: cover;
    margin: 0 auto;
    display: block;
  }
`}</style>

      <div className="gender-tabs">
        <button
          className={`gender-tab ${activeTab === "male" ? "active" : "inactive"}`}
          onClick={() => setActiveTab("male")}
        >
          Male
        </button>
        <button
          className={`gender-tab ${activeTab === "female" ? "active" : "inactive"}`}
          onClick={() => setActiveTab("female")}
        >
          Female
        </button>
      </div>

      <div className="players-card">
        <h2 className="players-title">Sold Players ({soldPlayers.filter(p => p.gender?.toLowerCase() === activeTab).length})</h2>
        <table className="players-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Player Name</th>
              <th>Photo</th>
              <th>Team</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {soldPlayers
              .filter((player) => player.gender?.toLowerCase() === activeTab)
              .map((player, index) => (
              <tr key={player.id || index}>
                <td>{index + 1}</td>
                <td>{player.name}</td>
                <td>
                  <img
                    className="player-photo"
                    src={`${API_BASE_URL}/assets/${player.photo}`}
                    alt={player.name}
                  />
                </td>
                <td>{player.teamName}</td>
                <td>{player.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SoldPlayersPage;
