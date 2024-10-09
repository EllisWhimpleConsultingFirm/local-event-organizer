interface CategoryTagProps {
    tagName: string;
    style?: string;
}

export const CategoryTag = ({tagName, style}: CategoryTagProps) => {
    return (
        <span
            key={tagName}
            className={`bg-blue-100 text-blue-600 text-sm font-medium px-2 py-1 rounded-full ${style}`}>
                {tagName}
        </span>
    )
}