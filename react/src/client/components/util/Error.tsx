import React from "react";

interface ErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
    message: string;
}

export const Error: React.FC<ErrorProps> = ({message, className, ...props}) => {
    return (
        <div className="flex h-screen justify-center items-center">
            <p
                className={`text-lg bg-white rounded-md p-4 border-l-4 border-red shadow-lg ${className || ''}`}
                {...props}
            >
                {`Something went wrong on our end: ${message}`}
            </p>
        </div>
    );
};