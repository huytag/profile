import React from "react";
import { Header, useNavigate } from "zmp-ui";

const HeaderComponent = ({ title, backUrl = null }) => {
  const navigate = useNavigate();

  const redirectUrl = (e) => {
    if (backUrl) {
      return navigate(backUrl);
    }

    navigate(-1);
  };

  return (
    <>
      <Header
        title={title}
        backgroundColor="#013772"
        textColor="#fff"
        onBackClick={(e) => redirectUrl(e)}
      />
    </>
  );
};

export default HeaderComponent;
