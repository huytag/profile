import { Icon, Text } from "zmp-ui";
import React from "react";

const ErrorComponent = ({ title = "Lỗi chưa xác định", isShow = false }) => {
  return (
    <div
      className={`flex items-center mt-2 text-red-600 ${!isShow && "hidden"}`}
    >
      <Icon icon="zi-warning-solid" size={20} style={{ color: "#DC2626" }} />
      <Text size="xxSmall" className="ml-1">
        {title}
      </Text>
    </div>
  );
};

export default ErrorComponent;
