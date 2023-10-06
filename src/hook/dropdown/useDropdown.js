import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { list } from "../../services/api";
import { noticeErrorState } from "../../store/notice";

const useDropdown = () => {
  const [options, setOptions] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const noticeError = useSetRecoilState(noticeErrorState);

  const getOptions = async (url, objects = [], extraField = null) => {
    setLoading(true);

    await list(url, { objects: objects, ...extraField })
      .then((response) => {
        setOptions(response?.data?.options);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  return { options, error, loading, getOptions };
};

export default useDropdown;
