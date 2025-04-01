import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import partnersService from "../../services/partners.service"


export const Listpartners = createAsyncThunk(
    "/post/listpartners",
    async (item,thunkAPI) => {
        try {
            const data = await partnersService.Listpartners(item);
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


export const Addpartners = createAsyncThunk(
    "/post/addpartners",
    async (item,thunkAPI) => {
        try {
            const data = await partnersService.Addpartners(item);
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

export const Editpartners = createAsyncThunk(
    "/post/editpartners",
    async (item,thunkAPI) => {
        try {
            const data = await partnersService.Editpartners(item);
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

export const Updatepartners = createAsyncThunk(
    "/post/updateloans",
    async (item,thunkAPI) => {
        try {
            const data = await partnersService.Updatepartners(item);
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


export const ListpartnersLicence = createAsyncThunk(
    "/post/listpartnersLicence",
    async (item,thunkAPI) => {
        try {
            const data = await partnersService.ListpartnersLicence(item);
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

export const AddpartnersLicence = createAsyncThunk(
    "/post/addpartnersLicence",
    async (item,thunkAPI) => {
        try {
            const data = await partnersService.AddpartnersLicence(item);
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

export const EditpartnersLicence = createAsyncThunk(
    "/post/editpartners",
    async (item,thunkAPI) => {
        try {
            const data = await partnersService.EditpartnersLicence(item);
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

export const UpdatepartnersLicence = createAsyncThunk(
    "/post/updateloans",
    async (item,thunkAPI) => {
        try {
            const data = await partnersService.UpdatepartnersLicence(item);
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


export const ListCompliances = createAsyncThunk(
    "/post/listcompliances",
    async (item,thunkAPI) => {
        try {
            const data = await partnersService.ListCompliances(item);
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


export const Addcompliances = createAsyncThunk(
    "/post/Addcompliances",
    async (item,thunkAPI) => {
        try {
            const data = await partnersService.Addcompliances(item);
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

export const Editcompliances = createAsyncThunk(
    "/post/Editcompliances",
    async (item,thunkAPI) => {
        try {
            const data = await partnersService.Editcompliances(item);
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

export const Updatecompliances = createAsyncThunk(
    "/post/updateloans",
    async (item,thunkAPI) => {
        try {
            const data = await partnersService.Updatecompliances(item);
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

