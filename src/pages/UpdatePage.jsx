import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UpdatePage = () => {
  const [loading, setLoading] = useState(true);
  const [playerId, setPlayerId] = useState(null);
  const [teams, setTeams] = useState([]);
  const [teamStats, setTeamStats] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const playerCardRef = useRef(null);

  // Auction draw system states
  const [auctionStarted, setAuctionStarted] = useState(false);
  const [remainingNumbers, setRemainingNumbers] = useState([]);
  const [unsoldQueue, setUnsoldQueue] = useState([]);
  const [completedNumbers, setCompletedNumbers] = useState([]); // Track completed numbers
  const [isDrawing, setIsDrawing] = useState(false);
  const [displayNumber, setDisplayNumber] = useState(null);
  const [stampAnimation, setStampAnimation] = useState(null); // 'sold' or 'unsold'
  const [isUnsoldPhase, setIsUnsoldPhase] = useState(false);
  const [auctionComplete, setAuctionComplete] = useState(false);
  const [showDrawingAnimation, setShowDrawingAnimation] = useState(false);

  // Load auction state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('auctionState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setAuctionStarted(state.auctionStarted || false);
        setRemainingNumbers(state.remainingNumbers || []);
        setUnsoldQueue(state.unsoldQueue || []);
        setCompletedNumbers(state.completedNumbers || []);
        setIsUnsoldPhase(state.isUnsoldPhase || false);
        setAuctionComplete(state.auctionComplete || false);
        
        // Check if we need to show drawing animation
        if (state.showDrawingAnimation && state.currentPlayerId) {
          setShowDrawingAnimation(true);
          setIsDrawing(true);
          
          // Run animation for the current player
          const poolForAnimation = state.isUnsoldPhase 
            ? [...(state.unsoldQueue || []), state.currentPlayerId]
            : [...(state.remainingNumbers || []), state.currentPlayerId];
          
          let animationCount = 0;
          const maxAnimations = 12 + Math.floor(Math.random() * 6); // 12-18 cycles (faster)
          const animationInterval = setInterval(() => {
            const randomDisplay = poolForAnimation[Math.floor(Math.random() * poolForAnimation.length)];
            setDisplayNumber(randomDisplay);
            animationCount++;
            
            if (animationCount >= maxAnimations) {
              clearInterval(animationInterval);
              setDisplayNumber(state.currentPlayerId);
              setPlayerId(state.currentPlayerId);
              setIsDrawing(false);
              setShowDrawingAnimation(false);
              
              // Clear the animation flag from localStorage
              const updatedState = { ...state, showDrawingAnimation: false };
              localStorage.setItem('auctionState', JSON.stringify(updatedState));
            }
          }, 40); // Faster animation (40ms instead of 50ms)
        } else {
          setPlayerId(state.currentPlayerId || null);
        }
      } catch (e) {
        console.error('Failed to load auction state:', e);
      }
    }
  }, []);

  // Save auction state to localStorage whenever it changes
  const saveAuctionState = useCallback((updates = {}) => {
    const state = {
      auctionStarted: updates.auctionStarted ?? auctionStarted,
      remainingNumbers: updates.remainingNumbers ?? remainingNumbers,
      unsoldQueue: updates.unsoldQueue ?? unsoldQueue,
      completedNumbers: updates.completedNumbers ?? completedNumbers,
      isUnsoldPhase: updates.isUnsoldPhase ?? isUnsoldPhase,
      auctionComplete: updates.auctionComplete ?? auctionComplete,
      currentPlayerId: updates.currentPlayerId ?? playerId,
      showDrawingAnimation: updates.showDrawingAnimation ?? false,
    };
    localStorage.setItem('auctionState', JSON.stringify(state));
  }, [auctionStarted, remainingNumbers, unsoldQueue, completedNumbers, isUnsoldPhase, auctionComplete, playerId]);

  // Initialize remaining numbers (1-95)
  const initializeNumbers = useCallback(() => {
    const numbers = Array.from({ length: 95 }, (_, i) => i + 1);
    // Shuffle array
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
  }, []);

  // Draw next random number with animation
  const drawNextNumber = useCallback((pool) => {
    const currentPool = pool || (isUnsoldPhase ? unsoldQueue : remainingNumbers);
    
    if (currentPool.length === 0) {
      if (!isUnsoldPhase && unsoldQueue.length > 0) {
        // Switch to unsold phase
        setIsUnsoldPhase(true);
        return;
      }
      setAuctionComplete(true);
      return;
    }

    setIsDrawing(true);
    setStampAnimation(null);
    
    // Pre-select the final number
    const randomIndex = Math.floor(Math.random() * currentPool.length);
    const drawnNumber = currentPool[randomIndex];
    
    // Animation: cycle through random numbers for 0.5-1 sec
    let animationCount = 0;
    const maxAnimations = 15 + Math.floor(Math.random() * 10); // 15-25 cycles
    const animationInterval = setInterval(() => {
      const randomDisplay = currentPool[Math.floor(Math.random() * currentPool.length)];
      setDisplayNumber(randomDisplay);
      animationCount++;
      
      if (animationCount >= maxAnimations) {
        clearInterval(animationInterval);
        
        setDisplayNumber(drawnNumber);
        setPlayerId(drawnNumber);
        
        // Remove from pool
        if (isUnsoldPhase) {
          setUnsoldQueue(prev => prev.filter(n => n !== drawnNumber));
        } else {
          setRemainingNumbers(prev => prev.filter(n => n !== drawnNumber));
        }
        
        setIsDrawing(false);
      }
    }, 50);
  }, [remainingNumbers, unsoldQueue, isUnsoldPhase]);

  // Handle Start Auction
  const handleStartAuction = () => {
    const numbers = initializeNumbers();
    setRemainingNumbers(numbers);
    setAuctionStarted(true);
    
    // Pre-select the first number
    const randomIndex = Math.floor(Math.random() * numbers.length);
    const firstNumber = numbers[randomIndex];
    const newRemainingNumbers = numbers.filter(n => n !== firstNumber);
    
    // Save initial state
    saveAuctionState({
      auctionStarted: true,
      remainingNumbers: newRemainingNumbers,
      currentPlayerId: firstNumber,
    });
    
    // Pass the numbers directly to drawNextNumber since state won't be updated yet
    setTimeout(() => {
      drawNextNumber(numbers);
    }, 100);
  };

  // Handle Sold
  const handleSold = () => {
    if (isDrawing || !playerId) return;
    
    setStampAnimation('sold');
    const newCompletedNumbers = [...completedNumbers, { id: playerId, status: 'sold' }];
    setCompletedNumbers(newCompletedNumbers);
    
    // Determine next number and save state before reload
    const currentPool = isUnsoldPhase ? unsoldQueue : remainingNumbers;
    
    if (currentPool.length === 0) {
      if (!isUnsoldPhase && unsoldQueue.length > 0) {
        // Switch to unsold phase
        const randomIndex = Math.floor(Math.random() * unsoldQueue.length);
        const nextNumber = unsoldQueue[randomIndex];
        const newUnsoldQueue = unsoldQueue.filter(n => n !== nextNumber);
        
        saveAuctionState({
          completedNumbers: newCompletedNumbers,
          unsoldQueue: newUnsoldQueue,
          isUnsoldPhase: true,
          currentPlayerId: nextNumber,
        });
      } else {
        // Auction complete
        saveAuctionState({
          completedNumbers: newCompletedNumbers,
          auctionComplete: true,
          currentPlayerId: null,
        });
      }
    } else {
      const randomIndex = Math.floor(Math.random() * currentPool.length);
      const nextNumber = currentPool[randomIndex];
      
      if (isUnsoldPhase) {
        const newUnsoldQueue = unsoldQueue.filter(n => n !== nextNumber);
        saveAuctionState({
          completedNumbers: newCompletedNumbers,
          unsoldQueue: newUnsoldQueue,
          currentPlayerId: nextNumber,
          showDrawingAnimation: true,
        });
      } else {
        const newRemainingNumbers = remainingNumbers.filter(n => n !== nextNumber);
        saveAuctionState({
          completedNumbers: newCompletedNumbers,
          remainingNumbers: newRemainingNumbers,
          currentPlayerId: nextNumber,
          showDrawingAnimation: true,
        });
      }
    }
    
    // Reload faster after stamp animation
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  // Handle Unsold
  const handleUnsold = () => {
    if (isDrawing || !playerId) return;
    
    setStampAnimation('unsold');
    
    let newUnsoldQueue = unsoldQueue;
    let newCompletedNumbers = completedNumbers;
    
    if (!isUnsoldPhase) {
      // Add to unsold queue only in first phase
      newUnsoldQueue = [...unsoldQueue, playerId];
      setUnsoldQueue(newUnsoldQueue);
    } else {
      // In unsold phase, mark as completed unsold
      newCompletedNumbers = [...completedNumbers, { id: playerId, status: 'unsold' }];
      setCompletedNumbers(newCompletedNumbers);
    }
    
    // Determine next number and save state before reload
    const currentPool = isUnsoldPhase ? unsoldQueue.filter(n => n !== playerId) : remainingNumbers;
    
    if (currentPool.length === 0) {
      if (!isUnsoldPhase && newUnsoldQueue.length > 0) {
        // Switch to unsold phase
        const randomIndex = Math.floor(Math.random() * newUnsoldQueue.length);
        const nextNumber = newUnsoldQueue[randomIndex];
        const updatedUnsoldQueue = newUnsoldQueue.filter(n => n !== nextNumber);
        
        saveAuctionState({
          completedNumbers: newCompletedNumbers,
          unsoldQueue: updatedUnsoldQueue,
          isUnsoldPhase: true,
          currentPlayerId: nextNumber,
          showDrawingAnimation: true,
        });
      } else {
        // Auction complete
        saveAuctionState({
          completedNumbers: newCompletedNumbers,
          unsoldQueue: isUnsoldPhase ? [] : newUnsoldQueue,
          auctionComplete: true,
          currentPlayerId: null,
        });
      }
    } else {
      const randomIndex = Math.floor(Math.random() * currentPool.length);
      const nextNumber = currentPool[randomIndex];
      
      if (isUnsoldPhase) {
        const updatedUnsoldQueue = currentPool.filter(n => n !== nextNumber);
        saveAuctionState({
          completedNumbers: newCompletedNumbers,
          unsoldQueue: updatedUnsoldQueue,
          currentPlayerId: nextNumber,
          showDrawingAnimation: true,
        });
      } else {
        const newRemainingNumbers = remainingNumbers.filter(n => n !== nextNumber);
        saveAuctionState({
          completedNumbers: newCompletedNumbers,
          remainingNumbers: newRemainingNumbers,
          unsoldQueue: newUnsoldQueue,
          currentPlayerId: nextNumber,
          showDrawingAnimation: true,
        });
      }
    }
    
    // Reload faster after stamp animation
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  // Reset auction (utility function)
  const resetAuction = () => {
    localStorage.removeItem('auctionState');
    window.location.reload();
  };

  // Re-auction only unsold players
  const reAuctionUnsold = () => {
    const unsoldPlayers = completedNumbers
      .filter(n => n.status === 'unsold')
      .map(n => n.id);
    
    if (unsoldPlayers.length === 0) {
      alert('No unsold players to re-auction!');
      return;
    }

    // Shuffle the unsold players
    for (let i = unsoldPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unsoldPlayers[i], unsoldPlayers[j]] = [unsoldPlayers[j], unsoldPlayers[i]];
    }

    // Keep only sold players in completed list
    const soldPlayers = completedNumbers.filter(n => n.status === 'sold');

    // Pre-select first number from unsold players
    const randomIndex = Math.floor(Math.random() * unsoldPlayers.length);
    const firstNumber = unsoldPlayers[randomIndex];
    const newRemainingNumbers = unsoldPlayers.filter(n => n !== firstNumber);

    // Save new state and reload
    const state = {
      auctionStarted: true,
      remainingNumbers: newRemainingNumbers,
      unsoldQueue: [],
      completedNumbers: soldPlayers,
      isUnsoldPhase: false,
      auctionComplete: false,
      currentPlayerId: firstNumber,
      showDrawingAnimation: true,
    };
    localStorage.setItem('auctionState', JSON.stringify(state));
    window.location.reload();
  };

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
    const qsPlayerId = queryParams.get("PlayerId");
    if (qsPlayerId) {
      setPlayerId(parseInt(qsPlayerId));
      setAuctionStarted(true);
    }
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

  // Removed handleClickOutside to prevent redirect when clicking buttons

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
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
          background-image: url('GGF25.png');
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
          max-width: min(55vh * (1920 / 1440), 90vw);
          aspect-ratio: 1920 / 1440;
          margin: 2px 0;
        }

        .player-card-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .player-number-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #1e3a8a;
          font-size: 28px;
          font-weight: 900;
          padding: 8px 20px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          z-index: 5;
        }

        /* Start Screen */
        .start-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          z-index: 1;
        }

        .start-button {
          padding: 24px 60px;
          font-size: 28px;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          border: none;
          border-radius: 16px;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(5, 150, 105, 0.4);
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .start-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(5, 150, 105, 0.5);
        }

        .start-button:active {
          transform: translateY(0);
        }

        /* Drawing Animation */
        .drawing-number {
          font-size: 120px;
          font-weight: 900;
          color: #fbbf24;
          text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);
          animation: pulse 0.1s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 20px;
          z-index: 1;
          margin: 8px 0;
        }

        .action-btn {
          padding: 16px 40px;
          font-size: 20px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .sold-btn {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          color: white;
          box-shadow: 0 4px 16px rgba(5, 150, 105, 0.4);
        }

        .sold-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(5, 150, 105, 0.5);
        }

        .unsold-btn {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
          color: white;
          box-shadow: 0 4px 16px rgba(220, 38, 38, 0.4);
        }

        .unsold-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(220, 38, 38, 0.5);
        }

        /* Stamp Animation */
        .stamp-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-15deg) scale(0);
          font-size: 80px;
          font-weight: 900;
          text-transform: uppercase;
          padding: 20px 40px;
          border: 8px solid;
          border-radius: 12px;
          z-index: 10;
          animation: stampIn 0.5s ease-out forwards;
          pointer-events: none;
        }

        .stamp-sold {
          color: #059669;
          border-color: #059669;
          background: rgba(255, 255, 255, 0.95);
        }

        .stamp-unsold {
          color: #dc2626;
          border-color: #dc2626;
          background: rgba(255, 255, 255, 0.95);
        }

        @keyframes stampIn {
          0% {
            transform: translate(-50%, -50%) rotate(-15deg) scale(0);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) rotate(-15deg) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(-15deg) scale(1);
            opacity: 1;
          }
        }

        /* Status Info */
        .status-info {
          display: flex;
          gap: 20px;
          z-index: 1;
          background: rgba(255, 255, 255, 0.9);
          padding: 10px 20px;
          border-radius: 10px;
          margin-bottom: 8px;
        }

        .status-item {
          font-size: 14px;
          font-weight: 600;
          color: #1e3a8a;
        }

        .status-item span {
          color: #059669;
        }

        .unsold-phase-badge {
          background: #fbbf24;
          color: #1e3a8a;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          z-index: 1;
          animation: blink 1s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .auction-complete {
          font-size: 48px;
          font-weight: 900;
          color: #fbbf24;
          text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);
          z-index: 1;
        }

        .auction-complete-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          z-index: 1;
        }

        .complete-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .complete-btn {
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .restart-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
        }

        .restart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
        }

        .reauction-btn {
          background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
          color: #1e3a8a;
          box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
        }

        .reauction-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5);
        }

        /* Side Panels */
        .side-panels-container {
          position: fixed;
          top: 120px;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 2;
        }

        .side-panel {
          position: absolute;
          top: 0;
          width: 120px;
          max-height: calc(100vh - 300px);
          overflow-y: auto;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 10px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          pointer-events: auto;
        }

        .side-panel::-webkit-scrollbar {
          width: 4px;
        }

        .side-panel::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }

        .left-panel {
          left: 10px;
        }

        .right-panel {
          right: 10px;
        }

        .panel-title {
          font-size: 12px;
          font-weight: 700;
          color: #1e3a8a;
          text-align: center;
          margin-bottom: 8px;
          padding-bottom: 6px;
          border-bottom: 2px solid #e5e7eb;
        }

        .panel-numbers {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          justify-content: center;
        }

        .number-chip {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 6px;
          min-width: 32px;
          text-align: center;
        }

        .number-chip.sold {
          background: #dcfce7;
          color: #059669;
        }

        .number-chip.unsold {
          background: #fee2e2;
          color: #dc2626;
        }

        .number-chip.pending {
          background: #fef3c7;
          color: #d97706;
        }

        .panel-count {
          font-size: 10px;
          color: #6b7280;
          text-align: center;
          margin-top: 6px;
        }

        .reset-btn {
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 600;
          background: #6b7280;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .reset-btn:hover {
          background: #4b5563;
        }

        /* Tablet view - 3 cards per row */
        @media (max-width: 1024px) {
          .side-panel {
            width: 100px;
            padding: 8px;
          }

          .panel-title {
            font-size: 11px;
          }

          .number-chip {
            font-size: 10px;
            padding: 3px 6px;
            min-width: 28px;
          }

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
            max-width: min(45vh * (1920 / 1440), 85vw);
          }

          .player-number-badge {
            font-size: 22px;
            padding: 6px 16px;
          }

          .drawing-number {
            font-size: 80px;
          }

          .stamp-overlay {
            font-size: 60px;
            padding: 15px 30px;
          }
        }

        /* Mobile view - 2 cards per row */
        @media (max-width: 768px) {
          .side-panels-container {
            position: relative;
            top: auto;
            left: auto;
            right: auto;
            bottom: auto;
            display: flex;
            gap: 10px;
            justify-content: center;
            pointer-events: auto;
            margin-bottom: 8px;
          }

          .side-panel {
            position: relative;
            width: 45%;
            max-width: 160px;
            max-height: 120px;
            left: auto;
            right: auto;
          }

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
            max-width: min(40vh * (1920 / 1440), 90vw);
          }

          .player-number-badge {
            font-size: 18px;
            padding: 5px 12px;
            top: 8px;
            right: 8px;
          }

          .action-buttons {
            gap: 12px;
          }

          .action-btn {
            padding: 12px 24px;
            font-size: 16px;
          }

          .drawing-number {
            font-size: 60px;
          }

          .stamp-overlay {
            font-size: 40px;
            padding: 10px 20px;
            border-width: 5px;
          }

          .start-button {
            padding: 18px 40px;
            font-size: 22px;
          }

          .status-info {
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            padding: 8px 12px;
          }

          .status-item {
            font-size: 12px;
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
            max-width: min(35vh * (1920 / 1440), 92vw);
          }

          .player-number-badge {
            font-size: 14px;
            padding: 4px 10px;
            top: 5px;
            right: 5px;
            border-radius: 6px;
          }

          .action-btn {
            padding: 10px 20px;
            font-size: 14px;
          }

          .drawing-number {
            font-size: 50px;
          }

          .stamp-overlay {
            font-size: 30px;
            padding: 8px 16px;
            border-width: 4px;
          }

          .start-button {
            padding: 14px 30px;
            font-size: 18px;
          }
        }
      `}</style>

      {/* Status Info */}
      {auctionStarted && !auctionComplete && (
        <div className="status-info">
          <div className="status-item">
            Remaining: <span>{remainingNumbers.length}</span>
          </div>
          <div className="status-item">
            Unsold Queue: <span>{unsoldQueue.length}</span>
          </div>
          <div className="status-item">
            Done: <span>{completedNumbers.length}</span>
          </div>
          <button className="reset-btn" onClick={resetAuction}>
            Reset
          </button>
        </div>
      )}

      {/* Unsold Phase Badge */}
      {isUnsoldPhase && !auctionComplete && (
        <div className="unsold-phase-badge">
          🔄 UNSOLD PLAYERS ROUND
        </div>
      )}

      {/* Start Screen */}
      {!auctionStarted && !loading && (
        <div className="start-screen">
          <button className="start-button" onClick={handleStartAuction}>
            🎯 Start Auction
          </button>
        </div>
      )}

      {/* Drawing Animation */}
      {isDrawing && (
        <div className="drawing-number">
          #{displayNumber}
        </div>
      )}

      {/* Auction Complete */}
      {auctionComplete && (
        <div className="auction-complete-container">
          <div className="auction-complete">
            🏆 AUCTION COMPLETE! 🏆
          </div>
          <div className="complete-actions">
            <button className="complete-btn restart-btn" onClick={resetAuction}>
              🔄 Restart Full Auction
            </button>
            {completedNumbers.filter(n => n.status === 'unsold').length > 0 && (
              <button className="complete-btn reauction-btn" onClick={reAuctionUnsold}>
                ♻️ Re-Auction Unsold ({completedNumbers.filter(n => n.status === 'unsold').length})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Side Panels - Completed and Unsold Queues */}
      {auctionStarted && (
        <div className="side-panels-container">
          {/* Left Panel - Completed Numbers */}
          <div className="side-panel left-panel">
            <div className="panel-title">✓ COMPLETED</div>
            <div className="panel-numbers">
              {completedNumbers.map((item) => (
                <div key={item.id} className={`number-chip ${item.status}`}>
                  {item.id}
                </div>
              ))}
            </div>
            <div className="panel-count">{completedNumbers.length} done</div>
          </div>

          {/* Right Panel - Unsold Queue */}
          <div className="side-panel right-panel">
            <div className="panel-title">⏳ UNSOLD QUEUE</div>
            <div className="panel-numbers">
              {unsoldQueue.map((num) => (
                <div key={num} className="number-chip pending">
                  {num}
                </div>
              ))}
            </div>
            <div className="panel-count">{unsoldQueue.length} pending</div>
          </div>
        </div>
      )}

      {/* Player Card at Top */}
      {auctionStarted && playerId && !isDrawing && !auctionComplete && (
        <div ref={playerCardRef} className="player-card-container">
          <div className="player-number-badge">#{playerId}</div>
          <img
            className="player-card-image"
            src={`PlayerCards/${playerId}.png`}
            alt={`Player ${playerId}`}
          />
          {/* Stamp Animation Overlay */}
          {stampAnimation && (
            <div className={`stamp-overlay stamp-${stampAnimation}`}>
              {stampAnimation === 'sold' ? '✓ SOLD' : '✗ UNSOLD'}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {auctionStarted && playerId && !auctionComplete && (
        <div className="action-buttons">
          <button 
            className="action-btn sold-btn" 
            onClick={handleSold}
            disabled={isDrawing || stampAnimation}
          >
            ✓ SOLD
          </button>
          <button 
            className="action-btn unsold-btn" 
            onClick={handleUnsold}
            disabled={isDrawing || stampAnimation}
          >
            ✗ UNSOLD
          </button>
        </div>
      )}

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
