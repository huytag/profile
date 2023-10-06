import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Text, Button, Sheet, Box } from "zmp-ui";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";
import { create, list } from "../../../services/api";
import { canChangeSupplier } from "../../../services/hasPermission";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { DROPDOWN_ASSET, TICKETS } from "../../../utils/constApiRoute";
import { SUPPLIERS } from "../../../utils/enumDropdown";
import { STATUS_DONE } from "../../../utils/enumTicket";
import IconAvatar from "../../icon/Avatar";
import RatingComponent from "../../rating";
import Select2Component from "../../select2";

const InfoSupplierComponent = ({ item, title = "Nhà cung cấp" }) => {
  const reloadPage = useNavigateCustomize();
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const [width, setWidth] = useState("90px");
  const [supplierId, setSupplierId] = useState(item?.supplier?.id);
  const [isVisible, setIsVisible] = useState(false);
  const [hasChange, setHasChange] = useState(false);
  const [hiddenRate, setHiddenRate] = useState(true);
  const [options, setOptions] = useState([]);

  const confirm = () => {
    if (!supplierId) {
      noticeError("Vui lòng chọn nhà cung cấp!");
      return;
    }

    setIsVisible(false);
    setLoading(true);

    create(`${TICKETS}/${item?.id}/update-supplier`, {
      supplier_id: supplierId,
    })
      .then((res) => {
        noticeSuccess("Cập nhật thành công");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!hasChange) return;

    setLoading(true);

    list(DROPDOWN_ASSET, {
      objects: [SUPPLIERS],
    })
      .then((response) => {
        setOptions(response?.data?.options?.suppliers);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  }, [hasChange]);

  useEffect(() => {
    if (item?.status === STATUS_DONE) setHiddenRate(false);

    if (canChangeSupplier(item)) {
      setWidth("180px");
      setHasChange(true);
    }
  }, [isVisible]);

  return (
    <>
      <Text.Title size="small" className="mt-3">
        {title}
      </Text.Title>
      <div className="flex mt-3 justify-between items-center">
        <IconAvatar className="w-20" />
        <div style={{ width: `calc(100% - ${width})` }}>
          <Text.Title size="normal">{item?.supplier?.name ?? ""}</Text.Title>
          <div className={`${hiddenRate && "hidden"}`}>
            <RatingComponent rating={item?.supplier_rate} count={300} />
          </div>
        </div>
        <div className={`${!hasChange && "hidden"}`}>
          <Button
            variant="primary"
            size="small"
            onClick={() => setIsVisible(true)}
          >
            Thay đổi
          </Button>
        </div>
      </div>

      <Sheet
        title="Chọn nhà cung cấp"
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        autoHeight
        unmountOnClose
        mask
        handler
        swipeToClose
      >
        <Box p={4} className="custom-bottom-sheet" flex flexDirection="column">
          <Box
            className="bottom-sheet-body pb-60"
            style={{ overflowY: "auto" }}
          >
            <Text.Title size="large" className="mt-5 mb-2">
              Nhà cung cấp đã chọn
            </Text.Title>
            <Select2Component
              placeholder="Chọn nhà cung cấp"
              defaultValue={_.find(
                options,
                (i) => i.value === item?.supplier?.id
              )}
              options={options}
              onSelect={(value) => setSupplierId(value)}
            />
          </Box>
          <Box flex flexDirection="row" mt={1}>
            <Box style={{ flex: 1 }} pr={1}>
              <Button
                fullWidth
                variant="secondary"
                type="danger"
                onClick={() => {
                  setIsVisible(false);
                }}
              >
                Huỷ
              </Button>
            </Box>
            <Box style={{ flex: 1 }} pl={1}>
              <Button fullWidth onClick={confirm}>
                Lưu hay đổi
              </Button>
            </Box>
          </Box>
        </Box>
      </Sheet>
    </>
  );
};

export default InfoSupplierComponent;
