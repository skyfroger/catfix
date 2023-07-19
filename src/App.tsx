import React from "react";
import "./App.css";
import logo from "./logo.png";
import { Layout, ConfigProvider, Menu, FloatButton } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import posthog from "posthog-js";

import MainPage from "./components/pages/MainPage";
import LangSelector from "./components/ui/LangSelector";
import TeacherPage from "./components/pages/TeacherPage";
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
                        justifyContent: "space-between",
                        alignItems: "stretch",
                        backgroundColor: "#4C4C6D",
                    }}
                >
                    <NavLink to="/">
                        <span
                            style={{
                                display: "inline-block",
                                height: "100%",
                                verticalAlign: "middle",
                            }}
                        >
                            <img
                                src={logo}
                                alt={"КотФикс - проверка Scratch проектов"}
                                style={{
                                    verticalAlign: "text-bottom",
                                    maxHeight: "50%",
                                }}
                            />
                        </span>
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
                    <span>Разработчик: Хорошевич Павел</span>{" "}
                    <a
                        href={"https://github.com/skyfroger/catfix"}
                        target={"_blank"}
                    >
                        <GithubOutlined />
                    </a>
                </Footer>
                <FloatButton.BackTop type="primary" />
            </Layout>
        </ConfigProvider>
    );
}

export default App;
