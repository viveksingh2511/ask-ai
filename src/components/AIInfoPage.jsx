import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AIInfoPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gradient-to-br from-blue-100 to-purple-200">
        <h1 className="text-5xl font-extrabold mb-6">Unleash the Power of AI</h1>
        <p className="text-xl mb-8 max-w-xl">
          Our cutting-edge AI solutions help you automate, innovate, and scale with confidence.
        </p>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-purple-700 transition"
        onClick={() => navigate('/ask')}>
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <Feature
          icon="🤖"
          title="Smart Automation"
          description="Automate repetitive tasks and streamline operations using intelligent workflows."
        />
        <Feature
          icon="📊"
          title="Data-Driven Insights"
          description="Unlock valuable insights from your data to drive better decisions."
        />
        <Feature
          icon="⚡"
          title="Real-time Processing"
          description="Experience lightning-fast processing with our optimized AI models."
        />
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-600">
        © {new Date().getFullYear()} AI Company. All rights reserved.
      </footer>
    </div>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
}
