import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Box, Button, Sheet, Text, Input } from "zmp-ui";
import useDropdown from "../../../hook/dropdown/useDropdown";
import useValidator from "../../../hook/validator/useValidator";
import { canViewReport } from "../../../services/hasPermission";
import { mediaImagesState, setMediaDefaultState } from "../../../store/media";
import { noticeErrorState } from "../../../store/notice";
import { DROPDOWN_TRADE } from "../../../utils/constApiRoute";
import { SETUP_APP_REASONS } from "../../../utils/enumDropdown";
import { PER_TRADE_SETUP_REPORT_VIEW } from "../../../utils/enumPermission";
import CampaignItemsSetupComponent from "../../campaign/info/itemsSetup";
import ErrorComponent from "../../error";
import InfoStoreComponent from "../../info/store";
import InputQuantity from "../../input/quantity";
import Select2Component from "../../select2";
import UploadMediaTicketComponent from "../../upload/ticket";

const SheetJoinCampaignSetup = ({ item = {}, isVisible = false, action }) => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const images = useRecoilValue(mediaImagesState);
  const resetMedia = useSetRecoilState(setMediaDefaultState);
  const [formData, setFormData] = useState({});
  const { options, getOptions } = useDropdown();
  const {
    listError,
    passValidator,
    checkValidator,
    settKeyOk,
    setDefaultError,
  } = useValidator();

  const handleSubmit = () => {
    let arrValidator = ["setup_reason_id", "item_quantity"];

    item?.is_required_image
      ? (arrValidator = [...arrValidator, "address_images"])
      : "";

    checkValidator(arrValidator, formData);

    if (!passValidator()) {
      noticeError("Vui lòng nhập các trường bị thiếu");
      return;
    }

    action("ok", formData);
  };

  useEffect(() => {
    getOptions(DROPDOWN_TRADE, [SETUP_APP_REASONS]);
  }, []);

  useEffect(() => {
    setFormData({ ...formData, address_images: images });

    if (!item?.is_required_image) return;

    settKeyOk("address_images", images);
  }, [images]);

  useEffect(() => {
    setFormData([]);
    setDefaultError();
    resetMedia();
  }, [isVisible]);

  return (
    <Sheet
      title="Yêu cầu lắp đặt"
      visible={isVisible}
      onClose={() => action("cancel")}
      autoHeight
      mask
      handler
      swipeToClose
    >
      <Box
        p={4}
        className="bottom-sheet-body pb-8"
        style={{ overflowY: "auto", overflowX: "hidden" }}
      >
        <Text.Title className="mt-5">Thiết bị áp dụng</Text.Title>
        <CampaignItemsSetupComponent item={item?.setup_app_item ?? item} />

        <Text.Title className="mt-5 mb-2">Số lượng</Text.Title>
        <InputQuantity
          value={formData?.item_quantity}
          required
          isError={listError?.item_quantity}
          action={(value) => {
            setFormData({ ...formData, item_quantity: value });
            settKeyOk("item_quantity", value);
          }}
        />

        <Text.Title className="mt-5">Lý do yêu cầu lắp đặt</Text.Title>
        <Select2Component
          options={options?.setup_app_reasons}
          placeholder="Chọn lý do"
          index="reason_id"
          required
          isError={listError?.setup_reason_id}
          onSelect={(value) => {
            setFormData({ ...formData, setup_reason_id: value });
            settKeyOk("setup_reason_id", value);
          }}
        />

        <div className={`${!item?.is_required_image && "opacity-0"}`}>
          <Text.Title className="mt-5 mb-2">Vị trí dự kiến lắp đặt</Text.Title>
          <UploadMediaTicketComponent isAddVideo={false} titleImage={null} />
          <ErrorComponent
            title="Chọn ít nhất 1 ảnh"
            isShow={listError?.address_images}
          />
        </div>
      </Box>
      <Box p={4} className="custom-bottom-sheet" flex flexDirection="column">
        <Box flex flexDirection="row" mt={1}>
          <Box style={{ flex: 1 }} pr={1}>
            <Button
              fullWidth
              variant="secondary"
              type="danger"
              onClick={() => action("cancel")}
            >
              Huỷ
            </Button>
          </Box>
          <Box style={{ flex: 1 }} pl={1}>
            <Button
              fullWidth
              onClick={handleSubmit}
              disabled={canViewReport(PER_TRADE_SETUP_REPORT_VIEW)}
            >
              Gửi đăng ký
            </Button>
          </Box>
        </Box>
      </Box>
    </Sheet>
  );
};

export default SheetJoinCampaignSetup;
