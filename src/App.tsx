import React, { useEffect, useState } from "react";
import "./App.css";
import logo from "./logo.png";
import logoEn from "./logo_en.png";

import {
    Layout,
    ConfigProvider,
    Menu,
    FloatButton,
    Grid,
    Drawer,
    Button,
    MenuProps,
    theme,
} from "antd";

import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { YMInitializer } from "@appigram/react-yandex-metrika";

import MainPage from "./components/pages/MainPage";
import TeacherPage from "./components/pages/TeacherPage";
import AboutPage from "./components/pages/AboutPage";
import { useTranslation } from "react-i18next";
import ExtensionPage from "./components/pages/ExtensionPage";
import ym from "@appigram/react-yandex-metrika";
import { HelmetProvider } from "react-helmet-async";
import AppFooter from "./components/ui/AppFooter";
import DocsPage from "./components/pages/DocsPage";

import {
    GlobalOutlined,
    MenuOutlined,
    VerticalAlignTopOutlined,
} from "@ant-design/icons";

// Локализация встроенных в antd меток
import { Locale } from "antd/es/locale";
import ruRU from "antd/locale/ru_RU";
import byBY from "antd/locale/by_BY";
import enUS from "antd/locale/en_US";

// словарь доступных в приложении локалей на выбор
const antdLocales: Record<string, Locale> = {
    ru: ruRU,
    be: byBY,
    en: enUS,
};

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

function App() {
    const { t, i18n } = useTranslation();
    let location = useLocation(); // new

    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const [drawerVisible, setDrawerVisible] = useState(false);

    useEffect(() => {
        ym("hit", location.pathname);
    }, [location]);

    // Пункты меню
    const menuItems: MenuProps["items"] = [
        { key: "/", label: <NavLink to="/">{t("ui.menuMainPage")}</NavLink> },
        {
            key: "/teacher",
            label: <NavLink to="/teacher">{t("ui.menuMassUpload")}</NavLink>,
        },
        {
            key: "/docs",
            label: <NavLink to="/docs">{t("ui.menuDocs")}</NavLink>,
        },
        {
            key: "/extension",
            label: (
                <NavLink to="/extension">{t("ui.extensionPageTitle")}</NavLink>
            ),
        },
        {
            key: "/about",
            label: <NavLink to="/about">{t("ui.menuAbout")}</NavLink>,
        },
        {
            key: "lang",
            icon: <GlobalOutlined style={{ color: "#4C4C6D", fontSize: 20 }} />,
            label:
                t(`languages.${i18n.language}` as any) ||
                i18n.language.toUpperCase(),
            children: [
                {
                    key: "ru",
                    label: "Русский",
                    onClick: () => i18n.changeLanguage("ru"),
                },
                {
                    key: "be",
                    label: "Беларуская",
                    onClick: () => i18n.changeLanguage("be"),
                },
                {
                    key: "en",
                    label: "English",
                    onClick: () => i18n.changeLanguage("en"),
                },
            ],
            style: { marginLeft: "auto" },
        },
    ];

    return (
        <HelmetProvider>
            <ConfigProvider
                theme={{
                    algorithm: theme.defaultAlgorithm,
                    token: {
                        colorText: "#2C2C2C",
                        fontSize: 15,
                        colorTextBase: "#293241",
                        colorPrimary: "#4C4C6D",
                        fontFamily: "Noto Sans",
                        colorBorder: "#121b33cf",
                        colorBorderSecondary: "#121b33cf",
                        lineWidth: 1,
                        lineWidthBold: 1,
                        borderRadius: 12,
                        borderRadiusLG: 16,
                        borderRadiusSM: 8,
                        controlHeight: 40,
                        controlHeightSM: 34,
                        controlHeightLG: 48,
                    },
                    components: {
                        Button: {
                            primaryShadow: "none",
                            dangerShadow: "none",
                            defaultShadow: "none",
                            fontWeight: 600,
                        },
                    },
                }}
                locale={antdLocales[i18n.language]} // смена antd локали после выбора языка
            >
                <Layout style={{ minHeight: "100vh" }}>
                    <Header
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "0 16px",
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
                                    src={i18n.language === "en" ? logoEn : logo}
                                    alt={"КотФикс - проверка Scratch проектов"}
                                    style={{
                                        verticalAlign: "text-bottom",
                                        height: "2.5em",
                                    }}
                                />
                            </span>
                        </NavLink>

                        {isMobile ? (
                            // Если мобильное устройство, нужно заменить меню на боковой Drawer
                            <Button
                                type="text"
                                icon={<MenuOutlined />}
                                onClick={() => setDrawerVisible(true)}
                            />
                        ) : (
                            <Menu
                                mode="horizontal"
                                selectedKeys={[location.pathname]}
                                items={menuItems}
                                overflowedIndicator={<MenuOutlined />}
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    border: "none",
                                    background: "transparent",
                                }}
                            />
                        )}
                    </Header>

                    <Drawer
                        placement="right"
                        onClose={() => setDrawerVisible(false)}
                        open={drawerVisible}
                    >
                        <Menu
                            mode="inline"
                            selectedKeys={[location.pathname]}
                            items={menuItems}
                            onClick={() => setDrawerVisible(false)}
                        />
                    </Drawer>

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

                    <FloatButton.BackTop
                        type="primary"
                        style={{
                            left: "50%",
                            transform: "translateX(-50%)",
                            bottom: 24,
                        }}
                        icon={<VerticalAlignTopOutlined />}
                    ></FloatButton.BackTop>
                    <YMInitializer
                        accounts={[Number(import.meta.env.VITE_YM)]}
                    />
                </Layout>
            </ConfigProvider>
        </HelmetProvider>
    );
}

export default App;
