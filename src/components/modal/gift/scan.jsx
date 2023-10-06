import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { Box, Button, Modal, Input } from "zmp-ui";
import { noticeErrorState } from "../../../store/notice";
import ErrorComponent from "../../error";
import { empty } from "../../../utils";

const ModalGiftScanComponent = ({
  isVisible,
  action,
  title = "Chụp mã thẻ",
  description,
}) => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const [content, setContent] = useState("");
  const [error, setError] = useState({
    content: false,
  });

  const handleChangeContent = (e) => {
    setError({
      ...error,
      content: false,
    });
    setContent(e.target?.value);
  };

  const handleConfirm = () => {
    if (empty(content)) {
      setError({
        ...error,
        content: true,
      });
      noticeError("Vui lòng nhập mã thẻ");
      return;
    }

    setContent("");
    action("oke", content);
  };

  return (
    <Modal title={title} visible={isVisible} verticalActions>
      <Box className="mt-5">
        <Input
          type="text"
          size="medium"
          placeholder="Nhập mã thẻ"
          label="Mã thẻ"
          className="rounded-md px-0 text-center"
          value={content}
          name="content"
          onChange={(e) => handleChangeContent(e)}
        />
        <ErrorComponent title="Vui lòng nhập mã thẻ" isShow={error?.content} />
      </Box>

      <div className="grid grid-cols-2 auto-cols-fr gap-1 mt-4">
        <Button
          type="danger"
          variant="secondary"
          onClick={() => action("cancel")}
          fullWidth
        >
          Quay lại
        </Button>
        <Button onClick={() => handleConfirm()} fullWidth>
          Xác nhận
        </Button>
      </div>
    </Modal>
  );
};

export default ModalGiftScanComponent;
