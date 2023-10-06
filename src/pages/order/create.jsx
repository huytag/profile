import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Page, Input, Text, Icon, Checkbox, Sheet, Box, Button } from "zmp-ui";
import HeaderComponent from "../../components/header";
import { loadingState } from "../../store/loading";
import { noticeErrorState } from "../../store/notice";
import OrderItemComponent from "../../components/items/order";
import { list } from "../../services/api";
import * as EnumApi from "../../utils/constApiRoute";
import _ from "lodash";
import InputQuantity from "../../components/input/quantity";
import SheetCartComponent from "../../components/sheet/cart";
import { empty } from "../../utils";
import { orderDefaultState } from "../../store/order";
import AnimateHeight from "react-animate-height";
import { IconCart } from "../../components/icon";

const CreateOrderPage = () => {
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const orderStore = useRecoilValue(orderDefaultState);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState({});
  const [filterProducts, setFilterProducts] = useState({});
  const [dataChecked, setDataChecked] = useState([]);
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState({
    id: null,
    quantity_bins: 0,
    quantity_boxes: 0,
  });
  const [pickAll, setPickAll] = useState({
    code: null,
    isAll: false,
  });
  const [note, setNote] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCart, setVisibleCart] = useState(false);
  const [keyword, setKeyword] = useState("");

  const fetchItems = () => {
    setLoading(true);

    list(EnumApi.ORDER_PRODUCT_CLASSES)
      .then((res) => {
        setItems(res.data.product_classes);
        fetchProducts();
      })
      .catch((error) => noticeError(error?.message))
      .then(() => setLoading(false));
  };

  const fetchProducts = (keyword = null) => {
    list(EnumApi.ORDER_PRODUCTS, { keyword })
      .then((res) => {
        setProducts(res?.data.product_classes);
        getFilterProducts(keyword, res?.data.product_classes);
      })
      .catch((error) => noticeError(error?.message))
      .then(() => setLoading(false));
  };

  const handleSearch = (value) => {
    setKeyword(value);
    startSearch(value, products);
  };

  const startSearch = useCallback(
    _.debounce((search, products) => {
      getFilterProducts(search, products);
    }, 500),
    []
  );

  const getFilterProducts = (search = null, data = {}) => {
    if (!search) {
      setFilterProducts(data);
      return;
    }

    const lowercasedSearch = search.toLowerCase();
    const filteredProducts = {};

    Object.keys(data).forEach((key) => {
      const productList = data[key];

      const filteredList = productList.filter((product) => {
        const lowercasedName = product?.name.toLowerCase();
        const lowercasedCode = product?.code.toLowerCase();

        return (
          lowercasedName.includes(lowercasedSearch) ||
          lowercasedCode.includes(lowercasedSearch)
        );
      });

      if (filteredList.length > 0) {
        filteredProducts[key] = filteredList;
      }
    });

    setFilterProducts(filteredProducts);
  };

  const handleCheckbox = (e, index) => {
    const { value, checked } = e.target;
    let newList = [...dataChecked];

    if (index === items.length) {
      newList = _.map(items, (i, index) => {
        return {
          ...newList[index],
          isActive: checked,
          checked: checked,
          value: i.code,
        };
      });
    }

    if (!checked) {
      newList[items.length] = {
        checked: false,
        value: "all",
      };
    }

    newList[index] = {
      ...newList[index],
      isActive: newList[index]?.isActive || checked,
      checked: checked,
      value,
    };
    setDataChecked(newList);
  };

  const handleTab = (index) => {
    let newList = [...dataChecked];

    newList[index] = {
      ...newList[index],
      isActive: !newList[index]?.isActive,
    };

    setDataChecked(newList);
  };

  const handleAddCart = useCallback((data) => {
    const index = _.findIndex(orders, (i) => {
      return i.id === data.id;
    });

    index < 0
      ? setOrder({ ...data, quantity_bins: 0, quantity_boxes: 0 })
      : setOrder({ ...orders[index] });

    setIsVisible(true);
  });

  const handleAllProducts = (code = "all") => {
    setIsVisible(true);

    setPickAll({
      code,
      isAll: true,
    });

    setOrder({
      id: null,
      quantity_bins: 0,
      quantity_boxes: 0,
    });
  };

  const handleAddQuantity = () => {
    setIsVisible(false);

    if (pickAll.isAll) {
      return addAllProduct(pickAll.code);
    }

    const index = _.findIndex(orders, (i) => i.code === order.code);
    if (index < 0) {
      return setOrders([...orders, order]);
    }

    const newOrders = [...orders];
    newOrders[index] = order;

    setOrders(newOrders);
  };

  const addAllProduct = (type) => {
    const list =
      type === "all" ? _.flatMapDeep(products) : products[pickAll.code];

    const arrAdd = [];
    list.map((i) => {
      const indexOrder = _.findIndex(orders, (o) => o.id === i.id);

      if (indexOrder < 0) {
        arrAdd.push({
          ...i,
          quantity_bins: order.quantity_bins,
          quantity_boxes: order.quantity_boxes,
        });
      } else {
        orders[indexOrder] = {
          ...orders[indexOrder],
          quantity_bins: orders[indexOrder].quantity_bins + order.quantity_bins,
          quantity_boxes:
            orders[indexOrder].quantity_boxes + order.quantity_boxes,
        };
      }
    });

    setOrders([...orders, ...arrAdd]);
    setPickAll({
      code: null,
      isAll: false,
    });
  };

  useEffect(() => {
    if (!orderStore) return;

    setOrders(orderStore.orders);
    setNote(orderStore.note);
  }, [orderStore]);

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <Page
      className="page w-screen h-screen relative"
      style={{ paddingTop: "60px" }}
      hideScrollbar={true}
    >
      <HeaderComponent
        title={orderStore.is_edit ? "Cập nhật đơn hàng" : "Tạo mới đơn hàng"}
      />
      <Input.Search
        placeholder="Tên sản phẩm, mã sản phẩm"
        size="small"
        clearable
        value={keyword}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <div className="bg-white rounded-lg p-3 mt-3">
        <div className="flex justify-between items-center h-[40px]">
          <div className="flex items-center">
            <Checkbox
              value="all"
              size="small"
              checked={dataChecked[items.length]?.checked}
              onChange={(e) => handleCheckbox(e, items.length)}
            />
            <Text.Title>Tất cả sản phẩm</Text.Title>
          </div>

          <div>
            <Icon
              icon="zi-plus-circle"
              size={28}
              className={`text-green-500 ${
                !dataChecked[items.length]?.checked && "hidden"
              }`}
              onClick={() => handleAllProducts()}
            />
          </div>
        </div>
      </div>
      {items.map((parent, index) => (
        <div
          className={`bg-white rounded-lg p-3 mt-3 ${
            !filterProducts[parent.code] && "hidden"
          }`}
          key={index}
        >
          <AnimateHeight
            animateOpacity={true}
            duration={500}
            easing="ease-in-out"
            height={!dataChecked[index]?.isActive ? 40 : "auto"}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Checkbox
                  value={parent.code}
                  size="small"
                  onChange={(e) => handleCheckbox(e, index)}
                  checked={dataChecked[index]?.checked}
                />
                <Text.Title onClick={() => handleTab(index)}>
                  {parent?.name}
                </Text.Title>
              </div>

              <div>
                <Icon
                  icon="zi-plus-circle"
                  size={28}
                  className={`text-green-500 ${
                    !dataChecked[index]?.checked && "hidden"
                  }`}
                  onClick={() => handleAllProducts(parent?.code)}
                />
                <Icon
                  onClick={() => handleTab(index)}
                  icon="zi-chevron-down"
                  className={`${dataChecked[index]?.isActive && "hidden"}`}
                  size={40}
                />
                <Icon
                  onClick={() => handleTab(index)}
                  icon="zi-chevron-up"
                  className={`${!dataChecked[index]?.isActive && "hidden"}`}
                  size={40}
                />
              </div>
            </div>
            <div className={`pt-3`}>
              {filterProducts[parent.code] ? (
                filterProducts[parent.code].map((product, indexChild) => (
                  <OrderItemComponent
                    cart={_.find(orders, (i) => i.code === product.code)}
                    item={product}
                    key={indexChild}
                    action={handleAddCart}
                  />
                ))
              ) : (
                <Text size="large">Không có sản phẩm</Text>
              )}
            </div>
          </AnimateHeight>
        </div>
      ))}
      <div className="bg-white rounded-lg p-3 mt-3">
        <Text.Title>Ghi chú</Text.Title>
        <Input.TextArea
          placeholder="Nhập ghi chú"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div
        className={`fixed bottom-[10%] right-2 border bg-[#f7f2f2] p-1 rounded-lg shadow-xl ${
          visibleCart || isVisible ? "hidden" : ""
        }`}
        onClick={() => {
          if (
            empty(
              _.filter(
                orders,
                (i) => i.quantity_bins !== 0 || i.quantity_boxes !== 0
              )
            )
          ) {
            return noticeError(" Chưa có sản phẩm trong giỏ hàng");
          }

          setVisibleCart(true);
        }}
      >
        <span className="absolute -top-0 -right-1 bg-red-500 flex justify-center items-center text-white text-xs w-[16px] h-[16px] rounded-full">
          {
            _.filter(
              orders,
              (i) => i.quantity_bins !== 0 || i.quantity_boxes !== 0
            ).length
          }
        </span>
        <IconCart className="w-10" />
      </div>
      <SheetCartComponent
        isVisible={visibleCart}
        isEdit={orderStore.is_edit}
        idOrder={orderStore.id}
        items={_.filter(
          orders,
          (i) => i.quantity_bins !== 0 || i.quantity_boxes !== 0
        )}
        note={note}
        action={(type, data) => {
          setVisibleCart(false);
          setOrders(data);
        }}
      />
      <Sheet
        title="Nhập số lượng"
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        autoHeight
        mask
        handler
        swipeToClose
        unmountOnClose
      >
        <Box p={4} className="custom-bottom-sheet" flex flexDirection="column">
          <Box className="bottom-sheet-body pb-8" style={{ overflowY: "auto" }}>
            <div className="flex items-center justify-between">
              <Text.Title size="large" className="my-4">
                Thùng
              </Text.Title>
              <InputQuantity
                value={order.quantity_boxes}
                action={(e) => setOrder({ ...order, quantity_boxes: e })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Text.Title size="large" className="my-4">
                Hộp
              </Text.Title>
              <InputQuantity
                value={order.quantity_bins}
                action={(e) => setOrder({ ...order, quantity_bins: e })}
              />
            </div>
          </Box>
          <Box flex flexDirection="row" mt={1}>
            <Box style={{ flex: 1 }} pr={1}>
              <Button
                fullWidth
                variant="secondary"
                type="danger"
                onClick={() => setIsVisible(false)}
              >
                Huỷ
              </Button>
            </Box>
            <Box style={{ flex: 1 }} pl={1}>
              <Button fullWidth onClick={handleAddQuantity}>
                Xác nhận
              </Button>
            </Box>
          </Box>
        </Box>
      </Sheet>
    </Page>
  );
};

export default CreateOrderPage;
