//utna kaam nhi aaya


import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-[#ff3b5c] to-[#701a29] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Vironex</h1>
          <p className="text-xl mb-8">Your ultimate video streaming platform</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="bg-white text-[#ff3b5c] py-3 px-8 rounded-full font-medium hover:bg-gray-200 transition-colors"
            >
              Log in
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-transparent border-2 border-white py-3 px-8 rounded-full font-medium hover:bg-white hover:text-[#ff3b5c] transition-colors"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Vironex</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#1a1a1a] p-6 rounded-xl">
            <div className="text-[#ff3b5c] text-4xl mb-4">📹</div>
            <h3 className="text-xl font-bold mb-2">High-Quality Videos</h3>
            <p className="text-gray-300">Stream and upload videos in HD and 4K quality with no compression.</p>
          </div>
          
          <div className="bg-[#1a1a1a] p-6 rounded-xl">
            <div className="text-[#ff3b5c] text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-gray-300">Enjoy buffer-free streaming with our optimized video delivery.</p>
          </div>
          
          <div className="bg-[#1a1a1a] p-6 rounded-xl">
            <div className="text-[#ff3b5c] text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">Secure Platform</h3>
            <p className="text-gray-300">Your content is protected with end-to-end encryption and secure storage.</p>
          </div>
        </div>
      </div>

      {/* Call-to-Action */}
      <div className="w-full bg-[#1a1a1a] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join Vironex Today</h2>
          <p className="text-xl text-gray-300 mb-8">
            Start sharing your creativity with the world
          </p>
          
          <button 
            onClick={() => navigate('/signup')}
            className="bg-[#ff3b5c] py-3 px-8 rounded-full font-medium hover:bg-[#e02d53] transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#0f0f0f] py-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-2xl font-bold mb-4 md:mb-0">Vironex</div>
          
          <div className="flex gap-6">
            <a href="#" className="text-gray-300 hover:text-white">About</a>
            <a href="#" className="text-gray-300 hover:text-white">Terms</a>
            <a href="#" className="text-gray-300 hover:text-white">Privacy</a>
            <a href="#" className="text-gray-300 hover:text-white">Contact</a>
          </div>
          
          <div className="mt-4 md:mt-0 text-gray-500">
            © 2025 Vironex
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
