import React, { useEffect, useState } from "react";
import { Sheet, Box, Button, Text } from "zmp-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import * as StatusOrder from "../../utils/enumOrder";
import { detail } from "../../services/api";
import { useSetRecoilState } from "recoil";
import { noticeErrorState } from "../../store/notice";
import { ORDER_ACTIVITIES } from "../../utils/constApiRoute";
import { parseUtcToLocal } from "../../utils";

const SheetStatusOrderComponent = ({ item }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [items, setItems] = useState([]);
  const noticeError = useSetRecoilState(noticeErrorState);

  const fetchItems = () => {
    detail(ORDER_ACTIVITIES, item?.code)
      .then((res) => {
        setItems(res.data.order_activities);
      })
      .catch((error) => noticeError(error?.message));
  };

  useEffect(() => {
    if (!isVisible || items.length) return;

    fetchItems();
  }, [isVisible]);

  return (
    <>
      <div
        className="p-3 bg-white rounded-lg"
        onClick={() => setIsVisible(true)}
      >
        <div className="flex justify-between items-center">
          <Text.Title>Trạng thái</Text.Title>
          <Text size="large" className="text-blue-500 border-b border-blue-500">
            {item?.status_text}
          </Text>
        </div>

        {item?.status === StatusOrder.CANCEL && (
          <Text className="mt-2">Lý do: {item?.reason_no_cancel}</Text>
        )}
      </div>

      <Sheet
        visible={isVisible}
        title="Trạng thái yêu cầu"
        onClose={() => setIsVisible(false)}
        autoHeight
        mask
        handler
        swipeToClose
        unmountOnClose={true}
      >
        <Box p={4} className="bottom-sheet-body" style={{ overflowY: "auto" }}>
          <div className="p-4 border border-black rounded-xl text-4xl mt-2 flex justify-between items-center">
            <Text.Title size="large">Mã đơn hàng</Text.Title>
            <Text.Title size="small" className="text-gray-500">
              {item?.code}
            </Text.Title>
          </div>

          <div className="p-4 border border-black rounded-xl text-4xl mt-7 mb-5">
            <Text.Title
              size="normal"
              className="mb-4 border-b border-black pb-3"
            >
              Tình trạng
            </Text.Title>

            <ul className="timeline-list relative max-w-[350px] mx-auto">
              {items.map((i, index) => (
                <li
                  key={index}
                  className={`flex justify-between mt-5 relative ${
                    i.active ? "active" : ""
                  }`}
                >
                  <div className="icon absolute text-lg top-0 left-[59px] leading-none z-50">
                    <FontAwesomeIcon icon={faCircle} />
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="text-[#085394]"
                    />
                  </div>
                  <Text className="timeline-date w-[60px]">
                    {parseUtcToLocal(i?.activity_at, "DD/MM HH:mm")}
                  </Text>
                  <Text
                    className="timeline-text"
                    style={{ width: `calc(100% - 100px)` }}
                  >
                    {i?.status_text} <br />
                    <span className="text-gray-400 font-normal">
                      {i?.reason_no_cancel && `Lý do: ${i?.reason_no_cancel}`}
                    </span>
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        </Box>
        <Box p={4} className="custom-bottom-sheet" flex flexDirection="column">
          <Box flex flexDirection="row" mt={1}>
            <Box style={{ flex: 1 }} pr={1}>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => setIsVisible(false)}
              >
                Quay lại
              </Button>
            </Box>
          </Box>
        </Box>
      </Sheet>
    </>
  );
};

export default SheetStatusOrderComponent;
