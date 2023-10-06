import {
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import { Swiper, Text } from "zmp-ui";

const CampaignInfoComponent = ({
  images = [],
  note,
  title = "Thông tin chi tiết",
  titleNote = "Ghi chú",
  duration = 5000,
  mt = 3,
}) => {
  const slideRef = useRef();

  return (
    <>
      <div className={`bg-white p-4 rounded-lg shadow-lg mt-${mt}`}>
        <Text.Title size="xLarge">{title}</Text.Title>

        <div className="mt-3 relative">
          <div
            className="absolute top-1/2 left-1 -translate-y-1/2 z-10 drop-shadow-2xl text-white"
            onClick={() => slideRef?.current?.prev()}
          >
            <FontAwesomeIcon icon={faCircleChevronLeft} size="2x" />
          </div>
          <div
            className="absolute top-1/2 right-1 -translate-y-1/2 z-10 drop-shadow-2xl text-white"
            onClick={() => slideRef?.current?.next()}
          >
            <FontAwesomeIcon icon={faCircleChevronRight} size="2x" />
          </div>
          <Swiper loop disableSwipe ref={slideRef}>
            {images?.map((item, index) => (
              <Swiper.Slide key={index} className="pointer-events-none">
                <img
                  className="slide-img w-full pointer-events-none"
                  src={item}
                  alt="slide-1"
                />
              </Swiper.Slide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className={`bg-white p-4 rounded-lg shadow-lg mt-${mt}`}>
        <Text.Title
          className="border-b-2 pb-1 border-dashed border-[#dddddd]"
          size="xLarge"
        >
          {titleNote}
        </Text.Title>
        {note && (
          <>
            <div
              className="mt-3"
              dangerouslySetInnerHTML={{ __html: note }}
            ></div>
          </>
        )}
      </div>
    </>
  );
};

export default CampaignInfoComponent;
