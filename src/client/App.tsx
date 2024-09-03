import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import Navigation from "./components/nav/Navigation";
import Login from "./pages/Login";
import Home from "./pages/Home.tsx";
import {useAuth} from "./components/auth/useAuth.ts";

// Placeholder components for other routes
const Profile = () => <div>Profile Page</div>;
const Logout = () => <div>Logout Page</div>;
const Admin = () => <div>Admin Page</div>;

const App: React.FC = () => {
    const { isAuthenticated, isAdmin, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div>
                <Navigation />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    {isAuthenticated && (
                        <>
                            <Route path="/profile" element={<Profile />} />
                            {isAdmin && <Route path="/admin" element={<Admin />} />}
                        </>
                    )}
                </Routes>
            </div>
        </Router>
    );
};

export default App;