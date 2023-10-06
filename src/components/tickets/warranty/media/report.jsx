import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Button, Input, Text } from "zmp-ui";
import { mediaImagesState } from "../../../../store/media";
import { empty } from "../../../../utils";
import ModalApproveComponent from "../../../modal/approve";
import UploadMediaTicketComponent from "../../../upload/ticket";

const ReportWarrantyComponent = ({
  item,
  titleImage,
  titleVideo,
  titleDes,
  type,
  action,
  isRemove,
}) => {
  const imagesState = useRecoilValue(mediaImagesState);
  const [note, setNote] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    setNote("");
  }, [isRemove]);

  return (
    <div className="-mt-5">
      <Text size="xxSmall" className="-mb-5 mt-2 text-red-500">
        * Phải có ít nhất 2 ảnh và nội dung
      </Text>
      <UploadMediaTicketComponent
        titleImage={titleImage}
        titleVideo={titleVideo}
      />

      <hr className="mt-3 bg-[#ddd] h-[2px]" />

      <Text.Title size="small" className="mt-5">
        {titleDes}
      </Text.Title>
      <Input.TextArea
        value={note}
        clearable
        onChange={(e) => setNote(e.target.value)}
      />

      {(item?.can_report_error || item?.can_report_after) && (
        <>
          <Button
            fullWidth
            size="large"
            className="mt-5"
            disabled={empty(note) || imagesState.length < 2}
            onClick={() => setPopupVisible(true)}
          >
            {type === "error" ? "Gửi" : "Gửi báo cáo"}
          </Button>

          <ModalApproveComponent
            title="Đồng ý gửi"
            isVisible={popupVisible}
            action={(typeButton) => {
              setPopupVisible(false);
              action(type, note, typeButton);
            }}
          />
        </>
      )}
    </div>
  );
};

export default ReportWarrantyComponent;
