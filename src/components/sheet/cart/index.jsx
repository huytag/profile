import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Sheet, Box, Button, useNavigate, Text, Input, Icon } from "zmp-ui";
import { create, update } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { setOrderDefaultState } from "../../../store/order";
import { format_currency } from "../../../utils";
import * as EnumApi from "../../../utils/constApiRoute";
import InputQuantity from "../../input/quantity";

const SheetCartComponent = ({
  isVisible = false,
  items,
  note,
  isEdit,
  idOrder,
  action,
}) => {
  const navigate = useNavigate();
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const resetOrderState = useSetRecoilState(setOrderDefaultState);
  const [orders, setOrders] = useState([]);

  const createOrder = () => {
    if (!orders.length) {
      return noticeError("Vui lòng chọn sản phẩm");
    }

    setLoading(true);
    isEdit ? handleUpdate() : handleCreate();
  };

  const handleCreate = () => {
    create(EnumApi.ORDER_CREATE, {
      products: orders,
      note: note,
    })
      .then((res) => {
        noticeSuccess("Tạo mới đơn hàng thành công");
        navigate(`/order/${res.data.id}`);
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  const handleUpdate = () => {
    update(EnumApi.ORDER_CREATE, idOrder, { products: orders, note: note })
      .then((res) => {
        noticeSuccess("Cập nhật đơn hàng thành công");
        resetOrderState();
        navigate(`/order/${idOrder}`);
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  const handleDelete = (index) => {
    const newOrders = [...orders];
    newOrders.splice(index, 1);

    setOrders(newOrders);
  };

  const handleQuantity = (key, index, value) => {
    const newOrders = [...orders];
    newOrders[index] = {
      ...newOrders[index],
      [key]: value,
    };

    setOrders(newOrders);
  };

  useEffect(() => {
    isVisible ? setOrders(items) : action("cancel", orders);
  }, [isVisible]);

  return (
    <Sheet
      title="Hàng đã đặt"
      visible={isVisible}
      onClose={() => action("cancel", orders)}
      autoHeight
      mask
      handler
      swipeToClose
      unmountOnClose
    >
      <Box
        className="bottom-sheet-body pb-8"
        p={4}
        style={{ overflowY: "auto" }}
      >
        {orders.map((i, index) => (
          <div
            key={index}
            className="flex items-center gap-2 border-b-2 py-5 border-dashed border-black"
          >
            <div>
              <Text className="bg-sky-400 inline-block px-3 py-1 text-white rounded-lg">
                {i?.code}
              </Text>
              <Text.Title>{i?.name}</Text.Title>
              <Text>Đơn giá: {format_currency(i?.price)}</Text>
              <div className="flex mt-2 gap-2">
                <div>
                  <Text>Thùng: </Text>
                  <InputQuantity
                    value={i.quantity_boxes}
                    action={(e) => handleQuantity("quantity_boxes", index, e)}
                  />
                </div>
                <div>
                  <Text>Hộp: </Text>
                  <InputQuantity
                    value={i.quantity_bins}
                    action={(e) => handleQuantity("quantity_bins", index, e)}
                  />
                </div>
              </div>
            </div>
            <div className="ml-auto text-red-600">
              <Icon
                icon="zi-delete"
                size={35}
                onClick={() => handleDelete(index)}
              />
            </div>
          </div>
        ))}

        <Text.Title className="mt-5">Ghi chú</Text.Title>
        <Input.TextArea
          className="bg-gray-200 pointer-events-none"
          value={note}
        />
      </Box>
      <Box flex flexDirection="row" p={2} mt={1}>
        <Box style={{ flex: 1 }} pr={1}>
          <Button
            fullWidth
            variant="secondary"
            type="danger"
            onClick={() => action("cancel", orders)}
          >
            Quay lại
          </Button>
        </Box>
        <Box style={{ flex: 1 }} pl={1}>
          <Button fullWidth onClick={createOrder}>
            {isEdit ? "Cập nhật" : "Đặt hàng"}
          </Button>
        </Box>
      </Box>
    </Sheet>
  );
};

export default SheetCartComponent;
