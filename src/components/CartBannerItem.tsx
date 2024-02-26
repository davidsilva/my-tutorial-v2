import { useCartContext } from "../context/CartContext";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const CartBannerItem = () => {
  const { totalQuantity } = useCartContext();
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate("/cart")}>{totalQuantity} Cart</Button>
  );
};
export default CartBannerItem;
