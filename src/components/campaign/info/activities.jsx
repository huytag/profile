import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSetRecoilState } from "recoil";
import { Text } from "zmp-ui";
import { list } from "../../../services/api";
import { noticeErrorState } from "../../../store/notice";
import { parseUtcToLocal } from "../../../utils";
import { hiddenBottomSheetState } from "../../../store/navigation";
import { SETUP_RESULT_DETAIL } from "../../../utils/constApiRoute";
import SheetStatusComponent from "../../sheet/status";

const SetupActivitiesComponent = ({ item, hasHidden = false }) => {
  const { id } = useParams();
  const setHiddenSheetBottom = useSetRecoilState(hiddenBottomSheetState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [status, setStatus] = useState([]);

  const getStatus = async () => {
    await list(`${SETUP_RESULT_DETAIL}/${id}/activities`)
      .then((response) => {
        setStatus(response.data.setup_activities);
      })
      .catch((error) => noticeError(error?.message));
  };

  useEffect(() => {
    getStatus();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <Text.Title size="small">Trạng thái</Text.Title>
        <Text.Title
          size="small"
          className="text-[#2b78e4] cursor-pointer"
          onClick={() => {
            setSheetVisible(true);

            if (!hasHidden) return;
            setHiddenSheetBottom(true);
          }}
        >
          Xem
        </Text.Title>
      </div>

      <div className="flex justify-between items-center">
        <Text size="xSmall" className="ml-2 text-gray-500">
          {status[0]?.status_text ?? item?.status_text}
        </Text>
        <Text size="xSmall" className="ml-2 text-gray-500">
          {parseUtcToLocal(status[0]?.activity_at ?? item?.created_at)}
        </Text>
      </div>

      <SheetStatusComponent
        isSetup
        item={item}
        items={status}
        isVisible={sheetVisible}
        action={() => {
          setSheetVisible(false);

          if (!hasHidden) return;
          setHiddenSheetBottom(false);
        }}
      />
    </>
  );
};

export default SetupActivitiesComponent;
