import React from "react";
import { Spinner } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { loadingState } from "../../store/loading";
import logo from "../../static/logo.jpg";

const LoadingComponent = () => {
  const loading = useRecoilValue(loadingState);

  return (
    <>
      <div
        className={`loading absolute w-screen h-screen top-0 left-0 flex items-center justify-center bg-white/70 z-[999999]
        ${!loading ? "hidden" : ""}`}
      >
        <Spinner visible logo={logo} />
      </div>
    </>
  );
};

export default LoadingComponent;
