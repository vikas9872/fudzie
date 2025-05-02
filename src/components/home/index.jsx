import React from 'react';

const HomePage = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/Images/home.mp4"
        autoPlay
        loop
        muted
      ></video>

      {/* Overlay Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white">Welcome to Fudzie!</h1>
        <p className="text-md md:text-lg text-white max-w-2xl mx-auto mt-4">
          Discover delicious recipes, explore special dishes, and find inspiration for your next meal. Fudzie is your ultimate food companion!
        </p>
      </div>

      {/* Optional Overlay for Darkening the Video */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0"></div>
    </div>
  );
};

export default HomePage;