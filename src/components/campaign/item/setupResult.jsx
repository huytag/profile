import React from "react";
import { Text } from "zmp-ui";
import noImage from "../../../static/no-image.png";
import { Link } from "react-router-dom";
import TextBaseLineComponent from "../../textBaseLine";
import moment from "moment";

const ItemAppSetupResultComponent = ({ item }) => {
  return (
    <>
      <div className="p-3 bg-white rounded-xl shadow-lg shadow-black-500/50 mt-3 duration-500">
        <Link to={`/campaigns/setup-results/${item?.id}`}>
          <Text.Title size="normal">{item?.item_name ?? "-"}</Text.Title>
          <div className="text-4xl flex mt-3">
            <img
              src={item?.item_images ?? noImage}
              alt="alt source"
              className="max-w-[25vw] w-full h-[25vw] object-cover aspect-square"
            />
            <div
              style={{ width: `calc(100% - 33vw)` }}
              className="mx-auto flex flex-col justify-between"
            >
              <div>
                <TextBaseLineComponent
                  title="Trạng thái"
                  value={item?.status_text}
                  mt={0}
                />
                <TextBaseLineComponent
                  title="Mã yêu cầu"
                  value={item?.request_code}
                  mt={1}
                />
                <TextBaseLineComponent
                  title="Ngày tạo"
                  value={moment(item?.created_at).format("DD/MM/YYYY")}
                  mt={1}
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default ItemAppSetupResultComponent;
