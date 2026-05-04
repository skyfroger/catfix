import { Dispatch, SetStateAction } from "react";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { Bubble, Sender, Prompts } from "@ant-design/x";
import type { PromptsProps } from "@ant-design/x";
import { CodeHighlighter, Mermaid, Actions } from "@ant-design/x";
import { XMarkdown, type ComponentProps } from "@ant-design/x-markdown";
import Latex from "@ant-design/x-markdown/plugins/Latex";
import ScratchCode from "../ui/ScratchCode";
import { MessageItem } from "./ChatHOC";
import { Button, Divider, Flex } from "antd";
import DeleteConfirmButton from "../ui/DeleteConfirmButton";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ChatPDFExport } from "../ui/ChatPDFExport";

// Рядом с каждым сообщением будет кнопка "Копировать"
const actionItems = (content: string) => [
    {
        key: "copy",
        label: "copy",
        actionRender: () => {
            return <Actions.Copy text={content} />;
        },
    },
];

// Примеры запросов
const promptSuggestions: PromptsProps["items"] = [
    {
        key: "1",
        label: "Как сделать клоны спрайта?",
    },
    {
        key: "2",
        label: "Для чего используются списки?",
    },
];

// Компонент для отрисовки Scratch-кода и Mermaid-диаграмм
const Code = (props: ComponentProps) => {
    const { className, children } = props;
    const lang = className?.match(/language-(\w+)/)?.[1] || "";

    if (typeof children !== "string") return null;
    if (lang === "mermaid") {
        return <Mermaid>{children}</Mermaid>;
    }
    // Блочный scratch
    if (lang === "scratchblocks") {
        return <ScratchCode code={children} />;
    }

    // Строчный scratch — по префиксу "scratch:"
    if (!lang && children.startsWith("scratch:")) {
        const code = children.replace(/^scratch:/, "").trim();
        return <ScratchCode inline={true} code={code} />;
    }
    return <CodeHighlighter lang={lang}>{children}</CodeHighlighter>;
};

// пропсы компонента
interface ChatViewProps {
    messagesHistory: MessageItem[];
    isLoading: boolean;
    userPrompt: string;
    handleSubmit: (text: string) => void;
    handleClear: () => void;
    setUserPrompt: Dispatch<SetStateAction<string>>;
}

function ChatView({
    messagesHistory,
    isLoading,
    userPrompt,
    handleSubmit,
    handleClear,
    setUserPrompt,
}: ChatViewProps) {
    // Фильтруем сообщения для отображения (исключаем системные промпты - роль system)
    const visibleMessages = messagesHistory.filter(
        (msg) => msg.role !== "system"
    );

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                }}
            >
                <Bubble.List
                    items={visibleMessages.map((msg) => ({
                        key: msg.key,
                        role: msg.role,
                        placement: msg.role === "user" ? "end" : "start",
                        footer: (content: string) => (
                            <Actions items={actionItems(msg.content)} />
                        ),
                        footerPlacement:
                            msg.role === "user" ? "outer-end" : "outer-start",
                        variant:
                            msg.role === "user" ? "outlined" : "borderless",
                        styles:
                            msg.role === "user"
                                ? {
                                      content: {
                                          boxShadow: "2px 2px 0 #121b33cf",
                                      },
                                  }
                                : undefined,
                        content: (
                            <XMarkdown
                                components={{
                                    code: Code,
                                }}
                                config={{ extensions: Latex() }}
                            >
                                {msg.content}
                            </XMarkdown>
                        ),
                    }))}
                />

                {messagesHistory.length <= 1 && (
                    <Prompts
                        vertical
                        title="Возможные вопросы:"
                        onItemClick={(prompt) => {
                            handleSubmit(`${prompt.data.label}`);
                        }}
                        items={promptSuggestions}
                    />
                )}
            </div>
            <div style={{ borderTop: "1px solid #f0f0f0", padding: 12 }}>
                <Sender
                    loading={isLoading}
                    value={userPrompt}
                    placeholder="Задай свой вопрос по Scratch..."
                    onChange={setUserPrompt}
                    onSubmit={handleSubmit}
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    footer={(_, { components }) => {
                        const { SendButton, LoadingButton, SpeechButton } =
                            components;
                        return (
                            <Flex justify="space-between" align="center">
                                <Flex gap="small" align="center">
                                    <PDFDownloadLink
                                        document={
                                            <ChatPDFExport
                                                messagesHistory={
                                                    messagesHistory
                                                }
                                            />
                                        }
                                    >
                                        <Button
                                            disabled={isLoading}
                                            variant="dashed"
                                            color="primary"
                                            icon={<SaveOutlined />}
                                        ></Button>
                                    </PDFDownloadLink>
                                    <Divider orientation="vertical" />

                                    <DeleteConfirmButton
                                        onConfirm={handleClear}
                                    >
                                        <DeleteOutlined />
                                    </DeleteConfirmButton>
                                </Flex>
                                <Flex align="center">
                                    <SpeechButton />
                                    <Divider orientation="vertical" />
                                    {isLoading ? (
                                        <LoadingButton type="default" />
                                    ) : (
                                        <SendButton
                                            type="primary"
                                            disabled={false}
                                        />
                                    )}
                                </Flex>
                            </Flex>
                        );
                    }}
                    suffix={false}
                    allowSpeech
                    style={{ border: "1px solid #2C2C2C" }}
                />
            </div>
        </div>
    );
}

export default ChatView;
