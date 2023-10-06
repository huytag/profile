import axios from "axios";
import { PAGE_SIZE } from "../../utils/enums";
import { empty } from "../../utils";
import _ from "lodash";
import moment from "moment";
import { HttpCodeOK } from "../../utils/httpCode";
import { REFRESH_TOKEN } from "../../utils/constApiRoute";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const isExpired = () => {
  const tokenExpireAt = moment.utc(localStorage.getItem("token_expire_at"));
  const currentUtcTime = moment.utc();

  return tokenExpireAt.valueOf() < currentUtcTime.valueOf();
};

let isRefreshing = false;
apiClient.interceptors.request.use(async (request) => {
  if (isExpired() && !isRefreshing) {
    console.log("refresh token");
    isRefreshing = true;
    await refreshToken();
    isRefreshing = false;
  }

  request.headers.Authorization = "Bearer " + localStorage.getItem("token");

  return request;
});

apiClient.interceptors.response.use(
  (response) => {
    const { status, message } = response.data;

    if (status !== HttpCodeOK) {
      console.warn(message);
      throw response.data;
    }

    return response.data;
  },
  (error) => {
    throw error;
  }
);

export const refreshToken = async () => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/${REFRESH_TOKEN}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
      },
    }
  );

  localStorage.setItem("userInfo", JSON.stringify(response.data.data.user));
  localStorage.setItem(
    "permissions",
    JSON.stringify(response.data.data.user.permissions)
  );
  localStorage.setItem("token", response.data.data.token);
  localStorage.setItem("refresh_token", response.data.data.refresh_token);
  localStorage.setItem("token_expire_at", response.data.data.token_expire_at);
};

export const list = async (url, queries = {}) => {
  if (isExpired()) {
    await refreshToken();
  }

  if (empty(queries.limit)) {
    queries = _.assignIn(queries, { limit: PAGE_SIZE });
  }

  return apiClient.get(`/${url}`, { params: queries });
};

export const detail = async (url, id) => {
  if (isExpired()) {
    await refreshToken();
  }

  return apiClient.get(`/${url}/${id}`);
};

export const create = async (url, payload) => {
  if (isExpired()) {
    await refreshToken();
  }

  return apiClient.post(`/${url}`, payload);
};

export const update = async (url, id, payload) => {
  if (isExpired()) {
    await refreshToken();
  }

  return apiClient.put(`/${url}/${id}`, payload);
};

export const destroy = async (url, id) => {
  if (isExpired()) {
    await refreshToken();
  }

  return apiClient.delete(`/${url}/${id}`);
};
