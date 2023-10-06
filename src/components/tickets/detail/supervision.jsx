import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { showNavigationState } from "../../../store/navigation";
import { TICKETS } from "../../../utils/constApiRoute";
import * as Permission from "../../../utils/enumPermission";
import { SUB_CANCEL_REQUEST } from "../../../utils/enumTicket";
import SheetBottomNavigateComponent from "../../sheet/bottomNavigate";

const TicketApproveSupervisionComopnent = ({ item }) => {
  const setShowNavBottom = useSetRecoilState(showNavigationState);

  useEffect(() => {
    if (!item?.can_approve_1) setShowNavBottom(true);
  }, []);
  return (
    <>
      {item?.can_approve_1 && (
        <SheetBottomNavigateComponent
          id={item?.id}
          isCancel={item?.sub_status === SUB_CANCEL_REQUEST}
          urlCancel={`${TICKETS}/${item?.id}/cancel`}
          urlConfirm={`${TICKETS}/${item?.id}/confirm-supervision`}
          permissionsCancel={[
            ...Permission.perTicketDefault,
            Permission.PER_ASSET_TICKET_DELETE,
          ]}
          permissionsConfirm={[
            ...Permission.perTicketDefault,
            Permission.PER_ASSET_TICKET_APPROVE_1,
          ]}
        />
      )}
    </>
  );
};

export default TicketApproveSupervisionComopnent;
