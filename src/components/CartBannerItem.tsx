import { useCartContext } from "../context/CartContext";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const CartBannerItem = () => {
  const { cartItems } = useCartContext();
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate("/cart")}>{cartItems.length} Cart</Button>
  );
};
export default CartBannerItem;
