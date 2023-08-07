import react from "react";
import parse from "html-react-parser";
import { motion } from "framer-motion";
import { basicAnimations } from "../../utils/animations";
import { useTranslation } from "react-i18next";
import { Divider } from "antd";

function ExtensionPage() {
    const { t } = useTranslation();
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={basicAnimations}
        >
            <h1>Браузерное расширение КотФикс</h1>
            <Divider />
            {parse(t("ui.extensionDesc"))}
            <a
                href={"https://github.com/skyfroger/catfix-browser-extension"}
                target={"_blank"}
            >
                Перейдите по ссылке
            </a>{" "}
            чтобы скачать расширение.
        </motion.div>
    );
}

export default ExtensionPage;
