import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSetRecoilState } from "recoil";
import { Box, Icon, Page, Text, Input } from "zmp-ui";
import HeaderComponent from "../../../components/header";
import { apiClient, create } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { SETUP_DETAIL } from "../../../utils/constApiRoute";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";
import ModalGiftComponent from "../../../components/modal/gift";
import TextBaseLineComponent from "../../../components/textBaseLine";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import ModalGiftScanComponent from "../../../components/modal/gift/scan";
import { random } from "lodash";

//TODO : API app gift exchange
const CampaignGiftExchangePage = () => {
  const { id, giftId } = useParams();
  const reloadPage = useNavigateCustomize();
  const setLoading = useSetRecoilState(loadingState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [item, setItem] = useState([]);
  const [result, setResult] = useState({});
  const [content, setContent] = useState(null);
  const [visible, setVisible] = useState({
    result: false,
    scan: false,
    confirm: false,
  });

  const getItem = async () => {
    setLoading(true);
    await apiClient
      .get(`${SETUP_DETAIL}/${giftId}`)
      .then((response) => {
        setItem(response?.data?.setup_app);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const handleResult = (type) => {
    console.log(type);
    if (type === "cancel") {
      return setVisible((prev) => ({ ...prev, result: false }));
    }

    if (type === "again") {
      setVisible((prev) => ({ ...prev, result: false, scan: true }));
      return;
    }

    if (type === "confirm") {
      setVisible((prev) => ({ ...prev, result: false, scan: false }));
      return;
    }
  };

  const handleScan = (type, value) => {
    setLoading(true);

    if (type === "cancel") {
      setLoading(false);
      return setVisible((prev) => ({ ...prev, scan: false }));
    }

    // TODO: api scan
    console.log("TODO api scan content: " + value);

    setContent(value);
    setResult((prev) => ({ ...prev, description: value }));
    setVisible((prev) => ({
      ...prev,
      scan: false,
      result: true,
      confirm: Boolean(random(0, 1)),
    }));

    setLoading(false);
    return;
  };

  useEffect(() => {
    // getItem();
  }, []);

  return (
    <Page className="page " style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Chương trình đổi quà" />
      <Box className="p-3 text-4xl mt-3 duration-500 bg-white rounded-xl shadow-lg shadow-black-500/50">
        <Text.Title>Quét mã quay thưởng</Text.Title>
        <TextBaseLineComponent
          title="Loại quà:"
          value="Bình nước"
          isBetween={false}
        />
        <Box className="mt-3">
          <Text.Title>Nội dung đổi quà</Text.Title>

          <Box className="flex justify-between items-center text-center py-1">
            <Text.Title size="small" className="w-[50%]">
              Quét hoặc nhập mã
            </Text.Title>
            <Text.Title size="small" className="w-[30%]">
              Mã thẻ
            </Text.Title>
            <Text.Title size="small" className="w-[20%]">
              Kết quả
            </Text.Title>
          </Box>
          <Box className="flex justify-between items-center text-center  border-t-2 py-1">
            <Text.Title size="small" className="w-[50%]">
              <FontAwesomeIcon
                icon={faBarcode}
                size="2xl"
                className="w-[50px]"
                onClick={() => setVisible((prev) => ({ ...prev, scan: true }))}
              />
            </Text.Title>
            <Text.Title size="small" className="w-[30%] break-words">
              {content}
            </Text.Title>
            <Text.Title size="small" className="w-[20%] flex justify-center">
              {content && (
                <Icon
                  onClick={() =>
                    setVisible((prev) => ({ ...prev, result: true }))
                  }
                  icon={visible.confirm ? "zi-check-circle" : "zi-close-circle"}
                  size={25}
                  className={`rounded-xl flex justify-center items-center p-3 ${
                    visible.confirm ? "text-green-600" : "text-red-600"
                  }`}
                />
              )}
            </Text.Title>
          </Box>
        </Box>
      </Box>

      <ModalGiftComponent
        isVisible={visible.result}
        description={result?.description ?? "hehe"}
        action={(type) => handleResult(type)}
        isConfirm={visible.confirm}
      />

      <ModalGiftScanComponent
        title="Nhập mã thẻ"
        isVisible={visible.scan}
        action={(type, value) => handleScan(type, value)}
      />
    </Page>
  );
};

export default CampaignGiftExchangePage;
