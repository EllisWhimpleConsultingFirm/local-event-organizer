import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                current: 'currentColor',
                white: '#FFFFFF',
                offwhite: '#FAF9F6',
                leoblue: '#B4DBDC',
                superlightgr: '#E5E5E5',
                lightgr: '#BABCBE',
                argray: '#414043',
                argold: '#A6947A',
                darkgold: '#7f6e55',
                red: '#ff5555',
                darkred: '#8B0000'
            },
            fontFamily: {
                sans: ['Solway', 'sans-serif']
            },
        },
    },
    plugins: [],
};
export default config;
