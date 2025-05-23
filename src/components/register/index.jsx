'use client';
import React, { useRef, useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import db from '../../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import bcrypt from 'bcryptjs';

const User = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null); // State to track the logged-in user
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const passwordRef = useRef(null);
  const feedbackRef = useRef(null); // Reference for feedback input

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

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user details in Firestore if needed
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });

      console.log('User signed in with Google:', user);
      alert('Signed in successfully!');
    } catch (error) {
      console.error('Error signing in with Google:', error);
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

  const submitFeedback = async (event) => {
    event.preventDefault();
    try {
      const feedback = feedbackRef.current.value;

      // Save feedback to Firestore
      await setDoc(doc(db, 'feedback', user.uid), {
        feedback: feedback,
        email: user.email,
      });

      console.log('Feedback submitted:', feedback);
      alert('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(error.message);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/Images/login.mp4"
        autoPlay
        loop
        muted
      ></video>

      {/* Overlay Content */}
      <div className="relative z-10 w-[95%] md:w-[50%] bg-white/50 p-8 rounded-lg shadow-lg">
        {user ? (
          <>
            <h1 className="font-bold text-2xl md:text-4xl text-black mb-6">Provide Feedback</h1>
            <form onSubmit={submitFeedback} className="flex flex-col gap-6">
              <textarea
                placeholder="Your feedback"
                className="bg-[#E7E7E78A] w-full h-[100px] rounded-xl placeholder-[#454545] outline-none text-black p-4"
                ref={feedbackRef}
                required
              />
              <button
                type="submit"
                className="bg-black text-white w-full h-[53px] rounded-xl hover:bg-gray-800"
              >
                Submit Feedback
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="font-bold text-2xl md:text-4xl text-black mb-6">
              {isLogin ? 'Login, Welcome Back' : 'Sign Up, Join Us'}
            </h1>
            <form onSubmit={isLogin ? login : register} className="flex flex-col gap-6">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="bg-[#E7E7E78A] w-full h-[40px] md:h-[53px] rounded-xl placeholder-[#454545] outline-none text-black p-4"
                  ref={nameRef}
                  required
                />
              )}
              <input
                type="email"
                placeholder="E-mail"
                className="bg-[#E7E7E78A] w-full h-[40px] md:h-[53px] rounded-xl placeholder-[#454545] outline-none text-black p-4"
                ref={emailRef}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="bg-[#E7E7E78A] w-full h-[40px] md:h-[53px] rounded-xl placeholder-[#454545] outline-none text-black p-4"
                ref={passwordRef}
                required
              />
              <button
                type="submit"
                className="bg-black text-white w-full h-[40px] md:h-[53px] rounded-xl hover:bg-gray-800"
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
              <div className="flex items-center justify-center gap-2">
                <div className="w-full h-[1.5px] bg-gradient-to-l from-black to-gray-300"></div>
                <p className="text-black text-sm md:text-lg">or</p>
                <div className="w-full h-[1.5px] bg-gradient-to-r from-black to-gray-300"></div>
              </div>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="flex items-center justify-center text-black text-sm border-[#4A4A4A] border-2 p-2 rounded-full"
              >
                <img
                  src="/Images/googleicon.png"
                  alt="google_icon"
                  className="h-[18px] md:h-[24px] w-[18px] md:w-[24px] mr-2"
                />
                <p className="text-xs md:text-lg">Sign in using Google</p>
              </button>
              <p className="text-center text-black">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <span
                  className="font-bold cursor-pointer hover:underline"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Sign Up' : 'Log In'}
                </span>
              </p>
            </form>
          </>
        )}
      </div>

      {/* Optional Overlay for Darkening the Video */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0"></div>
    </div>
  );
};

export default User;
