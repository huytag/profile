import { useLocation } from "react-router";
import { useNavigate } from "zmp-ui";

export default function useNavigateCustomize() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function reloadPage(path = "/") {
    let to = pathname + path;
    if (pathname[pathname.length - 1] === "/") {
      to = pathname.slice(0, -1);
    }
    navigate(to, {
      animate: false,
      replace: true,
    });
  }

  return reloadPage;
}
