import React, { useEffect, useState } from "react";
import { Text } from "zmp-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import EmptyComponent from "../empty";
import { notEmpty } from "../../utils";
import AnimateHeight from "react-animate-height";

const AccordionComponent = ({
  list = [],
  action = () => {},
  titleText = "xLarge",
  isNoneData = false,
  indexActive = 0,
}) => {
  const [isFirst, setIsFirst] = useState(true);
  const [activeIndex, setActiveIndex] = useState([indexActive]);

  const tabActive = (index) => {
    const indexdes = [...activeIndex];
    if (indexdes.findIndex((item) => item === index) < 0) {
      indexdes.push(index);
    } else {
      const newIndexes = indexdes.filter((item) => item !== index);
      setActiveIndex(newIndexes);
      return;
    }
    setActiveIndex(indexdes);
  };

  useEffect(() => {
    if (notEmpty(list) && isFirst) {
      setIsFirst(false);
    }
  }, [list]);

  return (
    <>
      {list.map((item, index) => (
        <div key={index} className="mt-3">
          {
            <div
              className={`bg-white p-4 rounded-t-lg flex justify-between items-center ${
                list.length < 1 && !item?.isOne ? "pointer-events-none" : ""
              }`}
              onClick={() => {
                tabActive(index);
                action();
              }}
            >
              <Text.Title size={titleText}>{item?.title}</Text.Title>
              <div className={`${list.length < 1 && !item?.isOne && "hidden"}`}>
                <FontAwesomeIcon
                  icon={!activeIndex.includes(index) ? faAngleDown : faAngleUp}
                />
              </div>
            </div>
          }

          <div
            className={`border-2 border-t-0 rounded-b-lg ${
              item?.bg ? "bg-white border-white" : "border-gray-300"
            }`}
          >
            <AnimateHeight
              animateOpacity={true}
              duration={300}
              easing="ease-in-out"
              height={
                !activeIndex.includes(index) ||
                (list.length < 1 && !item?.isOne)
                  ? 0
                  : "auto"
              }
            >
              <div className="p-3">{item?.component}</div>
            </AnimateHeight>
          </div>
        </div>
      ))}

      {isNoneData && list.length === 0 && (
        <div className="bg-white p-4 rounded-t-lg flex justify-center items-center mt-3">
          <EmptyComponent length={list.length} title="dữ liệu" />
        </div>
      )}
    </>
  );
};

export default AccordionComponent;
