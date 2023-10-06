import React from "react";
import { Text, Input } from "zmp-ui";

const InfoDescriptionComponent = ({ title, text }) => {
  return (
    <>
      <Text.Title size="small">{title}</Text.Title>
      <Input.TextArea
        className="custom-class pointer-events-none bg-gray-300 border-none"
        showCount={false}
        value={text}
      />
    </>
  );
};

export default InfoDescriptionComponent;
