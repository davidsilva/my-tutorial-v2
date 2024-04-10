import { ListProducts } from "../components";
import { useAuthContext } from "../context/AuthContext";

const Landing = () => {
  const { authState } = useAuthContext();
  const isLoggedIn = authState?.isLoggedIn;

  return (
    <div>
      <p>Is logged in: {isLoggedIn ? "yes" : "no"}</p>
      <ListProducts />
    </div>
  );
};
export default Landing;
