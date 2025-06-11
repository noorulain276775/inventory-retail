import React, { useState } from 'react';
import { Box, TextField, Button, Grid, Paper } from '@mui/material';

const ProductFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    model_number: '',
    gold_karat: '',
    gold_color: '',
    min_weight: '',
    max_weight: '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              name="model_number"
              label="Model Number"
              value={filters.model_number}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              name="gold_karat"
              label="Gold Karat"
              value={filters.gold_karat}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              name="gold_color"
              label="Gold Color"
              value={filters.gold_color}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              name="min_weight"
              label="Min Weight (g)"
              value={filters.min_weight}
              onChange={handleChange}
              variant="outlined"
              size="small"
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              name="max_weight"
              label="Max Weight (g)"
              value={filters.max_weight}
              onChange={handleChange}
              variant="outlined"
              size="small"
              type="number"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              size="large"
              sx={{
                height: '100%',
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 2,
              }}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ProductFilters;
