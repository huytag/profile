import _ from "lodash";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Button, Icon, Input, Text } from "zmp-ui";
import { storeDropdownProductSells } from "../../../store/campaign";
import { noticeErrorState } from "../../../store/notice";
import { format_currency } from "../../../utils";
import Select2Component from "../../select2";

const SamplingProductBuyComponent = ({ passDataToParent = () => {} }, ref) => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const [listProduct, setListProduct] = useState([]);
  const options = useRecoilValue(storeDropdownProductSells);
  const [chooseProducts, setChooseProducts] = useState([]);
  const [optionProducts, setOptionProducts] = useState(options);

  useImperativeHandle(ref, () => {
    return {
      onResetData: () => {
        setChooseProducts([]);
        setListProduct([]);
      },
    };
  });

  const addProduct = () => {
    const hasNotConfirm = _.filter(listProduct, (i) => i.isConfirm === false);
    if (hasNotConfirm.length && listProduct.length) {
      noticeError("Vui lòng xác nhận trước khi thêm mới");
      return;
    }

    setListProduct([
      ...listProduct,
      {
        sampling_product_id: null,
        sampling_product_name: "",
        price: 0,
        quantity: 0,
        total: 0,
        isConfirm: false,
      },
    ]);
  };

  const removeProduct = (index) => {
    const newList = [...listProduct];

    if (listProduct[index]?.sampling_product_id) {
      const newChooseProduct = chooseProducts.filter(
        (i) => i !== newList[index]?.sampling_product_id
      );
      setChooseProducts(newChooseProduct);
    }

    newList.splice(index, 1);
    setListProduct(newList);
  };

  const confirmProduct = (index) => {
    const list = listProduct;
    let product = list[index];
    if (product.quantity <= 0 || product.price <= 0) {
      noticeError("Vui lòng nhập số lớn hơn 0");
      return;
    }

    if (!product.sampling_product_name || !product.sampling_product_id) {
      noticeError("Vui lòng chọn sản phẩm");
      return;
    }

    product.isConfirm = true;
    product.total = product.price * product.quantity;

    const newList = _.fill(list, product, index, 1);
    setListProduct(() => [...newList]);
    setChooseProducts((prev) => [...prev, product.sampling_product_id]);
  };

  const inputChange = (index, type, value) => {
    const list = listProduct;
    let product = list[index];
    product[type] = Number(value);
    product.total = value * product[type === "price" ? "quantity" : "price"];

    const newList = _.fill(list, product, index, 1);

    setListProduct(() => [...newList]);
  };

  const selectChange = useCallback(
    (index, value) => {
      let product = listProduct[index];
      product.sampling_product_name = value?.value;
      product.sampling_product_id = value?.id;
    },
    [listProduct]
  );

  const getTotalByKey = (key = "quantity") => {
    return listProduct.reduce((total, item) => {
      return (total += item[key]);
    }, 0);
  };

  useEffect(() => {
    passDataToParent(_.filter(listProduct, (i) => i.isConfirm));
  }, [listProduct]);

  useEffect(() => {
    setOptionProducts(options.filter((i) => !chooseProducts.includes(i.id)));
  }, [chooseProducts]);

  return (
    <>
      <div className="flex justify-between items-center">
        <Text.Title>Nhập sản phẩm mua</Text.Title>
        <Text size="small">ĐVT: Hộp/Chai</Text>
      </div>

      {optionProducts.length > 0 && (
        <div className="text-right my-3">
          <Button
            size="large"
            size="medium"
            icon={<Icon icon="zi-plus" />}
            onClick={() => addProduct()}
          />
        </div>
      )}

      <ul className="mt-3">
        <li className="grid grid-cols-10 border-b-2 border-[#dddddd] border-dashed py-3 last:border-none gap-1">
          <Text.Title size="small" className="col-span-3">
            Tên hàng
          </Text.Title>
          <Text.Title size="small" className="text-center col-span-2">
            Đơn giá
            <p className="text-[10px]">(nghìn đồng)</p>
          </Text.Title>
          <Text.Title size="small" className="text-center col-span-2">
            SL
          </Text.Title>
          <Text.Title size="small" className="col-span-2 text-center">
            Thành tiền
          </Text.Title>
          <Text.Title size="small" className="col-span-1"></Text.Title>
        </li>
        {listProduct?.map((item, index) => (
          <li
            className="grid grid-cols-10 border-b-2 border-[#dddddd] border-dashed py-3 last:border-none gap-1 items-center"
            key={index}
          >
            <Text size="small" className="col-span-3">
              {!item.isConfirm && index + 1 === listProduct.length ? (
                <Select2Component
                  options={optionProducts}
                  onSelect={(value) => selectChange(index, value)}
                  isGetFull
                  isClearable={false}
                />
              ) : (
                item?.sampling_product_name
              )}
            </Text>
            <Text size="small" className="text-center col-span-2">
              {item.isConfirm === false ? (
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  size="small"
                  placeholder="0"
                  className="border-t-0 border-r-0 border-l-0 rounded-none text-center"
                  onChange={(e) =>
                    inputChange(index, "price", e.target.value * 1000)
                  }
                />
              ) : (
                format_currency(item?.price)
              )}
            </Text>
            <Text size="small" className="text-center col-span-2">
              {item.isConfirm === false ? (
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  size="small"
                  placeholder="0"
                  className="border-t-0 border-r-0 border-l-0 rounded-none text-center"
                  onChange={(e) =>
                    inputChange(index, "quantity", e.target.value)
                  }
                />
              ) : (
                item?.quantity
              )}
            </Text>
            <Text size="normal" className="col-span-2 text-center">
              {format_currency(item?.price * item?.quantity)}
            </Text>
            <Text size="small" className="col-span-1 text-center">
              {item.isConfirm === false ? (
                <div className="grid grid-rows-2 gap-2 ">
                  <Icon
                    icon="zi-delete"
                    className="text-red-600 mx-auto"
                    size={21}
                    onClick={() => removeProduct(index)}
                  />
                  <Icon
                    icon="zi-check-circle"
                    className="text-green-600 mx-auto"
                    size={21}
                    onClick={() => confirmProduct(index)}
                  />
                </div>
              ) : (
                <Icon
                  icon="zi-delete"
                  className="text-red-600"
                  size={21}
                  onClick={() => removeProduct(index)}
                />
              )}
            </Text>
          </li>
        ))}
        <li className="grid grid-cols-9 border-b-2 border-[#dddddd] border-dashed py-3 last:border-none gap-1">
          <Text.Title size="small" className="col-span-5">
            Tổng
          </Text.Title>
          <Text.Title size="small" className="text-center">
            {getTotalByKey("quantity")}
          </Text.Title>
          <Text.Title size="small" className="col-span-2 text-center">
            {format_currency(getTotalByKey("total"))}
          </Text.Title>
          <Text.Title size="small" className="col-span-1"></Text.Title>
        </li>
      </ul>
    </>
  );
};
export default forwardRef(SamplingProductBuyComponent);
