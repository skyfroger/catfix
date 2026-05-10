import { useState } from "react";
import { Drawer, FloatButton } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import ChatHOC from "../chat/ChatHOC";
import { Project } from "catfix-utils/dist/parsedProject";

interface ChatDrawerProps {
    project: Project | null;
}

function ChatDrawer({ project }: ChatDrawerProps) {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Drawer
                title="Ада: ИИ-репетитор"
                closable={{ "aria-label": "Close Button" }}
                onClose={onClose}
                open={open}
                size={"min(100vw, 45vw)"}
                mask={{ blur: true }}
                style={{
                    backgroundColor: "hsl(10, 30%, 98%)",
                    borderLeft: "1px solid #121b33",
                }}
                styles={{
                    body: {
                        padding: "0 0 0 1.2em",
                    },
                }}
            >
                <ChatHOC project={project} />
            </Drawer>

            <FloatButton
                icon={<MessageOutlined />}
                type="primary"
                onClick={showDrawer}
                style={{ right: 24, bottom: 24 }}
            />
        </>
    );
}

export default ChatDrawer;
