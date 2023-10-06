import React from "react";
import { Button, Modal } from "zmp-ui";

const ModalGiftComponent = ({
  isVisible,
  action,
  title = "Kết quả đổi quà",
  description,
  isConfirm = false,
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
          Quay lại
        </Button>
        {!isConfirm ? (
          <Button onClick={() => action("again")} fullWidth>
            Nhập lại
          </Button>
        ) : (
          <Button onClick={() => action("confirm")} fullWidth>
            Xác nhận
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default ModalGiftComponent;
