import React, { useEffect, useState } from "react";
import { Button, Icon, Text } from "zmp-ui";
import moment from "moment";
import { canChangeCalendar } from "../../../services/hasPermission";
import SheetDatePickerComponent from "../../sheet/datePicker";
import { create } from "../../../services/api";
import { TICKETS } from "../../../utils/constApiRoute";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";

const InfoEstimateComponent = ({ item }) => {
  const reloadPage = useNavigateCustomize();
  const setLoading = useSetRecoilState(loadingState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [isShowSheet, setIsShowSheet] = useState(false);
  const [hasChange, setHasChange] = useState(false);

  const actionSheet = (action, data) => {
    setIsShowSheet(false);
    if (action === "cancel") return;
    setLoading(true);
    create(`${TICKETS}/${item?.id}/update-calender`, data)
      .then((response) => {
        noticeSuccess("Thay đổi thành công");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (canChangeCalendar(item)) {
      setHasChange(true);
    }
  }, []);

  return (
    <>
      {item?.can_update_calendar && (
        <div className="bg-white p-4 rounded-lg flex justify-between items-center">
          <div>
            <Text.Title>Lịch hẹn</Text.Title>
            <Text className="text-gray-400 mt-2 ml-6">
              {moment(item?.estimate_date).format("DD/MM/YYYY")}
            </Text>
          </div>

          {hasChange ? (
            <Button
              variant="primary"
              size="small"
              onClick={() => setIsShowSheet(true)}
            >
              Thay đổi
            </Button>
          ) : (
            <Icon icon="zi-calendar" size={35} />
          )}
        </div>
      )}

      {hasChange && (
        <SheetDatePickerComponent
          item={item}
          isVisible={isShowSheet}
          action={actionSheet}
        />
      )}
    </>
  );
};

export default InfoEstimateComponent;
