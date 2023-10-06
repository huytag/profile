import _ from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Sheet, Box, Button, Text, DatePicker } from "zmp-ui";
import useDropdown from "../../../hook/dropdown/useDropdown";
import { showNavigationState } from "../../../store/navigation";
import { noticeErrorState } from "../../../store/notice";
import { DROPDOWN_ASSET, DROPDOWN_AUTH } from "../../../utils/constApiRoute";
import { PC_USERS, SUPPLIER_USERS } from "../../../utils/enumDropdown";
import { METHOD_PC_REPAIR } from "../../../utils/enumTicket";
import Select2Component from "../../select2";

const SheetDatePickerComponent = ({ item, isVisible, action }) => {
  const hiddenBottom = useSetRecoilState(showNavigationState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const { options, getOptions } = useDropdown();
  const [formData, setFormData] = useState({
    estimate_date: moment(item?.estimate_date).format("YYYY-MM-DD"),
    technician_id: item?.technician_id,
    pc_user_id: item?.pc_user_id,
  });

  const confirm = () => {
    if (
      moment().valueOf() >
      moment(formData.estimate_date, "DD/MM/YYYY").valueOf()
    ) {
      noticeError("Vui lòng thời gian sau thời gian hiện tại!");
      return;
    }

    if (item?.method_type == METHOD_PC_REPAIR && !item?.can_update_pc_user) {
      action("oke", _.pick(formData, ["estimate_date"]));
      return;
    }

    action("oke", formData);
  };

  useEffect(() => {
    if (item?.method_type != METHOD_PC_REPAIR) {
      getOptions(DROPDOWN_ASSET, [SUPPLIER_USERS], {
        supplier_id: item?.supplier?.id,
      });
    } else {
      getOptions(DROPDOWN_AUTH, [PC_USERS]);
    }
  }, []);

  useEffect(() => {
    hiddenBottom(!isVisible);
  }, [isVisible]);

  return (
    <>
      <Sheet
        title="Thay đổi lịch hẹn"
        visible={isVisible}
        onClose={() => action("cancel")}
        autoHeight
        mask
        handler
        swipeToClose
        unmountOnClose
      >
        <Box p={4} className="custom-bottom-sheet" flex flexDirection="column">
          <Box className="bottom-sheet-body pb-8" style={{ overflowY: "auto" }}>
            <Text.Title size="large" className="mb-4">
              Chọn lịch hẹn
            </Text.Title>
            <DatePicker
              mask
              maskClosable
              dateFormat="dd/mm/yyyy"
              title="Chọn lịch"
              helperText="Lưu ý khi thay đổi lịch thì ticket sẽ bị quay về trạng thái ban đầu"
              defaultValue={new Date(moment(item?.estimate_date, "YYYY-MM-DD"))}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  estimate_date: moment(value).format("YYYY-MM-DD"),
                }))
              }
            />

            {item?.method_type !== METHOD_PC_REPAIR ? (
              <>
                <Text.Title size="large" className="my-4">
                  Chọn kỹ thuật viên
                </Text.Title>
                <Select2Component
                  options={options?.supplier_users}
                  index="user_id"
                  defaultValue={_.find(
                    options?.supplier_users,
                    (i) => i.user_id === item?.technician_id
                  )}
                  onSelect={(e) =>
                    setFormData((prev) => ({ ...prev, technician_id: e }))
                  }
                />
              </>
            ) : (
              item?.can_update_pc_user && (
                <>
                  <Text.Title size="small" className="mt-5 mb-2">
                    Lựa chọn PC sửa chữa
                  </Text.Title>
                  <Select2Component
                    options={options?.pc_users}
                    placeholder="Chọn PC sửa chữa"
                    index="value"
                    defaultValue={_.find(
                      options?.pc_users,
                      (i) => i.value === item?.pc_user_id
                    )}
                    onSelect={(value) =>
                      setFormData((prev) => ({ ...prev, pc_user_id: value }))
                    }
                  />
                </>
              )
            )}
          </Box>

          <Box flex flexDirection="row" mt={1}>
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
              <Button fullWidth onClick={() => confirm()}>
                Thay đổi
              </Button>
            </Box>
          </Box>
        </Box>
      </Sheet>
    </>
  );
};

export default SheetDatePickerComponent;
