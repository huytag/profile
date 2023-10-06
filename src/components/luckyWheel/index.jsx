import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Button, Modal, Text } from "zmp-ui";
import { apiClient } from "../../services/api";
import { canViewReport } from "../../services/hasPermission";
import { loadingState } from "../../store/loading";
import { noticeErrorState } from "../../store/notice";
import { LUCKY_APP } from "../../utils/constApiRoute";

const LuckyWheelComponent = ({ item, action }) => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);
  const [isWheeling, setIsWheeling] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [nextWheel, setNextWheel] = useState();
  const [result, setResult] = useState({});
  let luckyWheel = null;

  const drawWheel = () => {
    luckyWheel = new Winwheel({
      numSegments: item?.detail?.num_of_coupons,
      drawMode: "image",
      animation: {
        type: "spinToStop",
        duration: 5,
        callbackFinished: () => {
          let winningSegment = luckyWheel.getIndicatedSegment();
          console.log(winningSegment);
          setIsVisible(true);
        },
      },
    });

    var luckyWheelImage = new Image();
    luckyWheelImage.onload = function () {
      luckyWheel.wheelImage = luckyWheelImage;
      luckyWheel.draw();
    };
    luckyWheelImage.src = item?.detail?.spin_image;
  };

  const startLucKy = () => {
    if (canViewReport()) {
      noticeError("Không được phép quay");
      return;
    }

    setLoading(true);
    apiClient
      .post(`${LUCKY_APP}/${item.id}/draw`)
      .then((res) => {
        setResult(res?.data?.result);
        setIsWheeling(true);

        setTimeout(() => {
          setIsWheeling(false);
        }, 5000);

        const wheel = nextWheel ?? luckyWheel;
        let stopAt = wheel.getRandomForSegment(
          res?.data?.result.coupon_index + 1
        );
        wheel.animation.stopAngle = stopAt;
        wheel.startAnimation();

        if (luckyWheel) {
          setNextWheel(luckyWheel);
        }

        action("oke");
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const restartWheel = () => {
    nextWheel.stopAnimation(false);
    nextWheel.rotationAngle = 0;
    nextWheel.draw();
  };

  useEffect(() => {
    drawWheel();
  }, [item]);

  return (
    <>
      <div
        className={`container_wheel relative py-4 max-w-[450px] rounded-lg mx-auto ${
          isWheeling && "pointer-events-none"
        }`}
      >
        <canvas
          id="canvas"
          width={window.innerWidth > 450 ? 350 : window.innerWidth - 70}
          height={window.innerWidth > 450 ? 350 : window.innerWidth - 70}
          className="mx-auto"
          onClick={() => startLucKy()}
        >
          Trình duyệt không hỗ trợ, quý khách vui lòng mở bằng trình duyệt khác
          😔
        </canvas>
      </div>

      <Modal
        visible={isVisible}
        title="Kết quả"
        onClose={() => {
          setIsVisible(false);
          restartWheel();
        }}
        verticalActions
      >
        <img src={result?.coupon_img} className="w-10/12 mx-auto" />
        <Text.Title className="mt-2">{result?.result_title}</Text.Title>
        <Text className="mt-2">{result?.result_content}</Text>
        <Button
          className="mt-3"
          onClick={() => {
            setIsVisible(false);
            restartWheel();
          }}
          fullWidth
        >
          Tiếp tục quay
        </Button>
      </Modal>
    </>
  );
};

export default LuckyWheelComponent;
