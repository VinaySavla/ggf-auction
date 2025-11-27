import React from 'react';

const TitleSponser = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-700 to-blue-500 text-white p-10 shadow-lg w-full max-w-full mx-auto">
      {/* Background Cricket Theme */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="GGF.png" // Replace with an actual cricket background image URL
          alt="Cricket Theme"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Content Section */}
      <div className="relative flex flex-col md:flex-row items-center justify-center">
        {/* Left Section */}
        <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-10">
          {/* Title */}
          <h2 className="text-lg md:text-4xl font-bold mb-4 text-center">Godhara Graduates Forum</h2>

          {/* Sponsor Name */}
          {/* <p className="text-sm md:text-2xl font-semibold text-center">
            Godhara Graduates Forum
          </p> */}

          {/* Cricket Ball Decoration */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <img
              src="cricket-ball.gif" // Replace with the actual cricket ball gif URL
              alt="Cricket Ball"
              className="w-4 h-4 md:w-8 md:h-8 rounded-full"
            />
            <img
              src="cricket-bat.gif" // Replace with the actual cricket bat gif URL
              alt="Cricket Ball"
              className="w-4 h-4 md:w-8 md:h-8 rounded-full"
            />
            <img
              src="cricket-ball.gif" // Replace with the actual cricket ball gif URL
              alt="Cricket Ball"
              className="w-4 h-4 md:w-8 md:h-8 rounded-full"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="overflow-hidden w-full h-auto md:w-auto md:h-96 shadow-lg rounded-lg">
          <img
            src="GGF.png" // Replace with the family image URL
            alt="GGF Team"
            className="w-full md:h-full object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default TitleSponser;
