import { FloatButton, Popover } from "antd";
import { useCallback, useState, useRef, useEffect } from "react";
import { Bubble, Sender, Prompts } from "@ant-design/x";
import type { PromptsProps } from "@ant-design/x";
import { CodeHighlighter, Mermaid } from "@ant-design/x";
import { XMarkdown, type ComponentProps } from "@ant-design/x-markdown";
import OpenAI from "openai";
import { MessageOutlined, CloseOutlined } from "@ant-design/icons";
import ScratchCode from "./ScratchCode";
import systemPromptGenerator from "../../utils/chat";

interface MessageItem {
    content: string;
    role: "system" | "user" | "assistant";
    key: string | number;
}

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: import.meta.env.VITE_OPEN_ROUTER_API_KEY,
    dangerouslyAllowBrowser: true,
});

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

const Code: React.FC<ComponentProps> = (props) => {
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

function ChatPopover() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userPrompt, setUserPrompt] = useState<string>("");
    const [messagesHistory, setMessagesHistory] = useState<Array<MessageItem>>([
        {
            content: systemPromptGenerator(),
            role: "system",
            key: Date.now(),
        },
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const getAiResponce = useCallback(
        async (userMessage: string) => {
            setIsLoading(true);

            try {
                const updatedHistory: MessageItem[] = [
                    ...messagesHistory,
                    { content: userMessage, role: "user", key: Date.now() },
                ];

                setMessagesHistory(updatedHistory);

                const completion = await openai.chat.completions.create({
                    model: "openai/gpt-oss-120b:free",
                    messages: updatedHistory.map(({ role, content }) => ({
                        role,
                        content,
                    })),
                });

                const assistantContent =
                    completion.choices[0].message.content ?? "";

                setMessagesHistory([
                    ...updatedHistory,
                    {
                        content: assistantContent,
                        role: "assistant",
                        key: Date.now(),
                    },
                ]);
            } catch (error) {
                console.log("Ошибка получения ответа от LLM", error);
            } finally {
                setIsLoading(false);
            }
        },
        [messagesHistory]
    );

    const handleSubmit = (text: string) => {
        if (!text.trim()) return;

        setUserPrompt("");
        getAiResponce(text);
    };

    // Фильтруем сообщения для отображения (исключаем системные промпты - роль system)
    const visibleMessages = messagesHistory.filter(
        (msg) => msg.role !== "system"
    );

    // Контент всплывающего окна
    const popoverContent = (
        <div
            style={{
                width: "min(85vw, 720px)",
                height: 550,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Заголовок */}
            <div
                style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f0f0f0",
                    fontWeight: 500,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <CloseOutlined
                    style={{ cursor: "pointer", color: "#8c8c8c" }}
                    onClick={() => setOpen(false)}
                />
            </div>
            <div
                style={{
                    flex: 1,
                    maxHeight: 400,
                    overflowY: "auto",
                    padding: 16,
                }}
            >
                <Bubble.List
                    items={visibleMessages.map((msg) => ({
                        key: msg.key,
                        role: msg.role,
                        placement: msg.role === "user" ? "end" : "start",
                        styles:
                            msg.role === "assistant"
                                ? {
                                      content: {
                                          padding: 0,
                                          background: "transparent",
                                          border: "none",
                                          borderRadius: 0,
                                      },
                                      bubble: {
                                          maxWidth: "100%",
                                      },
                                  }
                                : undefined,
                        content: (
                            <XMarkdown
                                components={{
                                    code: Code,
                                }}
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

                <div ref={messagesEndRef} />
            </div>
            <div style={{ borderTop: "1px solid #f0f0f0", padding: 12 }}>
                <Sender
                    loading={isLoading}
                    value={userPrompt}
                    placeholder="Задай свой вопрос по Scratch..."
                    onChange={setUserPrompt}
                    onSubmit={handleSubmit}
                    autoSize={{ minRows: 1, maxRows: 6 }}
                    style={{ border: "1px solid #2C2C2C" }}
                />
            </div>
        </div>
    );
    return (
        <Popover
            content={popoverContent}
            trigger="click"
            open={open}
            onOpenChange={setOpen}
            placement="topRight"
            arrow={false}
            destroyOnHidden={false} // сохраняем состояние при закрытии
            styles={{
                container: {
                    backgroundColor: "hsl(10, 30%, 98%)",
                    boxShadow: "2px 2px 0 #121b33cf",
                    border: "2px solid #121b33",
                },
            }}
        >
            <FloatButton
                icon={<MessageOutlined />}
                type="primary"
                style={{ right: 24, bottom: 24 }}
            />
        </Popover>
    );
}

export default ChatPopover;
