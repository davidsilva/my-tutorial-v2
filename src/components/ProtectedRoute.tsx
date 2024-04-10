import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

type ProtectedRouterProps = PropsWithChildren<{
  role?: "user" | "admin";
}>;

const ProtectedRoute = ({ children, role = "user" }: ProtectedRouterProps) => {
  const navigate = useNavigate();
  const { authState, setIntendedPath } = useAuthContext();
  const isLoggedIn = authState?.isLoggedIn;
  const isAdmin = authState?.isAdmin;

  useEffect(() => {
    if (isLoggedIn === null || location.pathname === "/signin") return;

    if (!isLoggedIn) {
      setIntendedPath(location.pathname);
      navigate("/signin");
    } else if (role === "admin" && !isAdmin) {
      navigate("/not-authorized");
    }
  }, [navigate, isLoggedIn, isAdmin, role, setIntendedPath]);

  return children;
};

export default ProtectedRoute;
