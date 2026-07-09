import { message } from "antd";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import OpenAI from "openai";
import pRetry, { AbortError } from "p-retry";
import ChatView from "../chat/ChatView";
import {
    systemPromptGenerator,
    projectContentForPrompt,
} from "../../utils/chat";
import { Project } from "catfix-utils/dist/parsedProject";

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

interface ChatHOCProps {
    project: Project | null;
}

const MODELS: string[] = import.meta.env.VITE_LLM
    ? String(import.meta.env.VITE_LLM)
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean)
    : [];

function ChatHOC({ project }: ChatHOCProps) {
    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [userPrompt, setUserPrompt] = useState<string>("");
    const [messagesHistory, setMessagesHistory] = useState<Array<MessageItem>>([
        {
            content: systemPromptGenerator(),
            role: "system",
            key: Date.now(),
        },
    ]);

    useEffect(() => {
        if (project) {
            console.log("К чату добавлен проверяемый проект.");
            setMessagesHistory((prev) => [
                ...prev,

                {
                    content: projectContentForPrompt(project),
                    role: "system",
                    key: Date.now(),
                },
                {
                    content: t("chat.projectUploaded"),
                    role: "assistant",
                    key: Date.now(),
                },
            ]);
        }
    }, [project]);

    const getAiResponce = useCallback(
        async (userMessage: string) => {
            if (MODELS.length === 0) {
                messageApi.error("Список моделей пуст.");
                return;
            }

            setIsLoading(true);

            try {
                const updatedHistory: MessageItem[] = [
                    ...messagesHistory,
                    { content: userMessage, role: "user", key: Date.now() },
                ];
                setMessagesHistory(updatedHistory);

                const apiMessages = updatedHistory.map(({ role, content }) => ({
                    role,
                    content,
                }));

                // p-retry сам переключает модель по attemptNumber
                const completion = await pRetry(
                    async (attemptNumber) => {
                        const modelIndex = attemptNumber - 1; // attemptNumber начинается с 1
                        const model = MODELS[modelIndex];

                        if (!model) {
                            throw new AbortError(
                                "Все модели из списка исчерпаны"
                            );
                        }

                        console.log(
                            `[LLM] Попытка ${attemptNumber} → модель: ${model}`
                        );
                        return openai.chat.completions.create({
                            model,
                            messages: apiMessages,
                        });
                    },
                    {
                        retries: MODELS.length - 1, // fallback на оставшиеся модели
                        minTimeout: 0, // мгновенное переключение, без задержек
                        maxTimeout: 0,
                        factor: 1,
                        onFailedAttempt: ({
                            error,
                            attemptNumber,
                            retriesLeft,
                        }) => {
                            const failedModel = MODELS[attemptNumber - 1];
                            console.error(
                                `[LLM] Модель ${failedModel} упала (попытка ${attemptNumber}):`,
                                error
                            );
                            if (retriesLeft > 0) {
                                console.log(
                                    `[LLM] Переключаюсь на следующую модель...`
                                );
                            }
                        },
                    }
                );

                const assistantContent =
                    completion.choices[0].message.content ?? "";

                setMessagesHistory((prev) => [
                    ...prev,
                    {
                        content: assistantContent,
                        role: "assistant",
                        key: Date.now(),
                    },
                ]);
            } catch (error) {
                messageApi.open({
                    type: "error",
                    content: t("chat.llmRateError"),
                });
                console.log("Ошибка получения ответа от LLM", error);
            } finally {
                setIsLoading(false);
            }
        },
        [messagesHistory, messageApi, t]
    );

    // отправка сообщения
    const handleSubmit = (text: string) => {
        if (!text.trim()) return;

        setUserPrompt("");
        getAiResponce(text);
    };

    // Очистка чата
    const handleClear = () => {
        // возвращаем в массив сообщений системный запрос
        setMessagesHistory([
            {
                content: systemPromptGenerator(),
                role: "system",
                key: Date.now(),
            },
        ]);
    };

    return (
        <>
            {contextHolder}

            <ChatView
                messagesHistory={messagesHistory}
                isLoading={isLoading}
                userPrompt={userPrompt}
                handleSubmit={handleSubmit}
                handleClear={handleClear}
                setUserPrompt={setUserPrompt}
            />
        </>
    );
}

export default ChatHOC;
