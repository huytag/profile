import React from "react";
import { useParams } from "react-router";
import { Box, Text } from "zmp-ui";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

const CampaignOutletComponent = ({ list, appName = "display" }) => {
  const { id } = useParams();

  return (
    <Box>
      {list?.map((item, index) => (
        <Box
          className="border border-[#333333] mb-3 rounded-md py-2 w-full mt-3"
          key={index}
        >
          <Link
            to={`/campaigns/${appName}/${id}/?customerId=${item?.customer_id}`}
            className="flex"
          >
            <div className="ml-3 items-center p-2">
              <Text size="large" className="font-bold">
                {item?.name}
              </Text>
              <Text size="small">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  size="sm"
                  className="mr-2"
                />
                {item?.address}
              </Text>
              <Text size="small">
                <FontAwesomeIcon icon={faPhone} size="sm" className="mr-2" />
                {item?.phone}
              </Text>
              <Text size="small">
                <FontAwesomeIcon icon={faCode} size="sm" className="mr-2" />
                Mã outlet: <span className="font-bold">{item?.code}</span>
              </Text>
            </div>
          </Link>
        </Box>
      ))}
    </Box>
  );
};

export default CampaignOutletComponent;
