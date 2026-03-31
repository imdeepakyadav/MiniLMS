import type React from "react";

type LogoutDispatch = React.Dispatch<{ type: "LOGOUT" }>;

let logoutDispatch: LogoutDispatch | null = null;

export const registerLogoutDispatch = (dispatch: LogoutDispatch | null) => {
  logoutDispatch = dispatch;
};

export const clearAuthSessionState = () => {
  logoutDispatch?.({ type: "LOGOUT" });
};
