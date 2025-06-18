import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductCards } from '../redux/productsSlice.js';

import ProductCard from '../Components/ProductCard.js';
import { Grid, Typography, Container, Box, CircularProgress } from '@mui/material';
import ProductFilters from '../Components/ProductFilters.js';
import DiamondIcon from '@mui/icons-material/Diamond';

const ProductListPage = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProductCards());
    }
  }, [dispatch, items.length]);

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', pb: 8 }}>
      {/* Hero Banner */}
      <Box
        sx={{
          background: 'linear-gradient(to right, #fffaf0, #f0e6f7)',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container>
          <DiamondIcon sx={{ fontSize: 50, color: '#a854f3', mb: 1 }} />
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              mb: 1,
              color: '#3c3c3c',
            }}
          >
            Discover Timeless Jewelry
          </Typography>
          <Typography variant="subtitle1" sx={{ maxWidth: 600, mx: 'auto', color: '#555' }}>
            Browse our collection of luxury jewelry. Use the filters to find the perfect piece for you.
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container sx={{ mt: 5 }}>
        {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <ExcelUploadButton />
        </Box> */}

        <ProductFilters onFilter={(filters) => dispatch(fetchProductCards(filters))} />

        {/* Loading Spinner */}
        {status === 'loading' ? (
          <Box sx={{ textAlign: 'center', mt: 10 }}>
            <CircularProgress size={60} thickness={5} sx={{ color: '#a854f3' }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading your perfect piece...
            </Typography>
          </Box>
        ) : items.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 5, color: '#999' }}>
            No products found.
          </Typography>
        ) : (
          <Grid container spacing={4} justifyContent="center
          " mt={1}>
            {items.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ProductListPage;
