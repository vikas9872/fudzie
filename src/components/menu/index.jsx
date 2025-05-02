'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { menuItems } from '@/staticValues/menuItems';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import db from '@/firebase';

const Menu = () => {
  const [quantities, setQuantities] = useState(
    menuItems.reduce((acc, item) => {
      acc[item.id] = 0;
      return acc;
    }, {})
  );
  const [userId, setUserId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setQuantities(
          menuItems.reduce((acc, item) => {
            acc[item.id] = 0;
            return acc;
          }, {})
        );
      }
    });

    return () => unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const updateCartInFirebase = async (id, quantity) => {
    if (!userId) {
      console.error('User is not signed in.');
      return;
    }

    const item = menuItems.find((item) => item.id === id);
    if (item) {
      try {
        await setDoc(doc(db, 'users', userId, 'cart', id), {
          id: item.id,
          displayName: item.displayName,
          price: item.price,
          quantity: quantity,
          image: item.image,
        });
        console.log(`${item.displayName} updated in the cart with quantity: ${quantity}`);
      } catch (error) {
        console.error('Error updating cart in Firebase:', error);
      }
    }
  };

  const handleIncrease = (id) => {
    setQuantities((prevQuantities) => {
      const newQuantities = {
        ...prevQuantities,
        [id]: prevQuantities[id] + 1,
      };
      updateCartInFirebase(id, newQuantities[id]);
      return newQuantities;
    });
  };

  const handleDecrease = (id) => {
    setQuantities((prevQuantities) => {
      const newQuantities = {
        ...prevQuantities,
        [id]: Math.max(prevQuantities[id] - 1, 0),
      };
      updateCartInFirebase(id, newQuantities[id]);
      return newQuantities;
    });
  };

  // Get unique categories from menuItems
  const categories = ['All', ...new Set(menuItems.map((item) => item.category))];

  // Filter menu items based on the selected category
  const filteredMenuItems =
    selectedCategory === 'All'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col items-center pt-16 px-4">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/Images/menu.mp4" // Replace with your video file path
        autoPlay
        loop
        muted
      ></video>

      {/* Overlay for better readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0"></div>

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-center">Menu</h1>

        {/* Dropdown Button for Categories */}
        <div className="relative mb-8 flex justify-end w-full" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-4 py-2 w-48 bg-white/80 text-black rounded-lg shadow-md hover:bg-white focus:outline-none flex items-center justify-between"
          >
            {selectedCategory}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-5 h-5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''
                }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute mt-3 bg-white shadow-lg rounded-lg w-48 z-10">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setDropdownOpen(false);
                  }}
                  className={`block w-full text-left text-black px-4 py-2 hover:bg-gray-200 ${selectedCategory === category ? 'bg-gray-100 font-bold' : ''
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/70 shadow-md rounded-lg p-4 flex flex-col items-center"
            >
              <img
                src={item.image}
                alt={item.displayName}
                className="w-32 h-32 object-cover rounded-full mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800">{item.displayName}</h2>
              <p className="text-black mb-2">${item.price}</p>
              <p className="text-sm text-black mb-4 text-center">{item.description}</p>
              <div className="flex items-center space-x-4">
                <button
                  className="px-3 py-1 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                  onClick={() => handleDecrease(item.id)}
                >
                  -
                </button>
                <span className="text-lg text-black font-bold">{quantities[item.id]}</span>
                <button
                  className="px-3 py-1 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                  onClick={() => handleIncrease(item.id)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Proceed to Cart Button */}
        <div className="flex justify-center items-center mt-8 mb-8">
          <button
            onClick={() => router.push('/cart')}
            className="px-6 py-3 bg-white/80 text-black font-semibold rounded-lg shadow-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Proceed to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
