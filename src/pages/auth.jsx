import React, { useEffect, useState } from "react";
import { Page, useNavigate, Button, Text } from "zmp-ui";
import { getAccessToken, getPhoneNumber } from "zmp-sdk/apis";
import { useSetRecoilState } from "recoil";
import { setUserState } from "../store/users";
import { showNavigationState } from "../store/navigation";
import { apiClient } from "../services/api";
import logo from "../static/logo.jpg";
import { LOGIN } from "../utils/constApiRoute";

const AuthPage = () => {
  const navigate = useNavigate();
  const setShowNavigation = useSetRecoilState(showNavigationState);
  const setUer = useSetRecoilState(setUserState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getToken = (tokenPhone) => {
    getAccessToken({
      success: (accessToken) => {
        !Boolean(import.meta.env.VITE_IS_MOBILE)
          ? (accessToken = "example")
          : "";

        apiClient
          .post(LOGIN, {
            access_token: accessToken,
            phone_token: tokenPhone,
          })
          .then((res) => {
            setUer(res.data.user);
            localStorage.setItem("userInfo", JSON.stringify(res.data.user));
            localStorage.setItem(
              "permissions",
              JSON.stringify(res.data.user.permissions)
            );
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("refresh_token", res.data.refresh_token);
            localStorage.setItem("token_expire_at", res.data.token_expire_at);

            setShowNavigation(true);
            navigate("/home");
          })
          .catch((err) => setError(err?.message));
      },
      fail: (error) => setError(error),
    });
  };

  const login = () => {
    setLoading(true);
    setError("");

    getPhoneNumber({
      success: async (data) => {
        getToken(data.token);
      },
      fail: (error) => setError(error),
    });
  };

  useEffect(() => {
    setShowNavigation(false);
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("userInfo");
    if (token && user) {
      setShowNavigation(true);
      navigate("/home");
    }
  }, []);

  return (
    <Page className="page w-screen h-screen bg-white relative">
      <img src={logo} className="w-1/2 mx-auto pt-24" />
      <div className="text-center mt-5">
        <Text className="my-3 text-red-700 font-bold">
          *Cung cấp số điện thoại cho việc đăng nhập
        </Text>
        <Button
          variant="secondary"
          size="large"
          onClick={login}
          loading={loading}
        >
          Đăng nhập
        </Button>
      </div>
      <p className="text-center text-red-700 font-bold text-lg mt-6">{error}</p>
    </Page>
  );
};

export default AuthPage;
