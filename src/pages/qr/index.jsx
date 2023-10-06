import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button, Icon, useNavigate } from "zmp-ui";
import { useSetRecoilState } from "recoil";
import { noticeErrorState } from "../../store/notice";
import { detail } from "../../services/api";
import { ITEMS_QRCODE } from "../../utils/constApiRoute";
import { showNavigationState } from "../../store/navigation";
import { loadingState } from "../../store/loading";

const QrPage = () => {
  const navigate = useNavigate();
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const showBottomMenu = useSetRecoilState(showNavigationState);
  const [camera, setCamera] = useState();
  const [qrCode, setQrCode] = useState();
  const fileRef = useRef();
  let hasSku = false;
  const url = window.location.pathname.split("/").pop();

  useEffect(() => {
    if (url === "qr") return;

    if (!qrCode) return;

    if (qrCode?.isScanning) {
      qrCode.stop();
    }
  }, [url]);

  const getDeviceBySku = async (sku) => {
    setLoading(true);

    await detail(ITEMS_QRCODE, sku)
      .then((response) => {
        navigate("/devices/" + response.data.item.id);
        qrCode.stop();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
        hasSku = false;
      });
  };

  const handleBack = () => {
    showBottomMenu(true);
    navigate(-1);
  };

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    setQrCode(html5QrCode);

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCamera(devices);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    showBottomMenu(false);
  }, []);

  useEffect(() => {
    if (!camera) return;

    qrCode
      .start(
        camera[1] ? camera[1].id : camera[0].id,
        {
          fps: 3,
          qrbox: { width: 300, height: 300 },
          rememberLastUsedCamera: true,
        },
        (decodedText, decodedResult) => {
          if (hasSku) {
            return;
          }

          hasSku = true;
          getDeviceBySku(decodedText);
        },
        (errorMessage) => {}
      )
      .catch((err) => {
        noticeError(err);
      });
  }, [camera]);

  return (
    <div>
      <Icon icon="zi-close" size={50} onClick={() => handleBack()} />
      <div id="reader" className="w-[90%] mx-auto my-3 ">
        Đang loading camera...
      </div>
      <div id="reader-image" className="hidden"></div>

      <div className="px-4">
        <Button
          fullWidth
          size="medium"
          disabled={!camera}
          prefixIcon={<Icon icon="zi-camera" />}
          onClick={() => {
            fileRef.current.click();
          }}
        >
          Tải ảnh lên
        </Button>
      </div>
      <input
        className="mt-5"
        type="file"
        id="qr-input-file"
        ref={fileRef}
        hidden
        accept="image/*"
        onChange={(e) => {
          if (e.target.files.length == 0) {
            return;
          }

          const imageFile = e.target.files[0];
          const html5QrCode = new Html5Qrcode("reader-image");
          html5QrCode
            .scanFile(imageFile, true)
            .then((decodedText) => {
              getDeviceBySku(decodedText);
            })
            .catch((err) => {
              console.log(`Error scanning file. Reason: ${err}`);
              noticeError("Hình ảnh QR không đúng vui lòng thử lại");
            });
        }}
      />
    </div>
  );
};

export default QrPage;
