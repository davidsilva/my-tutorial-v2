import { toast } from "react-toastify";
import { FormikValues } from "formik";
import { Link } from "react-router-dom";
import { ProductForm } from "../components";
import { post } from "aws-amplify/api";

const initialValues = {
  name: "",
  description: "",
  price: 0,
  image: "",
};

const AddProduct = () => {
  const onSubmit = async (values: FormikValues) => {
    const { name, description, price, image } = values;
    const product = { name, description, price, image };

    try {
      await post({
        apiName: "ProductAPI",
        path: "/product",
        options: {
          body: {
            operation: "create",
            payload: {
              Item: product,
            },
          },
        },
      });
      toast.success("Product added successfully");
    } catch (err) {
      const error = err as Error;
      console.error("error creating product:", error);
      toast.error(`Error adding product: ${error.message}`);
    }
  };

  return (
    <div>
      <Link to="/">List Products</Link>
      <h1>Add Product</h1>
      <ProductForm initialValues={initialValues} onSubmit={onSubmit} />
    </div>
  );
};
export default AddProduct;
