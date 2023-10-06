import React from "react";
import InfoDescriptionComponent from "../description";
import InfoMediaComponent from "../media";

const InfoReportWarrantyComopnent = ({ images, videos, content }) => {
  return (
    <>
      <InfoMediaComponent images={images} videos={videos} />

      <hr className="my-4 bg-[#ddd] h-[2px]" />

      <InfoDescriptionComponent title="Mô tả tình trạng" text={content} />
    </>
  );
};

export default InfoReportWarrantyComopnent;
