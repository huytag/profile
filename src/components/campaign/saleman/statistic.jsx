import React from "react";
import { Box, Text } from "zmp-ui";
import TextBaseLineComponent from "../../textBaseLine";

const ReportStatisticComponent = ({ item }) => {
  return (
    <Box className="px-5 py-3 text-4xl items-center mt-4 bg-white rounded-xl shadow-lg shadow-black-500/50">
      <Text.Title size="large" className="font-semibold">
        Báo cáo thống kê
      </Text.Title>

      {item?.revenue && (
        <Box className="ml-3">
          <TextBaseLineComponent
            title="Doanh số:"
            value={Object.values(item?.revenue)}
            isBetween={false}
          />
        </Box>
      )}

      {item?.join && (
        <Box className="ml-3">
          <TextBaseLineComponent
            title="Tham gia:"
            value={Object.values(item?.join)}
            isBetween={false}
          />
        </Box>
      )}

      {item?.achieve && (
        <Box className="ml-3">
          <TextBaseLineComponent
            title="Đã đạt thưởng:"
            value={item?.achieve}
            isBetween={false}
          />
        </Box>
      )}

      {item?.completed && (
        <Box className="ml-3">
          <TextBaseLineComponent
            title="Đã hoàn thành:"
            value={item?.completed}
            isBetween={false}
          />
        </Box>
      )}

      {item?.setting && (
        <Box className="ml-3">
          <TextBaseLineComponent
            title="Đã lắp đặt:"
            value={item?.setting}
            isBetween={false}
          />
        </Box>
      )}

      {item?.paid_out && (
        <Box className="ml-3">
          <TextBaseLineComponent
            title="Đã trao thưởng:"
            value={item?.paid_out}
            isBetween={false}
          />
        </Box>
      )}

      {item?.drawn && (
        <Box className="ml-3">
          <TextBaseLineComponent
            title="Lượt quay đã sử dụng:"
            value={item?.drawn}
            isBetween={false}
          />
        </Box>
      )}

      {item?.time_gone && (
        <Box className="ml-3">
          <TextBaseLineComponent
            title="Timegone:"
            isBetween={false}
            value={item?.time_gone}
          />
        </Box>
      )}

      {item?.reports?.length > 0 && (
        <Box className="mt-3 ml-3">
          <Text size="small" className="text-gray-600">
            Đã đạt báo cáo ảnh
          </Text>
          {item?.reports?.map((report, index) => {
            return (
              <Box className="ml-3" key={index}>
                <TextBaseLineComponent
                  className="ml-3"
                  title={`Kì ${report?.period}:`}
                  value={`${report?.achieve}/${report?.sum}`}
                  isBetween={false}
                ></TextBaseLineComponent>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default ReportStatisticComponent;
