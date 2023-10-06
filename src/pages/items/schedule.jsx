import React, { useEffect, useState } from "react";
import { Page, Box, Text, Button, useNavigate } from "zmp-ui";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { noticeErrorState } from "../../store/notice";
import { loadingState } from "../../store/loading";
import Calendar from "../../components/calendar";
import moment from "moment/moment";
import ScheduleItemComponent from "../../components/items/ticket/scheduleItem";
import AccordionComponent from "../../components/accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import SheetFilterScheduleComponent from "../../components/sheet/filter/filterSchedule";
import { TICKET_STATUS_FILTERS } from "../../utils/enumDropdown";
import { DROPDOWN_ASSET, TICKETS } from "../../utils/constApiRoute";
import { create, list } from "../../services/api";
import TabComponent from "../../components/tab";
import {
  STATUS_DONE,
  STATUS_REPAIR,
  STATUS_WAITING_CONFIRM,
} from "../../utils/enumTicket";
import _ from "lodash";
import { showNavigationState } from "../../store/navigation";
import SheetSelectRepairCalendar from "../../components/sheet/SelectRepairCalender";
import { isSupplier } from "../../services/hasPermission";
import { TAB_ITEMS_TICKET } from "../../utils/enum/ticket";
import { tabStatusState } from "../../store/tab";
import { IconFilter } from "../../components/icon";

const DeviceSchedulePage = () => {
  const setShowNavigation = useSetRecoilState(showNavigationState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);
  const [dataCalendar, setDataCalendar] = useState({
    from_date: moment().startOf("month").format("YYYY-MM-DD"),
    to_date: moment().endOf("month").format("YYYY-MM-DD"),
  });
  const [showSheet, setShowSheet] = useState({
    filter: false,
    select: false,
    assign: false,
  });
  const [options, setOptions] = useState({
    ticket_status_filters: [],
  });
  const { scheduleTab } = useRecoilValue(tabStatusState);
  const [isActiveTab, setIsActiveTab] = useState(STATUS_WAITING_CONFIRM);
  const [listDay, setListDay] = useState([]);
  const [ticketsEstimated, setTicketsEstimated] = useState([]);
  const [listAccTickets, setListAccTickets] = useState([]);
  const [isFirst, setIsFirst] = useState(true);
  const [isFirstDropdown, setIsFirstDropdown] = useState(true);
  const [ticketIds, setTicketIds] = useState([]);
  const navigate = useNavigate();

  // TODO status sai
  const onActionSelect = async (type, data = null) => {
    setShowSheet({ ...showSheet, select: false, assign: false });

    if (type === "cancel") return;

    setLoading(true);
    await create(`${TICKETS}/multi-confirm-supplier`, {
      ...data,
      ticket_ids: ticketIds,
    })
      .then((response) => {
        navigate("/");
        onSelectRepairCalendar();
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const onActionFilter = (type, subStatus = null) => {
    setShowSheet({ ...showSheet, filter: false });

    if (type === "filter") {
      setLoading(true);
      getTicketsEstimated(scheduleTab, subStatus, dataCalendar);
    }
  };

  const onSetDataCalendar = (days) => {
    const newDataCalendar = {
      from_date: moment(days[0]?.key, "YYYY-M-D").format("YYYY-MM-DD"),
      to_date: moment(days[0]?.key, "YYYY-M-D")
        .add(41, "days")
        .format("YYYY-MM-DD"),
    };
    if (isFirst) {
      getTicketsEstimated(scheduleTab, null, newDataCalendar);
      setDataCalendar(newDataCalendar);
      setIsFirst(false);
    }
  };

  const getOption = async (option) => {
    if (!isFirstDropdown) return;

    await list(DROPDOWN_ASSET, { objects: option })
      .then((res) => {
        setOptions(res.data?.options);
        setIsFirstDropdown(false);
      })
      .catch((error) => noticeError(error?.message));
  };

  const getTicketsEstimated = async (
    status = null,
    sub_statuses = null,
    dataCalendar
  ) => {
    await list(`${TICKETS}/estimated-list`, {
      ...dataCalendar,
      status,
      sub_statuses,
    })
      .then((response) => setTicketsEstimated(response.data?.tickets))
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const getAccordionSchedule = () => {
    let newTicketsEstimated = ticketsEstimated;
    if (scheduleTab !== STATUS_REPAIR) {
      newTicketsEstimated = _.flatMap(ticketsEstimated);
      return newTicketsEstimated;
    }

    return _.map(newTicketsEstimated, (item, index) => {
      return {
        title: "Ngày " + moment(index).format("DD/MM/YYYY"),
        component: (
          <ScheduleItemComponent
            item={item}
            key={index}
            isAccordion={scheduleTab === STATUS_REPAIR ? true : false}
          />
        ),
        key: "ticket-estimate" + index,
        bg: true,
      };
    });
  };

  const onSelectRepairCalendar = () => {
    if (scheduleTab !== STATUS_WAITING_CONFIRM) return;
    setShowNavigation(showSheet.select);
    setShowSheet({ ...showSheet, select: !showSheet.select });
  };

  useEffect(() => {
    setLoading(true);
    if (isFirst) {
      setIsFirst(false);
      return;
    }

    getTicketsEstimated(scheduleTab, null, dataCalendar);
  }, [scheduleTab]);

  useEffect(() => {
    const list = getAccordionSchedule();
    setListAccTickets(list);

    setListDay(
      Object.keys(ticketsEstimated).map((item) => {
        return moment(item).format("MMDDYYYY");
      })
    );
  }, [ticketsEstimated]);

  return (
    <Page
      className="page px-3"
      style={{ paddingTop: "60px" }}
      hideScrollbar={true}
    >
      <div
        className="zaui-header"
        style={{
          textAlign: "center",
          backgroundColor: "#013772",
          color: "#fff",
        }}
      >
        <span className="zaui-header-title">Lịch trình sửa chữa</span>
      </div>
      <div className="p-3 text-4xl bg-white rounded-xl shadow-lg shadow-black-500/50">
        <Box className="custom-bottom-sheet" flex flexDirection="column">
          <Calendar
            listDay={listDay}
            isOnlyShow
            action={(days) => onSetDataCalendar(days)}
          />
        </Box>
      </div>
      <Box className="flex items-center justify-between mt-3 pt-3">
        <Text.Title size="large">Trạng thái</Text.Title>
        <Box flex>
          {/* {isSupplier() && !ticketsEstimated.length ? (
            <Box className={`border-r-2 border-slate-300`} px={2}>
              <Text.Title onClick={() => onSelectRepairCalendar()} px={2}>
                <FontAwesomeIcon icon={faPenToSquare} className="mr-1" />
                Chọn
              </Text.Title>
            </Box>
          ) : (
            ""
          )} */}

          <Box px={2}>
            <Text.Title
              onClick={async () => {
                await getOption([TICKET_STATUS_FILTERS]);
                setShowSheet({ ...showSheet, filter: !showSheet.filter });
              }}
            >
              Bộ lọc
              <IconFilter className="w-6 inline-block ml-1" />
            </Text.Title>
          </Box>
        </Box>
      </Box>
      <TabComponent
        items={TAB_ITEMS_TICKET}
        isActive={scheduleTab}
        keyTab="scheduleTab"
      />
      <Box className="custom-bottom-sheet" flex flexDirection="column">
        {scheduleTab === STATUS_REPAIR ? (
          <AccordionComponent
            list={listAccTickets}
            titleText="normal"
            isNoneData={true}
          />
        ) : (
          <div className="border-2 p-3 border-t-0 rounded-lg bg-white border-white mt-3">
            <ScheduleItemComponent
              item={getAccordionSchedule()}
              isActive={showSheet.select}
              action={(ids) => setTicketIds(ids)}
            />
          </div>
        )}
      </Box>

      <SheetFilterScheduleComponent
        item={options?.ticket_status_filters}
        filterActive={scheduleTab}
        isVisible={showSheet.filter}
        action={(type, value) => onActionFilter(type, value)}
      />

      <SheetSelectRepairCalendar
        isVisible={showSheet.assign}
        action={(type, data) => onActionSelect(type, data)}
      />

      {scheduleTab === STATUS_WAITING_CONFIRM && (
        <Box
          p={4}
          className={`justify-center items-center bg-white w-full shadow-sm left-0 bottom-0 fixed translate-y-1 opacity-0 ${
            showSheet.select &&
            "transition-all duration-500 translate-y-0 opacity-100"
          }`}
          flex
        >
          <Box flex flexDirection="row" className="w-full" mt={1}>
            <Box style={{ flex: 1 }} pr={1}>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => onSelectRepairCalendar()}
              >
                Quay lại
              </Button>
            </Box>
            <Box style={{ flex: 1 }} pr={1}>
              <Button
                fullWidth
                onClick={() => setShowSheet({ ...showSheet, assign: true })}
              >
                Tiếp tục
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Page>
  );
};

export default DeviceSchedulePage;
