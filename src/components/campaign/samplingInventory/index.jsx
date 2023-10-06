import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Button, Text, Input } from "zmp-ui";
import { create } from "../../../services/api";
import { storeDropdownProductSells } from "../../../store/campaign";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { SAMPLING_RESULT_DETAIL } from "../../../utils/constApiRoute";
import ModalApproveComponent from "../../modal/approve";

const SamplingInventoryComponent = ({ item, action }) => {
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const [isVisible, setIsVisible] = useState();
  const products = useRecoilValue(storeDropdownProductSells);
  const [formData, setFormData] = useState([]);

  const modalHandle = useCallback((type) => {
    setIsVisible(false);
    if (type === "cancel") return;

    setLoading(true);
    create(`${SAMPLING_RESULT_DETAIL}/${item?.id}/inventory`, {
      sampling_product: formData,
    })
      .then(() => {
        setDefaultFormData();
        noticeSuccess("Báo cáo thành công");
        action("ok");
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  });

  const setValue = (index, value, id) => {
    const listData = formData;
    listData[index] = {
      id: Number(id),
      quantity: Number(value),
    };

    setFormData([...listData]);
  };

  const setDefaultFormData = () => {
    setFormData(
      products.map((i) => {
        return { id: i.id, quantity: 0 };
      })
    );
  };

  useEffect(() => {
    setDefaultFormData();
  }, []);

  return (
    <>
      <Text.Title className="mt-3">Nhập số tồn kho</Text.Title>
      <div className="max-h-[300px] overflow-y-scroll">
        {products.map((gift, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b-2 border-dashed border-[#dddddd] py-3 last:border-0"
          >
            <div style={{ width: `calc(100% - 100px)` }}>{gift?.value}</div>
            <Input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              size="small"
              value={
                item?.inventories[index]?.first_quantity ??
                formData[index]?.quantity
              }
              placeholder="0"
              className={`border-t-0 border-r-0 border-l-0 rounded-none text-center max-w-[80px] m-0 ${
                item?.inventories[index] && "pointer-events-none"
              }`}
              onChange={(e) => setValue(index, e.target.value, gift?.id)}
            />
          </div>
        ))}
      </div>

      <Button
        fullWidth
        size="medium"
        className="mt-3"
        disabled={item?.inventories.length > 0}
        onClick={() => setIsVisible(true)}
      >
        {item?.inventories.length > 0 ? "Đã báo cáo" : "Báo cáo"}
      </Button>

      <ModalApproveComponent
        isVisible={isVisible}
        action={modalHandle}
        title="Gửi báo cáo"
      />
    </>
  );
};

export default SamplingInventoryComponent;
