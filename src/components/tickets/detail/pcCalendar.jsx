import React, { useState } from "react";
import { Box, Button } from "zmp-ui";
import { isSupplier } from "../../../services/hasPermission";
import { TICKETS } from "../../../utils/constApiRoute";
import {
  perTicketDefault,
  PER_ASSET_TICKET_APPROVE_CALENDAR,
  PER_ASSET_TICKET_DELETE,
} from "../../../utils/enumPermission";
import SheetBottomNavigateComponent from "../../sheet/bottomNavigate";
import SheetUpdateCalendarComponent from "../../sheet/updateCalendar";

const TicketApprovePcCalendarComopnent = ({ item }) => {
  const [sheetVisible, setSheetVisible] = useState(false);

  const sheetAction = (action) => {
    setSheetVisible(false);
  };

  return (
    <>
      {isSupplier() ? (
        <div>
          <Box
            p={4}
            className={`custom-bottom-sheet fixed bottom-0 left-0 w-full bg-white`}
            flex
            flexDirection="column"
          >
            <div>
              <Box flex flexDirection="row" mt={1}>
                <Box style={{ flex: 1 }} pr={1}>
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={() => setSheetVisible(true)}
                  >
                    Sửa lịch hẹn
                  </Button>
                </Box>
              </Box>
            </div>
          </Box>

          <SheetUpdateCalendarComponent
            id={item?.id}
            activeDate={item?.estimate_date}
            isVisible={sheetVisible}
            action={sheetAction}
          />
        </div>
      ) : (
        <SheetBottomNavigateComponent
          id={item?.id}
          urlCancel={`${TICKETS}/${item?.id}/refuse-calendar`}
          urlConfirm={`${TICKETS}/${item?.id}/approval-calendar`}
          titleCancel="Từ chối"
          titleConfirm="Duyệt"
          permissionsCancel={[...perTicketDefault, PER_ASSET_TICKET_DELETE]}
          permissionsConfirm={[
            ...perTicketDefault,
            PER_ASSET_TICKET_APPROVE_CALENDAR,
          ]}
        />
      )}
    </>
  );
};

export default TicketApprovePcCalendarComopnent;
