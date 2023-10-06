import React, { useState } from "react";
import { Box, Checkbox } from "zmp-ui";
import { STATUS_WAITING_CONFIRM } from "../../../utils/enumTicket";
import EmptyComponent from "../../empty";
import ScheduleAddressItem from "./scheduleAddressItem";

const ScheduleItemComponent = ({ item, isActive = false, action }) => {
  const [ticketIds, setTicketIds] = useState([]);

  const onChangeChecked = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      const newTicketIds = [...ticketIds, value];
      setTicketIds(newTicketIds);
      action(newTicketIds);
      return;
    }

    const newTicketIds = ticketIds.filter((e) => e !== value);
    setTicketIds(newTicketIds);
    action(newTicketIds);
  };

  return (
    <Box>
      <div className="border-b-2 last:border-0 group bg-white mb-2 rounded-md">
        {item.map((addressItem, index) => {
          return (
            <Box flex key={index}>
              {isActive && addressItem.status === STATUS_WAITING_CONFIRM && (
                <Checkbox
                  name="ticket_ids[]"
                  value={addressItem.id}
                  onChange={(e) => onChangeChecked(e)}
                />
              )}
              <ScheduleAddressItem item={addressItem} key={index} />
            </Box>
          );
        })}
        {item.length === 0 && (
          <div className="flex justify-center items-center">
            <EmptyComponent length={item.length} title="dữ liệu" />
          </div>
        )}
      </div>
    </Box>
  );
};

export default ScheduleItemComponent;
