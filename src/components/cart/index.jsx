'use client';
import React, { useEffect, useState } from 'react';
import db from '@/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items from Firestore
  const fetchCartItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cart'));
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  // Remove an item from the cart
  const handleRemoveItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'cart', id));
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      console.log(`Item with id ${id} removed from the cart`);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center pt-16">
      <h1 className="text-6xl font-bold text-gray-800 mb-6 text-center">Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-lg text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-gray-300 py-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.displayName}
                  className="w-16 h-16 object-cover rounded-full"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{item.displayName}</h2>
                  <p className="text-gray-600">${item.price}</p>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                </div>
              </div>
              <button
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                onClick={() => handleRemoveItem(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
          {/* Total Amount */}
          <div className="flex justify-between items-center mt-6 border-t border-gray-300 pt-4">
            <h2 className="text-2xl font-bold text-gray-800">Total:</h2>
            <p className="text-2xl font-semibold text-gray-800">
              ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
            </p>
          </div>
          {/* Pay on Delivery Button */}
          <div className="flex justify-center mt-6">
            <button
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
              onClick={() => alert('Order placed successfully!')}
            >
              Pay on Delivery
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;