import { motion } from "framer-motion";
import { basicAnimations } from "../../utils/animations";
import { useTranslation } from "react-i18next";
import { Divider, Card, Typography } from "antd";
import { Helmet } from "react-helmet-async";

import { useEffect, useState } from "react";
import MarkdownRenderer from "../ui/MarkdownRenderer";

function DocsPage() {
    const { t, i18n } = useTranslation();
    const [content, setContent] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/content/docs.${i18n.language}.md`)
            .then((response) => response.text())
            .then((text) => {
                // Обрабатываем оба варианта путей: с ./ и без
                const processedText = text.replace(
                    /!\[(.*?)\]\((.*?)\)/g,
                    (match, alt, path) => {
                        // Если путь начинается с ./, убираем его
                        const cleanPath = path.replace(/^\.\//, "");
                        // Добавляем префикс /content/
                        return `![${alt}](/content/${cleanPath})`;
                    }
                );
                setContent(processedText);
            })
            .catch((error) => console.error("Error loading markdown:", error));
    }, [i18n.language]);

    return (
        <>
            <Helmet>
                <title>{t("meta.docs")}</title>
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
                    <Typography.Title>{t("ui.menuDocs")}</Typography.Title>
                    <Divider />
                    <MarkdownRenderer components={null} source={content} />
                </Card>
            </motion.div>
        </>
    );
}

export default DocsPage;
