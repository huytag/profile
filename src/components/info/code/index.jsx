import React from "react";
import { Text } from "zmp-ui";

const InfoCodeComponent = ({ code }) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <Text.Title size="small">Mã yêu cầu</Text.Title>
        <Text size="small" className="text-gray-500">
          {code}
        </Text>
      </div>
    </>
  );
};

export default InfoCodeComponent;
