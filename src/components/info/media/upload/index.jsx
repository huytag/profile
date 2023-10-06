import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { chooseImage, openMediaPicker } from "zmp-sdk/apis";
import { Button, Text, Icon } from "zmp-ui";
import {
  defaultMediaState,
  mediaImagesState,
  mediaVideosState,
  setMediaDefaultState,
} from "../../../../store/media";
import { noticeErrorState } from "../../../../store/notice";

const UploadMediaComponent = () => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const [mediaState, setMediaState] = useRecoilState(defaultMediaState);
  const [images, setImages] = useRecoilState(mediaImagesState);
  const [videos, setVideos] = useRecoilState(mediaVideosState);
  const resetMedia = useSetRecoilState(setMediaDefaultState);

  const uploadMedia = (type) => {
    chooseImage({
      sourceType: ["album", "camera"],
      cameraType: "back",
      success: ({ filePaths, tempFiles }) => {
        if (tempFiles[0].size > 20e6) {
          noticeError("File không được quá 20MB!");
          return;
        }
        type === "image" ? setImages(filePaths[0]) : setVideos(filePaths[0]);
      },
      fail: (error) => noticeError(error?.message),
    });
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

  useEffect(() => {
    resetMedia("");
  }, []);

  return (
    <>
      <Text.Title size="small" className="mt-5">
        Hình ảnh về tình trạng hư hỏng
      </Text.Title>
      <div className="grid grid-cols-4 gap-2 mt-2">
        {images.map((item, index) => (
          <div className="relative group cursor-pointer" key={index}>
            <div
              className="absolute top-0 right-0 z-50"
              style={{ transform: `translate(50%, -45%)` }}
              onClick={() => removeItems("image", index)}
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
            <img src={item} className="h-auto" />
          </div>
        ))}

        <div
          className={`flex items-center justify-center ${
            images.length >= 4 ? "hidden" : ""
          }`}
        >
          <Button
            size="large"
            icon={<Icon icon="zi-camera" />}
            onClick={() => uploadMedia("image")}
          >
            Button
          </Button>
        </div>
      </div>
      <Text.Title size="small" className="mt-5">
        Video về tình trạng hư hỏng
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
          className={`flex items-center justify-center ${
            videos.length >= 1 ? "hidden" : ""
          }`}
        >
          <Button
            size="large"
            icon={<Icon icon="zi-video" />}
            onClick={() => uploadMedia("video")}
          >
            Button
          </Button>
        </div>
      </div>
    </>
  );
};

export default UploadMediaComponent;
