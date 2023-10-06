import React, { useEffect, useState } from "react";
import { Button, Modal, Text } from "zmp-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStartRegular } from "@fortawesome/free-regular-svg-icons";

const ModalConfirmComponent = ({ isVisible, action }) => {
  const [rate, setRate] = useState(1);

  useEffect(() => {
    setRate(1);
  }, [isVisible]);
  return (
    <Modal
      visible={isVisible}
      title="Đánh giá"
      onClose={() => action("cancel")}
      verticalActions
    >
      <div>
        <Text className="text-center text-lg">
          Bạn có hài lòng với dịch vụ của chúng tôi ?
        </Text>
        <div className="text-center text-yellow-500 text-3xl mt-3">
          {[...Array(rate)].map((value, index) => (
            <FontAwesomeIcon
              icon={faStar}
              key={index}
              onClick={() => setRate(index + 1)}
            />
          ))}
          {[...Array(5 - rate)].map((value, index) => (
            <FontAwesomeIcon
              icon={faStartRegular}
              key={index}
              onClick={() => setRate(rate + index + 1)}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 auto-cols-fr gap-1 mt-4">
        <Button onClick={() => action("cancel")} fullWidth variant="tertiary">
          Huỷ
        </Button>
        <Button onClick={() => action("oke", rate)} fullWidth>
          Xác nhận
        </Button>
      </div>
    </Modal>
  );
};

export default ModalConfirmComponent;
