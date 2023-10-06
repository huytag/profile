import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useRecoilState, useSetRecoilState } from "recoil";
import { chooseImage, getAccessToken, getLocation } from "zmp-sdk";
import { Sheet, Box, Button, Text, Input, Icon } from "zmp-ui";
import useImageUpload from "../../../hook/upload/useUpload";
import useValidator from "../../../hook/validator/useValidator";
import { apiClient, detail } from "../../../services/api";
import { storeAppState } from "../../../store/campaign";
import { loadingState } from "../../../store/loading";
import { noticeErrorState } from "../../../store/notice";
import { SAMPLING_DETAIL, ZALO_LOCATION } from "../../../utils/constApiRoute";
import SamplingGiftComponent from "../../campaign/gift";
import SamplingProductBuyComponent from "../../campaign/productBuy";
import ErrorComponent from "../../error";

const initState = {
  customer_name: null,
  customer_phone: null,
  customer_address: null,
  customer_images: [],
  note: null,
  sampling_product_gifts: [],
  sampling_product_sells: [],
  customer_address_lat: null,
  customer_address_lng: null,
};

const SheetSamplingCustomer = ({ isVisible, action }) => {
  const { campaignId } = useParams();
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [appStore, setAppStore] = useRecoilState(storeAppState);
  const [data, setData] = useState(initState);
  const [errorNumber, setErrorNumber] = useState(false);
  const productRef = useRef();
  const giftRef = useRef();
  const { image, loading, error, parseBlob } = useImageUpload();
  const {
    listError,
    setDefaultError,
    passValidator,
    checkValidator,
    settKeyOk,
  } = useValidator();

  const assignDataComponent = useCallback((value, key) => {
    setData({ ...data, [key]: value });
    if (!value.length) {
      return;
    }

    settKeyOk(key, value);
  });

  const uploadImage = () => {
    chooseImage({
      sourceType: ["camera"],
      cameraType: "back",
      success: ({ filePaths, tempFiles }) => {
        if (tempFiles[0].size > 20e6) {
          noticeError("Hình ảnh không được quá 20MB!");
          return;
        }
        parseBlob(filePaths[0]);
      },
      fail: (error) => noticeError(error?.message),
    });
  };

  const getDataLocation = (accessToken, locationToken) => {
    apiClient
      .post(ZALO_LOCATION, {
        access_token: accessToken,
        location_token: locationToken,
      })
      .then((res) => {
        setData({
          ...data,
          customer_address_lng: res.data.longitude,
          customer_address_lat: res.data.latitude,
        });
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  const handleChange = (e, isRequired = true) => {
    if (e.target.name === "customer_phone") {
      setErrorNumber(!(e.target.value.length === 10));
    }

    setData({ ...data, [e.target.name]: e.target.value });
    settKeyOk(e.target.name, e.target.value, isRequired);
  };

  const handleSubmit = () => {
    checkValidator(
      [
        "customer_name",
        "customer_phone",
        "sampling_product_sells",
        "sampling_product_gifts",
        "customer_images",
      ],
      data
    );

    if (data?.customer_phone?.length !== 10) {
      noticeError("Số điện thoại phải là 10 số!");
      setErrorNumber(true);
      return;
    }

    if (!passValidator()) {
      noticeError("Vui lòng chọn trường bị thiếu");
      return;
    }

    setErrorNumber(false);

    onAddCustomer();
  };

  const onAddCustomer = () => {
    action("ok", data);

    setData({
      ...initState,
      customer_address_lat: data.customer_address_lat,
      customer_address_lng: data.customer_address_lng,
    });

    productRef.current.onResetData();
    giftRef.current.onResetData();

    setDefaultError();
  };

  const getDetailApp = async () => {
    await detail(SAMPLING_DETAIL, campaignId)
      .then((res) => {
        setAppStore(res?.data?.sampling_app);
      })
      .catch((error) => noticeError(error?.message));
  };

  useEffect(() => {
    getAccessToken({
      success: (accessToken) => {
        getLocation({
          success: async (response) => {
            if (Boolean(import.meta.env.VITE_IS_MOBILE)) {
              getDataLocation(accessToken, response?.token);
              return;
            }

            setData({
              ...data,
              customer_address_lng: response.longitude,
              customer_address_lat: response.latitude,
            });
          },
          fail: (error) => {
            noticeError(error?.message);
            setLoading(false);
          },
        });
      },
      fail: (error) => {
        noticeError(error?.message);
        setLoading(false);
      },
    });

    getDetailApp();
  }, []);

  useEffect(() => {
    setLoading(loading);

    if (error) {
      noticeError(error);
      return;
    }

    if (!image) {
      return;
    }

    settKeyOk("customer_images", [image]);
    setData({ ...data, customer_images: [image] });
  }, [image, loading]);

  useEffect(() => {
    setData({
      ...initState,
      customer_address_lat: data.customer_address_lat,
      customer_address_lng: data.customer_address_lng,
    });

    setDefaultError();
  }, [isVisible]);

  return (
    <>
      <Sheet
        visible={isVisible}
        title="Thêm mới khách hàng"
        onClose={() => action("cancel")}
        autoHeight
        mask
        handler
        swipeToClose
        unmountOnClose={true}
      >
        <Box p={4} className="bottom-sheet-body" style={{ overflowY: "auto" }}>
          <Text.Title size="normal">Khách hàng</Text.Title>
          <Input
            type="text"
            name="customer_name"
            placeholder="Tên khách hàng"
            status={listError?.customer_name ? "error" : ""}
            errorText="Nhập tên khách hàng"
            value={data.customer_name}
            onChange={handleChange}
          />
          <Text.Title size="normal" className="mt-3">
            Số điện thoại
          </Text.Title>
          <Input
            type="number"
            name="customer_phone"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Số điện thoại"
            status={listError?.customer_phone || errorNumber ? "error" : ""}
            errorText="Nhập số điện thoại và phải là 10 số"
            value={data.customer_phone}
            onChange={handleChange}
          />
          <Text.Title size="normal" className="mt-3">
            Địa chỉ
          </Text.Title>
          <Input
            type="text"
            placeholder="Địa chỉ"
            name="customer_address"
            value={data.customer_address}
            onChange={(e) => handleChange(e, false)}
          />
          <hr className="border border-dashed my-4" />
          <SamplingProductBuyComponent
            ref={productRef}
            passDataToParent={(value) =>
              assignDataComponent(value, "sampling_product_sells")
            }
          />
          <ErrorComponent
            title="Thêm sản phẩm mua"
            isShow={listError?.sampling_product_sells}
          />
          <hr className="border border-dashed my-4" />
          <SamplingGiftComponent
            ref={giftRef}
            passDataToParent={(value) =>
              assignDataComponent(value, "sampling_product_gifts")
            }
          />
          <ErrorComponent
            title="Thêm sản phẩm quà tặng"
            isShow={listError?.sampling_product_gifts}
          />
          <hr className="border border-dashed my-4" />
          <Text.Title size="normal" className="mt-3">
            Ảnh chụp khách hàng
          </Text.Title>
          <ErrorComponent
            title="Thêm hình ảnh"
            isShow={listError?.customer_images}
          />
          <div className="flex gap-5 mt-3">
            <div
              className="w-[50vw] h-[50vw] flex items-center justify-center border"
              onClick={() => uploadImage()}
            >
              {data?.customer_images.length ? (
                <img
                  src={data?.customer_images}
                  className="object-contain w-full h-full"
                />
              ) : (
                <Icon icon="zi-camera" size={100} />
              )}
            </div>
            <div>
              <Text.Title size="small">
                Long:{" "}
                <span className="font-normal">
                  {data?.customer_address_lng}
                </span>
              </Text.Title>
              <Text.Title size="small" className="mt-3">
                Lat:{" "}
                <span className="font-normal">
                  {data?.customer_address_lat}
                </span>
              </Text.Title>
              <Text.Title size="small" className="mt-3">
                Thời gian:{" "}
                <span className="font-normal">
                  {moment().format("DD/MM/YYYY HH:mm")}
                </span>
              </Text.Title>
            </div>
          </div>
          <Text.Title size="normal" className="mt-3">
            Ghi chú
          </Text.Title>
          <Input.TextArea
            className="custom-class"
            placeholder="Nội dung ghi chú"
            value={data.note}
            onChange={(e) => setData({ ...data, note: e.target.value })}
          />
        </Box>
        <Box p={4} className="custom-bottom-sheet" flex flexDirection="column">
          <Box flex flexDirection="row" mt={1}>
            <Box style={{ flex: 1 }} pr={1}>
              <Button
                fullWidth
                variant="secondary"
                type="danger"
                onClick={() => action("cancel")}
              >
                Huỷ
              </Button>
            </Box>
            <Box style={{ flex: 1 }} pr={1}>
              <Button
                fullWidth
                variant="primary"
                onClick={() => handleSubmit()}
              >
                Lưu thông tin
              </Button>
            </Box>
          </Box>
        </Box>
      </Sheet>
    </>
  );
};

export default SheetSamplingCustomer;
