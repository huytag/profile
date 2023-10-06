import {
  METHOD_LIQUIDATION,
  METHOD_REPAIR,
  METHOD_WARRANTY,
  STATUS_DONE,
  STATUS_REFUSE,
  STATUS_REPAIR,
  STATUS_WAITING_CONFIRM,
} from "../../utils/enumTicket";

export const parseTicketStatusBg = (status = STATUS_REFUSE) => {
  switch (status) {
    case STATUS_WAITING_CONFIRM:
      return "bg-blue-700";

    case STATUS_REPAIR:
      return "bg-yellow-400";

    case STATUS_DONE:
      return "bg-green-500";

    default:
      return "bg-red-500";
  }
};
