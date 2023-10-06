import React from "react";
import { Swiper } from "zmp-ui";
import noImage from "../../../static/no-image.png";

const CampaignBannerComponent = ({ src = [] }) => {
  return (
    <>
      <Swiper autoplay loop>
        {src?.map((item, index) => (
          <Swiper.Slide key={index}>
            <img
              className="slide-img w-full"
              src={item ?? noImage}
              alt="slide-1"
            />
          </Swiper.Slide>
        ))}
      </Swiper>
    </>
  );
};

export default CampaignBannerComponent;
