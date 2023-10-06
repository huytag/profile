import React from "react";
import { Text } from "zmp-ui";
import { useSetRecoilState } from "recoil";
import { setTabStatusState } from "../../store/tab";

const TabComponent = ({
  isActive,
  items = [],
  action = () => {},
  cols = 3,
  keyTab = "all",
}) => {
  const setTabStatus = useSetRecoilState(setTabStatusState);

  const handleTab = (value) => {
    action(value);
    setTabStatus({ [keyTab]: value });
  };

  return (
    <ul
      className={`grid grid-cols-${cols} auto-cols-fr mt-5 bg-white rounded-xl shadow-lg shadow-black-500/50 overflow-hidden`}
    >
      {items.map((item, index) => (
        <li
          key={index}
          className={`text-center cursor-pointer py-4 border-r ${
            isActive === item?.value ? "bg-[#2b78e4] text-white" : ""
          }`}
          onClick={() => handleTab(item?.value)}
        >
          <Text size="xSmall" bold>
            {item?.text}
          </Text>
        </li>
      ))}
    </ul>
  );
};

export default TabComponent;
