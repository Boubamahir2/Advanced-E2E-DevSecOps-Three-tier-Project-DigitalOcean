import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";
import { clearAllJobsState } from "../allJobs/allJobsSlice";
import { clearValues } from "../job/jobSlice";
import { logoutUser } from "./userSlice";

// registerUser in the server
export const registerUserThunk = async (url, user, thunkAPI) => {
  try {
    const response = await customFetch.post(url, user);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

// loginUser in the server
export const loginUserThunk = async (url, user, thunkAPI) => {
  try {
    const response = await customFetch.post(url, user);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

// updateUser in the server
export const updateUserThunk = async (url, user, thunkAPI) => {
  try {
    const response = await customFetch.patch(url, user, {
      headers: {
        Authorization: `Bearer ${thunkAPI.getState().user.user.token}`,

      },
    });
    return response.data;
  } catch (error) {
    // console.log(error.response);
    // if (error.response.status === 401) {
    //   thunkAPI.dispatch(logoutUser());
    //   return thunkAPI.rejectWithValue("Unauthorized! Logging Out...");
    // }
    // return thunkAPI.rejectWithValue(error.response.data.msg);
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

// clear store
export const clearStoreThunk = async (message, thunkAPI) => {
  try {
    // logout user
    thunkAPI.dispatch(logoutUser(message));
    // clear all jobs state
    thunkAPI.dispatch(clearAllJobsState());
    // clear job input values
    thunkAPI.dispatch(clearValues());
    return Promise.resolve();
  } catch (error) {
    return Promise.reject();
  }
};
