import React from "react";
import { Sheet, Box, Button, Text } from "zmp-ui";
import StatusItemComponent from "./item";

const SheetStatusComponent = ({
  item,
  items,
  isVisible,
  action,
  isSetup = false,
}) => {
  return (
    <>
      <Sheet
        visible={isVisible}
        title="Trạng thái yêu cầu"
        onClose={() => action()}
        autoHeight
        mask
        handler
        swipeToClose
        unmountOnClose={true}
      >
        <Box p={4} className="bottom-sheet-body" style={{ overflowY: "auto" }}>
          <div className="p-4 border border-black rounded-xl text-4xl mt-2 flex justify-between items-center">
            <Text.Title size="large">Mã yêu cầu</Text.Title>
            <Text.Title size="small" className="text-gray-500">
              {isSetup ? item?.request_code : item?.code}
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
              {items.map((item, index) => (
                <StatusItemComponent
                  item={item}
                  key={index}
                  isSetup={isSetup}
                />
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
                onClick={() => action("close")}
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

export default SheetStatusComponent;
