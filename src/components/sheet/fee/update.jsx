import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Sheet, Box, Button, Text, Input } from "zmp-ui";
import { list } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { empty, validateItems } from "../../../utils";
import { DROPDOWN_ASSET } from "../../../utils/constApiRoute";
import {
  FEE_CATEGORIES,
  FEE_CATEGORY_DEVICES,
  FEE_CATEGORY_ITEMS,
  MOVE_FEES,
} from "../../../utils/enumDropdown";
import ListFeeComponent from "../../fee/repair";
import MoveFeeComponent from "../../fee/move";
import ModalApproveComponent from "../../modal/approve";
import Select2Component from "../../select2";
import { noticeErrorState } from "../../../store/notice";
import DistanceComponent from "../../distance";
import InfoFeeComponent from "../../info/fee";
import { isPCer } from "../../../services/hasPermission";
import { METHOD_PC_REPAIR } from "../../../utils/enumTicket";

// TODO Update api fee
const SheetUpdateFeeComponent = ({ item, isVisible, action }) => {
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [options, setOptions] = useState({
    fee_categories: [],
    fee_category_devices: [],
    move_fees: [],
  });

  const [data, setData] = useState({
    parent_fee_category_id: null,
    fee_category_id: null,
    note: "",
    distance_1: null,
    distance_2: null,
    repair_ticket_fee_details: [],
    repair_ticket_fee_details_other: [],
    move_ticket_fee_details: [],
  });

  const [fee, setFee] = useState({
    fee_repair_total: 0,
    fee_move_total: 0,
    fee_total: 0,
  });

  const [errors, setErrors] = useState({
    fee_category_id: false,
    repair_ticket_fee_details: false,
    move_ticket_fee_details: false,
  });

  const onUpdateFee = useCallback((type) => {
    setIsShowPopup(false);
    if (type === "cancel") return;

    if (!isValidated()) return;

    const itemAvailable = data.repair_ticket_fee_details
      .concat(data.repair_ticket_fee_details_other)
      .filter((item) => parseInt(item.quantity) > 0)
      .map((item) => ({ ...item, fee_category_item_id: item.value || null }));

    const moveItemAvailable = data.move_ticket_fee_details.filter(
      (item) => item.checked === true
    );

    const formData = {
      fee_category_id: data.fee_category_id,
      distance_1: data.distance_1,
      distance_2: data.distance_2,
      note: data.note,
      repair_ticket_fee_details: itemAvailable,
      move_ticket_fee_details: moveItemAvailable,
    };

    action("update", formData);
  });

  const onChangeMoveFee = (move_ticket_fee_details) => {
    const moveItems = move_ticket_fee_details.map((item) => ({
      ...item,
      move_fee_id: item.value,
      km: parseInt(item.quantity) ?? null,
    }));
    setData({ ...data, move_ticket_fee_details: moveItems });
  };

  const validateCategoryItems = () => {
    return _.every(data.repair_ticket_fee_details, (item) =>
      empty(item.quantity)
    );
  };

  const onActionItems = (type, item, value = 0) => {
    if (type === "error") {
      noticeError(item);
      return;
    }

    if (type === "changeOther") {
      setData({ ...data, repair_ticket_fee_details_other: item });
    }

    const newItems = [...data.repair_ticket_fee_details];
    if (type === "change") {
      newItems[item].quantity = value > 0 ? value : 0;
      setData({ ...data, repair_ticket_fee_details: newItems });
    }

    if (type === "add") {
      newItems.push(item);
      setData({ ...data, repair_ticket_fee_details_other: newItems });
    }

    if (type === "delete") {
      newItems.pop();
      setData({ ...data, repair_ticket_fee_details_other: newItems });
    }
  };

  const isValidated = () => {
    // If PC and method PC repair not use validated
    if (isPCer() && item?.method_type === METHOD_PC_REPAIR) return true;

    const textRequired = "Vui lòng chọn";
    const newErrors = {
      fee_category_id: empty(data.fee_category_id) && textRequired,
      repair_ticket_fee_details:
        validateItems(data.repair_ticket_fee_details, "quantity") &&
        textRequired,
      move_ticket_fee_details:
        validateItems(data.move_ticket_fee_details, "checked") && textRequired,
    };

    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
    setLoading(false);

    const isAllValidate = !Object.values(newErrors).some(Boolean);
    if (!isAllValidate) {
      action("error", "Vui lòng chọn đủ các trường bị thiếu");
      return false;
    }

    return true;
  };

  const getOption = async (option, data = {}) => {
    setLoading(true);
    await list(DROPDOWN_ASSET, { objects: option, ...data })
      .then((res) => {
        setOptions((currentOptions) => ({
          ...currentOptions,
          ...res.data?.options,
        }));
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isVisible || isLoaded) return;

    getOption([FEE_CATEGORIES, MOVE_FEES]);
    setIsLoaded(true);
  }, [isVisible]);

  useEffect(() => {
    if (!data.parent_fee_category_id) return;
    getOption([FEE_CATEGORY_DEVICES], {
      parent_id: data.parent_fee_category_id,
      level: 2,
    });
  }, [data.parent_fee_category_id]);

  const fetchCategoryItems = async () => {
    setLoading(true);
    await list(DROPDOWN_ASSET, {
      objects: [FEE_CATEGORY_ITEMS],
      fee_category_id: data.fee_category_id,
    })
      .then((res) => {
        setData({
          ...data,
          repair_ticket_fee_details: res.data?.options.fee_category_items,
        });
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!data.fee_category_id) {
      setData({
        ...data,
        repair_ticket_fee_details: [],
        repair_ticket_fee_details_other: [],
      });

      return;
    }

    fetchCategoryItems();
  }, [data.fee_category_id]);

  useEffect(() => {
    const totalFeeRepair = data.repair_ticket_fee_details.reduce(
      (total, item) => {
        const quantity = parseInt(item.quantity) || 0;
        const price = parseInt(item.price) || 0;
        return total + quantity * price;
      },
      0
    );

    const totalFeeRepairOther = data.repair_ticket_fee_details_other.reduce(
      (total, item) => {
        const quantity = parseInt(item.quantity) || 0;
        const price = parseInt(item.price) || 0;
        const priceLabor = parseInt(item.price_labor) || 0;
        return total + quantity * (price + priceLabor);
      },
      0
    );

    setFee((prevFee) => ({
      ...prevFee,
      fee_repair_total: totalFeeRepair + totalFeeRepairOther,
      fee_total: totalFeeRepair + totalFeeRepairOther + prevFee.fee_move_total,
    }));
  }, [data.repair_ticket_fee_details, data.repair_ticket_fee_details_other]);

  useEffect(() => {
    const totalMoveFee = data.move_ticket_fee_details.reduce((total, item) => {
      if (item.checked) {
        if (item.type === 1) {
          total += item.price;
        } else {
          const quantity = parseFloat(item.quantity) || 0;
          total += quantity * item.price;
        }
      }
      return total;
    }, 0);

    setFee((prevFee) => ({
      ...prevFee,
      fee_move_total: totalMoveFee,
      fee_total: totalMoveFee + prevFee.fee_repair_total,
    }));
  }, [data.move_ticket_fee_details]);

  return (
    <Sheet
      visible={isVisible}
      onClose={() => action("close")}
      height="95%"
      mask
      handler
      swipeToClose
      title="Cập nhật chi phí"
      p={2}
    >
      <Box
        className="bottom-sheet-body mb-2"
        style={{ overflowY: "auto" }}
        p={4}
      >
        <Box>
          <Text.Title size="small" className="my-3">
            Chọn tác vụ
          </Text.Title>
          <Select2Component
            placeholder="Sửa chữa / ..."
            options={options.fee_categories}
            onSelect={(value) =>
              setData({ ...data, parent_fee_category_id: value })
            }
          />
        </Box>

        <Box>
          <Text.Title size="small" className="my-3">
            Chọn loại thiết bị
          </Text.Title>
          <Select2Component
            placeholder="Tủ mát 1 cánh / ..."
            options={options.fee_category_devices}
            onSelect={(value) => setData({ ...data, fee_category_id: value })}
            isError={errors.fee_category_id}
            required={true}
          />
        </Box>

        {data.repair_ticket_fee_details.length > 0 && (
          <Box>
            <Box className="flex align-item-center justify-between">
              <Text.Title size="small" className="mt-5">
                Đơn vị sửa chữa
              </Text.Title>
              <Text.Title size="small" className="mt-5">
                Lựa chọn
              </Text.Title>
            </Box>
            <hr className="mt-3 bg-[#ddd] h-[2px]" />
            <ListFeeComponent
              items={data.repair_ticket_fee_details}
              action={(type, item, value) => {
                onActionItems(type, item, value);
              }}
              isAdd={true}
              placeholder="Tên đơn vị"
              errorTitle={errors.repair_ticket_fee_details}
              isShowError={errors.repair_ticket_fee_details}
            />
          </Box>
        )}

        <MoveFeeComponent
          options={options.move_fees}
          changeMoveFee={(value) => onChangeMoveFee(value)}
          isShowError={errors.move_ticket_fee_details}
          errorTitle={errors.move_ticket_fee_details}
        />

        <DistanceComponent
          loaded={isVisible}
          supplier={item?.supplier}
          outlet={item?.outlet}
          passValue={useCallback((valueDistance) => {
            setData((prevData) => ({
              ...prevData,
              distance_1: valueDistance?.distance_1,
              distance_2: valueDistance?.distance_2,
            }));
          })}
        />

        <InfoFeeComponent item={fee} />

        <Box mt={5}>
          <Text.Title size="small">Mô tả công việc </Text.Title>
          <Input.TextArea
            className="custom-class"
            placeholder="Nhập tình trạng công việc"
            value={data.note}
            onChange={(e) => setData({ ...data, note: e.target.value })}
            showCount={false}
          />
        </Box>
      </Box>
      <Box className="custom-bottom-sheet" flex flexDirection="row" p={4}>
        <Box style={{ flex: 1 }} pr={1}>
          <Button fullWidth variant="secondary" onClick={() => action("close")}>
            Huỷ
          </Button>
        </Box>
        <Box style={{ flex: 1 }} pl={1}>
          <Button fullWidth onClick={() => setIsShowPopup(true)}>
            Cập nhật
          </Button>
        </Box>
      </Box>

      <ModalApproveComponent
        isVisible={isShowPopup}
        action={(type) => onUpdateFee(type)}
        title="Đồng ý cập nhật"
      />
    </Sheet>
  );
};

export default SheetUpdateFeeComponent;
