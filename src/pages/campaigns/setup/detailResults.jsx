import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSetRecoilState } from "recoil";
import { Page, Text, Input, Button } from "zmp-ui";
import SetupActivitiesComponent from "../../../components/campaign/info/activities";
import CampaignItemsSetupComponent from "../../../components/campaign/info/itemsSetup";
import HeaderComponent from "../../../components/header";
import InfoCodeComponent from "../../../components/info/code";
import InfoMediaComponent from "../../../components/info/media";
import InfoMethodComponent from "../../../components/info/method";
import InfoStoreComponent from "../../../components/info/store";
import ModalHandoverComponent from "../../../components/modal/handover";
import RatingComponent from "../../../components/rating";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";
import { apiClient, detail } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { notEmpty, parseUtcToLocal } from "../../../utils";
import { SETUP_RESULT_DETAIL } from "../../../utils/constApiRoute";
import * as AppStatus from "../../../utils/enumSetupAppResult";

const CampaignSetupResultDetailPage = () => {
  const { id } = useParams();
  const reloadPage = useNavigateCustomize();
  const setLoading = useSetRecoilState(loadingState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [item, setItem] = useState();
  const [isShow, setIsShow] = useState(false);

  const getDetail = () => {
    setLoading(true);

    detail(SETUP_RESULT_DETAIL, id)
      .then((response) => {
        setItem(response?.data?.setup_app_result);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const modelAction = useCallback((type, data) => {
    setIsShow(false);

    if (type === "cancel") return;

    handleConfirm(data);
  });

  const handleConfirm = (data) => {
    apiClient
      .put(`${SETUP_RESULT_DETAIL}/${id}/handover-confirmation`, data)
      .then(() => {
        noticeSuccess("Xác nhận thành công");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <Page className="page " style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Chi tiết yêu cầu" />

      {item?.status === AppStatus.REJECT && (
        <div className="p-4 text-4xl mt-2 bg-white rounded-xl">
          <div className="flex justify-between">
            <div>
              <Text.Title size="large" className="text-[#597eaa]">
                Yêu cầu lắp đặt {item?.status_text.toLowerCase()}
              </Text.Title>
              <Text size="small" className="mt-3">
                {parseUtcToLocal(item?.updated_at)}
              </Text>
            </div>
            <div className="ml-3 text-red-500">
              <FontAwesomeIcon size="xl" icon={faArrowRotateLeft} />
            </div>
          </div>

          <Text size="small">
            Lý do:
            <span className="text-[#999999] ml-2">
              {item?.deny_reason_desc}
            </span>
          </Text>
        </div>
      )}

      <div className="rounded-xl text-4xl mt-3 p-3 bg-white">
        {item && <SetupActivitiesComponent item={item} hasHidden={true} />}
        <hr className="mt-3 bg-[#ddd] h-[2px]" />

        <Text.Title size="small" className="mt-3">
          Thiết bị yêu cầu
        </Text.Title>
        <CampaignItemsSetupComponent item={item?.setup_app_item} />

        <InfoMethodComponent title="Số lượng" value={item?.item_quantity} />
        <hr className="my-4 bg-[#ddd] h-[2px]" />
        <InfoMethodComponent
          title="Lý do yêu cầu lắp đặt"
          value={item?.setup_reason_desc}
          isFlexCol
        />

        {notEmpty(item?.address_images) && (
          <>
            <hr className="my-4 bg-[#ddd] h-[2px]" />
            <InfoMediaComponent
              images={item?.address_images}
              titleImage="Vị trí dự kiến lắp đặt"
            />
          </>
        )}

        <hr className="my-4 bg-[#ddd] h-[2px]" />
        <InfoMethodComponent
          title="Ngày tạo"
          value={parseUtcToLocal(item?.created_at)}
        />
        <hr className="my-4 bg-[#ddd] h-[2px]" />
        <InfoStoreComponent item={item?.outlet} />
        <hr className="my-4 bg-[#ddd] h-[2px]" />
        <InfoCodeComponent code={item?.request_code} />
      </div>

      {item?.status === AppStatus.DONE && (
        <>
          <div className="rounded-xl text-4xl mt-3 p-3 bg-white">
            <Text.Title>Thông tin đánh giá</Text.Title>

            <InfoMediaComponent
              images={item?.item_images ?? []}
              titleImage="Hình ảnh tình trạng thiết bị"
            />
            <hr className="my-4 bg-[#ddd] h-[2px]" />

            <InfoMethodComponent
              title="Đánh giá dịch vụ"
              value={
                <RatingComponent
                  rating={item?.rate_point}
                  isShowNumber={false}
                />
              }
            />
            <hr className="my-4 bg-[#ddd] h-[2px]" />

            <Text.Title>Mô tả đánh giá</Text.Title>
            <Input.TextArea
              value={item?.rate_note}
              className="pointer-events-none bg-gray-200 text-sm"
            />
          </div>
        </>
      )}

      {item?.status === AppStatus.WAIT_FOR_INSTALLATION && !item?.is_rated ? (
        <>
          <div className="flex gap-2 mt-3">
            <Button fullWidth size="medium" onClick={() => setIsShow(true)}>
              Xác nhận đã bàn giao
            </Button>
          </div>

          <ModalHandoverComponent
            isVisible={isShow}
            action={(type, note) => modelAction(type, note)}
          />
        </>
      ) : (
        ""
      )}
    </Page>
  );
};

export default CampaignSetupResultDetailPage;
