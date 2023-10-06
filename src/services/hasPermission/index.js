import _ from "lodash";
import { empty, notBlank } from "../../utils";
import {
  perTicketDefault,
  PER_ASSET_TICKET_APPROVE_1,
  PER_ASSET_TICKET_APPROVE_2,
  PER_ASSET_TICKET_SET_CALENDAR,
  PER_TRADE_REPORT_VIEW,
} from "../../utils/enumPermission";
import {
  STATUS_DONE,
  STATUS_REFUSE,
  SUB_WANTING_DISTRIBUTION,
} from "../../utils/enumTicket";
import {
  USER_DISTRIBUTOR,
  USER_OUTLET,
  USER_PG,
  USER_STAFF,
  USER_SUPPLIER,
} from "../../utils/enumUserType";

export const userInfo = JSON.parse(localStorage.getItem("userInfo")) ?? null;

export const hasPermission = (permissions) => {
  let userPermissions = JSON.parse(localStorage.getItem("permissions"));
  userPermissions = _.map(userPermissions, (i) => {
    return i.name;
  });

  let hasPermission = _.intersection(permissions, userPermissions);

  return !notBlank(hasPermission) ? "hidden" : "";
};

const passPermission = (item) => {
  if (!isPCer() && !isSupplier()) {
    return false;
  }

  if (item?.sub_status < SUB_WANTING_DISTRIBUTION) {
    return false;
  }

  if (item?.status === STATUS_DONE || item?.status === STATUS_REFUSE) {
    return false;
  }

  return true;
};

export const canChangeCalendar = (item) => {
  if (!passPermission(item)) {
    return false;
  }

  if (hasPermission([...perTicketDefault, PER_ASSET_TICKET_SET_CALENDAR])) {
    return false;
  }

  return true;
};

export const canChangeSupplier = (item) => {
  if (!passPermission(item)) {
    return false;
  }

  if (hasPermission([...perTicketDefault, PER_ASSET_TICKET_APPROVE_2])) {
    return false;
  }

  return true;
};

export const isHasPermission = (permissionName = "" | []) => {
  const userPermissions = _.map(
    JSON.parse(localStorage.getItem("permissions")),
    (i) => i.name
  );

  if (typeof permissionName === "object") {
    let hasPermission = _.intersection(permissionName, userPermissions);
    return !empty(hasPermission) || false;
  }

  const hasPermission = userPermissions.findIndex(
    (item) => item === permissionName
  );

  return hasPermission >= 0 || false;
};

export const isSaleman = (permissionApp = "") => {
  const permissionsToCheck = permissionApp
    ? [PER_TRADE_REPORT_VIEW, permissionApp]
    : PER_TRADE_REPORT_VIEW;
  return isHasPermission(permissionsToCheck);
};

export const isSupervisor = () => {
  return isHasPermission(PER_ASSET_TICKET_APPROVE_1);
};

export const isPCer = () => {
  return isHasPermission(PER_ASSET_TICKET_APPROVE_2);
};

export const canViewReport = (permissionApp = "") => {
  return isSupervisor() || isSaleman(permissionApp);
};

export const isDistributor = () => {
  return (
    JSON.parse(localStorage.getItem("userInfo"))?.type === USER_DISTRIBUTOR
  );
};

export const isPG = () => {
  return JSON.parse(localStorage.getItem("userInfo"))?.type === USER_PG;
};

export const isOutlet = () => {
  return JSON.parse(localStorage.getItem("userInfo"))?.type === USER_OUTLET;
};

export const isSupplier = () => {
  return JSON.parse(localStorage.getItem("userInfo"))?.type === USER_SUPPLIER;
};

export const isStaff = () => {
  return JSON.parse(localStorage.getItem("userInfo"))?.type === USER_STAFF;
};
