import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_SERVER_URL;

const initialState = {
  user: null,
  isAuthenticated: true,
  registerLoading: false,
  registerError: null,
  activateToken: null,
  activateLoading: false,
  activateError: null,
  loginLoading: false,
  loginError: null,
  logoutLoading: false,
  logoutError: null,
  forgetPasswordLoading: false,
  forgetPasswordError: null,
  fogertPasswordToken: null,
  resetPasswordActicationLoading: false,
  resetPasswordActicationError: null,
  resetPasswordLoading: false,
  meLoading: false,
  meError: null,
  me: null,
  getAllUsersLoading: false,
  getAllUsersError: null,
  users: [],
  totalUsers: 0,
  currentPage: 1,
  totalPages: 1,
  updateUserInfoLoading: false,
  updateUserInfoError: null,
  changeEmailToken: null,
  activateChangedEmailLoading: false,
  activateChangedEmailError: null,
  changePasswordRequestLoading: false,
  changePasswordRequestError: null,
  changePasswordToken: null,
  activateChangedPasswordLoading: false,
  activateChangedPasswordError: null,
  deleteAccountLoading: false,
  deleteAccountError: null,
};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (data) => {
    try {
      const response = await axios.post(`${baseURL}/api/users/register`, data);
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

export const activateUser = createAsyncThunk(
  "user/activateUser",
  async (data) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/users/activation`,
        data
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

export const loginUser = createAsyncThunk("user/loginUser", async (data) => {
  try {
    const response = await axios.post(`${baseURL}/api/users/login`, data, {
      withCredentials: true,
    });
    if (response.data.success) {
      toast.success(response.data.message);
    }
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    throw new Error(error.response.data.message);
  }
});

export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  try {
    const response = await axios.post(
      `${baseURL}/api/users/logout`,
      {},
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
});

export const forgetPassword = createAsyncThunk(
  "user/forgetPassword",
  async (data) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/users/forget-password`,
        data
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

export const resetPasswordActivation = createAsyncThunk(
  "user/resetPasswordActivation",
  async (data) => {
    try {
      const response = await axios.put(
        `${baseURL}/api/users/reset-password`,
        data
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

export const me = createAsyncThunk("user/me", async () => {
  try {
    const response = await axios.get(`${baseURL}/api/users/me`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async ({ name, limit, page, sortField, sortOrder }) => {
    try {
      const response = await axios.get(`${baseURL}/api/users/get-all`, {
        withCredentials: true,
        params: {
          name,
          limit,
          page,
          sortField,
          sortOrder,
        },
      });
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  async (data) => {
    try {
      const response = await axios.put(`${baseURL}/api/users/update`, data, {
        withCredentials: true,
      });
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

export const activateChangeEmail = createAsyncThunk(
  "user/activateChangedEmail",
  async (data) => {
    try {
      const response = await axios.put(
        `${baseURL}/api/users/update-email-activation`,
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

export const changePasswordRequest = createAsyncThunk(
  "user/changePasswordRequest",
  async ({ old_password }) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/users/update-password`,
        {
          old_password,
        },
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

export const activateChangedPassword = createAsyncThunk(
  "user/activateChangedPassword",
  async (data) => {
    try {
      const response = await axios.put(
        `${baseURL}/api/users/update-password-activation`,
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

export const deleteAccount = createAsyncThunk(
  "user/deleteAccount",
  async () => {
    try {
      const response = await axios.delete(`${baseURL}/api/users/delete`, {
        withCredentials: true,
      });
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


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.registerError = null;
      state.loginError = null;
      state.activateError = null;
      state.forgetPasswordError = null;
      state.resetPasswordActicationError = null;
      state.meError = null;
      state.getAllUsersError = null;
      state.updateUserInfoError = null;
      state.activateChangedEmailError = null;
      state.changePasswordRequestError = null;
      state.activateChangedPasswordError = null;
      state.deleteAccountError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerLoading = false;
        state.activateToken = action.payload.activation_token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.error.message;
      })
      .addCase(activateUser.pending, (state) => {
        state.activateLoading = true;
        state.activateError = null;
      })
      .addCase(activateUser.fulfilled, (state) => {
        state.activateLoading = false;
        state.activateToken = null;
      })
      .addCase(activateUser.rejected, (state, action) => {
        state.activateLoading = false;
        state.activateError = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.error.message;
      })
      .addCase(logoutUser.pending, (state) => {
        state.logoutLoading = true;
        state.logoutError = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutLoading = false;
        state.logoutError = action.error.message;
      })
      .addCase(forgetPassword.pending, (state) => {
        state.forgetPasswordLoading = true;
        state.forgetPasswordError = null;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.forgetPasswordLoading = false;
        state.fogertPasswordToken = action.payload.activation_token;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.forgetPasswordLoading = false;
        state.forgetPasswordError = action.error.message;
      })
      .addCase(resetPasswordActivation.pending, (state) => {
        state.resetPasswordActicationLoading = true;
        state.resetPasswordActicationError = null;
      })
      .addCase(resetPasswordActivation.fulfilled, (state) => {
        state.resetPasswordActicationLoading = false;
        state.fogertPasswordToken = null;
      })
      .addCase(resetPasswordActivation.rejected, (state, action) => {
        state.resetPasswordActicationLoading = false;
        state.resetPasswordActicationError = action.error.message;
      })
      .addCase(me.pending, (state) => {
        state.meLoading = true;
        state.meError = null;
      })
      .addCase(me.fulfilled, (state, action) => {
        state.meLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(me.rejected, (state, action) => {
        state.meError = action.error.message;
        state.meLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.getAllUsersLoading = true;
        state.getAllUsersError = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.getAllUsersLoading = false;
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.getAllUsersLoading = false;
        state.getAllUsersError = action.error.message;
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.updateUserInfoLoading = true;
        state.updateUserInfoError = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.updateUserInfoLoading = false;
        state.user = action.payload.user;
        state.changeEmailToken = action.payload.activation_token;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.updateUserInfoLoading = false;
        state.updateUserInfoError = action.error.message;
      })
      .addCase(activateChangeEmail.pending, (state) => {
        state.activateChangedEmailLoading = true;
        state.activateChangedEmailError = null;
      })
      .addCase(activateChangeEmail.fulfilled, (state, action) => {
        state.activateChangedEmailLoading = false;
        state.changeEmailToken = null;
        state.user = action.payload.user;
      })
      .addCase(activateChangeEmail.rejected, (state, action) => {
        state.activateChangedEmailLoading = false;
        state.activateChangedEmailError = action.error.message;
      })
      .addCase(changePasswordRequest.pending, (state) => {
        state.changePasswordRequestLoading = true;
        state.changePasswordRequestError = null;
      })
      .addCase(changePasswordRequest.fulfilled, (state, action) => {
        state.changePasswordRequestLoading = false;
        state.changePasswordToken = action.payload.activation_token;
      })
      .addCase(changePasswordRequest.rejected, (state, action) => {
        state.changePasswordRequestLoading = false;
        state.changePasswordRequestError = action.error.message;
      })
      .addCase(activateChangedPassword.pending, (state) => {
        state.activateChangedPasswordLoading = true;
        state.activateChangedPasswordError = null;
      })
      .addCase(activateChangedPassword.fulfilled, (state) => {
        state.activateChangedPasswordLoading = false;
        state.changePasswordToken = null;
      })
      .addCase(activateChangedPassword.rejected, (state, action) => {
        state.activateChangedPasswordLoading = false;
        state.activateChangedPasswordError = action.error.message;
      })
      .addCase(deleteAccount.pending, (state) => {
        state.deleteAccountLoading = true;
        state.deleteAccountError = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.deleteAccountLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.deleteAccountLoading = false;
        state.deleteAccountError = action.error.message;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
