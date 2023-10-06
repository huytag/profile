import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSetRecoilState } from "recoil";
import { Button, Icon, Page, Text, useNavigate } from "zmp-ui";
import SamplingInventoryComponent from "../../../components/campaign/samplingInventory";
import HeaderComponent from "../../../components/header";
import ModalApproveComponent from "../../../components/modal/approve";
import SheetSamplingCustomer from "../../../components/sheet/sampling/addCustomer";
import TextBaseLineComponent from "../../../components/textBaseLine";
import { apiClient, create, list } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { format_currency } from "../../../utils";
import {
  SAMPLING_DETAIL,
  SAMPLING_RESULT_DETAIL,
} from "../../../utils/constApiRoute";

const CampaignSamplingDetailPage = () => {
  const { customerId, campaignId } = useParams();
  const setLoading = useSetRecoilState(loadingState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [item, setItem] = useState();
  const [customers, setCustomers] = useState([]);
  const [numberData, setNumberData] = useState({
    total_revenue: 0,
    total_customer: 0,
    total_gift: 0,
  });
  const [modelShow, setModelShow] = useState({
    ok: false,
    cancel: false,
  });

  const getList = async () => {
    setLoading(true);
    await list(`${SAMPLING_DETAIL}/${campaignId}/outlets/${customerId}`)
      .then((response) => {
        setItem(response?.data?.sampling_result);
        setCustomers(response?.data?.sampling_result?.customers);
        setNumberData({
          total_revenue: response?.data?.sampling_result?.total_revenue,
          total_customer: response?.data?.sampling_result?.total_customer,
          total_gift: response?.data?.sampling_result?.total_gift,
        });
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const actionSheet = useCallback((type, data) => {
    if (type === "cancel") {
      setIsVisible(false);
      return;
    }

    create(`${SAMPLING_RESULT_DETAIL}/${item?.id}/add-customer`, data)
      .then(() => {
        noticeSuccess("Thêm thành công");
        changeRevenueUI(data);
      })
      .catch((error) => {
        noticeError(error?.message);
      })
      .finally(() => setLoading(false));
  });

  const changeRevenueUI = (data) => {
    const totalRevenue = _.reduce(
      data?.sampling_product_sells,
      (prev, current) => prev + current?.total ?? 0,
      0
    );

    setNumberData((prev) => ({
      total_revenue: prev.total_revenue + totalRevenue,
      total_customer: prev.total_customer + 1,
      total_gift:
        prev.total_gift +
        data?.sampling_product_gifts.reduce(
          (prev, next) => prev + next?.quantity,
          0
        ),
    }));

    setCustomers((prev) => [
      {
        customer_name: data?.customer_name,
        customer_phone: data?.customer_phone,
        customer_revenue: totalRevenue,
        product_gifts: data?.sampling_product_gifts.map((i) => {
          return {
            product_name: i?.sampling_product_name,
            quantity: i?.quantity,
          };
        }),
      },
      ...prev,
    ]);
  };

  const modalAction = useCallback((type) => {
    setModelShow({ ...modelShow, ok: false });
    if (type === "cancel") return;

    create(`${SAMPLING_DETAIL}/${campaignId}/results`, {
      outlet_code: customerId,
    })
      .then(() => {
        noticeSuccess("Tham gia thành công");
        getList();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  });

  const modalActionCancel = useCallback((type) => {
    setModelShow({ ...modelShow, cancel: false });
    if (type === "cancel") return;

    apiClient
      .put(`${SAMPLING_RESULT_DETAIL}/${item?.id}/cancel`, {
        outlet_code: customerId,
      })
      .then(() => {
        noticeSuccess("Huỷ thành công");
        navigate(`/campaigns/sampling/${campaignId}`);
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  });

  useEffect(() => {
    getList();
  }, []);

  return (
    <Page className="page " style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Chi tiết chương trình" />

      <div className="bg-white p-3 rounded-lg shadow-lg">
        <Text.Title className="text-center text-4xl border-b-2 border-dashed border-[#dddddd] pb-3 mb-3">
          Ngày : {item?.current_day}
        </Text.Title>
        <TextBaseLineComponent
          title="Tên cửa hàng"
          value={item?.outlet?.name}
          mt={1}
        />
        <TextBaseLineComponent
          title="Mã cửa hàng"
          value={item?.outlet?.code}
          mt={1}
        />

        {item?.checked_in_at && (
          <SamplingInventoryComponent item={item} action={() => getList()} />
        )}
      </div>

      <div className="bg-white p-3 rounded-lg shadow-lg mt-3">
        <ul className="mt-5">
          <li className="grid grid-cols-3 border-b-2 border-dashed border-[#dddddd] last:border-none py-3.5">
            <Text.Title size="small" className=" text-center">
              Tổng doanh thu
            </Text.Title>
            <Text.Title
              size="small"
              className="border-l-2 border-dashed text-center"
            >
              Số lượng KH
            </Text.Title>
            <Text.Title
              size="small"
              className="border-l-2 border-dashed text-center"
            >
              Số lượng quà tặng
            </Text.Title>
          </li>

          <li className="grid grid-cols-3 border-b-2 border-dashed border-[#dddddd] last:border-none py-3.5">
            <Text
              size="xSmall"
              className="text-center text-[#2B78E4] font-bold text-xl"
            >
              {format_currency(numberData?.total_revenue ?? 0)}
            </Text>
            <Text
              size="xSmall"
              className="border-l-2 border-dashed text-center text-[#2B78E4] font-bold text-xl"
            >
              {numberData?.total_customer ?? 0}
            </Text>
            <Text
              size="xSmall"
              className="border-l-2 border-dashed text-center text-[#2B78E4] font-bold text-xl"
            >
              {numberData?.total_gift ?? 0}
            </Text>
          </li>
        </ul>

        <div className="flex justify-between items-center mt-5">
          <Text.Title>Danh sách khách hàng</Text.Title>
          {item?.checked_in_at && (
            <div className="text-right">
              <Button
                size="large"
                size="medium"
                prefixIcon={<Icon icon="zi-plus" />}
                onClick={() => setIsVisible(true)}
              >
                Thêm mới
              </Button>
            </div>
          )}
        </div>

        <div className="overflow-x-scroll">
          <ul className="mt-3 min-w-[630px]">
            <li className="flex border-b-2 border-dashed border-[#dddddd] last:border-none py-3.5">
              <Text.Title size="small" className="w-[150px] text-center">
                Tên
              </Text.Title>
              <Text.Title
                size="small"
                className="border-l-2 border-dashed text-center w-[100px]"
              >
                SĐT
              </Text.Title>
              <Text.Title
                size="small"
                className="border-l-2 border-dashed text-center w-[100px]"
              >
                Doanh thu
              </Text.Title>
              <Text.Title
                size="small"
                className="border-l-2 border-dashed text-center w-[200px]"
              >
                Loại quà tặng
              </Text.Title>
              <Text.Title
                size="small"
                className="col-span-2 border-l-2 border-dashed text-center w-[80px]"
              >
                Số lượng
              </Text.Title>
            </li>
            {customers.map((i, index) => (
              <li
                className="flex border-b-2 border-dashed border-[#dddddd] last:border-none py-3.5"
                key={index}
              >
                <Text
                  size="xxSmall"
                  className="w-[150px] flex items-center break-words px-2"
                >
                  {i?.customer_name}
                </Text>
                <Text
                  size="xxSmall"
                  className="border-l-2 border-dashed px-2 flex justify-center items-center break-all w-[100px]"
                >
                  {i?.customer_phone}
                </Text>
                <Text
                  size="xxSmall"
                  className="border-l-2 border-dashed flex items-center justify-center break-all px-2 w-[100px]"
                >
                  {format_currency(i?.customer_revenue)}
                </Text>
                <Text
                  size="xxSmall"
                  className="border-l-2 border-dashed text-center p-2 w-[200px]"
                >
                  {i.product_gifts.map((value, index) => (
                    <p
                      className="px-2 py-1 rounded-xl text-left text-white truncate bg-red-700 mt-1 first:mt-0"
                      key={index}
                    >
                      {value?.product_name}
                    </p>
                  ))}
                </Text>
                <Text
                  size="xxSmall"
                  className="border-l-2 border-dashed break-all p-2 w-[80px]"
                >
                  {i.product_gifts.map((value, index) => (
                    <p
                      className="px-2 py-1 rounded-xl text-center bg-red-700 text-white mt-1 first:mt-0"
                      key={index}
                    >
                      {value?.quantity}
                    </p>
                  ))}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {!item?.checked_in_at && (
        <>
          <Button
            fullWidth
            className="mt-5"
            onClick={() => setModelShow({ ...modelShow, ok: true })}
          >
            Tham gia
          </Button>

          <ModalApproveComponent
            isVisible={modelShow.ok}
            title="Đồng ý tham gia chương trình"
            action={modalAction}
          />
        </>
      )}

      {item?.checked_in_at && (
        <>
          <Button
            fullWidth
            className="mt-5"
            onClick={() => setModelShow({ ...modelShow, cancel: true })}
          >
            Huỷ tham gia
          </Button>

          <ModalApproveComponent
            isVisible={modelShow.cancel}
            title="Huỷ tham gia chương trình"
            action={modalActionCancel}
          />
        </>
      )}

      <SheetSamplingCustomer isVisible={isVisible} action={actionSheet} />
    </Page>
  );
};

export default CampaignSamplingDetailPage;
