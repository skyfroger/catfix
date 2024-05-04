import react from "react";
import parse from "html-react-parser";
import { motion } from "framer-motion";
import { basicAnimations } from "../../utils/animations";
import { useTranslation } from "react-i18next";
import { Divider, Card, Typography } from "antd";
import { Helmet } from "react-helmet-async";

function ExtensionPage() {
    const { t } = useTranslation();
    return (
        <>
            <Helmet>
                <title>
                    КотФикс - Проверка Scratch проектов | Расширение для
                    браузера
                </title>
                <meta
                    name="description"
                    content="Браузерное расширение для поиска ошибок в Scratch-проекте."
                />
            </Helmet>
            <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={basicAnimations}
            >
                <Card>
                    <Typography.Title>
                        {t("ui.extensionPageTitle")}
                    </Typography.Title>
                    <Divider />
                    {parse(t("ui.extensionDesc"))}
                </Card>
            </motion.div>
        </>
    );
}

export default ExtensionPage;
