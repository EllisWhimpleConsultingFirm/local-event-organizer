import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './client/App';

const root = ReactDOM.hydrateRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <App></App>
)

