import React from "react";
import "./App.css";
import { Layout } from "antd";

import MainPage from "./components/MainPage";
import LangSelector from "./components/LangSelector";

const { Header, Content, Footer } = Layout;

function App() {
    return (
        <>
            <LangSelector />
            <MainPage />
        </>
    );
}

export default App;
