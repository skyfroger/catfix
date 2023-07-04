import React from "react";
import "./App.css";
import { Layout, ConfigProvider, Menu, theme, FloatButton } from "antd";

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
                <Content style={{ margin: 32 }}>
                    <MainPage />
                </Content>
                <Footer>
                    <p>Разработчик: Хорошевич Павел</p>
                </Footer>
                <FloatButton.BackTop type="primary" />
            </Layout>
        </ConfigProvider>
    );
}

export default App;
