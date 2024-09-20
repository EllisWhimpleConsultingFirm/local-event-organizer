import { Calendar, Users, Repeat } from 'lucide-react';

export default function Home() {
  return (
      <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
              <div className="container mx-auto px-4 py-12">
                  <h1 className="text-4xl font-bold text-center mb-8">LEO</h1>

                  <p className="text-xl text-center mb-12">
                      Your one-stop platform for discovering, managing, and participating in local events.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                      <FeatureCard
                          icon={<Calendar className="w-12 h-12 text-blue-500"/>}
                          title="Effortless Scheduling"
                          description="Create and manage one-time or recurring events with ease."
                      />
                      <FeatureCard
                          icon={<Users className="w-12 h-12 text-blue-500"/>}
                          title="Vendor Management"
                          description="Connect event organizers with vendors for seamless collaboration."
                      />
                      <FeatureCard
                          icon={<Repeat className="w-12 h-12 text-blue-500"/>}
                          title="Recurring Events"
                          description="Set up weekly, monthly, or custom recurring events in just a few clicks."
                      />
                  </div>

                  <div className="text-center">
                      <button
                          className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300">
                          Get Started
                      </button>
                  </div>
              </div>
          </main>
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