import React from "react";

interface ButtonProps {
    icon?: string | null;
    icon_description?: string | null;
    text?: string | null;
    style?: string | null;
    textStyles?: string | null;
    onClick: (event?: React.FormEvent | undefined) => void;
}

const Button: React.FC<ButtonProps> = ({icon = null, icon_description = null, text = null, onClick, style = "", textStyles = ""}) => {

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
                    <img src={icon} alt={icon_description ?? ''}/>
                </span>
            )}
            {text && (
                <span className={`p-2 ${textStyles ? textStyles : ''}`}>{text}
                {text}
            </span>
            )}
        </a>
    );
};