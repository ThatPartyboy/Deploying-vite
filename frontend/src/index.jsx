import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Cal from './App.jsx';
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <DevSupport ComponentPreviews={ComponentPreviews}
                    useInitialHook={useInitial}
        >
            <Cal/>
        </DevSupport>
    </React.StrictMode>
);
