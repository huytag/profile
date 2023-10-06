import { atom, selector } from "recoil";
import { STATUS_CAMPAIGN } from "../utils/enum/campaign";
import { STATUS_PROMOTION } from "../utils/enum/promotion";
import { STATUS_SUPPORT } from "../utils/enum/support";
import { STATUS_WAITING_CONFIRM } from "../utils/enumTicket";
import * as StatusOrder from "../utils/enumOrder";
import * as AppStatus from "../utils/enumSetupAppResult";
import { STATUS_WHEEL_HISTORY } from "../utils/enum/wheelHistory";

export const tabStatusState = atom({
  key: "tabStatusState",
  default: {
    accumulationTab: STATUS_CAMPAIGN.NOT_JOIN,
    displayTab: STATUS_CAMPAIGN.NOT_JOIN,
    orderTab: StatusOrder.ALL,
    promotionTab: STATUS_PROMOTION.IN_PROGRESS,
    supportTab: STATUS_SUPPORT.WAITING,
    ticketTab: STATUS_WAITING_CONFIRM,
    scheduleTab: STATUS_WAITING_CONFIRM,
    setupTab: AppStatus.WAITING_FOR_REVIEW,
    wheelHistoryTab: STATUS_WHEEL_HISTORY.ALL,
  },
});

export const setTabStatusState = selector({
  key: "setTabStatusState",
  get: ({ get }) => {
    return get(tabStatusState);
  },
  set: ({ set }, newStatus) => {
    set(tabStatusState, (currentState) => ({
      ...currentState,
      ...newStatus,
    }));
  },
});
