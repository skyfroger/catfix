import { FloatButton, Popover } from "antd";
import { useState } from "react";
import { MessageOutlined } from "@ant-design/icons";
import ChatHOC from "../chat/ChatHOC";

function ChatPopover() {
    const [open, setOpen] = useState(false);

    return (
        <Popover
            content={<ChatHOC />}
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
