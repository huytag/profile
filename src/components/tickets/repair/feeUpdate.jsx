import React, { useCallback, useEffect, useState } from "react";
import { Box, Button } from "zmp-ui";
import AccordionComponent from "../../accordion";
import InfoApproveTicketBeforeRepairComponent from "../../info/repair/approveBefore";
import {
  perTicketDefault,
  PER_ASSET_TICKET_FEE_UPDATE,
} from "../../../utils/enumPermission";
import {
  hasPermission,
  isPCer,
  isSupplier,
} from "../../../services/hasPermission";
import SheetUpdateFeeComponent from "../../sheet/fee/update";
import { useSetRecoilState } from "recoil";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import ApproveFeeComponent from "./approveFee";
import { create } from "../../../services/api";
import { TICKET_FEES } from "../../../utils/constApiRoute";
import { loadingState } from "../../../store/loading";
import { empty, notEmpty } from "../../../utils";
import InfoApproveTicketAfterRepairComponent from "../../info/repair/approveAfter";
import { STATUS_DENY } from "../../../utils/enumTicketFee";
import { showNavigationState } from "../../../store/navigation";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";

const FeeUpdateComponent = ({ item, ticketFee }) => {
  const setShowBottom = useSetRecoilState(showNavigationState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const setLoading = useSetRecoilState(loadingState);
  const reloadPage = useNavigateCustomize();
  const [isShowUpdateFee, setIsShowUpdateFee] = useState(false);
  const listAcc = [
    {
      title: "Báo cáo trước sửa chữa",
      component: <InfoApproveTicketBeforeRepairComponent item={item} />,
      key: "info-before-repair",
      bg: true,
    },
    {
      title: "Báo cáo sau sửa chữa",
      component: <InfoApproveTicketAfterRepairComponent item={item} />,
      key: "info-after-repair",
      bg: true,
    },
  ];

  const onActionUpdateFee = useCallback((type, value) => {
    if (type === "error") {
      noticeError(value);
      return;
    }

    setIsShowUpdateFee(false);
    if (type === "close") {
      return;
    }

    setLoading(true);
    create(`${TICKET_FEES}/${item?.id}`, value)
      .then((res) => {
        noticeSuccess("Cập nhật chi phí thành công.");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  });

  const showBtnUpdate = () => {
    const isEmptyTicketFee = empty(ticketFee);
    const hasPer = !hasPermission([
      ...perTicketDefault,
      PER_ASSET_TICKET_FEE_UPDATE,
    ]);

    if (hasPer && isPCer()) {
      return true;
    }

    if (!hasPer || !isSupplier()) {
      return false;
    }

    if (isEmptyTicketFee) {
      return true;
    }

    if (!isEmptyTicketFee && ticketFee?.status === STATUS_DENY) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    setShowBottom(!isShowUpdateFee);
  }, [isShowUpdateFee]);

  return (
    <>
      <AccordionComponent list={listAcc} indexActive={1} />

      {notEmpty(ticketFee) && (
        <>
          <ApproveFeeComponent item={item} ticketFee={ticketFee} />
        </>
      )}

      {/* NCC cập nhật chi phí */}
      {showBtnUpdate() ? (
        <Box
          className="custom-bottom-sheet mt-5 w-full rounded-md"
          flex
          flexDirection="column"
        >
          <Box flex flexDirection="row" mt={1}>
            <div className="flex-1 pr-1">
              <Button
                fullWidth
                variant="primary"
                onClick={() => {
                  setIsShowUpdateFee(!isShowUpdateFee);
                }}
              >
                Cập nhật chi phí
              </Button>
            </div>
          </Box>

          <SheetUpdateFeeComponent
            isVisible={isShowUpdateFee}
            item={item}
            ticketFee={ticketFee}
            action={(type, value) => onActionUpdateFee(type, value)}
          />
        </Box>
      ) : null}
    </>
  );
};

export default FeeUpdateComponent;
