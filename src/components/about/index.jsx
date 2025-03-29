import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-cover bg-center min-h-screen pt-40"
      style={{ backgroundImage: "url('/Images/aboutusimg.jpg')" }}>
      <div className='flex flex-col p-4'>
        <h1 className="text-6xl font-bold text-gray-800 mb-6">About Us</h1>
        <p className="text-lg text-gray-600  max-w-2xl">
          Welcome to Fudzie! We are passionate about bringing you the best recipes and food inspiration from around the world.
          Our mission is to make cooking fun, easy, and accessible for everyone. Whether you're a seasoned chef or just starting
          your culinary journey, Fudzie is here to guide you every step of the way.
        </p>
        <p className="text-lg text-gray-600  max-w-2xl mt-4">
          Join us as we explore new flavors, share tips, and celebrate the joy of food. Thank you for being a part of our community!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;