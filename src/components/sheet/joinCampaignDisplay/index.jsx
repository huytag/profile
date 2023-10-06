import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Box, Button, Sheet, Text } from "zmp-ui";
import InputQuantity from "../../input/quantity";

const SheetJoinCampaignDisplay = ({ items, isVisible = false, action }) => {
  const [data, setData] = useState([]);

  const inputAction = (index, value, id) => {
    const list = data.map((item) => {
      return {
        quantity: 0,
        display_app_bonus_id: item?.display_app_bonus_id,
      };
    });

    const product = {
      quantity: Number(value),
      display_app_bonus_id: id,
    };
    list[index] = product;

    const newList = _.fill(list, product, index, 1);
    setData([...newList]);
  };

  useEffect(() => {
    setData([]);
  }, [isVisible]);

  return (
    <Sheet
      title="Yêu cầu tham gia"
      visible={isVisible}
      onClose={() => action("cancel")}
      autoHeight
      mask
      handler
      swipeToClose
    >
      <Box p={4} className="custom-bottom-sheet" flex flexDirection="column">
        <Box className="bottom-sheet-body" style={{ overflowY: "auto" }}>
          <div className="flex justify-between">
            <Text.Title>Mức tham gia</Text.Title>
            <Text.Title className="pr-4">Số suất</Text.Title>
          </div>

          {items?.map((item, index) => (
            <div
              className="flex justify-between items-center border-b-2 border-dashed border-[#dddddd] py-4 last:border-none"
              key={index}
            >
              <div>
                <Text.Title>Mức {item?.level}</Text.Title>
                <Text className="mt-2">{item?.product_desc}</Text>
                <Text className="text-[#2b78e4]">Thuong 500,000vnd/ suat</Text>
              </div>
              <div>
                <InputQuantity
                  value={data[index]?.quantity ?? 0}
                  action={(value) => inputAction(index, value, item?.id)}
                />
              </div>
            </div>
          ))}

          <div className="mb-4">
            <Text.Title className="mt-4">Tổng mức tham gia</Text.Title>
            <div className="flex flex-wrap gap-2 mt-2 min-h-[30px]">
              {data?.map((i, index) => (
                <Text
                  key={index}
                  size="small"
                  className={`bg-sky-200 px-2 py-1 rounded-lg ${
                    !i || i?.quantity === 0 ? "hidden" : ""
                  }`}
                >
                  Mức {index + 1} x {i?.quantity}
                </Text>
              ))}
            </div>
          </div>
        </Box>
        <Box flex flexDirection="row" mt={1}>
          <Box style={{ flex: 1 }} pr={1}>
            <Button
              fullWidth
              variant="secondary"
              type="danger"
              onClick={() => action("cancel")}
            >
              Huỷ
            </Button>
          </Box>
          <Box style={{ flex: 1 }} pl={1}>
            <Button
              fullWidth
              onClick={() =>
                action(
                  "ok",
                  _.filter(data, (i) => i?.quantity > 0 && i)
                )
              }
            >
              Gửi đăng ký
            </Button>
          </Box>
        </Box>
      </Box>
    </Sheet>
  );
};

export default SheetJoinCampaignDisplay;
