import React, { useEffect, useState } from "react";
import { Button, Page, useNavigate } from "zmp-ui";
import HeaderComponent from "../components/header";
import OutletProfileComponent from "../components/profile/outlet";
import ProfileComponent from "../components/profile";

const MePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    setUser(userInfo);
  }, []);

  return (
    <Page className="page" style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Hồ sơ" />
      <OutletProfileComponent user={user} />
      {/* {user?.is_outlet ? (
        <OutletProfileComponent user={user} />
      ) : (
        <ProfileComponent user={user} />
      )} */}

      <Button
        className="mt-5 block mx-auto"
        onClick={() => {
          localStorage.clear();
          navigate("/");
        }}
      >
        Đăng xuất
      </Button>
    </Page>
  );
};

export default MePage;
