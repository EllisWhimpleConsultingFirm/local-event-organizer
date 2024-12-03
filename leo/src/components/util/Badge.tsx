import React from 'react';
import {BadgeColor} from "@/components/util/TagPill";

interface BadgeProps {
    text?: string;
    color?: BadgeColor;
    icon?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ text, color = BadgeColor.GRAY, icon }) => {
    const baseClasses = 'inline-flex items-center px-3 py-1 border rounded-full text-sm font-medium text-white';

    const colorClasses = {
        [BadgeColor.GRAY]: 'bg-gray-300 border-gray-300',
        [BadgeColor.BRAND]: 'bg-brand-500 border-brand-500',
        [BadgeColor.ERROR]: 'bg-red-500 border-red-500',
        [BadgeColor.WARNING]: 'bg-yellow-500 border-yellow-500',
        [BadgeColor.SUCCESS]: 'bg-green-500 border-green-500',
        [BadgeColor.GRAY_BLUE]: 'bg-cool-gray-500 border-cool-gray-500',
        [BadgeColor.BLUE_LIGHT]: 'bg-light-blue-500 border-light-blue-500',
        [BadgeColor.BLUE]: 'bg-blue-500 border-blue-500',
        [BadgeColor.INDIGO]: 'bg-indigo-500 border-indigo-500',
        [BadgeColor.PURPLE]: 'bg-purple-500 border-purple-500',
        [BadgeColor.PINK]: 'bg-pink-500 border-pink-500',
        [BadgeColor.ORANGE]: 'bg-orange-500 border-orange-500',
        [BadgeColor.BLACK]: 'bg-black border-black',
        [BadgeColor.WHITE]: 'bg-white text-black border-white',
        [BadgeColor.WHITE_SUCCESS]: 'bg-white text-green-500 border-green-500',
    };

    return (
        <span className={`${baseClasses} ${colorClasses[color]}`}>
      {icon && <span className="mr-2">{icon}</span>}
            {text}
    </span>
    );
};

export default Badge;