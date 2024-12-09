import React from 'react';

interface TabsContextType {
    selectedValue: string;
    onChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
    defaultValue: string;
    children: React.ReactNode;
    className?: string;
}

const Tabs = ({ defaultValue, children, className = '' }: TabsProps) => {
    const [selectedValue, setSelectedValue] = React.useState(defaultValue);

    return (
        <TabsContext.Provider value={{ selectedValue, onChange: setSelectedValue }}>
            <div className={className}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

const TabsList = ({ children, className = '' }: TabsListProps) => {
    return (
        <div className={`flex rounded-lg bg-gray-100 p-1 ${className}`}>
            {children}
        </div>
    );
};

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
}

const TabsTrigger = ({ value, children }: TabsTriggerProps) => {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error('TabsTrigger must be used within Tabs');

    const isSelected = context.selectedValue === value;

    return (
        <button
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all
                ${isSelected
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:text-black hover:bg-gray-50'
            }`}
            onClick={() => context.onChange(value)}
        >
            {children}
        </button>
    );
};

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

const TabsContent = ({ value, children, className = '' }: TabsContentProps) => {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error('TabsContent must be used within Tabs');

    if (context.selectedValue !== value) return null;

    return (
        <div className={className}>
            {children}
        </div>
    );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };