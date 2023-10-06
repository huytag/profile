import React from "react";

const IconProduct = ({ className = "w-6" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      strokeWidth={1.5}
      stroke="currentColor"
      version="1.1"
      id="Icons"
      x="0px"
      y="0px"
      viewBox="0 0 32 32"
      className={className}
    >
      <polygon class="st0" points="5,12 10,5 15,12 " />
      <polyline class="st0" points="10,5 22,5 27,12 15,12 " />
      <rect x="10" y="1" class="st0" width="12" height="4" />
      <rect x="5" y="12" class="st0" width="10" height="19" />
      <rect x="15" y="12" class="st0" width="12" height="19" />
      <rect x="5" y="12" class="st0" width="22" height="5" />
      <rect x="5" y="26" class="st0" width="22" height="5" />
    </svg>
  );
};

export default IconProduct;
