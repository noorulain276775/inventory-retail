// src/pages/ProductDetailPage.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  IconButton,
  Typography,
  Container,
  Grid,
  Box,
  Divider,
  useTheme,
  Stack,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import {
  fetchProductById,
  setSelectedProductId,
  clearSelectedProductId,
} from '../redux/productsSlice';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const thumbnailRef = useRef();

  const { items = [], selectedProductId, status, error } = useSelector(
    (state) => state.products || {}
  );
  const selectedProduct = React.useMemo(() => {
    return items.find((item) => String(item.id) === String(selectedProductId));
  }, [items, selectedProductId]);

  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(setSelectedProductId(id));
    }
    return () => {
      dispatch(clearSelectedProductId());
    };
  }, [dispatch, id]);

  useEffect(() => {
    const el = thumbnailRef.current;
    if (!el) return;
    const checkScroll = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };
    checkScroll();
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [selectedProduct]);

  if (status === 'loading') return <Typography>Loading...</Typography>;
  if (status === 'failed') return <Typography color="error">Error: {error}</Typography>;
  if (!selectedProduct) return <Typography>No product found.</Typography>;

  const images = selectedProduct.images || [];
  const mainImageUrl = images[mainImageIndex]?.image || '/placeholder.jpg';

  const scrollThumbnails = (dir) => {
    if (thumbnailRef.current) {
      const offset = dir === 'left' ? -100 : 100;
      thumbnailRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Grid container
        spacing={4}
        justifyContent="center"
        alignItems="flex-start">
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: 400,
              height: 400,
              bgcolor: '#f9f9f9',
              borderRadius: 2,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 2,
            }}
          >
            <img
              src={mainImageUrl}
              alt={selectedProduct.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
              loading="lazy"
            />
          </Box>


          {images.length > 1 && (
            <Box sx={{ position: 'relative', mt: 2 }}>
              {canScrollLeft && (
                <IconButton
                  onClick={() => scrollThumbnails('left')}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: -16,
                    transform: 'translateY(-50%)',
                    bgcolor: '#fff',
                    boxShadow: 2,
                    zIndex: 1,
                  }}
                >
                  <ArrowBackIos />
                </IconButton>
              )}

              <Box
                ref={thumbnailRef}
                sx={{
                  display: 'flex',
                  overflowX: 'auto',
                  gap: 1,
                  pt: 1,
                  pb: 1,
                  '&::-webkit-scrollbar': { display: 'none' },
                }}
              >
                {images.map((img, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setMainImageIndex(idx)}
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: 1,
                      border:
                        idx === mainImageIndex
                          ? `2px solid ${theme.palette.primary.main}`
                          : '1px solid #ccc',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                  >
                    <img
                      src={img.image || img.photo?.image || '/placeholder.jpg'}
                      alt={`Thumb ${idx}`}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      loading="lazy"
                    />
                  </Box>
                ))}
              </Box>

              {canScrollRight && (
                <IconButton
                  onClick={() => scrollThumbnails('right')}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: -16,
                    transform: 'translateY(-50%)',
                    bgcolor: '#fff',
                    boxShadow: 2,
                    zIndex: 1,
                  }}
                >
                  <ArrowForwardIos />
                </IconButton>
              )}
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Typography variant="h4">{selectedProduct.name}</Typography>

            <Stack direction="row" spacing={1}>
              {selectedProduct.model_number && (
                <Typography
                  variant="body2"
                  sx={{ bgcolor: '#e0f7fa', px: 1, py: 0.5, borderRadius: 1 }}
                >
                  Model: {selectedProduct.model_number}
                </Typography>
              )}
            </Stack>

            <Divider />

            {selectedProduct.gold_color && (
              <Typography><strong>Gold Color:</strong> {selectedProduct.gold_color}</Typography>
            )}
            {selectedProduct.gold_karat && (
              <Typography><strong>Gold Karat:</strong> {selectedProduct.gold_karat}</Typography>
            )}
            {selectedProduct.total_metal_weight && (
              <Typography><strong>Metal Weight:</strong> {selectedProduct.total_metal_weight}g</Typography>
            )}
            {selectedProduct.total_weight && (
              <Typography><strong>Total Weight:</strong> {selectedProduct.total_weight}g</Typography>
            )}
            {selectedProduct.total_usd && (
              <Typography><strong>Price in USD:</strong> ${selectedProduct.total_usd}</Typography>
            )}

            <Divider />

            {selectedProduct.diamonds?.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Diamonds
                </Typography>
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={styledTable}>
                    <thead>
                      <tr>
                        <th style={headerCell}>Description</th>
                        <th style={headerCell}>Size</th>
                        <th style={headerCell}>Qty</th>
                        <th style={headerCell}>Weight (ct)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProduct.diamonds.map((d, index) => (
                        <tr key={index} style={index % 2 === 0 ? evenRow : oddRow}>
                          <td style={bodyCell}>{d.description}</td>
                          <td style={bodyCell}>{d.size}</td>
                          <td style={bodyCell}>{d.quantity}</td>
                          <td style={bodyCell}>{d.total_weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </>
            )}

            {selectedProduct.colored_stones?.length > 0 && (
              <>

                <Typography variant="h6" sx={{ mb: 1 }}>
                  Colored Stones
                </Typography>
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={styledTable}>
                    <thead>
                      <tr>
                        <th style={headerCell}>Description</th>
                        <th style={headerCell}>Size</th>
                        <th style={headerCell}>Qty</th>
                        <th style={headerCell}>Weight (ct)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProduct.colored_stones.map((stone, index) => (
                        <tr key={index} style={index % 2 === 0 ? evenRow : oddRow}>
                          <td style={bodyCell}>{stone.description}</td>
                          <td style={bodyCell}>{stone.size}</td>
                          <td style={bodyCell}>{stone.quantity}</td>
                          <td style={bodyCell}>{stone.total_weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </>
            )}

          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

const styledTable = {
  width: '100%',
  minWidth: 600,
  borderCollapse: 'collapse',
  fontSize: '14px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

const headerCell = {
  padding: '12px 16px',
  backgroundColor: '#f5f5f5',
  borderBottom: '2px solid #ccc',
  textAlign: 'left',
  fontWeight: 'bold',
};

const bodyCell = {
  padding: '10px 16px',
  borderBottom: '1px solid #eee',
};

const evenRow = {
  backgroundColor: '#fafafa',
};

const oddRow = {
  backgroundColor: '#fff',
};


export default ProductDetailPage;
