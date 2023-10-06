import React from "react";
import { useSetRecoilState } from "recoil";
import { openWebview } from "zmp-sdk/apis";
import { Box } from "zmp-ui";
import { noticeErrorState } from "../../store/notice";

const TextMapComponent = ({ text = "Địa chỉ", lat = null, lng = null }) => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const openUrlInWebview = async () => {
    try {
      await openWebview({
        url: `https://maps.google.com/?q=${lat},${lng}`,
      });
    } catch (error) {
      noticeError(error?.message);
    }
  };

  return (
    <>
      <Box
        className=" text-gray-500 underline"
        onClick={() => {
          openUrlInWebview();
        }}
      >
        {text}
      </Box>
    </>
  );
};

export default TextMapComponent;
