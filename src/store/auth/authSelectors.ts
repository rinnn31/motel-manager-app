import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const selectAuthState = (state: RootState) => state.auth;

export const selectAuthData = createSelector(
    [selectAuthState],
    (auth) => {
        return {
            refreshToken: auth.refreshToken,
            accessToken: auth.accessToken,
            userId: auth.userId
        }
    }
);

export const selectIsLoggedIn = createSelector(
    [selectAuthState],
    (token) => !!token.accessToken && !!token.refreshToken && !!token.userId
);

export const selectAuthLoading = createSelector(
    [selectAuthState],
    (auth) => auth.loading
);
