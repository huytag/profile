import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";
import { create } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import {
  mediaImagesState,
  mediaVideosState,
  setMediaDefaultState,
} from "../../../store/media";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { REPORT_AFTER, REQUEST, TICKETS } from "../../../utils/constApiRoute";
import AccordionComponent from "../../accordion";
import InfoReportWarrantyComopnent from "../../info/warranty/reportMedia";
import ReportWarrantyComponent from "./media/report";

const TicketWarrantySuppervionComopnent = ({ item }) => {
  const reloadPage = useNavigateCustomize();
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const imagesState = useRecoilValue(mediaImagesState);
  const videosState = useRecoilValue(mediaVideosState);
  const resetMedia = useSetRecoilState(setMediaDefaultState);
  const [isRemove, setIsRemove] = useState(false);

  const actionModal = (type, note, typeButton) => {
    if (typeButton === "cancel") return;

    setLoading(true);
    create(`${TICKETS}/${item?.id}/${REPORT_AFTER}/${REQUEST}`, {
      report_after_content: note,
      report_after_images: imagesState,
      report_after_videos: videosState,
    })
      .then((response) => {
        noticeSuccess("Gửi thành công");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  const listAcc = [
    {
      title: "Báo lỗi vận hành",
      component: (
        <InfoReportWarrantyComopnent
          images={item?.report_before_images}
          videos={item?.report_before_videos}
          content={item?.report_before_content}
        />
      ),
      key: "info1",
      bg: true,
    },
  ];

  if (item?.can_report_after) {
    listAcc.push({
      title: "Báo cáo sau sửa chữa",
      component: (
        <ReportWarrantyComponent
          item={item}
          titleImage="Hình ảnh tình trạng sau sửa chữa"
          titleVideo="Video tình trạng sau sửa chữa"
          titleDes="Ghi chú"
          type="warranty"
          action={actionModal}
          isRemove={isRemove}
        />
      ),
      key: "info3",
      bg: true,
    });
  }

  return (
    <>
      <AccordionComponent
        list={listAcc}
        indexActive={1}
        action={() => {
          setIsRemove(!isRemove);
          resetMedia("");
        }}
      />
    </>
  );
};

export default TicketWarrantySuppervionComopnent;
