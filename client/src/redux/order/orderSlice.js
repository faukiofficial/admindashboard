import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_SERVER_URL;

const initialState = {
    orders: [],
    order: null,
    getAllOrdersLoading: false,
    getAllOrdersError: null,
    totalOrders: 0,
    currentPage: 1,
    totalPages: 1,
    getSingleOrderLoading: false,
    getSingleOrderError: null,
  };

  export const getAllOrders = createAsyncThunk(
    "order/getAllOrders",
    async ({name, page, limit, sortField, sortOrder}) => {
      try {
        const response = await axios.get(`${baseURL}/api/orders/get-all`, {
          params: {
            name,
            page,
            limit,
            sortField,
            sortOrder
          }
        });
        return response.data;
      } catch (error) {
        toast.error(error.response.data.message);
        throw new Error(error.response.data.message);
      }
    }
  );

  export const getSingleOrder = createAsyncThunk(
    "order/getSingleOrder",
    async (id) => {
      try {
        const response = await axios.get(`${baseURL}/api/orders/get/${id}`);
        return response.data;
      } catch (error) {
        toast.error(error.response.data.message);
        throw new Error(error.response.data.message);
      }
    }
  );

  export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        clearOrderError: (state) => {
            state.getAllOrdersError = null;
            state.getSingleOrderError = null;
        }
    },
    extraReducers: (builder) => {
      builder
        .addCase(getAllOrders.pending, (state) => {
          state.getAllOrdersLoading = true;
          state.getAllOrdersError = null;
        })
        .addCase(getAllOrders.fulfilled, (state, action) => {
          state.getAllOrdersLoading = false;
          state.orders = action.payload.orders;
          state.totalOrders = action.payload.totalOrders;
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
        })
        .addCase(getAllOrders.rejected, (state, action) => {
          state.getAllOrdersLoading = false;
          state.getAllOrdersError = action.error.message;
        })
        .addCase(getSingleOrder.pending, (state) => {
          state.getSingleOrderLoading = true;
          state.getSingleOrderError = null;
        })    
        .addCase(getSingleOrder.fulfilled, (state, action) => {
          state.getSingleOrderLoading = false;
          state.order = action.payload.order;
        })
        .addCase(getSingleOrder.rejected, (state, action) => {
          state.getSingleOrderLoading = false;
          state.getSingleOrderError = action.error.message;
        });
    },
  });
  
  export default orderSlice.reducer;