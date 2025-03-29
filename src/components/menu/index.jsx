'use client';
import React, { useState } from 'react';
import { menuItems } from '@/staticValues/menuItems';
import db from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

const Menu = () => {
  const [quantities, setQuantities] = useState(
    menuItems.reduce((acc, item) => {
      acc[item.id] = 0;
      return acc;
    }, {})
  );

  const updateCartInFirebase = async (id, quantity) => {
    const item = menuItems.find((item) => item.id === id);
    if (item) {
      try {
        await setDoc(doc(db, 'cart', id), {
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

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center pt-16">
      <h1 className="text-6xl font-bold text-gray-800 mb-6 text-center">Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
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
