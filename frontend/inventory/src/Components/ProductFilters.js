import React, { useState } from 'react';
import { Box, TextField, Button, Grid, Paper } from '@mui/material';

const ProductFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    model_number: '',
    gold_karat: '',
    gold_color: '',
    total_usd_min: '',
    total_usd_max: '',
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
        <Grid container spacing={2} alignItems="center" justifyContent={"center"}>
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
              name="total_usd_min"
              label="Min Price (usd)"
              value={filters.total_usd_min}
              onChange={handleChange}
              variant="outlined"
              size="small"
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              name="total_usd_max"
              label="Max Price (usd)"
              value={filters.total_usd_max}
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
