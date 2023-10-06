import _ from "lodash";
import moment from "moment";

export const blank = (value) => {
  if (_.isNil(value)) {
    return true;
  }
  if (_.isObject(value) || _.isString(value)) {
    return !_.size(value);
  }
  return false;
};

export const notBlank = (value) => !blank(value);

export const empty = (value) => {
  if (blank(value)) {
    return true;
  }
  if (_.isString(value) && value.match(/^0(\.0+)?$/)) {
    return true;
  }
  return !value;
};

export const notEmpty = (value) => !empty(value);

export const isCtypeDigit = (value) => /^\d+$/.test(value);

export const parseUtcToLocal = (date, format = "DD/MM/YYYY HH:mm:ss") => {
  if (!date) return "-";

  return moment.utc(date).local().format(format);
};

export const parseLocalToUtc = (
  date,
  time = null,
  format = "DD/MM/YYYY HH:mm",
  formatDateResponse = "YYYY-MM-DD",
  formatTimeResponse = "HH:mm"
) => {
  const dataParse = time ? `${date} ${time}` : `${date}`;
  const response = moment(dataParse, format).utc();

  return {
    date: response.format(formatDateResponse),
    time: response.format(formatTimeResponse),
  };
};

export const format_currency = (value) => {
  if (typeof value !== "number") value = 0;
  return new Intl.NumberFormat("en-VI").format(value);
};

export const isOverTime = (date, month = 6) => {
  if (!date) return false;
  const dateAt = moment.utc(date);
  const dateBeforeAt = moment.utc().subtract(month, "months");
  return dateAt.valueOf() > dateBeforeAt.valueOf();
};

export const validateItems = (items = [], key = "id") => {
  return items.every((item) => empty(item[key]));
};
