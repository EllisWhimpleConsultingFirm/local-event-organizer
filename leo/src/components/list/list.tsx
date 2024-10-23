import React from 'react';

interface ListProps {
    children?: React.ReactNode;
}

export function List({ children }: ListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {children}
        </div>
    );
}