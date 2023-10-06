import _ from "lodash";
import React, { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Icon, Text } from "zmp-ui";
import { create } from "../../services/api";
import noImage from "../../static/no-image.png";
import { noticeErrorState, noticeSuccessState } from "../../store/notice";
import { countUnreadNotificationState } from "../../store/notification";
import { parseUtcToLocal } from "../../utils";
import { NOTIFICATIONS } from "../../utils/constApiRoute";

const NotificationItemComponent = ({ item }) => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const [countNoti, setCountNoti] = useRecoilState(
    countUnreadNotificationState
  );
  const [listNotiRead, setListNotiRead] = useState([]);

  const parseTitle = () => {
    const regex = /<(\w+)>/g;

    return _.replace(item?.title, regex, (match, key) => {
      const replacement = _.get(item?.data, key, match);
      return `<span class="">${replacement}</span>`;
    });
  };

  const readNoti = (id) => {
    create(`${NOTIFICATIONS}/${id}/read`)
      .then(() => {
        setListNotiRead((prev) => [...prev, id]);
        setCountNoti(countNoti > 0 ? countNoti - 1 : 0);
        noticeSuccess("Đã đọc thông báo");
      })
      .catch((error) => noticeError(error?.message));
  };

  return (
    <div
      className={`py-3 p-2 border-b-[1px] border-[#e4e4e7] last:border-none flex text-[#36383A] ${
        item?.read_at || listNotiRead.includes(item?.id)
          ? "opacity-[0.7] pointer-events-none"
          : "opacity-1"
      }`}
      onClick={() =>
        !item?.read_at || listNotiRead.includes(item?.id)
          ? readNoti(item?.id)
          : false
      }
    >
      <div className="max-w-[60px] relative">
        <img
          className="w-full object-contain pt-2"
          src={item?.img ?? noImage}
        />
        {!item?.read_at && !listNotiRead.includes(item?.id) && (
          <div className="ml-auto absolute -top-1 -right-3">
            <Icon icon="zi-bullet-solid" className="text-red-600" />
          </div>
        )}
      </div>

      <div className="relative ml-3">
        <Text size="small" className="text-blue-500">
          {item?.type ? "Sửa chữa" : "Chương trình"}
        </Text>
        <div
          className="text-md font-medium"
          dangerouslySetInnerHTML={{ __html: parseTitle() }}
        />
        <Text size="small" className="text-gray-500 pt-1">
          Thời gian: 01/01/2023 - 01/06/2023
        </Text>
        <Text size="small" className="text-gray-500">
          {parseUtcToLocal(item?.created_at, "H:mm DD-MM-YYYY")}
        </Text>
      </div>
    </div>
  );
};

export default NotificationItemComponent;
