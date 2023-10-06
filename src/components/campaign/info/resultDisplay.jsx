import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { chooseImage } from "zmp-sdk";
import { Button, Icon, ImageViewer, Text } from "zmp-ui";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";
import useImageUpload from "../../../hook/upload/useUpload";
import { create } from "../../../services/api";
import { isOutlet } from "../../../services/hasPermission";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { empty, notEmpty } from "../../../utils";
import { DISPLAY_RESULT_DETAIL } from "../../../utils/constApiRoute";
import ModalApproveComponent from "../../modal/approve";

const CampaignResultDisplayComponent = ({ item, report, resultId }) => {
  const reloadPage = useNavigateCustomize();
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);
  const [isVisible, setIsVisile] = useState(false);
  const [isShowImgView, setIsShowImgView] = useState(false);
  const [images, setImages] = useState([]);
  const { image, loading, error, parseBlob } = useImageUpload();

  const uploadImage = () => {
    chooseImage({
      sourceType: ["album", "camera"],
      cameraType: "back",
      success: ({ filePaths, tempFiles }) => {
        if (tempFiles[0].size > 20e6) {
          noticeError("Hình ảnh không được quá 20MB!");
          return;
        }
        parseBlob(filePaths[0]);
      },
      fail: (error) => noticeError(error?.message),
    });
  };

  const removeImage = (index) => {
    const newList = images;
    newList.splice(index, 1);

    setImages([...newList]);
  };

  const modelAction = useCallback((type) => {
    setIsVisile(false);
    if (type === "cancel") return;

    if (images.length === 0) {
      noticeError("Vui lòng chọn hình ảnh !");
      return;
    }

    setLoading(true);
    create(`${DISPLAY_RESULT_DETAIL}/${resultId}/report`, {
      display_app_report_id: item?.id,
      images: images,
    })
      .then(() => {
        noticeSuccess("Báo cáo thành công.");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  });

  const isBetween = () => {
    return moment(moment().format("YYYY-MM-DD")).isBetween(
      item.start_date,
      item.end_date,
      undefined,
      "[]"
    );
  };

  useEffect(() => {
    if (!image) return;

    setImages([...images, image]);
  }, [image]);

  useEffect(() => {
    setLoading(loading);

    if (error) {
      noticeError(error);
    }
  }, [loading, error]);

  return (
    <>
      {!isBetween() && empty(report) ? (
        <Text.Title className="text-center">
          Đã hết hạn hoặc chưa tới thời gian báo cáo
        </Text.Title>
      ) : (
        <>
          <Text.Title>Hình ảnh kết quả trưng bày</Text.Title>

          {notEmpty(report) && (
            <>
              <div className=" flex justify-end my-2">
                <span
                  className={`w-[100px] flex items-center justify-center rounded-md text-white px-2 p-1 ${
                    report.is_approved ? "bg-teal-600" : "bg-red-600"
                  }`}
                >
                  {report.is_approved ? "Đã đạt" : "Không đạt"}
                </span>
              </div>

              <Text.Title size="small">Hình ảnh báo cáo trước </Text.Title>
              <div className="mt-3 grid grid-cols-4 gap-4">
                {report?.images?.map((i, index) => (
                  <div
                    className="relative h-full"
                    key={index}
                    onClick={() => setIsShowImgView(true)}
                  >
                    <img src={i} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              <ImageViewer
                onClose={() => setIsShowImgView(false)}
                activeIndex={0}
                images={report?.images?.map((i, index) => {
                  return {
                    src: i,
                    alt: `img ${index}`,
                    key: index,
                  };
                })}
                visible={isShowImgView}
              />

              <Text.Title size="small mt-5">Báo cáo lại</Text.Title>
            </>
          )}

          {!report?.is_approved && (
            <>
              <div className="mt-3 grid grid-cols-4 gap-4">
                {images.map((i, index) => (
                  <div className="relative h-full" key={index}>
                    <Icon
                      icon="zi-close-circle-solid"
                      className="text-red-500 absolute top-0 right-0 translate-x-1/3 -translate-y-1/3"
                      onClick={() => removeImage(index)}
                    />
                    <img src={i} className="w-full h-full object-cover" />
                  </div>
                ))}
                {images.length < 4 && (
                  <div
                    className={`relative flex justify-center items-center border py-2 ${
                      !isBetween() || !isOutlet() ? "pointer-events-none" : ""
                    }`}
                    onClick={() => uploadImage()}
                  >
                    <Icon icon="zi-camera" size={50} />
                  </div>
                )}
              </div>
              <Button
                className="mt-3"
                size="medium"
                fullWidth
                onClick={() => {
                  if (!isOutlet()) return;

                  setIsVisile(true);
                }}
                disabled={!isBetween()}
              >
                {!isBetween() ? "Đã hết hạn báo cáo" : "Gửi báo cáo"}
              </Button>
            </>
          )}
        </>
      )}

      <ModalApproveComponent
        isVisible={isVisible}
        action={modelAction}
        title="Đồng ý gửi báo cáo"
      />
    </>
  );
};

export default CampaignResultDisplayComponent;
