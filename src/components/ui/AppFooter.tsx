import { Divider, Layout } from "antd";
import { useTranslation } from "react-i18next";

const { Footer } = Layout;

const AppFooter = () => {
    const { t } = useTranslation();
    return (
        <Footer
            style={{
                padding: "20px 40px",
            }}
        >
            <Divider />
            <div
                style={{
                    textAlign: "center",
                    marginTop: "10px",
                    marginBottom: "10px",
                }}
            >
                {`© ${t("ui.developerName")}, ${new Date().getFullYear()}`}
            </div>
        </Footer>
    );
};

export default AppFooter;
