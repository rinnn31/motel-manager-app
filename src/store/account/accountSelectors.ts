import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const selectAccountState = (state: RootState) => state.account;

export const selectUser = createSelector(
    [selectAccountState],
    (account) => account.user
);

export const selectIsAccountLoading = createSelector(
    [selectAccountState],
    (account) => account.loading
);

export const selectAccountError = createSelector(
    [selectAccountState],
    (account) => account.error
);

export const selectIsAccountVerified = createSelector(
    [selectUser],
    (user) => user ? user.isVerified : false
);