import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
// import customFetch ,{ checkForUnauthorizedResponse } from "../../utils/axios";
import { showStatsThunk, getAllJobsThunk } from "./allJobsThunk";

const initialFiltersState = {
  search: "",
  searchStatus: "all",
  searchType: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
};

const initialState = {
  isLoading: false,
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  ...initialFiltersState,
};

// // get all jobs
// export const getAllJobs = createAsyncThunk(
//   "allJobs/getJobs",
//   async (_, thunkAPI) => {
//     const { page, search, searchStatus, searchType, sort } =
//       thunkAPI.getState().allJobs;
//     let url = `/jobs?status=${searchStatus}&jobType=${searchType}&sort=${sort}$page=${page}`;
//     if (search) {
//       url = url + `&search=${search}`;
//     }
//     try {
//       const { data } = await customFetch.get(url);
//       return data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data.msg);
//     }
//   }
// );

// // get all jobs stats
// export const showStats = createAsyncThunk(
//   "allJobs/showStats",
//   async (_, thunkAPI) => {
//     try {
//       const res = await customFetch.get("/jobs/stats");
//       console.log(res.data);
//       return res.data;
//     } catch (error) {
//       return checkForUnauthorizedResponse(error, thunkAPI);
//     }
//   }
// );

// get all jobs short version
export const getAllJobs = createAsyncThunk("allJobs/getJobs", getAllJobsThunk);
export const showStats = createAsyncThunk("allJobs/showStats", showStatsThunk);

//  all jobs slice
const allJobsSlice = createSlice({
  name: "allJobs",
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
    // handle change in search, search status, search type, sort
    handleChange: (state, { payload: { name, value } }) => {
      state.page = 1;
      state[name] = value;
    },
    // clear filters in search
    clearFilters: (state) => {
      return { ...state, ...initialFiltersState };
    },
    // page change
    pageChange: (state, { payload }) => {
      state.page = payload;
    },
    //clear all jobs
    clearAllJobsState: () => initialState,
  },
  extraReducers: {
    [getAllJobs.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getAllJobs.fulfilled]: (state, action) => {
      const payload = action.payload;
      state.isLoading = false;
      state.jobs = payload.jobs;
      state.numOfPages = payload.numOfPages;
      state.totalJobs = payload.totalJobs;
    },
    [getAllJobs.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [showStats.pending]: (state, action) => {
      state.isLoading = true;
    },
    [showStats.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.stats = payload.defaultStats;
      state.monthlyApplications = payload.monthlyStats; // monthly applications
    },
    [showStats.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
  },
});

export const {
  showLoading,
  hideLoading,
  handleChange,
  clearFilters,
  pageChange,
  clearAllJobsState,
} = allJobsSlice.actions;

export default allJobsSlice.reducer;
