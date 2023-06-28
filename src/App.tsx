import React from "react";
import "./App.css";
import { Layout, ConfigProvider, Menu, theme } from "antd";

import MainPage from "./components/MainPage";
import LangSelector from "./components/LangSelector";

const { Header, Content, Footer } = Layout;

function App() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    fontSize: 15,
                    colorPrimary: "#4C4C6D",
                },
            }}
        >
            <Layout style={{ minHeight: "100vh" }}>
                <Header
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#4C4C6D",
                    }}
                >
                    <div className="logo" style={{ color: "white" }}>
                        <h1>КотФикс</h1>
                    </div>
                    <LangSelector />
                </Header>
                <Content>
                    <MainPage />
                </Content>
                <Footer>
                    <p>Дополнительная информация</p>
                </Footer>
            </Layout>
        </ConfigProvider>
    );
}

export default App;
