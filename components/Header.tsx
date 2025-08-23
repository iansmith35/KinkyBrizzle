import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const CartIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

const Header: React.FC = () => {
    const { cart } = useAppContext();
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const linkClass = "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200";
    const activeLinkClass = "text-indigo-600 dark:text-indigo-400";

    return (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
            <nav className="container mx-auto px-4 md:px-8 flex justify-between items-center h-16">
                <NavLink to="/" className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white">
                    KinkyBrizzle
                </NavLink>
                <div className="flex items-center space-x-6">
                    <NavLink to="/" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>
                        Shop
                    </NavLink>
                     <NavLink to="/kinky-kustomer" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>
                        Kinky Kustomer
                    </NavLink>
                    <NavLink to="/admin" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>
                        Admin
                    </NavLink>
                    <NavLink to="/cart" className={({ isActive }) => `${linkClass} relative ${isActive ? activeLinkClass : ''}`}>
                        <CartIcon />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </NavLink>
                </div>
            </nav>
        </header>
    );
};

export default Header;