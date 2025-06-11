import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    IconButton,
    Typography,
    Container,
    Grid,
    Box,
    Button,
    Stack,
    useTheme,
    Divider,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { fetchProductBySlug, clearSelectedProduct } from '../redux/productsSlice';
import ColorSwatch from '../components/ColorSwatch';

const ProductDetailPage = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { selectedProduct, productStatus, productError } = useSelector(
        (state) => state.products
    );

    const [selectedColor, setSelectedColor] = useState(null);
    const [filteredImages, setFilteredImages] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const thumbnailRef = useRef();
    const theme = useTheme();

    useEffect(() => {
        dispatch(fetchProductBySlug(slug));
        return () => dispatch(clearSelectedProduct());
    }, [dispatch, slug]);

    useEffect(() => {
        if (selectedProduct) {
            const hasColors = selectedProduct.color_variations?.length > 0;
            const firstColor = hasColors ? selectedProduct.color_variations[0].color : null;
            const firstPhotos = hasColors
                ? selectedProduct.color_variations[0].photos || []
                : selectedProduct.photos || [];

            setSelectedColor(firstColor);
            setFilteredImages(firstPhotos);
            setMainImageIndex(0);
        }
    }, [selectedProduct]);

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
    }, [filteredImages]);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        const colorVariation = selectedProduct.colors.find(
            (variation) => variation.color.id === color.id
        );

        const matchingPhotos = selectedProduct.photos.filter(
            (photo) => photo.color?.id === colorVariation.color.id
        );

        setFilteredImages(matchingPhotos.length > 0 ? matchingPhotos : []);
        setMainImageIndex(0);
    };

    const scrollThumbnails = (direction) => {
        const scrollAmount = 100;
        if (direction === 'left') {
            thumbnailRef.current.scrollLeft -= scrollAmount;
        } else {
            thumbnailRef.current.scrollLeft += scrollAmount;
        }
    };

    if (productStatus === 'loading') return <Typography>Loading...</Typography>;
    if (productStatus === 'failed') return <Typography color="error">{productError}</Typography>;
    if (!selectedProduct) return null;

    const product = selectedProduct;
    const mainImage =
        filteredImages[mainImageIndex]?.photo?.image ||
        product.photos?.[0]?.photo?.image ||
        '/placeholder.jpg';

    return (
        <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
            <Grid container spacing={4}>
                {/* Image Section */}
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 400,
                            height: 400,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f9f9f9',
                            borderRadius: 4,
                            boxShadow: 2,
                            overflow: 'hidden',
                            minHeight: 400,
                        }}
                    >
                        <img
                            src={mainImage}
                            alt={product.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                display: 'block',
                            }}
                            loading="lazy"
                        />
                    </Box>

                    {/* Thumbnails */}
                    <Box sx={{ position: 'relative', mt: 3 }}>
                        {canScrollLeft && (
                            <IconButton
                                onClick={() => scrollThumbnails('left')}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: -16,
                                    transform: 'translateY(-50%)',
                                    zIndex: 2,
                                    backgroundColor: '#fff',
                                    boxShadow: 2,
                                }}
                            >
                                <ArrowBackIos fontSize="small" />
                            </IconButton>
                        )}

                        <Box
                            ref={thumbnailRef}
                            sx={{
                                display: 'flex',
                                overflowX: 'auto',
                                gap: 1,
                                scrollBehavior: 'smooth',
                                '&::-webkit-scrollbar': { display: 'none' },
                                pb: 1,
                                pt: 1,
                            }}
                        >
                            {filteredImages.map((imgObj, index) => (
                                <Box
                                    key={index}
                                    onClick={() => setMainImageIndex(index)}
                                    sx={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: 2,
                                        border:
                                            index === mainImageIndex
                                                ? `2px solid ${theme.palette.primary.main}`
                                                : '1px solid #ccc',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        backgroundColor: '#fff',
                                        flexShrink: 0,
                                        transition: 'transform 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: 2,
                                        },
                                    }}
                                >
                                    <img
                                        src={imgObj.photo?.image || '/placeholder.jpg'}
                                        alt={`Thumb ${index}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            display: 'block',
                                        }}
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
                                    zIndex: 2,
                                    backgroundColor: '#fff',
                                    boxShadow: 2,
                                }}
                            >
                                <ArrowForwardIos fontSize="small" />
                            </IconButton>
                        )}
                    </Box>

                    {/* Color Swatches */}
                    {product.colors?.length > 0 && (
                        <Stack direction="row" spacing={1} mt={2}>
                            {product.colors.map((colorObj) => (
                                <ColorSwatch
                                    key={colorObj.color.id}
                                    color={colorObj.color}
                                    isActive={selectedColor?.id === colorObj.color.id}
                                    onClick={() => handleColorSelect(colorObj.color)}
                                />
                            ))}
                        </Stack>
                    )}
                </Grid>

                {/* Product Details */}
                <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                        <Typography variant="h4" fontWeight="bold">
                            {product.name}
                        </Typography>
                        <Typography variant="h5" color="primary" fontWeight="bold">
                            ${parseFloat(product.price).toFixed(2)}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color={product.stock > 0 ? 'success.main' : 'error.main'}
                            fontWeight="600"
                        >
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            disabled={product.stock === 0}
                            sx={{ width: 'fit-content', borderRadius: 2, px: 4, py: 1 }}
                        >
                            Add to Cart
                        </Button>

                        <Divider />

                        <Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Product Description
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {product.description}
                            </Typography>
                        </Box>

                        <Divider />

                        <Stack spacing={1}>
                            <Typography variant="body2">
                                <strong>Brand:</strong> {product.brand}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Manufacturer:</strong> {product.manufacturer}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Country of Origin:</strong> {product.country_of_origin}
                            </Typography>
                            {product.asin && (
                                <Typography variant="body2">
                                    <strong>ASIN:</strong> {product.asin}
                                </Typography>
                            )}
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductDetailPage;