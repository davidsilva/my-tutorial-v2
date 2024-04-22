import { describe, beforeEach, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignOut from "./SignOut";
import { AuthContextProvider } from "../context/AuthContext";
import userEvent from "@testing-library/user-event";

const { mockNavigate } = vi.hoisted(() => {
  return { mockNavigate: vi.fn() };
});

vi.mock("react-router-dom", async () => {
  const router = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...router,
    useNavigate: vi.fn().mockReturnValue(mockNavigate),
  };
});

const { signOutMock } = vi.hoisted(() => {
  return {
    signOutMock: vi.fn().mockImplementation(() => {
      return Promise.resolve({});
    }),
  };
});

/* 
We test the actual signOut functionality in the AuthContext tests, so here we're just asserting that *a* signOut function from a mock AuthContext is called.
 */
vi.mock("../context/AuthContext", async () => ({
  AuthContextProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  useAuthContext: () => ({
    signOut: signOutMock,
  }),
}));

vi.mock("aws-amplify/auth");

describe("SignOut", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders a sign out button", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthContextProvider>
          <SignOut />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const signOutButton = screen.getByRole("button", { name: "Sign Out" });
    expect(signOutButton).toBeInTheDocument();

    await user.click(signOutButton);

    expect(signOutMock).toHaveBeenCalledWith(mockNavigate);
  });
});
