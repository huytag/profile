import { useLocation } from "react-router";
import React, { useMemo } from "react";

export default function useQueryParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}
