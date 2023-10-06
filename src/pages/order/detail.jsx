import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSetRecoilState } from "recoil";
import { Page, Text, Input, Button, Icon, Modal, useNavigate } from "zmp-ui";
import HeaderComponent from "../../components/header";
import ModalApproveComponent from "../../components/modal/approve";
import ModalCancelComponent from "../../components/modal/cancel";
import TextBaseLineComponent from "../../components/textBaseLine";
import useNavigateCustomize from "../../hook/navigate/useNavigateCustom";
import { detail, list, update } from "../../services/api";
import { loadingState } from "../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../store/notice";
import { format_currency, parseUtcToLocal } from "../../utils";
import {
  ORDER_CANCEL,
  ORDER_CONFIRM,
  ORDER_CREATE,
  ORDER_DONE,
  ORDER_REASONS,
} from "../../utils/constApiRoute";
import * as StatusOrder from "./../../utils/enumOrder";
import noImage from "../../static/no-image.png";
import SheetStatusOrderComponent from "../../components/statusOrder";
import Select2Component from "../../components/select2";
import { setOrderEditState } from "../../store/order";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const setOrderState = useSetRecoilState(setOrderEditState);
  const reloadPage = useNavigateCustomize();
  const setLoading = useSetRecoilState(loadingState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [item, setItem] = useState();
  const [reasons, setReasons] = useState();
  const [description, setDescription] = useState();
  const [dataCancel, setDataCancel] = useState();
  const [modal, setModal] = useState({
    cancel: false,
    confirm: false,
    show: false,
  });

  const fetchItem = () => {
    setLoading(true);

    detail(ORDER_CREATE, id)
      .then((res) => {
        setItem(res.data.order);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const fetchReason = () => {
    list(ORDER_REASONS)
      .then((res) => {
        const data = res.data.order_reasons.map((i) => {
          return {
            value: i?.code,
            label: i?.name,
          };
        });
        setReasons(data);
      })
      .catch((error) => noticeError(error?.message));
  };

  const handleCancel = () => {
    setModal({
      ...modal,
      cancel: false,
    });

    if (!dataCancel?.order_reason_code || !dataCancel?.reason_no_cancel) {
      return noticeError("Vui lòng chọn lý do");
    }

    setLoading(true);

    update(ORDER_CANCEL, id, dataCancel)
      .then((res) => {
        noticeSuccess("Huỷ thành công");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  const handleConfirm = (type) => {
    setModal({
      ...modal,
      confirm: false,
    });

    if (type === "cancel") return;

    update(ORDER_CONFIRM, id)
      .then((res) => {
        noticeSuccess("Hoàn tất đơn hàng");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  const handleOrder = () => {
    update(ORDER_DONE, id)
      .then((res) => {
        noticeSuccess("Đặt hàng thành công");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  const handleUpdate = () => {
    const data = item?.order_products.map((i) => {
      return {
        code: i?.product?.code,
        name: i?.product?.name,
        price: i?.product?.price,
        quantity_bins: i?.quantity_bins,
        quantity_boxes: i?.quantity_boxes,
      };
    });

    setOrderState({
      id,
      note: item?.note,
      orders: data,
    });
    navigate("/order/create");
  };

  useEffect(() => {
    fetchReason();
    fetchItem();
  }, []);

  return (
    <Page
      className="page w-screen h-screen relative"
      hideScrollbar={true}
      style={{ paddingTop: "60px" }}
    >
      <HeaderComponent title="Chi tiết đơn hàng" />
      <SheetStatusOrderComponent item={item} />

      <div className="p-3 bg-white rounded-lg mt-3">
        <Text.Title>Danh sách sản phẩm</Text.Title>
        <TextBaseLineComponent title="Mã đơn hàng" value={item?.code} />
        <TextBaseLineComponent
          title="Thời gian đặt hàng"
          value={parseUtcToLocal(item?.order_date)}
          mt={2}
        />
        <TextBaseLineComponent
          title="Thành tiền"
          value={format_currency(item?.amount)}
          mt={2}
        />
        <TextBaseLineComponent
          title="Khuyến mãi tiền"
          value={format_currency(item?.discount)}
          mt={2}
        />
        <TextBaseLineComponent
          title="Chiết khấu ĐH"
          value={format_currency(item?.total_price)}
          mt={2}
        />
        <hr className="my-2 h-1 border-black border-dashed" />
        <TextBaseLineComponent
          title="Tổng tiền phải trả"
          value={format_currency(item?.total_price)}
          mt={0}
        />

        {item?.order_products.map((i, index) => (
          <div
            key={index}
            className="flex py-3 border-b-2 border-dashed border-[#dddddd] last:border-none"
          >
            <img
              src={i?.product?.images ?? noImage}
              alt={i?.product?.name}
              className="w-full max-w-[25vw] h-[25vw] aspect-square object-cover"
            />
            <div
              style={{ width: `calc(100% - 28vw)` }}
              className="ml-auto flex flex-col justify-between"
            >
              <Text.Title size="small">{i?.product?.name}</Text.Title>
              <TextBaseLineComponent
                title="Mã sản phẩm"
                value={i?.product?.code}
              />
              <TextBaseLineComponent
                title="Đơn giá"
                value={`${format_currency(i?.product?.box_price)} / thùng`}
                mt={1}
              />
              <TextBaseLineComponent
                title="Số lượng đặt"
                value={i?.order_number ?? 0}
                mt={1}
              />
              <TextBaseLineComponent
                title="Số lượng giao"
                value={i?.delivery_number ?? 0}
                mt={1}
              />
              <TextBaseLineComponent
                title="Khuyến mãi"
                value={format_currency(i?.discount)}
                boldTitle
                mt={1}
              />
              <TextBaseLineComponent
                title="Tổng tiền"
                value={format_currency(i?.amount)}
                boldTitle
                mt={1}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 bg-white rounded-lg mt-3">
        <Text.Title>Danh sách khuyến mãi</Text.Title>
        {item?.order_promotions && (
          <>
            <div className="grid grid-cols-8 mt-3 border-b border-[#dddddd] border-dashed pb-1">
              <Text.Title size="small" className="col-span-1">
                Mã
              </Text.Title>
              <Text.Title size="small" className="col-span-4 text-center">
                Tên
              </Text.Title>
              <Text.Title size="small" className="text-center col-span-2">
                Số lượng
              </Text.Title>
              <Text.Title size="small" className="text-center col-span-1">
                Mô tả
              </Text.Title>
            </div>
            {item.order_promotions.map((i, index) => (
              <div
                className="grid grid-cols-8 mt-1 border-b border-[#dddddd] border-dashed py-1 last:border-none"
                key={index}
              >
                <Text size="small" className="col-span-1">
                  {i?.product_code}
                </Text>
                <Text size="small" className="col-span-4 text-center">
                  {i?.product_name}
                </Text>
                <Text size="small" className="text-center col-span-2">
                  {i?.quantity}
                </Text>
                <Text size="small" className="text-center col-span-1">
                  <Icon
                    icon="zi-info-circle"
                    size={28}
                    onClick={() => {
                      setModal({ ...modal, show: true });
                      setDescription(i);
                    }}
                  />
                </Text>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="p-3 bg-white rounded-lg mt-3">
        <Text.Title>Ghi chú</Text.Title>
        <Input.TextArea
          value={item?.note}
          className="bg-gray-200 pointer-events-none"
        />

        <div className="flex gap-2 mt-4">
          {item?.status === StatusOrder.CREATE && (
            <Button
              className="flex-1"
              variant="secondary"
              onClick={() => handleUpdate()}
            >
              Cập nhật
            </Button>
          )}

          {item?.status === StatusOrder.CREATE && (
            <Button className="flex-1" onClick={handleOrder}>
              Đặt hàng
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {item?.status <= StatusOrder.OPEN && (
          <Button
            className="flex-1"
            variant="secondary"
            type="danger"
            onClick={() => setModal((prev) => ({ ...prev, cancel: true }))}
          >
            Huỷ đặt hàng
          </Button>
        )}

        {item?.status === StatusOrder.RELEASE && !item?.is_confirm && (
          <>
            <Button
              className="flex-1"
              variant="secondary"
              type="danger"
              onClick={() => setModal((prev) => ({ ...prev, cancel: true }))}
            >
              Từ chối
            </Button>
            <Button
              className="flex-1"
              onClick={() => setModal((prev) => ({ ...prev, confirm: true }))}
            >
              Xác nhận
            </Button>
          </>
        )}
      </div>

      <Modal
        visible={modal.show}
        title={description?.product_name ?? "Mô tả"}
        onClose={() => setModal({ ...modal, show: false })}
        verticalActions
      >
        <div>{description?.note ?? "Không có mô tả"}</div>
        <Button
          className="mt-3"
          onClick={() => setModal({ ...modal, show: false })}
          fullWidth
          variant="primary"
        >
          Đóng
        </Button>
      </Modal>

      <ModalCancelComponent
        isVisible={modal.cancel}
        action={(type, note) => handleCancel(type, note)}
      />

      {/* CANCEL */}
      <Modal
        visible={modal.cancel}
        title="Nhập lí do huỷ yêu cầu"
        onClose={() => setModal({ ...modal, cancel: false })}
        verticalActions
      >
        <div>
          <Select2Component
            placeholder="Chọn lý do"
            options={reasons}
            onSelect={(e) =>
              setDataCancel({ ...dataCancel, order_reason_code: e })
            }
          />
          <Input.TextArea
            className="mt-3"
            placeholder="Nhập lý do"
            clearable
            onChange={(e) =>
              setDataCancel({ ...dataCancel, reason_no_cancel: e.target.value })
            }
            // value={note}
          />
        </div>
        <div className="grid grid-cols-2 auto-cols-fr gap-1 mt-4">
          <Button
            onClick={() => setModal({ ...modal, cancel: false })}
            fullWidth
            variant="tertiary"
          >
            Huỷ
          </Button>
          <Button
            // disabled={!note}
            onClick={() => handleCancel()}
            fullWidth
          >
            Xác nhận
          </Button>
        </div>
      </Modal>
      {/* CANCEL */}

      <ModalApproveComponent
        title="Xac nhận hoàn tất đơn hàng"
        isVisible={modal.confirm}
        action={(type) => handleConfirm(type)}
      />
    </Page>
  );
};

export default OrderDetailPage;
