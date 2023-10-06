import React, { createRef, useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { Text } from "zmp-ui";
import { setTabStatusState } from "../../store/tab";

const Tab2Component = ({
  isActive,
  items = [],
  action,
  widthContainer,
  widthChild,
  mt = 3,
  keyTab = "all",
}) => {
  const setTabStatus = useSetRecoilState(setTabStatusState);
  const navRefs = useRef([]);
  navRefs.current = items.map((_, i) => navRefs.current[i] ?? createRef());

  const handleTab = (value) => {
    action(value);
    setTabStatus({ [keyTab]: value });
  };

  const scrollTo = (index) => {
    setTimeout(() => {
      if (index === navRefs.current.length) {
        navRefs.current[index - 1]?.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "end",
        });
      } else {
        navRefs.current[index]?.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "center",
        });
      }
    }, 300);
  };

  useEffect(() => {
    scrollTo(isActive);
  }, [isActive]);

  return (
    <div className={`overflow-x-scroll beatiful-scrollbar mt-${mt}`}>
      <ul className={`bg-white flex ${widthContainer}`}>
        {items.map((item, index) => (
          <li
            key={index}
            className={`text-center cursor-pointer py-4 border-r ${widthChild} ${
              isActive === item?.value ? "bg-[#2b78e4] text-white" : ""
            }`}
            ref={navRefs.current[index]}
            onClick={() => handleTab(item?.value)}
          >
            <Text size="xSmall" bold>
              {item?.text}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tab2Component;
