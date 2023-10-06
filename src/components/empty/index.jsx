import React from "react";
import { useRecoilValue } from "recoil";
import { Icon, Text } from "zmp-ui";
import { loadingState } from "../../store/loading";

const EmptyComponent = ({ length, title }) => {
  const isLoading = useRecoilValue(loadingState);

  return (
    <div
      className={`text-center mt-4 ${
        length !== 0 || isLoading ? "hidden" : ""
      }`}
    >
      <Icon icon="zi-inbox" size={50} />
      <Text.Title size="small">Không có {title}</Text.Title>
    </div>
  );
};
export default EmptyComponent;
