import React from "react";
import "./App.css";
import { Layout, ConfigProvider, Menu, FloatButton } from "antd";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import posthog from "posthog-js";

import MainPage from "./components/MainPage";
import LangSelector from "./components/LangSelector";
import TeacherPage from "./components/TeacherPage";
import { useTranslation } from "react-i18next";

const { Header, Content, Footer } = Layout;

function App() {
    const { t } = useTranslation();
    let location = useLocation(); // new

    React.useEffect(() => {
        // new
        posthog.capture("$pageview");
    }, [location]);

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
                        display: "inline-flex",
                        gap: "12px",
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#4C4C6D",
                    }}
                >
                    <NavLink to="/">
                        <div className="logo" style={{ color: "white" }}>
                            <h1>КотФикс</h1>
                        </div>
                    </NavLink>
                    <Menu
                        mode={"horizontal"}
                        defaultSelectedKeys={["1"]}
                        theme={"dark"}
                        style={{ flex: "auto", backgroundColor: "#4C4C6D" }}
                    >
                        <Menu.Item key={1}>
                            <NavLink to="/">{t("ui.menuMainPage")}</NavLink>
                        </Menu.Item>
                        <Menu.Item key={2}>
                            <NavLink to="/teacher">
                                {t("ui.menuMassUpload")}
                            </NavLink>
                        </Menu.Item>
                    </Menu>

                    <LangSelector />
                </Header>
                <Content style={{ margin: 32 }}>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/teacher" element={<TeacherPage />} />
                    </Routes>
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
