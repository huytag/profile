import React, { useCallback, useEffect, useState } from "react";
import { Box, Page, Text, Icon, Button, DatePicker } from "zmp-ui";
import HeaderComponent from "../../components/header";
import { noticeErrorState, noticeSuccessState } from "../../store/notice";
import { loadingState } from "../../store/loading";
import { useSetRecoilState } from "recoil";
import SurveyTextComponent from "../../components/Survey/SurveyTextComponent";
import SurveyRadioComponent from "../../components/Survey/SurveyRadioComponent";
import SurveySelectComponent from "../../components/Survey/SurveySelectComponent";
import SurveyCheckBoxComponent from "../../components/Survey/SurveyCheckBoxComponent";
import SurveyRatingComponent from "../../components/Survey/SurveyRatingComponent";
import ModalApproveComponent from "../../components/modal/approve";
import useNavigateCustomize from "../../hook/navigate/useNavigateCustom";
import SurveyMultiChoiceComponent from "../../components/Survey/SurveyMultiChoiceComponent";
import SurveyTimeComponent from "../../components/Survey/SurveyTimeComponent";
import SurveyDateComponent from "../../components/Survey/SurveyDateComponent";

const initValue = {
  name: "",
  sex: [
    { value: 1, label: "Nam" },
    { value: 2, label: "Nữ" },
    { value: 3, label: "Khác" },
  ],
  local: [
    { value: 1, label: "Miền Bắc" },
    { value: 2, label: "Miền Trung" },
    { value: 3, label: "Miền Nam" },
  ],
  stocks: [
    { value: 1, label: "Sữa hạt" },
    { value: 2, label: "Đồ uống giải khát" },
    { value: 3, label: "TH true milk" },
  ],
  choices: [
    {
      value: 1,
      label: "Câu hỏi 1",
      questions: [
        {
          value: 1,
          label: "Có",
        },
        {
          value: 2,
          label: "Không",
        },
      ],
    },
    {
      value: 2,
      label: "Câu hỏi 2",
      questions: [
        {
          value: 3,
          label: "Có",
        },
        {
          value: 4,
          label: "Không",
        },
      ],
    },
  ],
  time: "",
  date: null,
};

const initData = {
  name: "",
  sex: null,
  local: null,
  stocks: [],
  rating: 1,
  choices: [],
  time: null,
  date: null,
};

const SurveyDetailPage = () => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const setLoading = useSetRecoilState(loadingState);
  const reload = useNavigateCustomize();
  const [item, setItem] = useState();
  const [visible, setVisible] = useState({
    reset: false,
  });
  const [formValue, setFormValue] = useState(initValue);
  const [formData, setFormData] = useState(initData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    console.log(e);
    const { name, value, required } = e.target;
    handleFormData(name, value, required);
  };

  const handleFormData = useCallback(
    (key, value, required = false) => {
      console.log(key, value);
      console.log(formData);
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));

      if (required) {
        setErrors((prev) => ({
          ...prev,
          [key]: !Boolean(value),
        }));
      }
    },
    [formData]
  );

  const handleMultichoice = (key, value, parentKey = null) => {
    let newData = [...formData[key]];
    const choice = {
      [parentKey]: value,
    };

    if (
      !newData.some((item) =>
        Object.keys(item).some((keyItem) => keyItem == parentKey)
      )
    ) {
      newData.push(choice);
    } else {
      const index = newData.findIndex((data) => Object.keys(data) == parentKey);
      Object.assign(newData[index], choice);
    }

    console.log(newData);
    handleFormData(key, newData);
  };

  const onResetForm = (type) => {
    setVisible((prev) => ({ ...prev, reset: false }));
    if (type === "cancel") return;

    reload();
    noticeSuccess("Xoá câu trả lời thành công");
  };

  const onHandleConfirm = () => {
    console.log(formData);
  };

  return (
    <Page
      className="page px-2"
      style={{ paddingTop: "60px" }}
      hideScrollbar={true}
    >
      <HeaderComponent title="Khảo sát" />

      <Box className="px-5 py-3 text-4xl  bg-white rounded-xl shadow-lg shadow-black-500/50">
        <Box className="flex justify-center">
          <Text.Title>Thu thập thông tin khách hàng</Text.Title>
        </Box>
        <Box mt={2} className="border-b border-[#ddd] border-dashed pb-3">
          <SurveyTextComponent
            title="Bạn tên gì"
            placeholder="Nhập tên của bạn"
            name="name"
            value={formData.name}
            error={errors.name}
            action={(e) => handleChange(e)}
            required
          />
        </Box>

        <Box mt={2} className="border-b border-[#ddd] border-dashed pb-3">
          <SurveyRadioComponent
            title="Giới tính của bạn là gì?"
            name="sex"
            options={formValue?.sex}
            checked={formData?.sex}
            error={errors?.sex}
            action={(e) => handleChange(e)}
            required
          />
        </Box>

        <Box mt={2} className="border-b border-[#ddd] border-dashed pb-3">
          <SurveySelectComponent
            title="Bạn là người miền nào?"
            placeholder="Chọn miền của bạn"
            name="local"
            options={formValue?.local}
            action={(value) => handleFormData("local", value)}
          />
        </Box>

        <Box mt={2} className="border-b border-[#ddd] border-dashed pb-3">
          <SurveyCheckBoxComponent
            title="Hàng hoá cần mua?"
            options={formValue?.stocks}
            name="stocks"
            action={(value) => handleFormData("stocks", value)}
          />
        </Box>

        <Box mt={2} className="border-b border-[#ddd] border-dashed pb-3">
          <SurveyRatingComponent
            title="Chọn mức đánh giá"
            options={formData?.rating}
            action={(value) => handleFormData("rating", value)}
          />
        </Box>

        <Box my={5} className="border-b border-[#ddd] border-dashed pb-3">
          <SurveyMultiChoiceComponent
            title="Ma trận trắc nghiệm?"
            name="choices"
            options={formValue?.choices}
            action={(value, parentKey) =>
              handleMultichoice("choices", value, parentKey)
            }
            error={errors?.choices}
            checked={formData?.choices}
            required
          />
        </Box>

        <Box mt={6} className="border-b border-[#ddd] border-dashed pb-3">
          <SurveyDateComponent
            title="Đặt lịch hẹn tiếp theo"
            placeholder="Đặt lịch hẹn tiếp theo"
            name="date"
            options={formValue?.date}
            action={(e) => handleFormData("date", e)}
            error={errors?.date}
            checked={formData?.date}
            required
          />
        </Box>

        <Box mt={6} className="border-b border-[#ddd] border-dashed pb-3">
          <SurveyTimeComponent
            title="Chọn giờ hẹn"
            placeholder="Chọn giờ hẹn"
            name="time"
            options={formValue?.time}
            action={(e) => handleFormData("time", e)}
            error={errors?.time}
            checked={formData?.time}
            required
          />
        </Box>

        <Box className="grid grid-cols-2 auto-cols-fr gap-1 mt-4">
          <Button
            onClick={() => setVisible((prev) => ({ ...prev, reset: true }))}
            fullWidth
            variant="secondary"
          >
            Xoá câu trả lời
          </Button>
          <Button onClick={() => onHandleConfirm("submit")} fullWidth>
            Gửi
          </Button>
        </Box>
      </Box>

      <ModalApproveComponent
        isVisible={visible.reset}
        title="Xoá tất cả câu trả lời?"
        description="Thao tác này sẽ xoá tất cả câu trả lời của bạn. Bạn không thể hoàn lại thao tác này."
        action={(type) => onResetForm(type)}
      />
    </Page>
  );
};

export default SurveyDetailPage;
