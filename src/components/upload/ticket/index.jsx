import _ from "lodash";
import React, { useEffect, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { chooseImage } from "zmp-sdk/apis";
import { Button, Text, Icon } from "zmp-ui";
import { apiClient } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import {
  defaultMediaState,
  mediaImagesState,
  mediaVideosState,
  setMediaDefaultState,
} from "../../../store/media";
import { noticeErrorState } from "../../../store/notice";
import { UPLOAD } from "../../../utils/constApiRoute";

const UploadMediaTicketComponent = ({
  titleImage = "Hình ảnh về tình trạng hư hỏng",
  titleVideo = "Video về tình trạng hư hỏng",
  isAddVideo = true,
}) => {
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [mediaState, setMediaState] = useRecoilState(defaultMediaState);
  const [images, setImages] = useRecoilState(mediaImagesState);
  const [videos, setVideos] = useRecoilState(mediaVideosState);
  const resetMedia = useSetRecoilState(setMediaDefaultState);
  const refFile = useRef();

  const uploadImage = () => {
    chooseImage({
      sourceType: ["album", "camera"],
      cameraType: "back",
      success: ({ filePaths, tempFiles }) => {
        if (tempFiles[0].size > 20e6) {
          noticeError("Hình ảnh không được quá 20MB!");
          return;
        }
        parseBlob(filePaths[0], "image");
      },
      fail: (error) => noticeError(error?.message),
    });
  };

  const parseBlob = (file, type) => {
    fetch(file)
      .then((response) => response.blob())
      .then((blob) => {
        setLoading(true);

        const reader = new FileReader();
        reader.onloadend = function () {
          const fileContent = reader.result;

          uploadFile(fileContent, type);
        };

        reader.readAsArrayBuffer(blob);
      })
      .catch((error) => noticeError(error?.message));
  };

  const changeFile = (e) => {
    const files = e.target.files;
    if (files[0].size > 20e6) {
      noticeError("File không được quá 20MB!");
      return;
    }

    parseBlob(URL.createObjectURL(files[0]), "video");
  };

  const removeItems = (target, index) => {
    if (target === "image") {
      const newImages = [...mediaState.images];
      newImages.splice(index, 1);
      setMediaState((prevMediaState) => ({
        ...prevMediaState,
        images: newImages,
      }));

      return;
    }

    setVideos();
  };

  const uploadFile = (data, type) => {
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
        if (type === "image") {
          setImages(response.data.url);
          return;
        }

        return setVideos(response.data.url);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    resetMedia("");
  }, []);

  return (
    <>
      <Text.Title size="small" className="mt-5">
        {titleImage}
      </Text.Title>
      <div className="grid grid-cols-4 gap-2 mt-2">
        {images.map((item, index) => (
          <div className="relative group cursor-pointer" key={index}>
            <Icon
              className="absolute top-0 right-0 text-red-500"
              icon="zi-close-circle-solid"
              onClick={() => removeItems("image", index)}
            />
            <img src={item} className="h-auto" />
          </div>
        ))}

        <div
          className={`flex items-center justify-center border-2 py-3 ${
            images.length >= 4 ? "hidden" : ""
          }`}
          onClick={() => uploadImage()}
        >
          <Icon icon="zi-camera" size={45} />
        </div>
      </div>
      {isAddVideo && (
        <>
          <Text.Title size="small" className="mt-5">
            {titleVideo}
          </Text.Title>
          {videos.map((item, index) => (
            <div className="border relative group" key={index}>
              <div
                className="absolute top-0 right-0 z-50"
                style={{ transform: `translate(50%, -45%)` }}
                onClick={() => removeItems("video", index)}
              >
                <Button
                  size="medium"
                  variant="tertiary"
                  type="danger"
                  icon={<Icon icon="zi-close-circle-solid" />}
                >
                  Button
                </Button>
              </div>
              <video src={item} width="100%" controls></video>
            </div>
          ))}

          <div className="mt-2 grid grid-cols-4">
            <div
              className={`flex items-center justify-center border-2 py-3 ${
                videos.length >= 1 ? "hidden" : ""
              }`}
              onClick={() => {
                refFile.current.value = null;
                refFile.current.click();
              }}
            >
              <input
                type="file"
                accept="video/mp4,video/x-m4v,video/*"
                hidden
                ref={refFile}
                onChange={(e) => changeFile(e)}
              />
              <Icon icon="zi-video" size={45} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UploadMediaTicketComponent;
