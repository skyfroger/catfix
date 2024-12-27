import { Layout, Row, Col, Divider } from "antd";

import { Link } from "react-router-dom";

import bspu from "../../bspu.png";
import fmf from "../../fmf.png";

const { Footer } = Layout;

const AppFooter = () => {
    return (
        <Footer
            style={{
                background:
                    "linear-gradient(135deg, #a1c1ed, #2C4261), linear-gradient(to top, #242A33, rgba(255, 255, 255, 0.1))",
                color: "white",
                padding: "20px 40px",
            }}
        >
            <Row justify="space-between" align="middle">
                <Col span={24} style={{ textAlign: "center" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                            alignItems: "flex-start",
                        }}
                    >
                        <div>
                            <img
                                src={bspu}
                                alt="БГПУ им. Максима Танка"
                                style={{ height: "120px", marginRight: "20px" }}
                            />
                            <img
                                src={fmf}
                                alt="Физико-математический факультет"
                                style={{ height: "120px" }}
                            />
                        </div>
                        <div
                            style={{ marginBottom: "20px", textAlign: "left" }}
                        >
                            <a
                                href="https://bspu.by"
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    display: "block",
                                    marginBottom: "10px",
                                }}
                                target="_blank"
                            >
                                БГПУ им. Максима Танка
                            </a>
                            <a
                                href="https://fmf.bspu.by"
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    display: "block",
                                }}
                                target="_blank"
                            >
                                Физико-математический факультет
                            </a>
                        </div>
                        <div>
                            <ul
                                style={{
                                    listStyle: "none",
                                    padding: 0,
                                    textAlign: "left",
                                }}
                            >
                                <li>
                                    <Link
                                        to="/"
                                        style={{
                                            color: "white",
                                            textDecoration: "none",
                                            display: "block",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        Главная
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/teacher"
                                        style={{
                                            color: "white",
                                            textDecoration: "none",
                                            display: "block",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        Для учителя
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/docs"
                                        style={{
                                            color: "white",
                                            textDecoration: "none",
                                            display: "block",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        Документация
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/extension"
                                        style={{
                                            color: "white",
                                            textDecoration: "none",
                                            display: "block",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        Браузерное расширение
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about"
                                        style={{
                                            color: "white",
                                            textDecoration: "none",
                                            display: "block",
                                        }}
                                    >
                                        О проекте
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Col>
            </Row>
            <div
                style={{
                    textAlign: "center",
                    marginTop: "10px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                    paddingTop: "20px",
                }}
            >
                © Хорошевич Павел, 2024
            </div>
        </Footer>
    );
};

export default AppFooter;
