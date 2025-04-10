import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import UserService from "../../services/user.service"

export const GetUserList = createAsyncThunk(
    "/post/GetUserList",
    async (item,thunkAPI) => {
        try {
            const data = await UserService.GetUserList(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);

export const GetPartnerUser = createAsyncThunk(
    "/post/GetPartnerUser",
    async (item,thunkAPI) => {
        try {
            const data = await UserService.GetPartnerUser(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);

export const Adduser = createAsyncThunk(
    "/post/Adduser",
    async (item,thunkAPI) => {
        try {
            const data = await UserService.Adduser(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);

export const Userupdate = createAsyncThunk(
    "/post/Userupdate",
    async (item,thunkAPI) => {
        try {
            const data = await UserService.Userupdate(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);

export const GetDetailsuser = createAsyncThunk(
    "/post/GetDetailsuser",
    async (item,thunkAPI) => {
        try {
            const data = await UserService.GetDetailsuser(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);

export const Userdelete = createAsyncThunk(
    "/post/Userdelete",
    async (item,thunkAPI) => {
        try {
            const data = await UserService.Userdelete(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);

