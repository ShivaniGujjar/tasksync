import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconBoard, IconTeam, IconDrag } from '../components/Icons';

const Feature = ({ icon, title, children, style }) => (
  <div className="text-center p-8 bg-white rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 animate-fade-in-up" style={style}>
    <div className="text-indigo-500 mb-4 inline-block">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{children}</p>
  </div>
);

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 py-4">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800">
                <span>{question}</span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && <p className="mt-4 text-gray-600">{answer}</p>}
        </div>
    );
};

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="text-center pt-24 pb-32 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight animate-fade-in-down">
            Bring Clarity to Your Team's Work with <span className='text-indigo-600'>Task Sync</span>
          </h1>
          <br />
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up">
            Task Sync is the simple and visual way to manage projects and organize anything with anyone.
          </p>
          <Link to="/register" className="inline-block bg-indigo-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-indigo-700 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 mt-[-160px] relative z-10"> 
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Feature icon={<IconBoard />} title="Visual Boards" style={{ animationDelay: '0.8s' }}>
              Organize tasks and track every stage of your project on a simple Kanban board.
            </Feature>
            <Feature icon={<IconTeam />} title="Team Collaboration" style={{ animationDelay: '1.0s' }}>
              Invite members to your boards and work together in a shared and synchronized space.
            </Feature>
            <Feature icon={<IconDrag />} title="Drag & Drop Simple" style={{ animationDelay: '1.2s' }}>
              Intuitively move tasks between lists to update progress and reorder priorities instantly.
            </Feature>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-12">How It Works</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                <div className="text-center">
                    <div className="text-4xl bg-indigo-100 text-indigo-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">1</div>
                    <h3 className="text-xl font-semibold">Create a Board</h3>
                    <p className="text-gray-600 mt-2">Start a new project board for anything you're working on.</p>
                </div>
                <div className="text-gray-300 text-2xl hidden md:block">→</div>
                <div className="text-center">
                    <div className="text-4xl bg-indigo-100 text-indigo-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">2</div>
                    <h3 className="text-xl font-semibold">Invite Your Team</h3>
                    <p className="text-gray-600 mt-2">Add members to your board to start collaborating.</p>
                </div>
                <div className="text-gray-300 text-2xl hidden md:block">→</div>
                <div className="text-center">
                    <div className="text-4xl bg-indigo-100 text-indigo-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">3</div>
                    <h3 className="text-xl font-semibold">Start Tracking</h3>
                    <p className="text-gray-600 mt-2">Add tasks and move them across your board to track progress.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Frequently Asked Questions</h2>
            <div>
                <FaqItem 
                    question="Is Task Sync free to use?" 
                    answer="Yes, this project is completely free to use. It was developed as a major project for the MCA program."
                />
                <FaqItem 
                    question="How many members can I invite to a board?"
                    answer="There is currently no limit on the number of members you can invite to a single board."
                />
                <FaqItem 
                    question="Is my data secure?"
                    answer="Yes, We take security seriously. Passwords are encrypted and all communication with the server is secured. You can only access boards that you own or are a member of."
                />
            </div>
        </div>
      </section>

      {/* Final Section */}
      <section className="bg-indigo-700 text-white text-center py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Organized ?</h2>
          <p className="text-xl opacity-90 mb-8">Start managing your projects the smart way, today.</p>
          <Link to="/register" className="inline-block bg-white text-indigo-600 font-bold py-3 px-10 rounded-lg hover:bg-gray-200 transition duration-300 text-lg shadow-lg">
            Sign Up for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto text-center">
              <p>&copy; 2025 Task Sync. All rights reserved.</p>
              <p className="text-sm text-gray-400 mt-1">An MCA Major Project</p>
          </div>
      </footer>
    </div>
  );
};

export default HomePage;

