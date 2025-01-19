import React from 'react';
import { Box, Grid, Typography, Button, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import imageSvg from '../../assets/man-working-on-laptop.png';

const HeroSection = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '40vh',
                backgroundColor: '#f5f5f5',
                p: 2,
            }}
        >
            <Box
                square
                sx={{
                    p: { xs: 3, md: 6 },
                    backgroundColor: '#f5f5f5',
                    maxWidth: 1200,
                    width: '100%',
                }}
            >
                <Grid
                    container
                    spacing={4}
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                >
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                            }}
                        >
                            <Typography variant="h2" gutterBottom>
                                Daily Updates of Stock Market
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Stay informed with the latest trends and insights in the stock market. Our comprehensive analysis and real-time data help you make informed investment decisions.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                component={RouterLink}
                                to="/charts"
                                sx={{ mt: 2 }}
                            >
                                See Charts
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            component="img"
                            src={imageSvg}
                            alt="Stock Market Illustration"
                            sx={{
                                width: { xs: '80%', md: '100%' },
                                height: 'auto',
                                maxWidth: 500,
                                borderRadius: 2,
                                mx: 'auto',
                                display: 'block',
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default HeroSection;
