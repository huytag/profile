import React from "react";
import InfoCodeComponent from "../code";
import InfoDescriptionComponent from "../description";
import InfoItemComponent from "../item";
import InfoMediaComponent from "../media";
import InfoStatusComponent from "../status";
import InfoStoreComponent from "../store";
import InfoSupplierComponent from "../supplier";
import InfoMethodComponent from "../method";

const InfoTicketRepairComponent = ({ item }) => {
  return (
    <div className="rounded-xl text-4xl mt-2">
      <InfoStatusComponent item={item} hasHidden={true} />

      <hr className="mt-3 bg-[#ddd] h-[2px]" />

      <InfoItemComponent item={item?.item} />

      <hr className="my-4 bg-[#ddd] h-[2px]" />

      <InfoSupplierComponent item={item} />

      <hr className="my-4 bg-[#ddd] h-[2px]" />

      <InfoMethodComponent title={item?.method_type_text} />

      <hr className="my-4 bg-[#ddd] h-[2px]" />

      <InfoStoreComponent item={item?.outlet} />

      <hr className="my-4 bg-[#ddd] h-[2px]" />

      <InfoDescriptionComponent title="Mô tả tình trạng" text={item?.content} />

      <hr className="my-4 bg-[#ddd] h-[2px]" />

      <InfoMediaComponent images={item?.images} videos={item?.videos} />

      <hr className="my-4 bg-[#ddd] h-[2px]" />

      <InfoCodeComponent code={item?.code} />
    </div>
  );
};

export default InfoTicketRepairComponent;
