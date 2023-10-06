import React from "react";
import { Text } from "zmp-ui";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import TextBaseLineComponent from "../../textBaseLine";
import moment from "moment";

const CampaignSamplingItemComponent = ({ item }) => {
  const returnUrl = () => {
    return item?.user_sampling_app_result
      ? `${item?.id}/${item?.user_sampling_app_result?.outlet_code}`
      : `${item?.id}`;
  };

  return (
    <>
      <Link to={returnUrl()}>
        <div className="p-4 text-4xl mt-3  duration-500 bg-white rounded-xl shadow-lg shadow-black-500/50">
          <Text.Title size="normal">{item?.name ?? "-"}</Text.Title>
          <TextBaseLineComponent title="Mã chương trình" value={item?.code} />
          <TextBaseLineComponent
            title="Trạng thái"
            value={
              item?.user_sampling_app_result ? "Đã tham gia" : "Chưa tham gia"
            }
            mt={1}
          />
          <TextBaseLineComponent
            title={<FontAwesomeIcon icon={faCalendarDays} />}
            value={`${moment(item?.start_date).format("DD/MM/YYYY")} - ${moment(
              item?.end_date
            ).format("DD/MM/YYYY")}`}
            mt={1}
          />
        </div>
      </Link>
    </>
  );
};

export default CampaignSamplingItemComponent;
