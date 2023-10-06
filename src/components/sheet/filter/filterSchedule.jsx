import React, { useEffect, useState } from "react";
import { Sheet, Box, Button, Text, Checkbox } from "zmp-ui";

const SheetFilterScheduleComponent = ({
  item,
  filterActive = 0,
  isVisible,
  action,
}) => {
  const [options, setOptions] = useState({
    checkbox: [],
  });

  const confirm = () => {
    action("filter", options.checkbox);
    return;
  };

  const onChangeChecked = (e) => {
    const { value, checked } = e.target;
    const { checkbox } = options;

    if (checked) {
      setOptions({
        checkbox: [...checkbox, value],
      });
    } else {
      setOptions({
        checkbox: checkbox.filter((e) => e !== value),
      });
    }
  };

  useEffect(() => {
    setOptions({ checkbox: [] });
  }, [filterActive]);

  return (
    <>
      <Sheet
        visible={isVisible}
        onClose={() => action("close")}
        autoHeight
        mask
        handler
        swipeToClose
        title="Bộ lọc tìm kiếm"
        p={2}
      >
        <Box p={4} className="custom-bottom-sheet" flex flexDirection="column">
          <Box
            className="bottom-sheet-body pb-10"
            style={{ overflowY: "auto" }}
          >
            <Text.Title>Theo trạng thái</Text.Title>
            <Box className="grid grid-cols-1 custom-checkbox-hidden mt-4">
              {item?.map((status, index) => {
                if (status.value === filterActive) {
                  return (
                    <Box mt={3} key={index}>
                      <Text.Title size="small">{status.label}</Text.Title>
                      <div className="grid grid-cols-3">
                        {status?.children.map((sub_status, index) => {
                          return (
                            <Checkbox
                              pr={1}
                              key={index}
                              value={sub_status.value}
                              name="sub_status"
                              className="text-gray-700 mr-3 my-2"
                              onChange={(e) => onChangeChecked(e)}
                              size="small"
                              options={sub_status.children}
                            >
                              {sub_status.label}
                            </Checkbox>
                          );
                        })}
                      </div>
                    </Box>
                  );
                }
              })}
            </Box>
          </Box>
          <Box flex flexDirection="row" mt={1}>
            <Box style={{ flex: 1 }} pr={1}>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => action("close")}
              >
                Huỷ
              </Button>
            </Box>
            <Box style={{ flex: 1 }} pl={1}>
              <Button fullWidth onClick={() => confirm()}>
                Áp dụng
              </Button>
            </Box>
          </Box>
        </Box>
      </Sheet>
    </>
  );
};

export default SheetFilterScheduleComponent;
