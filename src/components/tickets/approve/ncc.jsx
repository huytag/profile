import React, { useEffect, useState } from "react";
import { Sheet, Box, Button, Text, Input } from "zmp-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarPlus } from "@fortawesome/free-regular-svg-icons";
import InfoCodeComponent from "../../info/code";
import InfoDescriptionComponent from "../../info/description";
import InfoDeviceComponent from "../../info/device";
import InfoMediaComponent from "../../info/media";
import InfoStoreComponent from "../../info/store";
import InfoTablePriceComponent from "../../info/tablePrice";
import StatusComponent from "../../status";
import SheetDatePicker from "../../sheet/datePicker";
import InfoTicketComponent from "../../info/ticket";
// import SheetDatePicker from "../../datePicker";
// import SheetTimeline from "../../timelilne";

const MaintenanceNccDetailComponent = ({ item, action }) => {
  const [isShowSheet, setIsShowSheet] = useState(false);
  const [isHiddenBottom, setIsHiddenBottom] = useState(false);

  const units = [
    {
      title: "quat gio 12mm",
      price: "200,000",
    },
    {
      title: "dan lanh abcxyz",
      price: "450,000",
    },
    {
      title: "canh tu",
      price: "300,000",
    },
  ];

  const ships = [
    {
      title: "2km",
      price: "20,000",
    },
    {
      title: "6km",
      price: "50,000",
    },
  ];

  const onFocus = () => {
    console.log("1231313312");
    setIsShowSheet(true);
  };

  const actionSheet = (time) => {
    setIsShowSheet(false);

    console.log(time);
  };

  return (
    <>
      <Box p={4} className="bottom-sheet-body" style={{ overflowY: "auto" }}>
        <div className="bg-white rounded-xl shadow-lg shadow-black-500/50">
          <Text.Title size="large" className="px-4 pb-0 pt-5">
            Yêu cầu sửa chữa
          </Text.Title>
          <InfoTicketComponent item={item} />
        </div>
        {/* div done sec 1 */}

        <div className="bg-white rounded-xl shadow-lg shadow-black-500/50 px-4 py-8 mt-5">
          <Text.Title size="large" className="mb-2">
            Phương án đã chọn
          </Text.Title>
          <Input
            type="text"
            placeholder="Bảo hành / sửa chữa"
            defaultValue="Bảo hành / sửa chữa"
            className="pointer-events-none"
          />

          <Text.Title size="large" className="mt-3 mb-2">
            Nhà cung cấp đã chọn
          </Text.Title>
          <Input
            type="text"
            placeholder="Nhà cung cấp 1"
            defaultValue="Nhà cung cấp 1"
            className="pointer-events-none"
          />

          <Text.Title size="large" className="mt-3 mb-2">
            Nhân viên bảo trì
          </Text.Title>
          <Input
            type="text"
            placeholder="Nhân viên A"
            defaultValue="Nhân viên A"
            className="pointer-events-none"
          />

          <Text.Title size="large" className="mt-5 mb-2">
            Lịch dự kiến
          </Text.Title>
          <div
            className="h-[48px] border rounded-lg flex items-center justify-between p-3"
            onClick={onFocus}
          >
            <Text size="small" className="text-gray-700">
              13/06/2023 08:00
            </Text>
            <FontAwesomeIcon icon={faCalendarPlus} />
          </div>
        </div>
      </Box>
      <Box
        p={4}
        className={`custom-bottom-sheet fixed bottom-0 left-0 w-full bg-white ${
          isHiddenBottom ? "-z-40" : ""
        }`}
        flex
        flexDirection="column"
      >
        <Box flex flexDirection="row" mt={1}>
          <Box style={{ flex: 1 }} pr={1}>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => action("cancel")}
            >
              Trả yêu cầu
            </Button>
          </Box>
          <Box style={{ flex: 1 }} pl={1}>
            <Button fullWidth onClick={() => action("ok")}>
              Xác nhận
            </Button>
          </Box>
        </Box>
      </Box>
      {/* show celendar */}
      <SheetDatePicker isVisible={isShowSheet} action={actionSheet} />
    </>
  );
};

export default MaintenanceNccDetailComponent;
