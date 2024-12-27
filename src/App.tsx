import React, { useEffect } from "react";
import "./App.css";
import logo from "./logo.png";
import { Layout, ConfigProvider, Menu, FloatButton, Row, Col } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { YMInitializer } from "@appigram/react-yandex-metrika";

import MainPage from "./components/pages/MainPage";
import LangSelector from "./components/ui/LangSelector";
import TeacherPage from "./components/pages/TeacherPage";
import AboutPage from "./components/pages/AboutPage";
import { useTranslation } from "react-i18next";
import ExtensionPage from "./components/pages/ExtensionPage";
import ym from "@appigram/react-yandex-metrika";
import { HelmetProvider } from "react-helmet-async";
import AppFooter from "./components/ui/AppFooter";
import DocsPage from "./components/pages/DocsPage";

const { Header, Content, Footer } = Layout;

function App() {
    const { t } = useTranslation();
    let location = useLocation(); // new

    useEffect(() => {
        ym("hit", location.pathname);
    }, [location]);

    return (
        <HelmetProvider>
            <ConfigProvider
                theme={{
                    token: {
                        fontSize: 15,
                        colorTextBase: "#293241",
                        colorPrimary: "#4C4C6D",
                        fontFamily: "Noto Sans",
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
                            backgroundColor: "#f5f5f5",
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
                            selectedKeys={[location.pathname]}
                            defaultSelectedKeys={["/"]}
                            theme={"light"}
                            style={{ flex: "auto", backgroundColor: "#f5f5f5" }}
                        >
                            <Menu.Item key="/">
                                <NavLink to="/">{t("ui.menuMainPage")}</NavLink>
                            </Menu.Item>
                            <Menu.Item key="/teacher">
                                <NavLink to="/teacher">
                                    {t("ui.menuMassUpload")}
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="/docs">
                                <NavLink to="/docs">{t("ui.menuDocs")}</NavLink>
                            </Menu.Item>
                            <Menu.Item key="/extension">
                                <NavLink to="/extension">
                                    {t("ui.extensionPageTitle")}
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="/about">
                                <NavLink to="/about">
                                    {t("ui.menuAbout")}
                                </NavLink>
                            </Menu.Item>
                        </Menu>

                        <LangSelector />
                    </Header>
                    <Content style={{ margin: 32 }}>
                        <Routes>
                            <Route path="/" element={<MainPage />} />
                            <Route path="/teacher" element={<TeacherPage />} />
                            <Route path="/docs" element={<DocsPage />} />
                            <Route
                                path="/extension"
                                element={<ExtensionPage />}
                            />
                            <Route path="/about" element={<AboutPage />} />
                        </Routes>
                    </Content>

                    <AppFooter />

                    <FloatButton.BackTop type="primary" />
                    <YMInitializer
                        accounts={[Number(import.meta.env.VITE_YM)]}
                    />
                </Layout>
            </ConfigProvider>
        </HelmetProvider>
    );
}

export default App;
