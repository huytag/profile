import React from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "zmp-ui";
import { canViewReport } from "../../../services/hasPermission";
import noImage from "../../../static/no-image.png";
import { parseUtcToLocal } from "../../../utils";
import { PER_TRADE_ACCUMULATE_REPORT_VIEW } from "../../../utils/enumPermission";
import TextBaseLineComponent from "../../textBaseLine";

const ItemAccumulationComponent = ({ item }) => {
  return (
    <Link
      to={`${item?.id}/${
        canViewReport(PER_TRADE_ACCUMULATE_REPORT_VIEW) ? "saleman" : ""
      }`}
    >
      <Box className="p-3 text-4xl mt-3 flex flex-col group duration-500 bg-white rounded-xl shadow-lg shadow-black-500/50 ">
        <div className="flex">
          <img
            src={item?.avatar_images ?? noImage}
            alt="alt source"
            className="w-full max-w-[25vw] h-[25vw] aspect-square object-cover"
          />
          <div
            style={{ width: `calc(100% - 28vw)` }}
            className="ml-auto flex flex-col"
          >
            <Text.Title size="normal">{item?.name}</Text.Title>
            <TextBaseLineComponent title="Mã chương trình" value={item?.code} />
            <TextBaseLineComponent
              title="Ngày đăng ký"
              value={`${parseUtcToLocal(item?.created_from_date, "DD/MM/YYYY")} 
              - ${parseUtcToLocal(item?.created_to_date, "DD/MM/YYYY")}`}
              mt={1}
            />
            <TextBaseLineComponent
              title="Ngày thực hiện"
              value={`
              ${parseUtcToLocal(item?.start_date, "DD/MM/YYYY")} 
              - ${parseUtcToLocal(item?.end_date, "DD/MM/YYYY")}`}
              mt={1}
            />
            <TextBaseLineComponent
              title="Trạng thái"
              value={
                <Text
                  size="xSmall"
                  className="rounded-md text-center text-white bg-slate-400 px-2"
                >
                  {item?.status_text}
                </Text>
              }
              mt={1}
            />
          </div>
        </div>

        <Text className="mt-3 break-words">{item?.desc}</Text>
      </Box>
    </Link>
  );
};

export default ItemAccumulationComponent;
