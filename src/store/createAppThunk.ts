import { createAsyncThunk } from "@reduxjs/toolkit";

export default <Returned, Arg>(
    type: string,
    fn: (arg: Arg, thunkAPI: any) => Promise<Returned>
) => {
    return createAsyncThunk<Returned, Arg>(
        type,
        async (arg, thunkAPI) => {
            try {
                return await fn(arg, thunkAPI);
            } catch (error: any) {
                console.error(`Error in thunk ${type}:`, error);
                return thunkAPI.rejectWithValue(
                    error.response?.data || {
                        success: false,
                        errorCode: "UNKNOWN_ERROR",
                        message: "Lỗi không xác định",
                        data: null
                    }
                );
            }
        }
    );
};