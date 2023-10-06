import React, { useEffect, useState } from "react";
import { Text } from "zmp-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { METHOD_WARRANTY, SUB_CANCEL_REQUEST } from "../../utils/enumTicket";
import { parseUtcToLocal } from "../../utils";

const InfoCancelComponent = ({ item, titleCancel = null }) => {
  const [title, setTitle] = useState("Yêu cầu đã huỷ");

  useEffect(() => {
    if (titleCancel) return;

    if (item?.report_before_content && item?.report_after_content) {
      setTitle("Kết quả sửa chữa bị từ chối");
      return;
    }

    if (item?.report_after_content) {
      setTitle("Kết quả bảo hành bị từ chối");
      return;
    }

    if (item?.report_before_content) {
      const text =
        item?.method_type === METHOD_WARRANTY
          ? "Lỗi vận hành"
          : "Hiện trạng sửa chữa";
      setTitle(`${text} bị từ chối`);
      return;
    }
  }, []);

  return (
    <div
      className={`p-4 text-4xl mt-2 bg-white rounded-xl shadow-lg shadow-black-500/50`}
    >
      <div className="flex justify-between">
        <div>
          <Text.Title size="large" className="text-[#597eaa]">
            {titleCancel ?? title}
          </Text.Title>
          <Text size="small" className="mt-3">
            {parseUtcToLocal(
              titleCancel
                ? item?.refused_at
                : item?.canceled_at ?? item?.refused_at
            )}
          </Text>
          <Text size="small">
            Huỷ bởi:{" "}
            <span className="text-[#999999] ml-2">
              {titleCancel
                ? item?.refused_user?.name
                : item?.canceled_user?.name ?? item?.refused_by?.name}
            </span>
          </Text>
        </div>
        <div className="ml-3 text-red-500">
          <FontAwesomeIcon size="xl" icon={faArrowRotateLeft} />
        </div>
      </div>

      <Text size="small">
        Lý do:
        <span className="text-[#999999] ml-2">
          {item?.sub_status === SUB_CANCEL_REQUEST
            ? item?.reason_cancel
            : item?.reason_refuse}
        </span>
      </Text>
    </div>
  );
};

export default InfoCancelComponent;
