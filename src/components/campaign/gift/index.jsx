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
import { storeDropdownProductGifts } from "../../../store/campaign";
import { noticeErrorState } from "../../../store/notice";
import Select2Component from "../../select2";

const SamplingGiftComponent = ({ passDataToParent = () => {} }, ref) => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const [listProduct, setListProduct] = useState([]);
  const options = useRecoilValue(storeDropdownProductGifts);
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
        quantity: 0,
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
    if (product.quantity <= 0) {
      noticeError("Vui lòng nhập số lượng lớn hơn 0");
      return;
    }

    if (!product.sampling_product_name || !product.sampling_product_id) {
      noticeError("Vui lòng chọn sản phẩm");
      return;
    }

    product.isConfirm = true;

    const newList = _.fill(list, product, index, 1);

    setListProduct(() => [...newList]);
    setChooseProducts((prev) => [...prev, product.sampling_product_id]);
  };

  const inputChange = (index, type, value) => {
    const list = listProduct;
    let product = list[index];
    product[type] = Number(value);

    const newList = _.fill(list, product, index, 1);

    setListProduct(() => [...newList]);
  };

  const selectChange = useCallback(
    (index, value) => {
      let product = listProduct[index];
      product.sampling_product_id = value?.id;
      product.sampling_product_name = value?.value;
    },
    [listProduct]
  );

  useEffect(() => {
    passDataToParent(_.filter(listProduct, (i) => i.isConfirm));
  }, [listProduct]);

  useEffect(() => {
    setOptionProducts(options.filter((i) => !chooseProducts.includes(i.id)));
  }, [chooseProducts]);

  return (
    <>
      <Text.Title>Nhập sản phẩm quà tặng</Text.Title>

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
        <li className="grid grid-cols-9 border-b-2 border-[#dddddd] border-dashed py-3 last:border-none gap-1">
          <Text.Title size="small" className="col-span-7">
            Tên hàng
          </Text.Title>
          <Text.Title size="small" className="text-center col-span-1">
            SL
          </Text.Title>
          <Text.Title size="small" className="col-span-1"></Text.Title>
        </li>
        {listProduct?.map((item, index) => (
          <li
            className="grid grid-cols-9 border-b-2 border-[#dddddd] border-dashed py-3 last:border-none gap-1"
            key={index}
          >
            <Text size="small" className="col-span-7">
              {!item.isConfirm && index + 1 === listProduct.length ? (
                <Select2Component
                  options={optionProducts}
                  isGetFull
                  onSelect={(value) => selectChange(index, value)}
                  isClearable={false}
                />
              ) : (
                item?.sampling_product_name
              )}
            </Text>
            <Text size="small" className="text-center col-span-1">
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
          <Text.Title size="small" className="col-span-7">
            Tổng
          </Text.Title>
          <Text.Title size="small" className="text-center">
            {listProduct.reduce((total, item) => {
              return (total += item.quantity);
            }, 0)}
          </Text.Title>
          <Text.Title size="small" className="col-span-1"></Text.Title>
        </li>
      </ul>
    </>
  );
};
export default forwardRef(SamplingGiftComponent);
