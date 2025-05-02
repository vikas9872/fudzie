import React from 'react';

const AboutUs = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/Images/aboutus.mp4" // Replace with your video file path
        autoPlay
        loop
        muted
      ></video>

      {/* Overlay Content */}
      <div className="z-10 flex flex-col w-[100%] pl-8">
        <h1 className="text-6xl font-bold text-white mb-6">About Us</h1>
        <p className="text-lg text-white max-w-2xl">
          Welcome to Fudzie! We’re passionate about bringing you the best recipes and food inspiration from around the world. Our goal is to make cooking fun, simple, and accessible for everyone.
          Whether you're an experienced chef or just getting started, Fudzie is here to support you with easy-to-follow recipes, helpful tips, and plenty of culinary inspiration. From quick meals to special dishes, we’ve got something for every taste and occasion.
          Join our community of food lovers and let’s explore the joy of cooking — one delicious recipe at a time!
        </p>
      </div>

      {/* Optional Overlay for Darkening the Video */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0"></div>
    </div>
  );
};

export default AboutUs;