import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_SERVER_URL;

const initialState = {
  categories: [],
  category: null,
  addCategoryLoading: false,
  addCategoryError: null,
  getAllCategoriesLoading: false,
  getAllCategoriesError: null,
  getSingleCategoryLoading: false,
  getSingleCategoryError: null,
  deleteCategoryLoading: false,
  deleteCategoryError: null,
  updateCategoryLoading: false,
  updateCategoryError: null,
};

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (data) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/categories/create`,
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

export const getAllCategories = createAsyncThunk(
  "category/getAllCategories",
  async () => {
    try {
      const response = await axios.get(`${baseURL}/api/categories/get-all`);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  }
);

export const getSingleCategory = createAsyncThunk(
  "category/getSingleCategory",
  async (id) => {
    try {
      const response = await axios.get(`${baseURL}/api/categories/get/${id}`);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id) => {
    try {
      const response = await axios.delete(
        `${baseURL}/api/categories/delete/${id}`,
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

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ data, id }) => {
    try {
      const response = await axios.put(
        `${baseURL}/api/categories/update/${id}`,
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

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.addCategoryError = null;
      state.getAllCategoriesError = null;
      state.deleteCategoryError = null;
      state.updateCategoryError = null;
      state.getSingleCategoryError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCategory.pending, (state) => {
        state.addCategoryLoading = true;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.addCategoryLoading = false;
        state.categories.push(action.payload.category);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.addCategoryLoading = false;
        state.addCategoryError = action.error.message;
      })
      .addCase(getAllCategories.pending, (state) => {
        state.getAllCategoriesLoading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.getAllCategoriesLoading = false;
        state.categories = action.payload.categories;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.getAllCategoriesLoading = false;
        state.getAllCategoriesError = action.error.message;
      })
      .addCase(getSingleCategory.pending, (state) => {
        state.getSingleCategoryLoading = true;
      })
      .addCase(getSingleCategory.fulfilled, (state, action) => {
        state.getSingleCategoryLoading = false;
        state.category = action.payload.category;
      })
      .addCase(getSingleCategory.rejected, (state, action) => {
        state.getSingleCategoryLoading = false;
        state.getSingleCategoryError = action.error.message;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.deleteCategoryLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.deleteCategoryLoading = false;
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload.category._id
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.deleteCategoryLoading = false;
        state.deleteCategoryError = action.error.message;
      })
      .addCase(updateCategory.pending, (state) => {
        state.updateCategoryLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.updateCategoryLoading = false;
        state.categories = state.categories.map((category) => {
          if (category._id === action.payload.category._id) {
            return action.payload.category;
          }
          return category;
        });
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.updateCategoryLoading = false;
        state.updateCategoryError = action.error.message;
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;

export default categorySlice.reducer;
