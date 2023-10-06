import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Sheet, Box, Button, Text, Input, DatePicker } from "zmp-ui";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { mediaImagesState, mediaVideosState } from "../../../store/media";
import UploadMediaTicketComponent from "../../upload/ticket";
import { create, list } from "../../../services/api";
import {
  DROPDOWN_ASSET,
  DROPDOWN_AUTH,
  TICKETS,
} from "../../../utils/constApiRoute";
import { empty } from "../../../utils";
import Select2Component from "../../select2";
import {
  PC_USERS,
  SUPPLIERS,
  TICKET_METHOD_TYPES,
} from "../../../utils/enumDropdown";
import {
  METHOD_LIQUIDATION,
  METHOD_PC_REPAIR,
} from "../../../utils/enumTicket";
import { isPCer, userInfo } from "../../../services/hasPermission";
import _ from "lodash";
import moment from "moment";

const SheetCreateTicketComponent = ({ id, address, isVisible, action }) => {
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);
  const imagesStore = useRecoilValue(mediaImagesState);
  const videosStore = useRecoilValue(mediaVideosState);
  const [options, setOptions] = useState([]);
  const [content, setContent] = useState("");
  const [dataOptions, setDataOptions] = useState({
    method: null,
    supplier: null,
    pc_users: userInfo?.id,
    estimate_date: moment().add(1, "day").format("YYYY-MM-DD"),
  });
  const [errors, setErrors] = useState();
  const isPC = isPCer();

  const isValidate = () => {
    if (!isPC) {
      return true;
    }

    if (dataOptions?.method === METHOD_LIQUIDATION) {
      return true;
    }

    if (dataOptions.method === METHOD_PC_REPAIR) {
      if (!dataOptions.pc_users) {
        setErrors({
          pc_users: !dataOptions.pc_users,
        });
        noticeError("Vui lòng chọn các trường bị thiếu!");
        return false;
      }

      if (
        dataOptions?.estimate_date &&
        moment().valueOf() > dataOptions?.estimate_date.valueOf()
      ) {
        console.log(moment(dataOptions?.estimate_date, "dd/mm/yyyy").valueOf());
        noticeError("Lịch dự kiến sau thời gian hiện tại");
        return false;
      }

      return true;
    }

    if (!dataOptions.method || !dataOptions.supplier) {
      setErrors({
        method: !dataOptions.method,
        supplier: !dataOptions.supplier,
      });

      noticeError("Vui lòng chọn các trường bị thiếu!");
      return false;
    }

    return true;
  };

  const createTicket = () => {
    if (!isValidate()) return;

    // setLoading(true);

    const data = {
      ...address,
      item_id: id,
      content,
      images: imagesStore,
      videos: videosStore,
    };

    if (isPCer()) {
      _.merge(data, {
        method_type: dataOptions.method,
        supplier_id: dataOptions.supplier ?? null,
        pc_user_id: dataOptions.pc_users ?? null,
        estimate_date: dataOptions?.estimate_date
          ? moment(dataOptions?.estimate_date).format("YYYY-MM-DD")
          : null,
      });
    }

    create(TICKETS, data)
      .then(() => {
        noticeSuccess("Tạo yêu cầu thành công.");
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => {
        setLoading(false);
        action("oke");
      });
  };

  const getOptions = async () => {
    await list(DROPDOWN_ASSET, {
      objects: [TICKET_METHOD_TYPES, SUPPLIERS],
    })
      .then((response) =>
        setOptions((options) => ({ ...options, ...response?.data.options }))
      )
      .catch((error) => noticeError(error?.message));

    await list(DROPDOWN_AUTH, {
      objects: [PC_USERS],
    })
      .then((response) =>
        setOptions((options) => ({ ...options, ...response?.data.options }))
      )
      .catch((error) => noticeError(error?.message));
  };

  useEffect(() => {
    if (isPC) {
      getOptions();
    }
  }, []);

  useEffect(() => {
    setContent("");
    setErrors("");
  }, [isVisible]);

  return (
    <>
      <Sheet
        visible={isVisible}
        title="Yêu cầu sữa chữa"
        onClose={() => action("cancel")}
        autoHeight
        mask
        handler
        swipeToClose
        unmountOnClose={true}
      >
        <Box
          p={4}
          className="bottom-sheet-body"
          style={{ overflowY: "auto", overflowX: "hidden" }}
        >
          <Text.Title size="small" className="mt-5">
            Mô tả tình trạng hư hỏng
          </Text.Title>
          <Input.TextArea
            className="custom-class"
            placeholder="Nhập tình trạng sản phẩm"
            showCount={false}
            onChange={(e) => setContent(e.target.value)}
          />

          {isPC && (
            <div>
              <Text.Title size="small" className="mt-5 mb-2">
                Lựa chọn phương án
              </Text.Title>
              <Select2Component
                options={options?.ticket_method_types}
                placeholder="Chọn phương án"
                required={true}
                isError={errors?.method}
                onSelect={(value) =>
                  setDataOptions({
                    ...dataOptions,
                    method: value,
                    pc_users: value === METHOD_PC_REPAIR ? userInfo?.id : null,
                  })
                }
              />
              {dataOptions?.method !== METHOD_LIQUIDATION &&
                dataOptions?.method !== METHOD_PC_REPAIR && (
                  <div>
                    <Text.Title size="small" className="mt-5 mb-2">
                      Lựa chọn nhà cung cấp
                    </Text.Title>
                    <Select2Component
                      options={options?.suppliers}
                      placeholder="Chọn nhà cung cấp"
                      required={true}
                      isError={errors?.supplier}
                      onSelect={(value) =>
                        setDataOptions({ ...dataOptions, supplier: value })
                      }
                    />
                  </div>
                )}
              {dataOptions?.method === METHOD_PC_REPAIR && (
                <div>
                  <Text.Title size="small" className="mt-5 mb-2">
                    Lựa chọn PC sửa chữa
                  </Text.Title>
                  <Select2Component
                    options={options?.pc_users}
                    placeholder="Chọn PC sửa chữa"
                    required={true}
                    isError={errors?.pc_users}
                    defaultValue={_.find(
                      options?.pc_users,
                      (i) => i.value === userInfo?.id
                    )}
                    onSelect={(value) =>
                      setDataOptions({ ...dataOptions, pc_users: value })
                    }
                  />

                  {dataOptions?.pc_users === userInfo?.id && (
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
                          setDataOptions({
                            ...dataOptions,
                            estimate_date: moment(value).format("YYYY-MM-DD"),
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <UploadMediaTicketComponent />

          <Text.Title size="small" className="mt-5">
            Địa chỉ
          </Text.Title>
          <Text size="small" className="ml-3">
            {address?.item_address}
          </Text>
        </Box>
        <Box p={4} className="custom-bottom-sheet" flex flexDirection="column">
          <Box flex flexDirection="row" mt={1}>
            <Box style={{ flex: 1 }} pr={1}>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => action("cancel")}
              >
                Huỷ yêu cầu
              </Button>
            </Box>
            <Box style={{ flex: 1 }} pl={1}>
              <Button
                fullWidth
                disabled={empty(content) || imagesStore.length < 1}
                onClick={() => createTicket()}
              >
                Gửi yêu cầu
              </Button>
            </Box>
          </Box>
        </Box>
      </Sheet>
    </>
  );
};

export default SheetCreateTicketComponent;
