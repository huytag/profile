import React, { useEffect, useState } from "react";
import { Page } from "zmp-ui";
import { useSetRecoilState } from "recoil";
import { noticeErrorState } from "../../store/notice";
import { loadingState } from "../../store/loading";
import ItemComponent from "../../components/items";
import HeaderComponent from "../../components/header";
import EmptyComponent from "../../components/empty";
import { ITEMS } from "../../utils/constApiRoute";
import { list } from "../../services/api";
import InfiniteScrollComponent from "../../components/infiniteScrollComponent";

const ItemsPage = () => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [items, setItems] = useState([]);

  const fetchItems = () => {
    setLoading(true);

    list(ITEMS, { page })
      .then((response) => {
        setItems([...items, ...response.data.items]);
        setLastPage(response.data.last_page);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [page]);

  return (
    <Page
      className="page px-3"
      style={{ paddingTop: "60px" }}
      hideScrollbar={true}
    >
      <HeaderComponent title="Danh sách thiết bị" />

      {items.length > 0 && (
        <InfiniteScrollComponent
          dataLength={items.length}
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < lastPage}
        >
          {items.map((item, index) => (
            <ItemComponent item={item} key={index} />
          ))}
        </InfiniteScrollComponent>
      )}

      <EmptyComponent title="thiết bị" length={items.length} />
    </Page>
  );
};

export default ItemsPage;
