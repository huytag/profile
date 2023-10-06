import React from "react";
import InfoMediaComponent from "../media";
import InfoDescriptionComponent from "../description";

const InfoApproveTicketBeforeRepairComponent = ({ item }) => {
  return (
    <div className="rounded-xl text-4xl mt-2">
      <InfoMediaComponent
        images={item?.report_before_images}
        videos={item?.report_before_videos}
      />

      <hr className="my-4 bg-[#ddd] h-[2px]" />

      <InfoDescriptionComponent
        title="Mô tả tình trạng"
        text={item?.report_before_content}
      />
    </div>
  );
};

export default InfoApproveTicketBeforeRepairComponent;
