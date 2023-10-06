import React, { useEffect, useState } from "react";
import { Box, Page, Icon } from "zmp-ui";
import HeaderComponent from "../../components/header";
import { Link } from "react-router-dom";
import { SUPPORT } from "../../utils/constApiRoute";
import { list } from "../../services/api";
import { noticeErrorState } from "../../store/notice";
import { loadingState } from "../../store/loading";
import { useSetRecoilState } from "recoil";
import InfiniteScrollComponent from "../../components/infiniteScrollComponent";
import { parseUtcToLocal } from "../../utils";
import TextBaseLineComponent from "../../components/textBaseLine";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarWeek } from "@fortawesome/free-solid-svg-icons";

// TODO api survey
const SurveyPage = () => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);
  const [surveys, setSurveys] = useState([1, 2, 3, 4, 5]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const getSurveys = async (page) => {
    setLoading(true);
    await list(`${SUPPORT}`, { page })
      .then((res) => {
        if (page === 1) {
          setSurveys(res.data?.supports);
        } else {
          setSurveys((currentSupports) => [
            ...currentSupports,
            ...res.data?.supports,
          ]);
        }
        setLastPage(res.data?.last_page);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // getSurveys(page);
  }, [page]);

  return (
    <Page
      className="page px-2"
      style={{ paddingTop: "60px" }}
      hideScrollbar={true}
    >
      <HeaderComponent title="Danh sách khảo sát" />

      <Box>
        {surveys.length > 0 && (
          <InfiniteScrollComponent
            dataLength={surveys.length}
            fetchMore={() => setPage((prev) => prev + 1)}
            hasMore={page < lastPage}
          >
            {surveys.map((item, index) => {
              return (
                <Link to={`${item?.id}`} key={index}>
                  <Box className="p-3 text-4xl mt-3 flex justify-between items-center duration-500 bg-white rounded-xl shadow-lg shadow-black-500/50">
                    <Box>
                      <TextBaseLineComponent
                        title="Mã khảo sát:"
                        value="YC71623871"
                        mt={1}
                        isBetween={false}
                      />
                      <TextBaseLineComponent
                        title="Tiêu đề:"
                        value="Khảo sát 1"
                        mt={1}
                        isBetween={false}
                      />
                      <TextBaseLineComponent
                        title={<FontAwesomeIcon icon={faCalendarWeek} />}
                        value={`${parseUtcToLocal(
                          item?.start_date,
                          "DD/MM/YYYY"
                        )} 
                        - ${parseUtcToLocal(item?.updated_at, "DD/MM/YYYY")}`}
                        isBetween={false}
                      />
                    </Box>
                    <Box>
                      <Icon size="30" icon="zi-chevron-right"></Icon>
                    </Box>
                  </Box>
                </Link>
              );
            })}
          </InfiniteScrollComponent>
        )}
      </Box>
    </Page>
  );
};

export default SurveyPage;
