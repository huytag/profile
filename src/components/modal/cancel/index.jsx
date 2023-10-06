import React, { useEffect, useState } from "react";
import { Button, Modal, Input } from "zmp-ui";

const ModalCancelComponent = ({ isVisible, action }) => {
  const [note, setNote] = useState("");

  useEffect(() => {
    setNote("");
  }, [isVisible]);
  return (
    <Modal
      visible={isVisible}
      title="Nhập lí do huỷ yêu cầu"
      onClose={() => action("cancel")}
      verticalActions
    >
      <div>
        <Input.TextArea
          placeholder="Nhập lý do"
          clearable
          onChange={(e) => setNote(e.target.value)}
          value={note}
        />
      </div>
      <div className="grid grid-cols-2 auto-cols-fr gap-1 mt-4">
        <Button onClick={() => action("cancel")} fullWidth variant="tertiary">
          Huỷ
        </Button>
        <Button disabled={!note} onClick={() => action("oke", note)} fullWidth>
          Xác nhận
        </Button>
      </div>
    </Modal>
  );
};

export default ModalCancelComponent;
