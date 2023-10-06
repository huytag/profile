import React from "react";
import { Text } from "zmp-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStartRegular } from "@fortawesome/free-regular-svg-icons";

const RatingComponent = ({ rating, count, isShowNumber = true }) => {
  const fullStars = Math.floor(rating ?? 0);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <>
      <div className="flex flex-wrap items-end text-2xl mt-1 text-yellow-400">
        {Array.from(Array(fullStars), (e, i) => (
          <FontAwesomeIcon icon={faStar} key={i} />
        ))}
        {hasHalfStar && <FontAwesomeIcon icon={faStarHalfStroke} />}
        {Array.from(Array(emptyStars), (e, i) => (
          <FontAwesomeIcon icon={faStartRegular} key={i} />
        ))}
        {isShowNumber && (
          <Text size="xLarge" className="ml-2 text-black">
            {rating}
          </Text>
        )}
      </div>
    </>
  );
};

export default RatingComponent;
