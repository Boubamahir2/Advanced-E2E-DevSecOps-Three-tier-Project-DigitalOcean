import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getUserFromLocalStorage } from "../../utils/localStorage";
import { createJobThunk, deleteJobThunk, editJobThunk } from "./jobThunk";
// import customFetch from "../../utils/axios";
// import { logoutUser } from "../user/userSlice";
// import { showLoading, hideLoading, getAllJobs } from "../allJobs/allJobsSlice";

const initialState = {
  isLoading: false,
  position: "",
  company: "",
  jobLocation: "",
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  jobType: "full-time",
  statusOptions: ["interview", "declined", "pending"],
  status: "pending",
  isEditing: false,
  editJobId: "",
};
// // create jobS
// export const createJob = createAsyncThunk(
//   "job/createJob",
//   async (job, thunkAPI) => {
//     try {
//       const res = await customFetch.post("/jobs", job, {
//         headers: {
//           Authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
//         },
//       });
//       thunkAPI.dispatch(clearValues());
//       return res.data;
//     } catch (error) {
//       if (error.response.status === 401) {
//         thunkAPI.dispatch(logoutUser());
//         return thunkAPI.rejectWithValue("Unauthorized! Logging Out...");
//       }
//       return thunkAPI.rejectWithValue(error.response.data.msg);
//     }
//   }
// );

// //delete job
// export const deleteJob = createAsyncThunk("job/deleteJob", async (jobId, thunkAPI) => {
//   try {
//     const res = await customFetch.delete(`/jobs/${jobId}`, {
//       headers: {
//         Authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
//       },
//     });
//     thunkAPI.dispatch(getAllJobs());
//     return res.data;
//   } catch (error) {
//     thunkAPI.dispatch(hideLoading());
//     return thunkAPI.rejectWithValue(error.response.data.msg);
//   }
// });


// //edit job
// export const editJob = createAsyncThunk(
//   "job/editJob",
//   async ({ jobId, job }, thunkAPI) => {
//     try {
//       const res = await customFetch.patch(`/jobs/${jobId}`, job, {
//         headers: {
//           Authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
//         },
//       });
//       thunkAPI.dispatch(clearValues());
//       return res.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data.msg);
//     }
//   }
// );

export const createJob = createAsyncThunk("job/createJob", createJobThunk);

export const deleteJob = createAsyncThunk("job/deleteJob", deleteJobThunk);

export const editJob = createAsyncThunk("job/editJob", editJobThunk);

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    handleChange: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearValues: () => {
      return {
        ...initialState,
        jobLocation: getUserFromLocalStorage()?.location || "",
      };
    },
    setEditJob: (state, { payload }) => {
      return { ...state, isEditing: true, ...payload };
    },
  },
  extraReducers: {
    // handle create job
    [createJob.pending]: (state) => {
      state.isLoading = true;
    },
    [createJob.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      toast.success("Job Created Successfully!");
    },
    [createJob.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },

    //handle edite job
    [editJob.pending]: (state) => {
      state.isLoading = true;
    },
    [editJob.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      toast.success("Job Edited Successfully!");
    },
    [editJob.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [deleteJob.fulfilled]: (state, { payload }) => {
      toast.success(payload);
    },
    [deleteJob.rejected]: (state, { payload }) => {
      toast.error(payload);
    },
  },
});
export const { handleChange, clearValues, setEditJob } = jobSlice.actions;
export default jobSlice.reducer;
