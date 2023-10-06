import React, { useState } from "react";
import { Text, ImageViewer } from "zmp-ui";

const InfoMediaComponent = ({
  images = [],
  videos = [],
  titleImage = "Hình ảnh về tình trạng hư hỏng",
  titleVideos = "Video về tình trạng hư hỏng",
}) => {
  const listImg = images?.map((i, index) => {
    return {
      src: i,
      alt: "alt",
      key: index,
    };
  });

  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <Text.Title size="small" className="mt-5">
        {titleImage}
      </Text.Title>
      <div className="grid grid-cols-4 gap-2 mt-2 min-h-[75px]">
        {images?.map((item, index) => (
          <div
            className="border flex items-center"
            key={index}
            onClick={() => {
              setActiveIndex(index);
              setVisible(true);
            }}
          >
            <img src={item} />
          </div>
        ))}
      </div>

      {videos?.length >= 1 && (
        <>
          <Text.Title size="small" className="mt-5">
            {titleVideos}
          </Text.Title>
          <div className="mt-2">
            {videos.map((item, index) => (
              <div className="border" key={index}>
                <video width="100%" src={item} controls></video>
              </div>
            ))}
          </div>
        </>
      )}

      <ImageViewer
        onClose={() => setVisible(false)}
        activeIndex={activeIndex}
        images={listImg}
        visible={visible}
      />
    </>
  );
};

export default InfoMediaComponent;
