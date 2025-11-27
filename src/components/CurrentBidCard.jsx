import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CurrentBidCard = ({ bid, isDesktop, onClick }) => {
  const [isImagePopped, setIsImagePopped] = useState(false);

  const handleImageClick = () => {
    if (!isDesktop) {
      setIsImagePopped((prev) => !prev);
    }
  };

  return (
    <div
      className="bid-card-container"
      onClick={isDesktop ? onClick : undefined}
      style={isDesktop ? { cursor: "pointer" } : {}}
    >
      <style>{`
        .bid-card-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .bid-card {
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          width: 100%;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
          border: 4px solid;
          border-image-source: linear-gradient(45deg, #ff0000, #ff7300, #ffeb00, #47ff00, #00ffea, #2b65ff, #8000ff, #ff0080);
          border-image-slice: 1;
          animation: rotateBorder 5s linear infinite;
        }
        @keyframes rotateBorder {
          0% {
            border-image-source: linear-gradient(45deg, #ff0000, #ff7300, #ffeb00, #47ff00, #00ffea, #2b65ff, #8000ff, #ff0080);
          }
          100% {
            border-image-source: linear-gradient(405deg, #ff0000, #ff7300, #ffeb00, #47ff00, #00ffea, #2b65ff, #8000ff, #ff0080);
          }
        }
        .bid-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .player-image-currentbid {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: contain;
          margin-right: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
        .player-image-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
  border: 4px solid;
  border-image-source: linear-gradient(45deg, #ff0000, #ff7300, #ffeb00, #47ff00, #00ffea, #2b65ff, #8000ff, #ff0080);
  border-image-slice: 1;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.player-image-popup img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

        }
.player-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        .player-name {
          font-size: 20px;
          font-weight: 700;
          color: #1e40af;
        }
        .player-details {
          font-size: 14px;
          color: #6b7280;
        }
        .price-info {
          text-align: right;
          margin-top: 10px; /* Add spacing on smaller screens */
        }
        .current-amount {
          font-size: 28px;
          font-weight: 800;
          color: #10b981;
        }
        .base-price {
          font-size: 16px;
          color: #6b7280;
          margin-top: 8px;
        }
        @media (max-width: 768px) {
          .bid-card {
            flex-direction: column;
          }
          .bid-card-header {
            flex-direction: column; /* Stack elements */
            align-items: center; /* Center items */
          }
          .player-image-currentbid {
            margin-right: 0;
            margin-bottom: 10px;
          }
            .price-info {
            text-align: center; /* Center align text */
          }
        }
      `}</style>

      <div className="bid-card">
        <div className="bid-card-header">
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <img
              src={bid.imageUrl}
              alt={bid.playerName}
              className="player-image-currentbid"
              onClick={handleImageClick}
            />
            <div className="player-info">
              <div className="player-name">{bid.playerName}</div>
              <div className="player-details">Age: {bid.age}</div>
            </div>
          </div>
          <div className="price-info">
            <div className="current-amount">Base Points: {bid.points}</div>
          </div>
        </div>
      </div>

      {isImagePopped && (
  <div className="player-image-popup" onClick={handleImageClick}>
    <img src={bid.imageUrl} alt={bid.playerName} />
  </div>
)}

    </div>
  );
};


const CurrentBid = () => {
  const [currentBids, setCurrentBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [auctionStatus, setAuctionStatus] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const navigate = useNavigate();

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchCurrentBids = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/items/Players?limit=100000`);
        const players = response.data.data;

        // Filter players whose auction_status is "ongoing auction"
        const ongoingAuctionPlayers = players.filter(
          (player) => player.auction_status.toLowerCase() === "ongoing auction"
        );

        if (ongoingAuctionPlayers.length > 0) {
          setCurrentBids(
            ongoingAuctionPlayers.map((player) => ({
              playerId: player.id,
              playerName: player.name,
              imageUrl: `${API_BASE_URL}/assets/${player.photo}`,
              age: player.age || "N/A",
              currentAmount: player.current_bid || "0 Kitty",
              points: player.points || "N/A",
            }))
          );
          setAuctionStatus("ongoing");
        } else {
          setAuctionStatus("no ongoing auction");
        }
      } catch (err) {
        setError("Failed to fetch current bid data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentBids();
  }, []);

  if (loading) {
    return <p>Loading current bids...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (auctionStatus === "no ongoing auction") {
    return (
      <div
      style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
        color: "white",
        textAlign: "center",
        height: "20vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1 rem",
      }}
      >
      Auction will start soon. Stay tuned!
      </div>
    );
  }

  if (!currentBids.length) {
    return <p>No bid data available.</p>;
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
      }}
    >
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          color: "#fff",
          textAlign: "center",
          marginBottom: "1.5rem",
        }}
      >
        Ongoing Auction
      </h2>
      {currentBids.map((bid, index) => (
        <CurrentBidCard
          key={index}
          bid={bid}
          isDesktop={true}
          onClick={() => navigate(`/player?PlayerId=${bid.playerId}`)}
        />
      ))}
    </div>
  );
};

export default CurrentBid;
