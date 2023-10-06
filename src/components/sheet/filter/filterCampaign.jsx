import moment from "moment";
import React, { useEffect, useState } from "react";
import { Sheet, Box, Button, Text, Input, DatePicker } from "zmp-ui";

const SheetFilterCampaignComponent = ({
  isVisible,
  filter = {},
  hiddenFilterDay = false,
  action,
}) => {
  const [data, setData] = useState(filter);

  useEffect(() => {
    setData(filter);
  }, [filter]);

  return (
    <>
      <Sheet
        visible={isVisible}
        onClose={() => action("cancel")}
        autoHeight
        mask
        handler
        swipeToClose
        title="Bộ lọc"
      >
        <Box p={2} className="bottom-sheet-body" style={{ overflowY: "auto" }}>
          <Box p={1} className="mb-3">
            <Text size="large" bold>
              Nhập từ khoá
            </Text>
            <Input
              type="text"
              placeholder=""
              clearable
              value={data?.keyword}
              onChange={(e) => {
                setData({
                  ...data,
                  keyword: e.target.value,
                });
              }}
            />
          </Box>

          {!hiddenFilterDay && (
            <Box className="flex justify-between items-center">
              <Box p={1}>
                <Text size="large" bold className="mb-3">
                  Từ ngày
                </Text>
                <DatePicker
                  mask
                  maskClosable
                  placeholder=" "
                  onChange={(value) => {
                    setData((prev) => ({
                      ...prev,
                      start_date: moment(value).format("YYYY-MM-DD"),
                    }));
                  }}
                  onVisibilityChange={(value) => {
                    value &&
                      setData((prev) => ({
                        ...prev,
                        start_date: moment().format("YYYY-MM-DD"),
                      }));
                  }}
                  inputClass={!data?.start_date && "custom-picker"}
                />
              </Box>

              <Box p={1}>
                <Text size="large" bold className="mb-3">
                  Đến ngày
                </Text>
                <DatePicker
                  mask
                  maskClosable
                  placeholder=" "
                  onChange={(value) => {
                    setData((prev) => ({
                      ...prev,
                      end_date: moment(value).format("YYYY-MM-DD"),
                    }));
                  }}
                  onVisibilityChange={(value) => {
                    value &&
                      setData((prev) => ({
                        ...prev,
                        end_date: moment().format("YYYY-MM-DD"),
                      }));
                  }}
                  inputClass={!data?.end_date && "custom-picker"}
                />
              </Box>
            </Box>
          )}

          <Box
            className="custom-bottom-sheet pb-2"
            flex
            flexDirection="row"
            mt={1}
          >
            <Box style={{ flex: 1 }} pr={1}>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => action("cancel")}
              >
                Huỷ
              </Button>
            </Box>
            <Box style={{ flex: 1 }} pl={1}>
              <Button fullWidth onClick={() => action("ok", data)}>
                Áp dụng
              </Button>
            </Box>
          </Box>
        </Box>
      </Sheet>
    </>
  );
};

export default SheetFilterCampaignComponent;
