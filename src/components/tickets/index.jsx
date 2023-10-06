import React from "react";
import { Text } from "zmp-ui";
import noImage from "../../static/no-image.png";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { showNavigationState } from "../../store/navigation";
import { parseTicketStatusBg } from "../../services/parseEnumTicket";
import TextBaseLineComponent from "../textBaseLine";
import moment from "moment";

const TicketComponent = ({ item }) => {
  const isShowBottom = useSetRecoilState(showNavigationState);
  const status = parseTicketStatusBg(item?.status);

  return (
    <>
      <div className="p-3 bg-white rounded-xl shadow-lg shadow-black-500/50 mt-3 duration-500">
        <Link to={`${item?.id}`} onClick={() => isShowBottom(false)}>
          <div className="flex justify-between items-center">
            <Text.Title size="normal">{item?.item?.name ?? "-"}</Text.Title>
            <Text
              size="normal"
              className={`text-white px-3 py-1 rounded-md ${status}`}
            >
              {item?.status_text}
            </Text>
          </div>
          <div className="text-4xl flex mt-3">
            <img
              src={item?.item?.image_url ?? noImage}
              alt="alt source"
              className="max-w-[25vw] w-full h-[25vw] object-cover aspect-square"
            />
            <div
              style={{ width: `calc(100% - 33vw)` }}
              className="mx-auto flex flex-col justify-between"
            >
              <div>
                <TextBaseLineComponent
                  title="Mã yêu cầu"
                  value={item?.code}
                  mt={0}
                />
                <TextBaseLineComponent
                  title="Trạng thái"
                  value={item?.sub_status_text}
                  mt={1}
                />
                <TextBaseLineComponent
                  title="Phương án"
                  value={item?.method_type_text}
                  mt={1}
                />
                <TextBaseLineComponent
                  title="Lịch dự kiến"
                  value={
                    item?.estimate_date &&
                    moment(item?.estimate_date).format("DD/MM/YYYY")
                  }
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

export default TicketComponent;
