'use client';
import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null); // Ref for the menu

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert('You have been signed out.');
    } catch (error) {
      console.error('Error signing out:', error);
      alert(error.message);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800">Fudzie</div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-800 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <ul
          ref={menuRef}
          className={`${isMenuOpen ? 'block' : 'hidden'
            } md:flex space-y-2 md:space-y-0 md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none`}
        >
          <li>
            <a
              href="#home"
              className="block text-gray-600 hover:text-gray-800 px-4 py-2"
              onClick={() => setIsMenuOpen(false)} // Close menu on click
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="block text-gray-600 hover:text-gray-800 px-4 py-2"
              onClick={() => setIsMenuOpen(false)} // Close menu on click
            >
              About Us
            </a>
          </li>
          <li>
            <a
              href="#menu"
              className="block text-gray-600 hover:text-gray-800 px-4 py-2"
              onClick={() => setIsMenuOpen(false)} // Close menu on click
            >
              Menu
            </a>
          </li>
        </ul>

        {/* Sign up / Sign out Button */}
        {user ? (
          <button
            className="hidden md:block px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        ) : (
          <button
            className="hidden md:block px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            onClick={() => {
              const registrationSection = document.getElementById('registration');
              if (registrationSection) {
                registrationSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Sign up
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;