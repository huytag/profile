import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";
import { create } from "../../../services/api";
import { isStaff } from "../../../services/hasPermission";
import { loadingState } from "../../../store/loading";
import {
  mediaImagesState,
  mediaVideosState,
  setMediaDefaultState,
} from "../../../store/media";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import {
  REPORT_AFTER,
  REPORT_ERROR,
  REQUEST,
  TICKETS,
} from "../../../utils/constApiRoute";
import AccordionComponent from "../../accordion";
import ReportWarrantyComponent from "./media/report";

const TicketWarrantyStaffComopnent = ({ item }) => {
  const reloadPage = useNavigateCustomize();
  const setLoading = useSetRecoilState(loadingState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const imagesState = useRecoilValue(mediaImagesState);
  const videosState = useRecoilValue(mediaVideosState);
  const resetMedia = useSetRecoilState(setMediaDefaultState);
  const [isRemove, setIsRemove] = useState(false);

  const action = (type, note, typeButton) => {
    if (typeButton === "cancel") return;

    setLoading(true);
    const isOperation = type === "operation";
    const data = isOperation
      ? {
          report_before_content: note,
          report_before_images: imagesState,
          report_before_videos: videosState,
        }
      : {
          report_after_content: note,
          report_after_images: imagesState,
          report_after_videos: videosState,
        };

    create(
      `${TICKETS}/${item?.id}/${
        isOperation ? REPORT_ERROR : REPORT_AFTER
      }/${REQUEST}`,
      data
    )
      .then((response) => {
        noticeSuccess("Gửi thành công!");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  const listAcc = [];
  const components = [
    {
      condition: item?.can_report_error,
      title: "Báo lỗi vận hành",
      name: "hư hỏng",
      type: "operation",
    },
    {
      condition: item?.can_report_after,
      title: "Báo cáo sau bảo hành",
      name: "bảo hành",
      type: "warranty",
    },
  ];

  components.map(({ condition, title, name, type }, key) => {
    if (condition) {
      listAcc.push({
        title,
        component: (
          <ReportWarrantyComponent
            item={item}
            titleImage={`Hình ảnh tình trạng ${name}`}
            titleVideo={`Video tình trạng ${name}`}
            titleDes="Mô tả tình trạng"
            type={type}
            action={action}
            isRemove={isRemove}
          />
        ),
        key,
        bg: true,
      });
    }
  });

  return (
    <>
      {isStaff() && (
        <AccordionComponent
          list={listAcc}
          action={() => {
            setIsRemove(!isRemove);
            resetMedia("");
          }}
        />
      )}
    </>
  );
};

export default TicketWarrantyStaffComopnent;
