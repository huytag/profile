import React from "react";
import { useSetRecoilState } from "recoil";
import { Icon, Page, Text, Button, useNavigate } from "zmp-ui";
import HeaderComponent from "../../components/header";
import { isActiveNavigationState } from "../../store/navigation";

const DeniedComponent = () => {
  const navigate = useNavigate();
  const setActiveTab = useSetRecoilState(isActiveNavigationState);

  return (
    <Page
      className="bg-white"
      style={{ paddingTop: "50px" }}
      hideScrollbar={true}
    >
      <HeaderComponent title="Không đủ quyền truy cập" />
      <div className="text-center">
        <Text.Title className="my-5">Không đủ quyền truy cập</Text.Title>
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

export default DeniedComponent;
