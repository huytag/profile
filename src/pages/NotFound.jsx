import React from "react";
import { useSetRecoilState } from "recoil";
import { Icon, Page, Text, Button, useNavigate } from "zmp-ui";
import HeaderComponent from "../components/header";
import { isActiveNavigationState } from "../store/navigation";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const setActiveTab = useSetRecoilState(isActiveNavigationState);

  return (
    <Page
      className="bg-white"
      style={{ paddingTop: "50px" }}
      hideScrollbar={true}
    >
      <HeaderComponent title="Không tìm thấy" />
      <div className="text-center">
        <Text.Title className="my-5">Trang không tìm thấy</Text.Title>
        <Button
          size="large"
          variant="secondary"
          prefixIcon={<Icon icon="zi-home" />}
          onClick={() => {
            navigate("/home");
            setActiveTab("home");
          }}
        >
          Quay lại trang chủ
        </Button>
      </div>
    </Page>
  );
};

export default NotFoundPage;
