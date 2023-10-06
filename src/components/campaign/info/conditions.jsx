import {
  faCalendarPlus,
  faCalendarWeek,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button, ImageViewer, Text } from "zmp-ui";
import { parseUtcToLocal } from "../../../utils";

const CampaignConditionsComponent = ({
  item,
  hasButton = false,
  disableButton = false,
  isCreatedDay = false,
  titleButton = "Tham gia",
  action,
  mt = 3,
}) => {
  const [visible, setVisible] = useState(false);
  const conditionImages = item?.condition_images
    ? item.condition_images.map((item, index) => {
        return {
          src: item,
          alt: `img ${index}`,
          key: index,
        };
      })
    : [];

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 mt-${mt}`}>
      <Text.Title size="xLarge">{item?.name ?? "-"}</Text.Title>

      <Text size="small" className="mt-4">
        Mã chương trình: <span className="text-gray-400">{item?.code}</span>
      </Text>
      <Text size="small">
        <FontAwesomeIcon icon={faCalendarWeek} />{" "}
        <span className="text-gray-400 ml-0.5">
          {`${parseUtcToLocal(item?.start_date, "DD/MM/YYYY")} 
              - ${parseUtcToLocal(item?.end_date, "DD/MM/YYYY")}`}
        </span>
      </Text>
      {isCreatedDay && (
        <Text size="small">
          <FontAwesomeIcon icon={faCalendarPlus} />{" "}
          <span className="text-gray-400">
            {`${parseUtcToLocal(item?.created_from_date, "DD/MM/YYYY")} 
              - ${parseUtcToLocal(item?.created_to_date, "DD/MM/YYYY")}`}
          </span>
        </Text>
      )}

      <Text
        size="small"
        className="mt-2 text-[#2b78e4] cursor-pointer font-bold"
        onClick={() => setVisible(true)}
      >
        <FontAwesomeIcon icon={faCircleInfo} /> Điều khoản & điều kiện
      </Text>

      {hasButton && (
        <Button
          className="mt-4"
          variant="primary"
          size="large"
          fullWidth
          disabled={disableButton}
          onClick={() => action("ok")}
        >
          {titleButton}
        </Button>
      )}

      {item?.condition_images && (
        <ImageViewer
          onClose={() => setVisible(false)}
          activeIndex={0}
          images={conditionImages}
          visible={visible}
        />
      )}
    </div>
  );
};

export default CampaignConditionsComponent;
