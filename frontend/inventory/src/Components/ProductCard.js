import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const imageUrl = product?.images?.[0]?.image || '/default.jpg';
  const altText = product?.images?.[0]?.alt_text || product.model_number || 'Jewelry Product';

  return (
    <Link to={`/product/${product.model_number}`} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          width: 300,
          height: 380,
          m: 2,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s',
          transformOrigin: 'center',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        <CardMedia
          component="img"
          image={imageUrl}
          alt={altText}
          sx={{
            height: 230,
            objectFit: 'contain',
          }}
        />
        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            px: 1.5,
            py: 1.2,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              lineHeight: '1.2rem',
              mb: 0.5,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
            }}
          >
            Model: {product.model_number}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Karat: {product.gold_karat} | Color: {product.gold_color}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Weight: {product.total_weight}g
          </Typography>

          <Typography variant="body1" fontWeight="bold" sx={{ mt: 0.5 }}>
            ${parseFloat(product.total_usd).toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
