import React from "react";
import { Avatar, Box, Text } from "zmp-ui";
import { parseUtcToLocal } from "../../utils";
import NoImage from "../../static/no-image.png";
import InfoMediaComponent from "../info/media";

const ItemDetailResponse = ({ item }) => {
  return (
    <Box className="px-5 py-3 text-4xl items-center mt-4 bg-white rounded-xl shadow-lg shadow-black-500/50">
      <Box className="flex items-center">
        <Box mr={2}>
          <Avatar
            story="default"
            size={60}
            src={item?.user_avatar ?? NoImage}
            className="avatar-contain"
          />
        </Box>
        <Box className="flex flex-col justify-between h-[50px]">
          <Text.Title size="normal">{item?.user_name}</Text.Title>
          <Text size="small" className=" text-gray-500">
            {parseUtcToLocal(item?.updated_at, "DD/MM/YYYY HH:mm")}
          </Text>
        </Box>
      </Box>

      <Box>
        <Text size="medium" className="mt-2  text-gray-500">
          <div dangerouslySetInnerHTML={{ __html: item?.message }} />
        </Text>
      </Box>

      {item?.images?.length > 0 && (
        <InfoMediaComponent
          titleImage="Hình ảnh minh hoạ"
          images={item?.images}
        />
      )}
    </Box>
  );
};

export default ItemDetailResponse;
