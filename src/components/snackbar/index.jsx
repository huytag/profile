import React, { useEffect } from "react";
import { useSnackbar } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { noticeState } from "../../store/notice";

const SnackbarComponent = () => {
  const notice = useRecoilValue(noticeState);
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    if (notice.visible) {
      openSnackbar({
        ...notice,
        text: notice.text ?? "Network Error",
      });
    }
  }, [notice]);
};

export default SnackbarComponent;
