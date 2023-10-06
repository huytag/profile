import React, { useEffect, useState } from "react";
import { Button } from "zmp-ui";

const LoadMoreComponent = ({ page, lastPage, action }) => {
  const [hiddenBtnMore, setHiddenBtnMore] = useState(false);

  useEffect(() => {
    if (page === lastPage) {
      return setHiddenBtnMore(true);
    }

    setHiddenBtnMore(false);
  }, [page, lastPage]);

  return (
    <>
      <div className={`text-center mt-5 ${hiddenBtnMore ? "hidden" : ""}`}>
        <Button
          variant="secondary"
          size="large"
          onClick={() => action(page + 1)}
        >
          Xem thêm
        </Button>
      </div>
    </>
  );
};

export default LoadMoreComponent;
