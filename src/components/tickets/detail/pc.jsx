import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useSetRecoilState } from "recoil";
import { Box, DatePicker, Text } from "zmp-ui";
import { noticeErrorState } from "../../../store/notice";
import { isPCer, userInfo } from "../../../services/hasPermission";
import moment from "moment";
import * as Permission from "../../../utils/enumPermission";
import Select2Component from "../../select2";
import SheetBottomNavigateComponent from "../../sheet/bottomNavigate";
import { list } from "../../../services/api";
import {
  DROPDOWN_ASSET,
  DROPDOWN_AUTH,
  TICKETS,
} from "../../../utils/constApiRoute";
import {
  PC_USERS,
  SUPPLIERS,
  TICKET_METHOD_TYPES,
} from "../../../utils/enumDropdown";
import {
  METHOD_LIQUIDATION,
  METHOD_PC_REPAIR,
} from "../../../utils/enumTicket";
import { showNavigationState } from "../../../store/navigation";

const TicketApprovePcComopnent = ({ item }) => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const setShowNavBottom = useSetRecoilState(showNavigationState);
  const [isValidateOke, setIsValidateOke] = useState(false);
  const [showError, setShowError] = useState({
    method_type: false,
    supplier_id: false,
    pc_user_id: false,
    estimate_date: false,
  });
  const [data, setData] = useState({
    method_type: null,
    supplier_id: null,
    pc_user_id: userInfo?.id,
    estimate_date: moment().add(1, "day").format("YYYY-MM-DD"),
  });
  const [dropdowns, setDropdowns] = useState([]);

  const actionValidate = () => {
    if (data.method_type === METHOD_LIQUIDATION || isPCer()) {
      setIsValidateOke(true);
      return;
    }

    if (!data.method_type || !data.supplier_id) {
      noticeError("Vui lòng Chọn đủ các trường bị thiếu");

      setShowError({
        method_type: !data.method_type,
        supplier_id: !data.supplier_id,
      });

      return;
    }

    setIsValidateOke(true);
  };

  const getDropDown = async () => {
    await list(DROPDOWN_ASSET, {
      objects: [SUPPLIERS, TICKET_METHOD_TYPES],
    })
      .then((response) => {
        setDropdowns((options) => ({ ...options, ...response?.data.options }));
      })
      .catch((error) => noticeError(error?.message));

    await list(DROPDOWN_AUTH, {
      objects: [PC_USERS],
    })
      .then((response) =>
        setDropdowns((options) => ({ ...options, ...response?.data.options }))
      )
      .catch((error) => noticeError(error?.message));
  };

  useEffect(() => {
    getDropDown();
    if (!item?.can_cancel) setShowNavBottom(true);
  }, []);

  return (
    <>
      {item?.can_approve_2 && (
        <Box>
          <div className="p-4 text-4xl mt-7 bg-white rounded-xl shadow-lg shadow-black-500/50">
            <Text.Title size="large" className="mb-2">
              Lựa chọn phương án
            </Text.Title>
            <Select2Component
              placeholder="Bảo hành/ sửa chữa/ thanh lý"
              options={dropdowns?.ticket_method_types}
              isError={showError.method}
              required={true}
              onSelect={(value) =>
                setData({
                  ...data,
                  method_type: value,
                })
              }
            />

            {data?.method_type !== METHOD_LIQUIDATION &&
              data?.method_type !== METHOD_PC_REPAIR && (
                <>
                  <Text.Title size="large" className="mt-5 mb-2">
                    Lựa chọn nhà cung cấp
                  </Text.Title>
                  <Select2Component
                    placeholder="Chọn nhà cung cấp"
                    options={dropdowns?.suppliers}
                    isError={showError.supplier}
                    required={true}
                    onSelect={(value) =>
                      setData({
                        ...data,
                        supplier_id: value,
                      })
                    }
                  />
                </>
              )}

            {data?.method_type === METHOD_PC_REPAIR && (
              <div>
                <Text.Title size="small" className="mt-5 mb-2">
                  Lựa chọn PC sửa chữa
                </Text.Title>
                <Select2Component
                  options={dropdowns?.pc_users}
                  placeholder="Chọn PC sửa chữa"
                  required={true}
                  isError={showError?.pc_user_id}
                  defaultValue={_.find(
                    dropdowns?.pc_users,
                    (i) => i.value === data?.pc_user_id
                  )}
                  onSelect={(value) =>
                    setData((prev) => ({ ...prev, pc_user_id: value }))
                  }
                />

                {data?.pc_user_id === userInfo?.id && (
                  <div>
                    <Text.Title size="small" className="mt-5 mb-2">
                      Chọn lịch dự kiến
                    </Text.Title>
                    <DatePicker
                      mask
                      maskClosable
                      locale="vi"
                      dateFormat="dd/mm/yyyy"
                      defaultValue={new Date(Date.now() + 3600 * 1000 * 24)}
                      onChange={(value) =>
                        setData({
                          ...data,
                          estimate_date: moment(value).format("YYYY-MM-DD"),
                        })
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </Box>
      )}

      {item?.can_cancel && (
        <SheetBottomNavigateComponent
          id={item?.id}
          urlCancel={`${TICKETS}/${item?.id}/cancel`}
          urlConfirm={`${TICKETS}/${item?.id}/confirm`}
          permissionsCancel={[
            ...Permission.perTicketDefault,
            Permission.PER_ASSET_TICKET_DELETE,
          ]}
          permissionsConfirm={[
            ...Permission.perTicketDefault,
            Permission.PER_ASSET_TICKET_APPROVE_2,
          ]}
          isValidate={true}
          isValidateOke={isValidateOke}
          actionValidate={actionValidate}
          dataConfirm={
            data?.method_type === 3 ? { method_type: data?.method_type } : data
          }
        />
      )}
    </>
  );
};

export default TicketApprovePcComopnent;
