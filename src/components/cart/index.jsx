'use client';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';
import db from '@/firebase';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setCartItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCartData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const cartCollection = collection(db, 'users', userId, 'cart');
        const cartSnapshot = await getDocs(cartCollection);
        const cartData = cartSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCartItems(cartData);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [userId]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handlePayment = async () => {
    const stripe = await stripePromise;

    console.log('Cart items being sent to API:', cartItems); // Debugging log

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
      });

      const session = await response.json();

      if (session.id) {
        await stripe.redirectToCheckout({ sessionId: session.id });
      } else {
        console.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error during payment:', error);
    }
  };

  const handleCashOnDelivery = async () => {
    if (!userId) {
      console.error('User is not logged in.');
      return;
    }
  
    try {
      // Reference to the user's document in Firestore
      const userDocRef = doc(db, 'users', userId);
  
      // Update the user's document with the payment mode
      await setDoc(
        userDocRef,
        { paymentMode: 'Cash on Delivery' }, // Add or update the paymentMode field
        { merge: true } // Merge with existing data
      );
  
      console.log('Cash on Delivery selected and saved to database.');
      alert('Cash on Delivery has been selected successfully!');
    } catch (error) {
      console.error('Error saving Cash on Delivery to database:', error);
      alert('Failed to select Cash on Delivery. Please try again.');
    }
  };

  if (!userId) {
    return <p className="text-center text-black">Please sign in to view your cart.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-8 text-center">
        Your Cart
      </h1>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-4 md:p-8">
        {cartItems.length > 0 ? (
          <div>
            {/* Scrollable Table Container */}
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-2 md:px-4 text-black text-sm md:text-base">
                      Image
                    </th>
                    <th className="py-2 px-2 md:px-4 text-black text-sm md:text-base">
                      Name
                    </th>
                    <th className="py-2 px-2 md:px-4 text-black text-sm md:text-base">
                      Price
                    </th>
                    <th className="py-2 px-2 md:px-4 text-black text-sm md:text-base">
                      Quantity
                    </th>
                    <th className="py-2 px-2 md:px-4 text-black text-sm md:text-base">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2 px-2 md:px-4">
                        <img
                          src={item.image || '/placeholder.png'}
                          alt={item.displayName}
                          className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md"
                        />
                      </td>
                      <td className="py-2 px-2 md:px-4 text-black text-sm md:text-base">
                        {item.displayName}
                      </td>
                      <td className="py-2 px-2 md:px-4 text-black text-sm md:text-base">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-2 px-2 md:px-4 text-black text-sm md:text-base">
                        {item.quantity}
                      </td>
                      <td className="py-2 px-2 md:px-4 text-black text-sm md:text-base">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 space-y-4 md:space-y-0 md:space-x-4">
              <h2 className="text-xl md:text-2xl font-bold text-black">
                Total: <span className="text-blue-600">${calculateTotal()}</span>
              </h2>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                <button
                  onClick={handlePayment}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
                >
                  Proceed to Payment
                </button>
                <button
                  onClick={handleCashOnDelivery}
                  className="bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-900 w-full sm:w-auto"
                >
                  Cash on Delivery
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-black">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;