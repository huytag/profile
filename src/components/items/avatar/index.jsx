import React, { useState, useEffect } from "react";
import { Button, Icon, Modal } from "zmp-ui";
import { chooseImage } from "zmp-sdk/apis";
import { useSetRecoilState } from "recoil";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { loadingState } from "../../../store/loading";
import { apiClient } from "../../../services/api";
import noImage from "../../../static/no-image.png";
import { ITEMS, UPLOAD } from "../../../utils/constApiRoute";

const AvatarItemComponent = ({ id, avatar }) => {
  const setLoading = useSetRecoilState(loadingState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [modalVisible, setModalVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState();
  const [tmpImgSrc, setTmpImgSrc] = useState();

  const uploadImage = () => {
    chooseImage({
      sourceType: ["album", "camera"],
      cameraType: "back",
      success: ({ filePaths, tempFiles }) => {
        if (tempFiles[0].size > 20e6) {
          noticeError("Hình ảnh không được quá 20MB!");
          return;
        }
        setLoading(true);
        updateAvatar(filePaths[0]);
      },
      fail: (error) => noticeError(error?.message),
    });
  };

  const updateAvatar = (file) => {
    fetch(file)
      .then((response) => response.blob())
      .then((blob) => {
        setLoading(true);

        const reader = new FileReader();
        reader.onloadend = function () {
          const fileContent = reader.result;

          sendFileToBackend(fileContent);
        };

        reader.readAsArrayBuffer(blob);
      })
      .catch((error) => noticeError(error?.message));

    setModalVisible(false);
  };

  const sendFileToBackend = (data) => {
    const fileBlob = new Blob([data], {
      type: "application/octet-stream",
    });

    const formData = new FormData();
    formData.append("file", fileBlob, "filename.jpg");
    formData.append("bucket", "th-asset");
    formData.append("dir", "images");
    formData.append("is_public", "1");

    apiClient
      .post(UPLOAD, formData)
      .then((response) => {
        setTmpImgSrc(response.data.url);
        setModalVisible(true);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const uploadDevice = () => {
    setLoading(true);

    apiClient
      .post(`${ITEMS}/${id}/image`, {
        image_url: tmpImgSrc,
      })
      .then((response) => {
        setImgSrc(tmpImgSrc);
        noticeSuccess("Cập nhật ảnh thành công");
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => {
        setLoading(false);
        setModalVisible(false);
      });
  };

  useEffect(() => {
    setImgSrc(avatar);
  }, [avatar]);

  return (
    <>
      <div>
        <div className="w-full mb-4 relative">
          <img
            src={imgSrc ?? noImage}
            alt="devices"
            className="w-full rounded-md"
          />
          <div
            className="absolute bottom-0 right-0 bg-white/[0.7] p-2 rounded-full border border-black"
            style={{ transform: "translate(30%, 30%)" }}
            onClick={() => uploadImage()}
          >
            <Icon icon="zi-camera" size={45} />
          </div>
        </div>

        <Modal
          visible={modalVisible}
          title="Xác nhận sử dụng ảnh này"
          onClose={() => setModalVisible(false)}
        >
          <img src={tmpImgSrc} alt="TH tmp" />
          <div className="grid-flow-col grid-cols-2 grid gap-4 mt-5">
            <Button
              onClick={() => setModalVisible(false)}
              fullWidth
              variant="tertiary"
            >
              Huỷ
            </Button>
            <Button onClick={() => uploadDevice()} fullWidth>
              Cập nhật
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default AvatarItemComponent;
