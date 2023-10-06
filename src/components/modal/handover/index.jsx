import React, { useEffect, useState } from "react";
import { Button, Modal, Text, Input } from "zmp-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStartRegular } from "@fortawesome/free-regular-svg-icons";
import UploadMediaTicketComponent from "../../upload/ticket";
import { mediaImagesState, setMediaDefaultState } from "../../../store/media";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useValidator from "../../../hook/validator/useValidator";
import ErrorComponent from "../../error";
import { noticeErrorState } from "../../../store/notice";

const ModalHandoverComponent = ({ isVisible, action }) => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const images = useRecoilValue(mediaImagesState);
  const resetMedia = useSetRecoilState(setMediaDefaultState);
  const { listError, passValidator, checkValidator, settKeyOk } =
    useValidator();
  const [formData, setFromData] = useState({
    rate_point: 5,
  });

  const handleSubmit = () => {
    checkValidator(["item_images"], formData);

    if (!passValidator()) {
      noticeError("Vui lòng chọn những trường còn thiếu");
      return;
    }

    action("ok", formData);
  };

  useEffect(() => {
    setFromData((prev) => ({ ...prev, item_images: images }));
    settKeyOk("item_images", images);
  }, [images]);

  useEffect(() => {
    setFromData({ rate_point: 5 });
    resetMedia();
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      title="Xác nhận đã bàn giao"
      onClose={() => action("cancel")}
      verticalActions
    >
      <div>
        <UploadMediaTicketComponent
          titleImage="Hình ảnh tình trạng thiết bị"
          isAddVideo={false}
        />
        <ErrorComponent
          title="Chọn ít nhất 1 ảnh"
          isShow={listError?.item_images}
        />

        <div className="flex justify-between items-center mt-5 border-y-2 border-dashed border-[#dddddd] py-3.5">
          <Text.Title size="small" className="mr-2">
            Đánh giá dịch vụ
          </Text.Title>
          <div className="text-center text-yellow-500 text-[4.5vw]">
            {[...Array(formData.rate_point)].map((value, index) => (
              <FontAwesomeIcon
                icon={faStar}
                key={index}
                onClick={() =>
                  setFromData((prev) => ({ ...prev, rate_point: index + 1 }))
                }
              />
            ))}
            {[...Array(5 - formData.rate_point)].map((value, index) => (
              <FontAwesomeIcon
                icon={faStartRegular}
                key={index}
                onClick={() =>
                  setFromData((prev) => ({
                    ...prev,
                    rate_point: formData.rate_point + index + 1,
                  }))
                }
              />
            ))}
          </div>
        </div>

        <Text.Title size="small" className="mb-2 mt-5">
          Mô tả đánh giá
        </Text.Title>
        <Input.TextArea
          value={formData?.rate_note ?? ""}
          onChange={(e) =>
            setFromData((prev) => ({ ...prev, rate_note: e.target.value }))
          }
        />
      </div>
      <div className="grid grid-cols-2 auto-cols-fr gap-1 mt-4">
        <Button
          onClick={() => action("cancel")}
          fullWidth
          variant="secondary"
          type="danger"
        >
          Huỷ
        </Button>
        <Button onClick={handleSubmit} fullWidth>
          Xác nhận
        </Button>
      </div>
    </Modal>
  );
};

export default ModalHandoverComponent;
