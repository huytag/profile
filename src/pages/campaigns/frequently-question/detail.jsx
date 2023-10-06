import React from "react";
import { Box, Page, Text } from "zmp-ui";
import HeaderComponent from "../../../components/header";

const FrequentlyQuestionDetailPage = () => {
  return (
    <Page
      className="page px-2"
      style={{ paddingTop: "60px" }}
      hideScrollbar={true}
    >
      <HeaderComponent title="Câu hỏi thường gặp" />

      <Box className="px-5 py-3 text-4xl items-center mt-4 bg-white rounded-xl shadow-lg shadow-black-500/50">
        <Box className="flex justify-between border-b border-gray-500 py-2 mb-3">
          <Text.Title className="font-semibold ">
            Tại sao sữa TH lại chọn Nghệ an làm nơi xây dựng trang trại và nhà
            máy?
          </Text.Title>
        </Box>
        <Box>
          <Box className="my-2">
            <Text.Title size="normal" className="font-normal text-base">
              Đối tác có trách nhiệm hoàn thiện Báo Cáo Kết Quả Trưng Bày bằng
              cách chụp ảnh các vật phẩm được trưng bày tại Cửa Hàng và gửi hình
              ảnh cho Công Ty thông qua ứng dụng Retailer App. Việc thực hiện
              Báo Cáo Kết Quả Trưng Bày sẽ được chia thành 4 lần:
              <br />
              *Lần 1: từ ngày 12/12/2022-1/12/2023
              <br />
              *Lần 2: từ ngày 12/12/2022-1/12/2023
              <br />
              *Lần 3: từ ngày 12/12/2022-1/12/2023
              <br />
              *Lần 4: từ ngày 12/12/2022-1/12/2023
            </Text.Title>
            <Text.Title size="normal" className="font-normal text-base my-2">
              Đối tác có trách nhiệm hoàn thiện Báo Cáo Kết Quả Trưng Bày bằng
              cách chụp ảnh các vật phẩm được trưng bày tại Cửa Hàng và gửi hình
              ảnh cho Công Ty thông qua ứng dụng Retailer App. Việc thực hiện
              Báo Cáo Kết Quả Trưng Bày sẽ được chia thành 4 lần:
              <br />
              *Lần 1: từ ngày 12/12/2022-1/12/2023
              <br />
              *Lần 2: từ ngày 12/12/2022-1/12/2023
              <br />
              *Lần 3: từ ngày 12/12/2022-1/12/2023
              <br />
              *Lần 4: từ ngày 12/12/2022-1/12/2023
            </Text.Title>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default FrequentlyQuestionDetailPage;
