export const BasicCard = ({
                  children,
                  className = ""
              }: {
    children: React.ReactNode;
    className?: string
}) => {
    return (
        <div className={`bg-white rounded-lg shadow-md ${className}`}>
            {children}
        </div>
    );
};