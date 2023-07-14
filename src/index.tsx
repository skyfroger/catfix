import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n/config";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { PostHogProvider } from "posthog-js/react";

const options = {
    api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST,
    autocapture: false,
};

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <PostHogProvider
            apiKey={process.env.REACT_APP_PUBLIC_POSTHOG_KEY}
            options={options}
        >
            <App />
        </PostHogProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
