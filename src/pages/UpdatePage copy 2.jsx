import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UpdatePage = () => {
  const [loading, setLoading] = useState(true);
  const [playerId, setPlayerId] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const playerCardRef = useRef(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setPlayerId(queryParams.get("PlayerId"));
    setLoading(false);
  }, [location]);

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
    return <div>Loading...</div>;
  }

  if (!playerId) {
    return <div>No player data found.</div>;
  }

  return (
    <div className="w-full h-[100vh] flex items-center justify-center relative">
      <img
        className="absolute top-0 left-0 w-full h-full object-cover opacity-10"
        src="GGF.png"
        alt="Background"
      />
      <div ref={playerCardRef} className="relative w-full md:h-[100vh] flex items-center justify-center relative">
        <img
          className="w-full h-auto md:h-full object-fit"
          src={`PlayerCards/${playerId}.png`}
          alt={playerId}
        />
      </div>
    </div>
  );
};

export default UpdatePage;
