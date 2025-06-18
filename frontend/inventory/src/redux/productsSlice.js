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

// Fetch single product by ID
export const fetchProductById = createAsyncThunk(
  'productCards/fetchById',
  async (id) => {
    const response = await axios.get(`/products/${id}`);
    return response.data;
  }
);

const productCardSlice = createSlice({
  name: 'productCards',
  initialState: {
    items: [],
    selectedProductId: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setSelectedProductId: (state, action) => {
      state.selectedProductId = action.payload;
    },
    clearSelectedProductId: (state) => {
      state.selectedProductId = null;
    },
  },
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
      })
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        const product = action.payload;
        const existingIndex = state.items.findIndex((item) => item.id === product.id);
        console.log('Fetched product on slice:', product);
        if (existingIndex !== -1) {
          state.items[existingIndex] = product;
        } else {
          state.items.push(product);
        }
        state.selectedProductId = product.id;
        state.status = 'succeeded';
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.selectedProductId = null;
      });
  },
});

export const { setSelectedProductId, clearSelectedProductId } = productCardSlice.actions;

export default productCardSlice.reducer;
