import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Sheet, Box, Button, Text, DatePicker } from "zmp-ui";
import { list } from "../../../services/api";
import { noticeErrorState } from "../../../store/notice";
import { DROPDOWN_ASSET } from "../../../utils/constApiRoute";
import { SUPPLIER_USERS } from "../../../utils/enumDropdown";
import Select2Component from "../../select2";

const SheetSelectRepairCalendar = ({ itemSelected, isVisible, action }) => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const [options, setOptions] = useState([]);
  const [data, setData] = useState({
    technician_id: null,
    estimate_date: null,
  });
  const [showError, setShowError] = useState({
    technician: false,
  });

  const onDataPicker = (value) => {
    const estimate_date = moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
    setData({ ...data, estimate_date });
  };

  const getDropDown = async () => {
    await list(DROPDOWN_ASSET, {
      objects: [SUPPLIER_USERS],
      supplier_id: JSON.parse(localStorage.getItem("userInfo"))?.id,
    })
      .then((response) => {
        setOptions(response.data.options.supplier_users);
      })
      .catch((error) => noticeError(error?.message));
  };

  useEffect(() => {
    if (!isVisible) return;
    getDropDown();
  }, [isVisible]);

  return (
    <>
      <Sheet
        visible={isVisible}
        title="Chọn thao tác"
        onClose={() => action("cancel")}
        autoHeight
        mask
        handler
        swipeToClose
        unmountOnClose={true}
      >
        <Box p={4} className="body-bottom-sheet" flex flexDirection="column">
          <Text.Title size="large" className="mt-5 mb-2">
            Lựa chọn nhân viên bảo trì
          </Text.Title>
          <Select2Component
            placeholder="Chọn nhà cung cấp"
            options={options}
            isError={showError.technician}
            required={true}
            onSelect={(value) =>
              setData({
                ...data,
                technician_id: value,
              })
            }
          />

          <Text.Title size="large" className="mt-5 mb-2">
            Chọn lịch dự kiến
          </Text.Title>
          <DatePicker
            mask
            maskClosable
            locale="vi"
            dateFormat="dd/mm/yyyy"
            onChange={(value) => onDataPicker(value)}
          />
        </Box>
        <Box p={4} className="custom-bottom-sheet" flex flexDirection="column">
          <Box flex flexDirection="row" mt={1}>
            <Box style={{ flex: 1 }} pr={1}>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => action("cancel")}
              >
                Quay lại
              </Button>
            </Box>
            <Box style={{ flex: 1 }} pr={1}>
              <Button
                fullWidth
                onClick={() => {
                  action("ok", data);
                }}
                disabled={!data.estimate_date || !data.technician_id}
              >
                Cập nhật
              </Button>
            </Box>
          </Box>
        </Box>
      </Sheet>
    </>
  );
};

export default SheetSelectRepairCalendar;
