import "./App.css";
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home.tsx";
import Sidebar from "./components/nav/Sidebar";  // Import the new Sidebar component
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useAuth } from "./components/auth/useAuth";

// Placeholder components for other routes
const Profile = () => <div>Profile Page</div>;
const Logout = () => <div>Logout Page</div>;
const Admin = () => <div>Admin Page</div>;
const Events = () => <div>Events Page</div>;
const Vendors = () => <div>Vendors Page</div>;
const AdminVendors = () => <div>Admin Vendors Page</div>;
const AdminEvents = () => <div>Admin Events Page</div>;
const Settings = () => <div>Settings Page</div>;

const App: React.FC = () => {
    const { isAuthenticated, isAdmin, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div className="flex">
                <Sidebar />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/vendors" element={<Vendors />} />
                        <Route path="/settings" element={<Settings />} />
                        {isAuthenticated && (
                            <>
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/logout" element={<Logout />} />
                                {isAdmin && (
                                    <>
                                        <Route path="/admin/vendors" element={<AdminVendors />} />
                                        <Route path="/admin/events" element={<AdminEvents />} />
                                    </>
                                )}
                            </>
                        )}
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;