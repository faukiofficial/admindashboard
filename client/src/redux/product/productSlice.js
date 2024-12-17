import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_SERVER_URL;

const initialState = {
  products: [],
  totalProducts: 0,
  currentPage: 1,
  totalPages: 1,
  product: null,
  addProductLoading: false,
  addProductError: null,
  getAllProductsLoading: false,
  getAllProductsError: null,
  getSingleProductLoading: false,
  getSingleProductError: null,
  deleteProductLoading: false,
  deleteProductError: null,
  updateProductLoading: false,
  updateProductError: null,
};

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (data) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/products/create`,
        data,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  }
);

export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async ({ category, name, limit, page, sortField = "createdAt", sortOrder = "desc" }) => {
    const params = { category, name, limit, page, sortField, sortOrder };
    try {
      const response = await axios.get(`${baseURL}/api/products/get-all`, { params });
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id) => {
    try {
      const response = await axios.delete(
        `${baseURL}/api/products/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  }
)

export const getSingleProduct = createAsyncThunk(
  "product/getSingleProduct",
  async (id) => {
    try {
      const response = await axios.get(`${baseURL}/api/products/get/${id}`);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({data, id}) => {
    try {
      const response = await axios.put(
        `${baseURL}/api/products/update/${id}`,
        data,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  }
)

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.addProductError = null;
      state.getAllProductsError = null;
      state.deleteProductError = null;
      state.updateProductError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.addProductLoading = true;
        state.addProductError = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.addProductLoading = false;
        state.addProductError = null;
        state.products.push(action.payload.product);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.addProductLoading = false;
        state.addProductError = action.error.message;
      })
      .addCase(getAllProducts.pending, (state) => {
        state.getAllProductsLoading = true;
        state.getAllProductsError = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.getAllProductsLoading = false;
        state.getAllProductsError = null;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.getAllProductsLoading = false;
        state.getAllProductsError = action.error.message;
      })
      .addCase(getSingleProduct.pending, (state) => {
        state.getSingleProductLoading = true;
        state.getSingleProductError = null;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.getSingleProductLoading = false;
        state.getSingleProductError = null;
        state.product = action.payload.product;
      })
      .addCase(getSingleProduct.rejected, (state, action) => {
        state.getSingleProductLoading = false;
        state.getSingleProductError = action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.updateProductLoading = true;
        state.updateProductError = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updateProductLoading = false;
        state.updateProductError = null;
        state.product = action.payload.product;
        state.products = state.products.map((product) => {
          if (product._id === action.payload.product._id) {
            return action.payload.product;
          }
          return product;
        });
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updateProductLoading = false;
        state.updateProductError = action.error.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.deleteProductLoading = true;
        state.deleteProductError = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteProductLoading = false;
        state.deleteProductError = null;
        state.products = state.products.filter(
          (product) => product._id !== action.payload.product._id
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleteProductLoading = false;
        state.deleteProductError = action.error.message;
      });
  },
});

export const { clearProductError } = productSlice.actions;

export default productSlice.reducer;