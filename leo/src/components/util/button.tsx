'use client'

import React from "react";

export interface ButtonProps {
    onClick?: () => void;
    style?: string;
    children?: React.ReactNode;
    label?: string;
}

export const Button: React.FC<ButtonProps> = ({
                                                  label,
                                                  onClick,
                                                  style,
                                                  children,
                                              }) => {
    return (
        <button
            className={`mt-2 p-2 border border-gray-400 rounded-full ${style}`}
            onClick={onClick}
        >
            {children && <span className="icon">{children}</span>}
            {label && <span className="label">{label}</span>}
        </button>
    );
};