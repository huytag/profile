import React from "react";
import { Text } from "zmp-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { parseUtcToLocal } from "../../../utils";

const StatusItemComponent = ({ item, isSetup = false }) => {
  return (
    <>
      <li
        className={`flex justify-between mt-5 relative ${
          item.active ? "active" : ""
        }`}
      >
        <div className="icon absolute text-lg top-0 left-[59px] leading-none z-50">
          <FontAwesomeIcon icon={faCircle} />
          <FontAwesomeIcon icon={faCircleCheck} className="text-[#085394]" />
        </div>
        <Text className="timeline-date w-[60px]">
          {parseUtcToLocal(
            isSetup ? item?.activity_at : item?.created_at,
            "DD/MM HH:mm"
          )}
        </Text>
        <Text className="timeline-text" style={{ width: `calc(100% - 100px)` }}>
          {isSetup ? item?.status_text : item?.status_name}
        </Text>
      </li>
    </>
  );
};

export default StatusItemComponent;
