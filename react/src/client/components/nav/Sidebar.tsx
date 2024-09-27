import React from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from '../auth/useAuth.js';
import {Home, Calendar, Users, Settings, LogIn, LogOut, ChevronLeft, ChevronRight} from 'lucide-react';
import {LogoWithText} from "../../assets/logo-with-text";

interface SidebarProps {
    isExpanded: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({isExpanded, toggleSidebar}) => {
    const {isAuthenticated, isAdmin} = useAuth();

    const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({to, icon, label}) => (
        <Link to={to}
              className={`flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors ${isExpanded ? 'justify-start' : 'justify-center'}`}>
            {icon}
            {isExpanded && <span className="ml-3">{label}</span>}
        </Link>
    );

    return (
        <aside
            className={`fixed left-0 top-0 bg-superlightgr text-black h-screen transition-all duration-300 ${
                isExpanded ? 'w-64' : 'w-20'
            } flex flex-col z-10`}
        >

            {/* Toggle Button */}
            <div className="flex justify-end p-4">
                <button onClick={toggleSidebar} className="text-black hover:text-white">
                    {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                </button>
            </div>

            {/* Logo Section */}
            <div className="flex items-center justify-center p-2">
                <LogoWithText height={200} width={200}/>
            </div>

            {/* Navigation */}
            <nav className="flex-grow overflow-y-auto">
                <ul className="space-y-2 p-8">
                    <li>
                        <NavItem to="/" icon={<Home size={32} />} label="Home" />
                    </li>
                    <li>
                        <NavItem to="/events" icon={<Calendar size={32} />} label="Events" />
                    </li>
                    <li>
                        <NavItem to="/vendors" icon={<Users size={32} />} label="Vendors" />
                    </li>
                    {isAdmin && (
                        <>
                            <li>
                                <NavItem to="/admin/vendors" icon={<Users size={24} />} label="Admin Vendor" />
                            </li>
                            <li>
                                <NavItem to="/admin/events" icon={<Calendar size={24} />} label="Admin Event" />
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            {/* Settings and Authentication */}
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