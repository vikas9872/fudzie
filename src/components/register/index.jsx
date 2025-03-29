'use client';
import React, { useRef, useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import db from '../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import bcrypt from 'bcryptjs';

const User = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null); // State to track the logged-in user
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the user state when logged in or logged out
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  const register = async (event) => {
    event.preventDefault();
    try {
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const name = nameRef.current.value;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user details in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        password: hashedPassword,
      });

      console.log('User registered:', user);
      alert('Registration successful!');
    } catch (error) {
      console.error('Error creating user:', error);
      alert(error.message);
    }
  };

  const login = async (event) => {
    event.preventDefault();
    try {
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
    } catch (error) {
      console.error('Error logging in user:', error);
      alert(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
      alert('You have been signed out.');
    } catch (error) {
      console.error('Error signing out:', error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center">
      <h1
        className="font-extrabold text-4xl md:text-8xl text-black mb-6"
        data-aos="fade-left"
      >
        {user ? 'Welcome Back!' : isLogin ? 'Log In' : 'Sign Up'}
      </h1>
      {user ? (
        <div className="flex flex-col items-center">
          <p className="text-lg text-black mb-4">You are logged in as {user.email}</p>
          <button
            onClick={handleSignOut}
            className="border-2 border-black p-2 w-full md:w-auto cursor-pointer text-black hover:bg-black hover:text-white"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <form
          className="w-full md:w-[50%] flex flex-col gap-4 p-4 backdrop-blur-0 backdrop-saturate-200 bg-white rounded-lg border border-gray-300/30 shadow-lg"
          onSubmit={isLogin ? login : register}
        >
          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label className="text-lg text-black">Full Name</label>
              <input
                type="text"
                className="border-2 p-2 outline-none border-black text-black"
                ref={nameRef}
                required
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="text-lg text-black">Email</label>
            <input
              type="email"
              className="border-2 p-2 outline-none"
              ref={emailRef}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg text-black">Password</label>
            <input
              type="password"
              className="border-2 p-2 outline-none"
              ref={passwordRef}
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="border-2 border-black p-2 w-full md:w-full cursor-pointer text-black hover:bg-black hover:text-white"
            >
              {isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-black">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <span
                className="font-bold cursor-pointer hover:underline ml-1 text-black"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </span>
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default User;