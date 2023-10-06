import React from "react";
import { Button, Modal } from "zmp-ui";

const ModalApproveComponent = ({
  isVisible,
  action,
  title = "Đồng ý duyệt yêu cầu",
  description,
}) => {
  return (
    <Modal
      title={title}
      visible={isVisible}
      onClose={() => action("cancel")}
      verticalActions
    >
      {description && <div className="text-center">{description}</div>}
      <div className="grid grid-cols-2 auto-cols-fr gap-1 mt-4">
        <Button
          type="danger"
          variant="secondary"
          onClick={() => action("cancel")}
          fullWidth
        >
          Huỷ
        </Button>
        <Button onClick={() => action("oke")} fullWidth>
          Xác nhận
        </Button>
      </div>
    </Modal>
  );
};

export default ModalApproveComponent;
