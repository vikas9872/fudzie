'use client';
import React, { useState, useEffect, useRef } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState('All'); // State for selected category
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
  const dropdownRef = useRef(null); // Ref for the dropdown
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-16 px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 text-center">Menu</h1>

      {/* Dropdown Button for Categories */}
      <div className="relative mb-8 flex justify-end w-full" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="px-4 py-2 w-48 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
        >
          {selectedCategory} <span className="ml-2">&#x25BC;</span>
        </button>
        {dropdownOpen && (
          <div className="absolute mt-12 bg-white shadow-lg rounded-lg w-48 z-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category); 
                  setDropdownOpen(false); 
                }}
                className={`block w-full text-left text-black px-4 py-2 hover:bg-gray-200 ${
                  selectedCategory === category ? 'bg-gray-100 font-bold' : ''
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
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
          >
            <img
              src={item.image}
              alt={item.displayName}
              className="w-32 h-32 object-cover rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">{item.displayName}</h2>
            <p className="text-black mb-2">${item.price}</p>
            <p className="text-sm text-gray-500 mb-4 text-center">{item.description}</p>
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
    </div>
  );
};

export default Menu;
