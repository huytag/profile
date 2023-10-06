import React, { useState } from "react";
import { Box, Page, Text, Icon, Button } from "zmp-ui";
import HeaderComponent from "../../components/header";
import TabComponent from "../../components/tab";
import ItemSupportComponent from "../../components/support/item";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import InfiniteScrollComponent from "../../components/infiniteScrollComponent";
import { TAB_ITEMS_SUPPORT } from "../../utils/enum/support";
import {
  perQaDefault,
  QA_SUPPORT_TICKET_CREATE,
} from "../../utils/enumPermission";
import { hasPermission } from "../../services/hasPermission";
import { tabStatusState } from "../../store/tab";
import EmptyComponent from "../../components/empty";
import useSupports from "../../hook/infinity/useSupports";

const ListSupportPage = () => {
  const { supportTab } = useRecoilValue(tabStatusState);
  const [page, setPage] = useState(1);
  const { data, fetchNextPage, hasNextPage } = useSupports(page, supportTab);

  return (
    <Page
      className="page px-2"
      style={{ paddingTop: "60px" }}
      hideScrollbar={true}
    >
      <HeaderComponent title="Danh sách yêu cầu hỗ trợ" />

      <Box className="px-5 py-3 text-4xl bg-white rounded-xl shadow-lg shadow-black-500/50 flex items-center justify-between mt-3 pt-3">
        <Text.Title size="large">Tình trạng</Text.Title>
        <Link
          to="create"
          className={`flex items-center ${hasPermission([
            ...perQaDefault,
            QA_SUPPORT_TICKET_CREATE,
          ])}`}
        >
          <Button size="medium" prefixIcon={<Icon icon="zi-plus" />}>
            Yêu cầu lắp đặt
          </Button>
        </Link>
      </Box>

      <Box>
        <TabComponent
          items={TAB_ITEMS_SUPPORT}
          action={() => setPage(1)}
          cols={TAB_ITEMS_SUPPORT.length}
          isActive={supportTab}
          keyTab="supportTab"
        />
      </Box>

      <Box>
        {data?.length > 0 ? (
          <InfiniteScrollComponent
            dataLength={data?.length}
            fetchMore={fetchNextPage}
            hasMore={hasNextPage}
          >
            {data?.map((item, index) => {
              return <ItemSupportComponent item={item} key={index} />;
            })}
          </InfiniteScrollComponent>
        ) : (
          <EmptyComponent title="danh sách hỗ trợ" length={0} />
        )}
      </Box>
    </Page>
  );
};

export default ListSupportPage;
