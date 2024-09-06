import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';
import { Home, Calendar, Users, Settings, LogIn, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { isAuthenticated, isAdmin } = useAuth();

    const toggleSidebar = () => setIsExpanded(!isExpanded);

    const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
        <Link to={to} className={`flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors ${isExpanded ? 'justify-start' : 'justify-center'}`}>
            {icon}
            {isExpanded && <span className="ml-3">{label}</span>}
        </Link>
    );

    return (
        <aside className={`bg-gray-800 text-white h-screen transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'} flex flex-col`}>
            <div className="flex justify-end p-4">
                <button onClick={toggleSidebar} className="text-gray-300 hover:text-white">
                    {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                </button>
            </div>

            <nav className="flex-grow">
                <ul className="space-y-2 p-2">
                    <li><NavItem to="/" icon={<Home size={24} />} label="Home" /></li>
                    <li><NavItem to="/events" icon={<Calendar size={24} />} label="Events" /></li>
                    <li><NavItem to="/vendors" icon={<Users size={24} />} label="Vendors" /></li>
                    {isAdmin && (
                        <>
                            <li><NavItem to="/admin/vendors" icon={<Users size={24} />} label="Admin Vendor" /></li>
                            <li><NavItem to="/admin/events" icon={<Calendar size={24} />} label="Admin Event" /></li>
                        </>
                    )}
                </ul>
            </nav>

            <div className="mt-auto p-2 space-y-2">
                <NavItem to="/settings" icon={<Settings size={24} />} label="Settings" />
                {isAuthenticated ? (
                    <NavItem to="/logout" icon={<LogOut size={24} />} label="Logout" />
                ) : (
                    <NavItem to="/login" icon={<LogIn size={24} />} label="Login" />
                )}
            </div>
        </aside>
    );
};

export default Sidebar;