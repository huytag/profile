import React, { useEffect, useState } from "react";
import { Sheet, Box, Button, Text, Select, Modal, Input } from "zmp-ui";
import AccordionComponent from "../../accordion";
import InfoCancelComponent from "../../info/cancel";
import InfoCodeComponent from "../../info/code";
import InfoDescriptionComponent from "../../info/description";
import InfoDeviceComponent from "../../info/device";
import InfoMediaComponent from "../../info/media";
import InfoStoreComponent from "../../info/store";
import InfoTablePriceComponent from "../../info/tablePrice";
import InfoTicketComponent from "../../info/ticket";
import StatusComponent from "../../status";

const MaintenanceDetailComponent = ({ item, action }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [isHiddenBottom, setIsHiddenBottom] = useState(false);
  const [note, setNote] = useState("");

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

  const listAcc = [
    {
      title: "Yêu cầu sửa chữa",
      component: <InfoTicketComponent item={item} />,
      key: "info",
      bg: true,
    },
    {
      title: "Luỹ kế hạng mục sửa chữa",
      component: <InfoTablePriceComponent units={units} ships={ships} />,
      key: "table_price",
      bg: true,
    },
  ];

  return (
    <>
      <Box className="bottom-sheet-body" style={{ overflowY: "auto" }}>
        <InfoCancelComponent item={item} />

        <AccordionComponent list={listAcc} />

        <div className="p-4 text-4xl mt-7 bg-white rounded-xl shadow-lg shadow-black-500/50">
          <Text.Title size="large" className="mb-2">
            Lựa chọn phương án
          </Text.Title>
          <Select
            size="lg"
            placeholder="Bảo hành / sửa chữa / thanh lý"
            clearable
            closeOnSelect={true}
          >
            <Select.Option value="Type 1" title="Bảo hành" />
            <Select.Option value="Type 2" title="Sửa chữa" />
            <Select.Option value="Type 3" title="Thanh lý" />
          </Select>

          <Text.Title size="large" className="mt-5 mb-2">
            Lựa chọn nhà cung cấp
          </Text.Title>
          <Select
            size="lg"
            placeholder="Chọn nhà cung cấp"
            clearable
            closeOnSelect={true}
          >
            <Select.Option value="Type 1" title="Nhà cung cấp A" />
            <Select.Option value="Type 2" title="Nhà cung cấp B" />
            <Select.Option value="Type 3" title="Nhà cung cấp C" />
          </Select>

          <Text.Title size="large" className="mt-5 mb-2">
            Lựa chọn kỹ thuật
          </Text.Title>
          <Select
            size="lg"
            placeholder="Kỹ thuật"
            clearable
            closeOnSelect={true}
          >
            <Select.Option value="Type 1" title="Nhà cung cấp A" />
            <Select.Option value="Type 2" title="Nhà cung cấp B" />
            <Select.Option value="Type 3" title="Nhà cung cấp C" />
          </Select>
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
              onClick={() => {
                setPopupVisible(true);
                setNote("");
              }}
            >
              Huỷ yêu cầu
            </Button>
          </Box>
          <Box style={{ flex: 1 }} pl={1}>
            <Button fullWidth onClick={() => action("confirm")}>
              Xác nhận
            </Button>
          </Box>
        </Box>
      </Box>

      {/* MODEL CANCEL */}
      <Modal
        visible={popupVisible}
        title="Nhập lí do huỷ yêu cầu"
        onClose={() => {
          setPopupVisible(false);
        }}
        verticalActions
      >
        <div>
          <Input.TextArea
            placeholder="Nhập lý do"
            clearable
            onChange={(e) => setNote(e.target.value)}
            value={note}
          />
        </div>
        <div className="grid grid-cols-2 auto-cols-fr gap-1 mt-4">
          <Button
            onClick={() => setPopupVisible(false)}
            fullWidth
            variant="tertiary"
          >
            Huỷ
          </Button>
          <Button
            onClick={() => {
              setPopupVisible(false);
              action("cancel", note);
            }}
            fullWidth
          >
            Xác nhận
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default MaintenanceDetailComponent;
