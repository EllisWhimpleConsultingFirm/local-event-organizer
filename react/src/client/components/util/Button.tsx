import React from "react";

interface ButtonProps {
    icon?: SVGElement | null;
    text?: string | null;
    style?: string | null;
    onClick: (event?: React.FormEvent | undefined) => void;
}

const Button: React.FC<ButtonProps> = ({icon = null, text = null, onClick, style = ""}) => {

    const styles = `btn flex items-center py-1 px-4 hover:outline-none ${style}`;

    return (
        <a
            role="button"
            onClick={onClick}
            className={styles}
            onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick();
                }
            }}
        >
            {icon && (
                <span className="h-6 w-6">
                    <img src={icon}/>
                </span>
            )}
            {text && (
                <span className="p-2">
                {text}
            </span>
            )}
        </a>
    );
};