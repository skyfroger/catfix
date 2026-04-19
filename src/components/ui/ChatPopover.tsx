import { FloatButton, Popover } from "antd";
import { MessageOutlined, CloseOutlined } from "@ant-design/icons";

function ChatPopover() {
    // Контент всплывающего окна
    const popoverContent = (
        <div
            style={{
                width: 367,
                height: 500,
                display: "flex",
                flexDirection: "column",
            }}
        ></div>
    );
    return (
        <Popover
            content={popoverContent}
            trigger="click"
            placement="topRight"
            overlayInnerStyle={{ padding: 0 }}
            arrow={true}
            destroyTooltipOnHide={false} // сохраняем состояние при закрытии
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
