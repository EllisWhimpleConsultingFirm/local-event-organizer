import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {useAuth} from "./components/auth/userAuth.js";
import LandingPage from "./pages/LandingPage";
import Navigation from "./components/nav/Navigation";
import Login from "./pages/Login";

// Placeholder components for other routes
const Profile = () => <div>Profile Page</div>;
const Logout = () => <div>Logout Page</div>;
const Admin = () => <div>Admin Page</div>;

const App: React.FC = () => {
    const { isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div>
                <Navigation />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;