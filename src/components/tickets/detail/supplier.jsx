import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Box, Text, Input, DatePicker } from "zmp-ui";
import { list } from "../../../services/api";
import { hasPermission, userInfo } from "../../../services/hasPermission";
import { noticeErrorState } from "../../../store/notice";
import { DROPDOWN_ASSET, TICKETS } from "../../../utils/constApiRoute";
import { SUPPLIER_USERS } from "../../../utils/enumDropdown";
import * as Permission from "../../../utils/enumPermission";
import { METHOD_PC_REPAIR } from "../../../utils/enumTicket";
import Select2Component from "../../select2";
import SheetBottomNavigateComponent from "../../sheet/bottomNavigate";

const TicketApproveSupplierComopnent = ({ item }) => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const [isValidateOke, setIsValidateOke] = useState(false);
  const [options, setOptions] = useState([]);
  const [showError, setShowError] = useState({
    technician: false,
  });
  const [data, setData] = useState({
    technician_id: null,
    pc_user_id: userInfo?.id,
    estimate_date: moment().add(1, "day").format("YYYY-MM-DD"),
  });

  const actionValidate = () => {
    if (!data.technician_id && item?.method_type !== METHOD_PC_REPAIR) {
      noticeError("Vui lòng Chọn đủ các trường bị thiếu");
      setShowError({
        technician: !data.technician_id,
      });

      return;
    }

    if (
      moment().valueOf() > moment(data?.estimate_date, "YYYY-MM-DD").valueOf()
    ) {
      noticeError("Chọn ngày sau thời gian hiện tại");
      return;
    }

    setIsValidateOke(true);
  };

  const getDropDown = async () => {
    await list(DROPDOWN_ASSET, {
      objects: [SUPPLIER_USERS],
      supplier_id: item?.supplier?.id,
    })
      .then((response) => {
        setOptions(response.data.options.supplier_users);
      })
      .catch((error) => noticeError(error?.message));
  };

  useEffect(() => {
    getDropDown();
  }, []);

  return (
    <>
      {!hasPermission([
        ...Permission.perTicketDefault,
        Permission.PER_ASSET_TICKET_TECHNICAL,
      ]) && (
        <Box>
          <div className="p-4 text-4xl mt-7 bg-white rounded-xl shadow-lg shadow-black-500/50">
            <Text.Title size="large" className="mb-2">
              Phương Án đã chọn
            </Text.Title>
            <Input
              value={item?.method_type_text}
              className="pointer-events-none bg-gray-200"
            />
            {item?.method_type !== METHOD_PC_REPAIR && (
              <>
                <Text.Title size="large" className="mt-5 mb-2">
                  Nhà cung cấp đã chọn
                </Text.Title>
                <Input
                  value={item?.supplier?.name}
                  className="pointer-events-none bg-gray-200"
                />

                <Text.Title size="large" className="mt-5 mb-2">
                  Lựa chọn nhân viên bảo trì
                </Text.Title>
                <Select2Component
                  placeholder="Chọn nhân viên bảo trì"
                  options={options}
                  isError={showError.technician}
                  required={true}
                  index="user_id"
                  onSelect={(value) =>
                    setData({
                      ...data,
                      technician_id: value,
                    })
                  }
                />
              </>
            )}

            <Text.Title size="large" className="mt-5 mb-2">
              Lịch dự kiến
            </Text.Title>
            <DatePicker
              mask
              maskClosable
              dateFormat="dd/mm/yyyy"
              title="Chọn lịch dự kiến"
              defaultValue={new Date(Date.now() + 3600 * 1000 * 24)}
              onChange={(value) =>
                setData({
                  ...data,
                  estimate_date: moment(value).format("YYYY-MM-DD"),
                })
              }
            />
          </div>
        </Box>
      )}

      <SheetBottomNavigateComponent
        id={item?.id}
        urlConfirm={`${TICKETS}/${item?.id}/${
          item?.method_type == METHOD_PC_REPAIR
            ? "update-calender"
            : "confirm-supplier"
        }`}
        titleConfirm="Xác nhận"
        permissionsConfirm={[
          ...Permission.perTicketDefault,
          Permission.PER_ASSET_TICKET_TECHNICAL,
        ]}
        isValidate={true}
        isValidateOke={isValidateOke}
        isHiddenCancel
        actionValidate={actionValidate}
        dataConfirm={data}
      />
    </>
  );
};

export default TicketApproveSupplierComopnent;
