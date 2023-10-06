import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSetRecoilState } from "recoil";
import { Box, Icon, Page, Text } from "zmp-ui";
import HeaderComponent from "../../../components/header";
import { apiClient, create } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { SETUP_DETAIL } from "../../../utils/constApiRoute";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";
import { Link } from "react-router-dom";

//TODO : API app gift
const CampaignGiftDetailPage = () => {
  const { id } = useParams();
  const reloadPage = useNavigateCustomize();
  const setLoading = useSetRecoilState(loadingState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [gifts, setGifts] = useState([
    {
      id: 1,
      name: "Bộ đồ dùng học tập",
      number_card: 40,
      number_card_exchanged: 35,
    },
    {
      id: 2,
      name: "Bình nước",
      number_card: 24,
      number_card_exchanged: 20,
    },
    {
      id: 3,
      name: "Bình nước full",
      number_card: 20,
      number_card_exchanged: 20,
    },
  ]);

  const fetchGifts = async () => {
    setLoading(true);
    await apiClient
      .get(`${SETUP_DETAIL}/${id}`)
      .then((response) => {
        setGifts(response?.data?.gifts);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // fetchGifts();
  }, []);

  return (
    <Page className="page " style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Chương trình đổi quà" />
      <Box className="p-3 text-4xl mt-3 duration-500 bg-white rounded-xl shadow-lg shadow-black-500/50">
        <Text.Title>Nội dung đổi quà</Text.Title>

        <Box className="flex justify-between items-center py-1">
          <Text.Title size="small" className="w-[30%]">
            Tên quà
          </Text.Title>
          <Text.Title size="small" className="w-[40%]">
            Số thẻ tương ứng
          </Text.Title>
          <Text.Title size="small">Số quà đã đổi</Text.Title>
        </Box>

        {gifts?.map((gift, index) => {
          return (
            <Box
              className="flex justify-between items-center border-t-2 py-1"
              key={index}
            >
              <Text.Title size="small" className="w-[30%]">
                {gift?.name}
              </Text.Title>
              <Text.Title size="small" className="w-[40%]">
                {gift?.number_card}
              </Text.Title>
              <Text.Title size="small" className="flex items-center">
                {gift?.number_card_exchanged}
                <Link to={`exchange/${gift?.id}`} className="ml-2">
                  <Icon
                    icon="zi-plus-circle"
                    className={` rounded-xl flex justify-center items-center p-2 ${
                      gift?.number_card > gift?.number_card_exchanged
                        ? "text-green-600"
                        : "text-gray-500 pointer-events-none"
                    }`}
                  />
                </Link>
              </Text.Title>
            </Box>
          );
        })}
      </Box>

      {/* Note */}
      <Box className="p-3 text-4xl mt-3 duration-500 bg-white rounded-xl shadow-lg shadow-black-500/50">
        <Text.Title>Ghi chú</Text.Title>
        <div
          className="text-lg font-medium ml-3"
          dangerouslySetInnerHTML={{ __html: gifts?.note ?? " " }}
        />
        <Text>
          1. Tên chương trình khuyến mại: HÈ KHÁM PHÁ - SĂN QUÀ CỰC ĐÃ
        </Text>
        <Text>2. Địa bàn (phạm vi) khuyến mại: Toàn quốc</Text>
        <Text>
          3. Hình thức khuyến mại: Tổ chức chương trình khách hàng thường xuyên.
          Theo đó, việc tặng thưởng cho khách hàng căn cứ trên việc khách hàng
          mua hàng hóa khuyến mại và thực hiện gửi/nộp đủ số lượng thẻ theo thể
          lệ chương trình.
        </Text>
        <Text>
          4. Thời gian khuyến mại: Từ ngày 15/05/2023 đến hết ngày 15/08/2023
          (Thời hạn đổi quà đến hết ngày 15/09/2023).
        </Text>
        <Text>
          5. Hàng hóa, dịch vụ khuyến mại: Sữa chua uống tiệt trùng TH true
          YOGURT công thức TOPKID 110 ml các hương vị, Sữa chua uống tiệt trùng
          TH true YOGURT TOPKID 180 ml các hương vị, Nước uống sữa trái cây TH
          true JUICE milk TOPKID 110 ml các hương vị , Nước uống sữa trái cây TH
          true JUICE milk TOPKID 180 ml các hương vị. Số lượng hàng hóa, dịch vụ
          (nếu có):
        </Text>
      </Box>
    </Page>
  );
};

export default CampaignGiftDetailPage;
