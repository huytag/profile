import _ from "lodash";
import { useState } from "react";
import { empty } from "../../utils";

const useValidator = () => {
  let lengthCheck = 0;
  const [listError, setListError] = useState({});

  const checkValidator = (keyErrors = [], data = {}) => {
    lengthCheck = keyErrors.length;

    for (let i = 0; i < keyErrors.length; i++) {
      const key = keyErrors[i];

      const hasTrue =
        !data[key] ||
        (_.isArray(data[key]) && data[key].length < 0) ||
        empty(data[key]);

      setListError((prevListError) => ({ ...prevListError, [key]: hasTrue }));
    }
  };

  const settKeyOk = (key, value, isRequired = true) => {
    if (!isRequired) {
      return;
    }

    setListError((prevListError) => ({
      ...prevListError,
      [key]: empty(value),
    }));
  };

  const passValidator = () => {
    let isPass = true;

    if (empty(listError)) return false;

    if (Object.keys(listError).length !== lengthCheck) return false;

    _.forIn(listError, (item) => {
      if (item === true) return (isPass = false);
    });

    return isPass;
  };

  const setDefaultError = () => setListError({});

  return {
    listError,
    setDefaultError,
    checkValidator,
    settKeyOk,
    passValidator,
  };
};

export default useValidator;
