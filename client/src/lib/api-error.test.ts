import { describe, expect, it } from "vitest";
import { AxiosError } from "axios";
import {
  getApiErrorMessage,
  isAccountBlockedMessage,
} from "./api-error";

describe("api-error helpers", () => {
  it("reads Nest-style message arrays from axios errors", () => {
    const error = new AxiosError("Request failed");
    error.response = {
      status: 400,
      data: { message: ["Email is invalid", "Password is too short"] },
      statusText: "Bad Request",
      headers: {},
      config: {} as never,
    };

    expect(getApiErrorMessage(error)).toBe(
      "Email is invalid, Password is too short"
    );
  });

  it("uses a generic message for 5xx responses without a body message", () => {
    const error = new AxiosError("Request failed");
    error.response = {
      status: 500,
      data: {},
      statusText: "Internal Server Error",
      headers: {},
      config: {} as never,
    };

    expect(getApiErrorMessage(error)).toBe(
      "Something went wrong, plz try again"
    );
  });

  it("detects blocked-account messages", () => {
    expect(isAccountBlockedMessage("Your account has been blocked")).toBe(true);
    expect(isAccountBlockedMessage("Invalid credentials")).toBe(false);
  });
});
