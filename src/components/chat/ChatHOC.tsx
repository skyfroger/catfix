import { useCallback, useState } from "react";
import OpenAI from "openai";
import ChatView from "../chat/ChatView";
import systemPromptGenerator from "../../utils/chat";

export interface MessageItem {
    content: string;
    role: "system" | "user" | "assistant";
    key: string | number;
}

const openai = new OpenAI({
    baseURL: import.meta.env.VITE_BASE_OPEN_AI_URL,
    apiKey: import.meta.env.VITE_OPEN_ROUTER_API_KEY,
    dangerouslyAllowBrowser: true,
});

function ChatHOC() {
    const [isLoading, setIsLoading] = useState(false);
    const [userPrompt, setUserPrompt] = useState<string>("");
    const [messagesHistory, setMessagesHistory] = useState<Array<MessageItem>>([
        {
            content: systemPromptGenerator(),
            role: "system",
            key: Date.now(),
        },
    ]);

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
                    model: import.meta.env.VITE_LLM,
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

    return (
        <ChatView
            messagesHistory={messagesHistory}
            isLoading={isLoading}
            userPrompt={userPrompt}
            handleSubmit={handleSubmit}
            setUserPrompt={setUserPrompt}
        />
    );
}

export default ChatHOC;
