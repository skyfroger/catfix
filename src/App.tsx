import React from "react";
import "./App.css";
import { Layout, ConfigProvider, Menu, theme, FloatButton } from "antd";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    NavLink,
    useLocation,
} from "react-router-dom";
import posthog from "posthog-js";

import MainPage from "./components/MainPage";
import LangSelector from "./components/LangSelector";
import TeacherPage from "./components/TeacherPage";

const { Header, Content, Footer } = Layout;

function App() {
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
                        display: "flex",
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
                    <NavLink to="/">Главная</NavLink>
                    <NavLink to="/teacher">Для учителя</NavLink>
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
