import React from 'react';
import { Calendar, Users, Repeat } from 'lucide-react';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-blue-600">EventHub</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <h2 className="text-4xl font-bold text-center mb-8">Welcome to EventHub</h2>

                <p className="text-xl text-center mb-12">
                    Your one-stop platform for discovering, managing, and participating in local events.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Calendar className="w-12 h-12 text-blue-500" />}
                        title="Effortless Scheduling"
                        description="Create and manage one-time or recurring events with ease."
                    />
                    <FeatureCard
                        icon={<Users className="w-12 h-12 text-blue-500" />}
                        title="Vendor Management"
                        description="Connect event organizers with vendors for seamless collaboration."
                    />
                    <FeatureCard
                        icon={<Repeat className="w-12 h-12 text-blue-500" />}
                        title="Recurring Events"
                        description="Set up weekly, monthly, or custom recurring events in just a few clicks."
                    />
                </div>

                <div className="mt-12 text-center">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300">
                        Get Started
                    </button>
                </div>
            </main>

            <footer className="bg-gray-100 mt-16">
                <div className="container mx-auto px-4 py-8 text-center text-gray-600">
                    &copy; 2024 EventHub. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default Home;