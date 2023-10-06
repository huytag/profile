import React from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "zmp-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";

//TODO:  remove item.id
const ScheduleAddressItem = ({ item }) => {
  return (
    <Box className="border border-[#333333] rounded-md py-2 w-full my-1">
      <Link to={`/maintenance/${item?.id}`} className="flex">
        <div className="flex items-start border-r text-gray-500 border-[#ddd] px-2 pt-2 w-[60px]">
          {item?.status_text ?? item?.sub_status_text}
        </div>
        <div className="ml-3 items-center p-2">
          <Text size="large" className="font-bold text-gray-700 bg-[]">
            {item?.item_name ?? ""} --- {item?.id}
          </Text>
          <Text size="small" className="text-gray-500">
            <FontAwesomeIcon icon={faLocationDot} size="sm" className="mr-2" />
            {item?.installation_address ?? ""}
          </Text>
          <Text size="small" className="text-gray-500">
            <FontAwesomeIcon icon={faPhone} size="sm" className="mr-2" />
            {item?.phone ?? ""}
          </Text>
        </div>
      </Link>
    </Box>
  );
};

export default ScheduleAddressItem;
