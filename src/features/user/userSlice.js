import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  updateUserThunk,
  clearStoreThunk,
  loginUserThunk,
  registerUserThunk,
} from "./userThunk";

import {
  addUserToLocalStorage,
  removeUserFromLocalStorage,
  getUserFromLocalStorage,
} from "../../utils/localStorage";

const initialState = {
  isLoading: false,
  isSidebarOpen: false,
  user: getUserFromLocalStorage(),
};

//createAsyncThunk is a function that takes in a name and a function
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (user, thunkAPI) => {
    return registerUserThunk("/auth/register", user, thunkAPI);
  }
);

// loginUser is a function that takes in a name and a function
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (user, thunkAPI) => {
    return loginUserThunk("/auth/login", user, thunkAPI);
  }
);

// udpateUser in the server
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (user, thunkAPI) => {
    return updateUserThunk("/auth/updateUser", user, thunkAPI);
  }
);

// cleatStore 
export const clearStore = createAsyncThunk("user/clearStore", clearStoreThunk);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },

    logoutUser: (state, { payload }) => {
      state.user = null;
      state.isSidebarOpen = false;
      removeUserFromLocalStorage();
      if (payload) {
        toast.success(payload);
      }
    },
  },
  extraReducers: {
    // reducer for the registerUser action
    [registerUser.pending]: (state, action) => {
      state.isLoading = true;
    },
    [registerUser.fulfilled]: (state, action) => {
      const  user  = action.payload;
      state.isLoading = false;
      state.user = user;
      // console.log("user in register",user);
      //if the response is successful then we want to add the user to local storage
      //and then we want to set the user in the state
      addUserToLocalStorage(user);
      toast.success(`registered successfully, hi ${user.user.name}`);
    },
    [registerUser.rejected]: (state, action) => {
      state.isLoading = false;
      toast.error(action);
    },

    // loginUser
    [loginUser.pending]: (state, action) => {
      state.isLoading = true;
    },
    [loginUser.fulfilled]: (state, action) => {
      const  user  = action.payload;
      state.isLoading = false;
      state.user = user;
      // console.log("user in login", user);
      //if the login is successful then we want to add the user to local storage
      addUserToLocalStorage(user);
      toast.success(`welcome back ${user.user.name}`);
    },
    [loginUser.rejected]: (state, action) => {
      state.isLoading = false;
      toast.error(action.payload);
    },
    // updateUser
    [updateUser.pending]: (state, action) => {
      state.isLoading = true;
       const user = action.payload;
       console.log("user in update", action.payload);
    },
    [updateUser.fulfilled]: (state, action) => {
      const  user  = action.payload;
     
      state.isLoading = false;
      state.user = user;
      //if the update is successful then we want to add the user to local storage
      addUserToLocalStorage(user);
      toast.success("user udated successfully");
    },
    [updateUser.rejected]: (state, action) => {
      state.isLoading = false;
      toast.error(action.payload);
    },
    // clearStore
    [clearStore.rejected]: (state, action) => {
      toast.error('something went wrong in clearStore');
    }
  },
});

export const { toggleSidebar, logoutUser } = userSlice.actions;
export default userSlice.reducer;
