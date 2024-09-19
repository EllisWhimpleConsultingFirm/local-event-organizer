import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 w-full mt-auto">
            <div className="container mx-auto px-4 py-8 text-center text-gray-600">
                &copy; {new Date().getFullYear()} EventHub. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;