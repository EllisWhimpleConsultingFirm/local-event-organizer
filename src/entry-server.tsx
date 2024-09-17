import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './client/App';
import Home from './client/pages/Home';
import About from './client/pages/About';

const pages: { [key: string]: React.ComponentType } = {
    Home,
    About,
};



export function render(url: string, componentName: string) {
    const PageComponent = pages[componentName] || App;

    return ReactDOMServer.renderToString(
        <React.StrictMode>
            <div id="root">
                <PageComponent />
            </div>
        </React.StrictMode>
    );
}