import { Page, Document, Font } from "@react-pdf/renderer";
import Html from "react-pdf-html";
import { marked } from "marked";
import { MessageItem } from "../chat/ChatHOC";

interface ChatPDFExportProps {
    messagesHistory: MessageItem[];
}

Font.register({
    family: "Roboto",
    src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

Font.registerEmojiSource({
    format: "png",
    url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/",
});

export const ChatPDFExport = ({ messagesHistory }: ChatPDFExportProps) => {
    const visibleMessages = messagesHistory.filter(
        (msg) => msg.role !== "system"
    );

    const htmlContent = visibleMessages.reduce(
        (acc, cur) => acc + marked.parse(cur.content),
        ""
    );

    const html = `<html>
<body>

${htmlContent}

</body>
</html>
`;

    console.log(html);
    return (
        <Document>
            <Page>
                <Html
                    stylesheet={{
                        body: { fontFamily: "Roboto" },
                    }}
                >
                    {html}
                </Html>
            </Page>
        </Document>
    );
};
