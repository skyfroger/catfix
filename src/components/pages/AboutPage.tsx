import parse from "html-react-parser";
import { motion } from "framer-motion";
import { basicAnimations } from "../../utils/animations";
import { useTranslation } from "react-i18next";
import { Divider, Card, Typography } from "antd";
import { Helmet } from "react-helmet-async";

function AboutPage() {
    const { t } = useTranslation();
    return (
        <>
            <Helmet>
                <title>КотФикс - Проверка Scratch проектов | О проекте</title>
                <meta
                    name="description"
                    content="Автор проекта - Хорошевич Павел Александрович"
                />
            </Helmet>
            <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={basicAnimations}
            >
                <Card>
                    <Typography.Title>{t("ui.menuAbout")}</Typography.Title>
                    <Divider />
                    {parse(t("ui.aboutDescription"))}
                </Card>
            </motion.div>
        </>
    );
}

export default AboutPage;
