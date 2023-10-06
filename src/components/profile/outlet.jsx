import React from "react";
import { Text, Avatar } from "zmp-ui";
import logo from "../../static/logo.jpg";
import ListItemsComponent from "../list/items";
import ListCampaignsComponent from "../list/campaigns";
import AccordionComponent from "../accordion";
import IconAvatar from "../icon/Avatar";

const OutletProfileComponent = ({ user }) => {
  const list = [
    {
      title: "Thiết bị đang quản lý",
      component: <ListItemsComponent items={[1, 2, 3]} />,
      key: "devices",
    },
    {
      title: "Chương trình đang tham gia",
      component: <ListCampaignsComponent />,
      key: "campaigns",
    },
  ];

  return (
    <>
      <div className="price px-5 py-3 text-4xl items-center mt-4 bg-white rounded-xl shadow-lg shadow-black-500/50">
        <div className="flex items-center">
          <Avatar
            story="default"
            online
            size={120}
            src={user?.avatar ?? logo}
            className="min-w-[120px]"
          />
          <Text.Title size="large" className="ml-2 mt-3">
            {user?.full_name ?? "-"}
          </Text.Title>
        </div>
        <Text.Title size="normal" className="mt-3">
          Thông tin chi tiết
        </Text.Title>
        <hr className="block h-[2px] bg-[#ccc] my-2" />
        <Text size={16}>Mã cửa hàng: {user?.code ?? "-"}</Text>
        <Text size={16}>
          Loại hình kinh doanh: {user?.business_type ?? "-"}
        </Text>
        <Text size={16}>Số điện thoại: {user?.phone ?? "-"}</Text>
        <Text size={16}>Địa chỉ: {user?.full_address ?? "-"}</Text>
      </div>

      <div className="price px-5 py-3 text-4xl items-center mt-4 bg-white rounded-xl shadow-lg shadow-black-500/50 mb-4">
        <Text.Title size="normal" className="mt-3">
          Nhân viên bảo trì
        </Text.Title>
        <hr className="block h-[2px] bg-[#ccc] my-2" />
        <div className="flex items-center justify-between">
          <IconAvatar className="w-20" />
          <div style={{ width: `calc(100% - 100px)` }}>
            <Text.Title size="normal">Vũ Ngọc Hà</Text.Title>
            <Text size={16} className="mt-2">
              Bộ phận: Saleman
            </Text>
            <Text size={16}>Mã nhân viên: 5702</Text>
            <Text size={16}>Số điện thoại: 0958394031</Text>
          </div>
        </div>
      </div>

      {/* <AccordionComponent list={list} /> */}
    </>
  );
};

export default OutletProfileComponent;
