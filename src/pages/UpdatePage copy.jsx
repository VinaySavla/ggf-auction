import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Play } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UpdatePage = () => {
  const [playerData, setPlayerData] = useState();
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const playerId = queryParams.get('PlayerId');
    
    if (playerId) {
      axios.get(`${API_BASE_URL}/items/Players/${playerId}`)
        .then((response) => {
          setPlayerData(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching player data:", error);
          setLoading(false);
        });
    }
  }, [location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!playerData) {
    return <div>No player data found.</div>;
  }

  return (
    <div className="w-[1536px] h-[864px] bg-white">
      <div className="relative h-[864px]">
        <img
          className="absolute w-[1536px] h-[864px] top-0 left-0"
          alt="Clip path group"
          src="clip-path-group.png"
        />
        <div className="relative h-[864px]">
          <img
            className="absolute w-[394px] h-[153px] top-[425px] left-[533px]"
            alt="Clip path group"
            src="clip-path-group-1@2x.png"
          />

          <img
            className="absolute w-[394px] h-[153px] top-[425px] left-[533px]"
            alt="Clip path group"
            src="clip-path-group-2@2x.png"
          />

          <img
            className="absolute w-[394px] h-[153px] top-[425px] left-[533px]"
            alt="Clip path group"
            src="clip-path-group-3@2x.png"
          />

          <img
            className="absolute w-[1536px] h-[864px] top-0 left-0"
            alt="Clip path group"
            src="clip-path-group-4.png"
          />

          <img
            className="absolute w-[1536px] h-[864px] top-0 left-0"
            alt="Clip path group"
            src="clip-path-group-5.png"
          />

          <img
            className="absolute w-[1536px] h-[864px] top-0 left-0"
            alt="Clip path group"
            src="clip-path-group-6.png"
          />

          <img
            className="absolute w-[464px] h-[496px] top-[5px] left-[496px]"
            alt="Clip path group"
            src="clip-path-group-7@2x.png"
          />

          <img
            className="absolute w-[450px] h-[430px] top-0 left-[510px] rounded-lg"
            alt="Clip path group"
            src={`http://72.60.203.164/assets/${playerData.photo}`}
          />

          <img
            className="absolute w-[1536px] h-[864px] top-0 left-0"
            alt="Clip path group"
            src="clip-path-group-9.png"
          />

          <img
            className="absolute w-[1536px] h-[864px] top-0 left-0"
            alt="Clip path group"
            src="clip-path-group-10.png"
          />

          <img
            className="absolute w-[1536px] h-[864px] top-0 left-0"
            alt="Clip path group"
            src="clip-path-group-11.png"
          />

          <img
            className="absolute w-[1536px] h-[864px] top-0 left-0"
            alt="Clip path group"
            src="clip-path-group-12.png"
          />

          <img
            className="absolute w-[1536px] h-[864px] top-0 left-0"
            alt="Clip path group"
            src="clip-path-group-13.png"
          />

          <img
            className="absolute w-[284px] h-24 top-[566px] left-0"
            alt="Clip path group"
            src="clip-path-group-14@2x.png"
          />

          <img
            className="absolute w-[244px] h-[25px] top-[638px] left-0"
            alt="Clip path group"
            src="clip-path-group-15@2x.png"
          />

          <img
            className="absolute w-[206px] h-5 top-[652px] left-0"
            alt="Clip path group"
            src="clip-path-group-16@2x.png"
          />

          <img
            className="absolute w-[396px] h-[114px] top-7 left-[1018px]"
            alt="Clip path group"
            src="clip-path-group-17@2x.png"
          />

          <img
            className="absolute w-[280px] h-[22px] top-[124px] left-[1018px]"
            alt="Clip path group"
            src="clip-path-group-18@2x.png"
          />

          <img
            className="absolute w-[316px] h-[25px] top-[108px] left-[1018px]"
            alt="Clip path group"
            src="clip-path-group-19@2x.png"
          />

          <img
            className="absolute w-[396px] h-[114px] top-7 left-[86px]"
            alt="Clip path group"
            src="clip-path-group-20@2x.png"
          />

          <img
            className="absolute w-64 h-5 top-[132px] left-[86px]"
            alt="Clip path group"
            src="clip-path-group-21@2x.png"
          />

          <img
            className="absolute w-[316px] h-[25px] top-28 left-[86px]"
            alt="Clip path group"
            src="clip-path-group-22@2x.png"
          />

          <img
            className="absolute w-[818px] h-16 top-[774px] left-[169px]"
            alt="Clip path group"
            src="clip-path-group-23.png"
          />

          <img
            className="absolute w-[1536px] h-[864px] top-0 left-0"
            alt="Clip path group"
            src="clip-path-group-24.png"
          />

          <img
            className="absolute w-[1536px] h-[864px] top-0 left-0"
            alt="Clip path group"
            src="clip-path-group-25.png"
          />

          <img
            className="absolute w-[1536px] h-[864px] top-0 left-0"
            alt="Group"
            src="group.png"
          />
        </div>
      </div>

      <div className="absolute w-[140px] h-[35px] top-[632px] left-[762px] [font-family:'League_Spartan',Helvetica] font-bold text-white text-[34.6px] tracking-[0] leading-[normal] whitespace-nowrap">
        {playerData.points}
      </div>

      <div className="absolute w-[198px] h-[46px] top-[580px] left-[38px] [font-family:'League_Spartan',Helvetica] font-bold text-white text-[45.9px] tracking-[0] leading-[normal] whitespace-nowrap">
        AGE: {playerData.age}
      </div>

      <div className="w-[53px] top-[245px] left-[1315px] text-[42.9px] absolute h-[43px] [font-family:'Inter',Helvetica] font-bold text-[#843c8e] tracking-[0] leading-[normal] whitespace-nowrap">
        {playerData.bowl_wickets}
      </div>

      <div className="w-[52px] top-[425px] left-[1295px] text-[41.1px] absolute h-[43px] [font-family:'Inter',Helvetica] font-bold text-[#843c8e] tracking-[0] leading-[normal] whitespace-nowrap">
        {playerData.bowl_economy}
      </div>

      <div className="w-[52px] top-[425px] left-[1110px] text-[41.1px] absolute h-[43px] [font-family:'Inter',Helvetica] font-bold text-[#843c8e] tracking-[0] leading-[normal] whitespace-nowrap">
        {playerData.bowl_average}
      </div>

      <div className="w-[54px] top-[245px] left-[1110px] text-[41.1px] absolute h-[43px] [font-family:'Inter',Helvetica] font-bold text-[#843c8e] tracking-[0] leading-[normal] whitespace-nowrap">
        {playerData.bowl_match}
      </div>

      <div className="w-[60px] top-[425px] left-[338px] text-[42.9px] absolute h-[43px] [font-family:'Inter',Helvetica] font-bold text-[#843c8e] tracking-[0] leading-[normal] whitespace-nowrap">
        {playerData.bat_strike_rate}
      </div>

      <div className="w-[60px] top-[425px] left-[115px] text-[42.9px] absolute h-[43px] [font-family:'Inter',Helvetica] font-bold text-[#843c8e] tracking-[0] leading-[normal] whitespace-nowrap">
        {playerData.bat_average}
      </div>

      <div className="w-[60px] top-[250px] left-[338px] text-[42.9px] absolute h-[43px] [font-family:'Inter',Helvetica] font-bold text-[#843c8e] tracking-[0] leading-[normal] whitespace-nowrap">
        {playerData.bat_runs}
      </div>

      <div className="w-[60px] top-[250px] left-[145px] text-[42.9px] absolute h-[43px] [font-family:'Inter',Helvetica] font-bold text-[#843c8e] tracking-[0] leading-[normal] whitespace-nowrap">
        {playerData.bat_match}
      </div>

      <div className="absolute w-[74px] h-[33px] top-[361px] left-[1303px] [font-family:'League_Spartan',Helvetica] font-bold text-white text-[33.1px] tracking-[0] leading-[normal] whitespace-nowrap">
        ECO
      </div>

      <div className="absolute w-16 h-[33px] top-[179px] left-[1299px] [font-family:'League_Spartan',Helvetica] font-bold text-white text-[33.1px] tracking-[0] leading-[normal] whitespace-nowrap">
        WK
      </div>

      <div className="absolute w-[46px] h-[33px] top-[355px] left-[351px] [font-family:'League_Spartan',Helvetica] font-bold text-white text-[33.1px] tracking-[0] leading-[normal] whitespace-nowrap">
        SR
      </div>

      <div className="absolute w-20 h-[33px] top-[355px] left-[122px] [font-family:'League_Spartan',Helvetica] font-bold text-white text-[33.1px] tracking-[0] leading-[normal] whitespace-nowrap">
        AVG
      </div>

      <div className="absolute w-[77px] h-[33px] top-[184px] left-[130px] [font-family:'League_Spartan',Helvetica] font-bold text-white text-[33.1px] tracking-[0] leading-[normal] whitespace-nowrap">
        MAT
      </div>

      <div className="absolute w-20 h-[33px] top-[361px] left-[1086px] [font-family:'League_Spartan',Helvetica] font-bold text-white text-[33.1px] tracking-[0] leading-[normal] whitespace-nowrap">
        AVG
      </div>

      <div className="absolute w-[98px] h-[33px] top-[184px] left-[329px] [font-family:'League_Spartan',Helvetica] font-bold text-white text-[33.1px] tracking-[0] leading-[normal] whitespace-nowrap">
        RUNS
      </div>

      <div className="absolute w-[77px] h-[33px] top-[183px] left-[1086px] [font-family:'League_Spartan',Helvetica] font-bold text-white text-[33.1px] tracking-[0] leading-[normal] whitespace-nowrap">
        MAT
      </div>

      <div className="absolute w-[337px] h-[46px] top-[478px] left-[590px] [font-family:'League_Spartan',Helvetica] font-bold text-white text-[46.1px] tracking-[0] leading-[normal] whitespace-nowrap">
        {playerData.name}
      </div>

      <div className="absolute w-[225px] h-10 top-[625px] left-[543px] [font-family:'League_Spartan',Helvetica] font-bold text-white text-[39.9px] tracking-[0] leading-[normal] whitespace-nowrap">
        Base Price:
      </div>

      <div className="absolute w-[309px] h-[38px] top-[50px] left-[130px] [font-family:'League_Spartan',Helvetica] font-bold text-white text-[37.6px] tracking-[0] leading-[normal] whitespace-nowrap">
        BATTING STATS
      </div>

      <div className="absolute w-[331px] h-[38px] top-[50px] left-[1055px] [font-family:'League_Spartan',Helvetica] font-bold text-white text-[37.6px] tracking-[0] leading-[normal] whitespace-nowrap">
        BOWLING STATS
      </div>
    </div>
  );
};


export default UpdatePage;