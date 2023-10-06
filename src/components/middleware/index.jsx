import React, { useEffect, useState } from "react";
import _ from "lodash";
import DeniedComponent from "./denied";
import { empty, notBlank } from "../../utils";

const MiddlewareComponent = ({ permissions, component }) => {
  const [isDenied, setIsDenied] = useState(true);

  useEffect(() => {
    if (empty(permissions)) {
      setIsDenied(false);
      return;
    }
    let userPermissions = JSON.parse(localStorage.getItem("permissions"));
    userPermissions = _.map(userPermissions, (i) => {
      return i.name;
    });

    let hasPermission = _.intersection(permissions, userPermissions);
    if (notBlank(hasPermission)) {
      setIsDenied(false);
    }
  }, []);

  return <>{isDenied ? <DeniedComponent /> : component}</>;
};

export default MiddlewareComponent;
