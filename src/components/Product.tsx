import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { Product as ProductType } from "../API";
import { archiveProduct, restoreProduct } from "../graphql/customMutations";
import { generateClient } from "aws-amplify/api";
import { Button } from "react-bootstrap";
import { useAuthContext } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";
import { S3_URL } from "../constants";

interface ProductProps {
  product: ProductType;
}

const client = generateClient();

const Product: React.FC<ProductProps> = ({ product }) => {
  const navigate = useNavigate();
  const [isArchived, setIsArchived] = useState(product.isArchived);
  const { authState } = useAuthContext();
  const isAdmin = authState?.isAdmin;
  const isLoggedIn = authState?.isLoggedIn;
  const { addToCart } = useCartContext();

  const handleEdit = () => {
    navigate(`/products/${product.id}/edit`);
  };

  const handleArchiveOrRestore = async () => {
    try {
      if (isArchived) {
        await client.graphql({
          query: restoreProduct,
          variables: { id: product.id },
        });
      } else {
        await client.graphql({
          query: archiveProduct,
          variables: { id: product.id },
        });
      }
      setIsArchived(!isArchived);
    } catch (err) {
      console.error("error updating product: ", err);
    }
  };

  const handleRateAndReview = () => {
    navigate(`/products/${product.id}/reviews/new`);
  };

  if (!authState?.isAuthStateKnown) {
    return null;
  }

  return (
    <Card role="listitem">
      <Card.Body>
        {product.image && (
          <Card.Img
            src={
              product.image.startsWith("http://") ||
              product.image.startsWith("https://")
                ? product.image
                : `${S3_URL}${product.image}`
            }
            alt={product.name}
            className="product-image"
          />
        )}
        <Card.Title aria-label="product name" className="product-name">
          {product.name}
        </Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <Card.Text>{product.price && product.price / 100}</Card.Text>
        <Card.Text>{product.reviews?.items?.length || 0} reviews</Card.Text>
        <div>
          {isLoggedIn && (
            <Button onClick={handleRateAndReview}>Rate and Review</Button>
          )}
          {isAdmin && (
            <>
              <Button onClick={handleEdit}>Edit</Button>
              <Button onClick={handleArchiveOrRestore}>
                {isArchived ? "Restore" : "Archive"}
              </Button>
            </>
          )}
          <>
            <Button onClick={() => navigate(`/products/${product.id}`)}>
              Detail
            </Button>
            <Button onClick={() => addToCart(product, 1)}>Add to Cart</Button>
          </>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Product;
