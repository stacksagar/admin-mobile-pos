import { createAsyncThunk } from "@reduxjs/toolkit";
import { axios_req } from "../../../api/axios_req";
import { FetchDataParams } from "../../../hooks/useFetchWithPagination";

export const fetchDashboardData = createAsyncThunk(
  "expenses/fetchDashboardData",
  async (params?: FetchDataParams) => {
    const { data } = await axios_req.get(`/dashboard`, {
      params,
    });
    return data;
  }
);
