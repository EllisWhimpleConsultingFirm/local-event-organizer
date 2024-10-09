'use client';

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {Calendar, ChevronLeft, ChevronRight, Settings, Users} from 'lucide-react';
import {useSidebar} from './SidebarContext';
import './sidebar.css'
import Image from "next/image";
import {Solway} from 'next/font/google'
import homeIcon from '../../public/icon-home.svg'
import vendorIcon from '../../public/icon-vendors.svg'
import eventIcon from '../../public/icon-events.svg'
import loginIcon from '../../public/icon-briefcase.svg'
import logoIcon from '../../public/icon-logo.svg'

interface SidebarProps {
    isAuthorized: boolean;
}

const solway = Solway({weight:"400", subsets: ['latin']})

const Sidebar: React.FC<SidebarProps> = ({ isAuthorized }) => {
    const { isExpanded, toggleSidebar } = useSidebar();
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
        if (!isExpanded) {
            setIsHovered(false);
        }
    };

    useEffect(() => {
        document.body.dataset.sidebarState = isExpanded ? 'expanded' : (isHovered ? 'hovered' : 'collapsed');
    }, [isExpanded, isHovered]);

    const sidebarState = isExpanded ? 'expanded' : (isHovered ? 'hovered' : 'collapsed');

    return (
        <aside
            className={`sidebar ${sidebarState} bg-superlightgr text-black h-screen flex flex-col`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex justify-end p-3">
                <button onClick={toggleSidebar} className="chevron text-black-300 hover:bg-black">
                    {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                </button>
            </div>
            <div className="flex justify-center mt-1" style={{height: "80px"}}>
                <div className={`logo ${sidebarState} text-5xl`}>
                    <div className={solway.className}>
                        <Link href={"/home"} className="flex items-center p-2 rounded-lg">
                            <Image src={logoIcon} alt={'Logo'} width={isExpanded ? 72 : 36} height={isExpanded ? 72 : 36} className="transition-all duration-300" />
                            <span className="sidebar-label ml-3">{"leo"}</span>
                        </Link>
                    </div>
                </div>
            </div>
            <nav className="flex-grow overflow-y-auto">
                <ul className="space-y-3 pl-3">
                    <SidebarItem href="/" icon={<Image src={homeIcon} alt={'Home Icon'} />} label="Home" />
                    <SidebarItem href="/events" icon={<Image src={eventIcon} alt={'Event Icon'} />} label="Events" />
                    <SidebarItem href="/vendors" icon={<Image src={vendorIcon} alt={'Vendor Icon'} />} label="Vendors" />
                    {isAuthorized && (
                        <>
                            <SidebarItem href="/admin/vendors" icon={<Users size={24} />} label="Admin Vendor" />
                            <SidebarItem href="/admin/events" icon={<Calendar size={24} />} label="Admin Event" />
                        </>
                    )}
                </ul>
            </nav>
            <div className="mt-auto pl-3 pb-12 space-y-3">
                <ul className="space-y-3">
                    <SidebarItem href="/settings" icon={<Settings size={24} />} label="Settings" />
                    {isAuthorized ? (
                        <SidebarItem href="/logout" icon={<Image src={loginIcon} alt={'Logout Icon'} />} label="Logout" />
                    ) : (
                        <SidebarItem href="/login" icon={<Image src={loginIcon} alt={'Login Icon'} />} label="Login" />
                    )}
                </ul>
            </div>
        </aside>
    );
};

interface SidebarItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon, label }) => (
    <li className={solway.className}>
        <Link href={href} className="sidebar-item flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
            {icon}
            <span className="sidebar-label ml-3">{label}</span>
        </Link>
    </li>
);

export default Sidebar;