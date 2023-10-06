import moment from "moment";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { Sheet, Box, Button, useNavigate } from "zmp-ui";
import { create } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { TICKETS } from "../../../utils/constApiRoute";
import Calendar from "../../calendar";

//TODO : Chưa có api cập nhật lịch
const SheetUpdateCalendarComponent = ({
  id,
  activeDate,
  isVisible,
  action,
}) => {
  const navigate = useNavigate();
  const setLoading = useSetRecoilState(loadingState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [date, setDate] = useState();

  const submit = () => {
    const datePick = moment(
      `${date?.day}/${date?.month}/${date?.year}`,
      "DD/MM/YYYY"
    ).valueOf();

    if (datePick < moment().valueOf()) {
      noticeError("Vui lòng thời gian sau thời gian hiện tại!");
      return;
    }

    setLoading(true);
    create(`${TICKETS}/${id}/update-calender`, {
      estimate_date: moment(
        `${date?.day}/${date?.month}/${date?.year}`,
        "DD/MM/YYYY"
      ).format("YYYY-MM-DD"),
    })
      .then((res) => {
        noticeSuccess("Sửa lịch thành công");
        navigate("/home");
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Sheet
        visible={isVisible}
        title="Sửa lịch hẹn"
        onClose={() => action()}
        autoHeight
        mask
        handler
        swipeToClose
        unmountOnClose={true}
      >
        <Box p={4} className="bottom-sheet-body" style={{ overflowY: "auto" }}>
          <Calendar
            activeDay={moment(activeDate, "YYYY-DD-MM HH:mm:ss").format(
              "DD/MM/YYYY"
            )}
            setDay={(data) => setDate(data)}
          />
        </Box>
        <Box p={4} className="custom-bottom-sheet" flex flexDirection="column">
          <Box flex flexDirection="row" mt={1}>
            <Box style={{ flex: 1 }} pr={1}>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => action("close")}
              >
                Quay lại
              </Button>
            </Box>
            <Box style={{ flex: 1 }} pr={1}>
              <Button fullWidth onClick={submit}>
                Cập nhật
              </Button>
            </Box>
          </Box>
        </Box>
      </Sheet>
    </>
  );
};

export default SheetUpdateCalendarComponent;
