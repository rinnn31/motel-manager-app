import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../store";

export const selectAccountState = (state: RootState) => state.account;

export const selectUser = createSelector(
    [selectAccountState],
    (account) => account.user
);

export const selectIsAccountVerified = createSelector(
    [selectUser],
    (user) => user ? user.isVerified : false
);