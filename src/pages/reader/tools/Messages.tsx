import { Button, message, Modal } from "antd";
import { LoginOutlined, LogoutOutlined, HomeFilled } from "@ant-design/icons";

export const showPageDelMsg = (onUndo: () => void) => {
  message.warning({
    content: (
      <>
        One page was deleted.
        <Button
          size="small"
          type="link"
          onClick={() => {
            message.destroy("DELETE");
            onUndo();
          }}
        >
          Undo
        </Button>
      </>
    ),
    key: "DELETE",
    duration: 10,
  });
};

export const showJoinMsg = (userID: string, userName: string) => {
  message.success({
    content: `${userName} joined the room`,
    icon: <LoginOutlined />,
    key: userID,
  });
};

export const showLeaveMsg = (userID: string, userName: string) => {
  message.warning({
    content: `${userName} leaved the room`,
    icon: <LogoutOutlined />,
    key: userID,
  });
};

export const showReopenMsg = (onOk: () => void) => {
  Modal.error({
    title: "This note is opened in another tab.",
    okText: "Back",
    okButtonProps: { icon: <HomeFilled /> },
    onOk,
  });
};
