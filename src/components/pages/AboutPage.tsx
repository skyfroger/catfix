import parse from "html-react-parser";
import { motion } from "framer-motion";
import { basicAnimations } from "../../utils/animations";
import { useTranslation } from "react-i18next";
import { Divider, Card, Typography } from "antd";
import { Helmet } from "react-helmet-async";

import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

function AboutPage() {
    const { t, i18n } = useTranslation();
    const [content, setContent] = useState<string | null>(null);

    useEffect(() => {
        import(`../../content/about.${i18n.language}.md`).then((res) => {
            fetch(res.default)
                .then((res) => res.text())
                .then((res) => setContent(res))
                .catch((err) => console.log(err));
        });
    });

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
                    <ReactMarkdown children={content} />
                </Card>
            </motion.div>
        </>
    );
}

export default AboutPage;
