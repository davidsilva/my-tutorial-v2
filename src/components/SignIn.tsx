import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { signIn, SignInInput, fetchAuthSession } from "aws-amplify/auth";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuthContext } from "../context/AuthContext";

/*
CONFIRM_SIGN_UP, RESET_PASSWORD, DONE, CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED
*/

type Actions = {
  resetForm: () => void;
};

const initialState = { username: "", password: "" };

const SignIn = () => {
  const initialValues: SignInInput = initialState;

  const { setIsLoggedIn, setSignInStep, setIsAdmin } = useAuthContext();

  const validationSchema = yup.object().shape({
    username: yup.string().required("Required"),
    password: yup.string().required("Required"),
  });

  const onSubmit = async (values: SignInInput, actions: Actions) => {
    const { username, password } = values;
    console.log("values", values);
    console.log("actions", actions);

    try {
      const signInResult = await signIn({ username, password });
      const { isSignedIn, nextStep } = signInResult;
      const { signInStep } = nextStep;
      const authSession = await fetchAuthSession();
      const tokens = authSession.tokens;
      if (tokens && Object.keys(tokens).length > 0) {
        console.log(
          'tokens.accessToken.payload["cognito:groups"]',
          tokens.accessToken.payload["cognito:groups"]
        );
        const groups = tokens.accessToken.payload["cognito:groups"];
        // groups is undefined if user belongs to no groups.
        console.log("groups", groups);
        if (groups && Array.isArray(groups) && groups.includes("admin")) {
          setIsAdmin(true);
        }
      }

      console.log("authSession", authSession);
      setSignInStep(signInStep);
      console.log("signInResult", signInResult);
      console.log("nextStep", nextStep);
      console.log("setting context value to true");
      setIsLoggedIn(isSignedIn);
    } catch (error) {
      // NotAuthorizedException: Incorrect username or password.
      setIsLoggedIn(false);
      console.log("error signing in", error);
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Form.Group className="mb-3" controlId="formBasicUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          name="username"
          placeholder="Enter username"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={touched.username && !!errors.username}
          required
        />
        <Form.Control.Feedback type="invalid">
          {errors.username}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          placeholder="Password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={touched.password && !!errors.password}
          required
        />
        <Form.Control.Feedback type="invalid">
          {errors.password}
        </Form.Control.Feedback>
      </Form.Group>
      <div>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          Sign In
        </Button>
      </div>
    </Form>
  );
};
export default SignIn;
