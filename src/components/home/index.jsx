import React from 'react';

const HomePage = () => {
  return (
    <div
      className="bg-cover bg-center min-h-screen flex flex-col items-center pt-40"
      style={{ backgroundImage: "url('/Images/homeimg.jpg')" }}
    >
      <h1 className="text-6xl font-bold text-black text-center mt-0.5">Welcome to Fudzie!</h1>
      <p className="text-lg text-black text-center max-w-2xl">
        Discover delicious recipes, explore special dishes, and find inspiration for your next meal. Fudzie is your ultimate food companion!
      </p>
    </div>
  );
};

export default HomePage;