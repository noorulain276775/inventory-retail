// src/redux/productCardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axiosConfig';

// Fetch product cards with filters
export const fetchProductCards = createAsyncThunk(
  'productCards/fetch',
  async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const url = query ? `/products-list?${query}` : '/products-list';
    const response = await axios.get(url);
    return response.data;
  }
);

const productCardSlice = createSlice({
  name: 'productCards',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductCards.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductCards.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProductCards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productCardSlice.reducer;
