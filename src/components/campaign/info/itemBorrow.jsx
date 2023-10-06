import { faCalendarWeek } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { Button, Text } from "zmp-ui";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";
import { create } from "../../../services/api";
import { canViewReport } from "../../../services/hasPermission";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { SETUP_DETAIL } from "../../../utils/constApiRoute";
import SheetJoinCampaignSetup from "../../sheet/joinCampaignSetup";
import TextBaseLineComponent from "../../textBaseLine";
import noImage from "./../../../static/no-image.png";

const CampaignItemBorrowComponent = ({ appId, items }) => {
  const reloadPage = useNavigateCustomize();
  const setLoading = useSetRecoilState(loadingState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [visibleModal, setVisibleModal] = useState(false);
  const [clickApp, setClipApp] = useState({
    id: null,
    index: 0,
  });

  const handleConfirm = (type, data) => {
    setVisibleModal(false);

    if (type === "cancel") return;

    if (!clickApp?.id) {
      noticeError("Có lỗi xảy ra vui lòng thử lại");
      return;
    }

    setLoading(true);
    create(`${SETUP_DETAIL}/${clickApp?.id}/results`, {
      ...data,
      display_app_id: appId,
    })
      .then(() => {
        noticeSuccess("Đăng ký thành công");
        reloadPage();
      })
      .catch((error) => {
        setLoading(false);
        noticeError(error?.message);
      });
  };

  return (
    <div>
      <div>
        {items.map((item, index) => (
          <div
            key={index}
            className="border-b-2 border-dashed pb-3 last:border-0 last:pb-0"
          >
            <div className="text-4xl flex mt-3">
              <img
                src={item?.avatar_images ?? noImage}
                alt="alt source"
                className="w-full max-w-[25vw] h-[25vw] aspect-square object-cover"
              />
              <div style={{ width: `calc(100% - 28vw)` }} className="ml-auto">
                <div>
                  <Text.Title size="large">{item?.name}</Text.Title>
                  <TextBaseLineComponent
                    title="Mã yêu cầu"
                    value={item?.code}
                  />
                  <TextBaseLineComponent
                    title={<FontAwesomeIcon icon={faCalendarWeek} />}
                    value={`${
                      item?.start_date
                        ? moment(item?.start_date).format("DD/MM/YYYY")
                        : ""
                    } - ${
                      item?.end_date
                        ? moment(item?.end_date).format("DD/MM/YYYY")
                        : ""
                    }`}
                    mt={1}
                  />
                </div>
              </div>
            </div>

            <Button
              className="mt-3"
              fullWidth
              size="medium"
              disabled={item?.registered}
              onClick={() => {
                setClipApp({
                  id: item?.id,
                  index: index,
                });
                setVisibleModal(true);
              }}
            >
              {item?.registered ? "Đã tham gia" : "Đăng ký ngay"}
            </Button>
          </div>
        ))}
      </div>

      <SheetJoinCampaignSetup
        item={items[clickApp.index] ?? {}}
        isVisible={visibleModal}
        action={handleConfirm}
      />
    </div>
  );
};

export default CampaignItemBorrowComponent;
