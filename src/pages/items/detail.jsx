import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Page, Text, Button, Icon } from "zmp-ui";
import { useSetRecoilState } from "recoil";
import { noticeErrorState } from "../../store/notice";
import { loadingState } from "../../store/loading";
import { apiClient, detail } from "./../../services/api";
import HeaderComponent from "../../components/header";
import AvatarItemComponent from "../../components/items/avatar";
import SheetCreateTicketComponent from "../../components/sheet/ticket/create";
import { ITEMS, ZALO_LOCATION } from "../../utils/constApiRoute";
import { hasPermission } from "../../services/hasPermission";
import {
  perItemDefault,
  perTicketDefault,
  PER_ASSET_ITEM_TICKET_HISTORY,
  PER_ASSET_TICKET_CREATE,
} from "../../utils/enumPermission";
import { getAccessToken, getLocation } from "zmp-sdk";
import axios from "axios";
import TextBaseLineComponent from "../../components/textBaseLine";
import { showNavigationState } from "../../store/navigation";
import { LIQUIDATED } from "../../utils/enumItem";
import InfoTablePriceComponent from "../../components/info/tablePrice";
import DeviceTicketHistoryComponent from "../../components/tickets/history/device";
import { parseUtcToLocal } from "../../utils";

//TODO : change api google
const ItemDetailPage = () => {
  let { itemId } = useParams();
  const setShowNavBottom = useSetRecoilState(showNavigationState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [item, setItem] = useState();
  const [address, setAddress] = useState({
    item_lng: "",
    item_lat: "",
    item_address: "",
  });

  // DETAIL DEVICE
  const getDetail = async () => {
    await detail(ITEMS, itemId)
      .then((response) => {
        setItem(response.data.item);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  // GET DATA FROM SHEET
  const actionSheet = (action, data) => {
    setSheetVisible(false);
    if (action === "cancel") return;

    getDetail();
  };

  // GET LOCATION
  const getLoc = async () => {
    getAccessToken({
      success: (accessToken) => {
        getLocation({
          success: async (data) => {
            if (Boolean(import.meta.env.VITE_IS_MOBILE)) {
              getDataLocation(accessToken, data?.token);
              return;
            }

            setSheetVisible(true);
            setLoading(false);
            getAddressFromCoordinates(data.latitude, data.longitude);
            setAddress({
              ...address,
              item_lng: data.longitude,
              item_lat: data.latitude,
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
  };

  const getDataLocation = (accessToken, locationToken) => {
    apiClient
      .post(ZALO_LOCATION, {
        access_token: accessToken,
        location_token: locationToken,
      })
      .then((res) => {
        getAddressFromCoordinates(res.data.latitude, res.data.longitude);
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  const getAddressFromCoordinates = (latitude, longitude) => {
    const apiKey = import.meta.env.VITE_GOOGLEMAP_API_KEY;
    // const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    const geocodingApiUrl = `https://rsapi.goong.io/Geocode?latlng=${latitude},${longitude}&api_key=LCnGg1ThwJNFBPZsvuE9rej2a2nYhM02NvdYqgz9`;

    https: axios
      .get(geocodingApiUrl)
      .then((response) => {
        if (response.data.results.length > 0) {
          const currentAddress = response.data.results[0].formatted_address;

          setAddress({
            item_lng: longitude,
            item_lat: latitude,
            item_address: currentAddress,
          });
          setSheetVisible(true);
        } else {
          console.log(response.data?.error_message);
          noticeError("Lấy vị trí hiện tại thất bại, vui lòng thử lại!");
        }
      })
      .catch((error) => {
        console.log(error);
        noticeError("Lấy vị trí hiện tại thất bại, vui lòng thử lại!");
      })
      .finally(() => setLoading(false));
  };

  const loadApi = async () => {
    await getDetail();
  };

  useEffect(() => {
    setLoading(true);
    setShowNavBottom(true);

    loadApi();
  }, []);

  return (
    <Page
      className="page px-3"
      style={{ paddingTop: "60px" }}
      hideScrollbar={true}
    >
      <HeaderComponent title="Thông tin thiết bị" />
      <div className="p-3 text-4xl bg-white rounded-xl shadow-lg shadow-black-500/50">
        <AvatarItemComponent id={item?.id} avatar={item?.image_url} />

        <Text.Title size="large" className="mt-8">
          {item?.name ?? "-"}
        </Text.Title>
        <TextBaseLineComponent title="SKU" value={item?.sku} mt={5} />
        <TextBaseLineComponent title="Loại thiết bị" value={item?.type} />
        <TextBaseLineComponent
          title="Hãng sản xuất"
          value={item?.attribute_2}
        />
        <TextBaseLineComponent title="Dung tích" value={item?.attribute_1} />
        <TextBaseLineComponent
          title="Địa chỉ lắp đặt"
          value={item?.installation_address}
        />
        <TextBaseLineComponent
          title="Thời gian lắp đặt"
          value={parseUtcToLocal(item?.installation_at, "DD/MM/YYYY")}
        />
        <TextBaseLineComponent
          title="Tình trạng bảo hành"
          value={item?.warranty}
        />
        <TextBaseLineComponent
          title="Tình trạng thanh lý"
          value={
            item?.status === LIQUIDATED ? "Đã thanh lý" : item?.liquidation
          }
        />

        <div
          className={`mt-5 
            ${
              item?.open_ticket_id || item?.status === LIQUIDATED
                ? "hidden"
                : ""
            }
            ${hasPermission([...perTicketDefault, PER_ASSET_TICKET_CREATE])}`}
        >
          <Button
            variant="secondary"
            fullWidth
            size="medium"
            type="danger"
            prefixIcon={<Icon icon="zi-warning-solid" />}
            onClick={() => {
              setLoading(true);
              getLoc();
            }}
          >
            Yêu cầu sửa chữa
          </Button>
        </div>
      </div>

      {item?.has_accumulate_permission && (
        <div className="p-3 text-4xl bg-white rounded-xl shadow-lg shadow-black-500/50 mt-5">
          <InfoTablePriceComponent item={item} />
        </div>
      )}

      {item && item?.can_create_ticket && (
        <SheetCreateTicketComponent
          id={itemId}
          address={address}
          isVisible={sheetVisible}
          action={actionSheet}
        />
      )}

      {!hasPermission([...perItemDefault, PER_ASSET_ITEM_TICKET_HISTORY]) && (
        <DeviceTicketHistoryComponent itemId={itemId} />
      )}
    </Page>
  );
};

export default ItemDetailPage;
