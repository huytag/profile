import React from "react";
import { Text, Avatar } from "zmp-ui";

const ProfileComponent = ({ user }) => {
  return (
    <>
      <div className="text-center mt-4">
        <Avatar src={user?.avatar} size={80} />
        <Text.Title size="xLarge" className="mt-3">
          {user?.full_name ?? "-"}
        </Text.Title>
      </div>

      <div className="price px-5 py-3 text-4xl items-center mt-4 bg-white rounded-xl shadow-lg shadow-black-500/50">
        <Text.Title size="normal" className="mt-3">
          Thông tin chi tiết
        </Text.Title>
        <hr className="block h-[2px] bg-[#ccc] mt-2" />
        <ul>
          <li className="flex justify-between py-3 border-b-2 last:border-0">
            <Text size={14}>Mã nhân viên</Text>
            <Text size={14} className="ml-2">
              {user?.code ?? "-"}
            </Text>
          </li>
          <li className="flex justify-between py-3 border-b-2 last:border-0">
            <Text size={14}>Vị trí</Text>
            <Text size={14} className="ml-2">
              {user?.working_position ?? "-"}
            </Text>
          </li>
          <li className="flex justify-between py-3 border-b-2 last:border-0">
            <Text size={14}>Email</Text>
            <Text size={14} className="ml-2">
              {user?.email ?? "-"}
            </Text>
          </li>
          <li className="flex justify-between py-3 border-b-2 last:border-0">
            <Text size={14}>Số điện thoại</Text>
            <Text size={14} className="ml-2">
              {user?.phone ?? "-"}
            </Text>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ProfileComponent;
