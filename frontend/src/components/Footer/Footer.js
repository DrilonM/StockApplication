import React from 'react';
import { Box, Container, Grid, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import imageSvg from '../../assets/Logo.png';

const Footer = () => {
    return (
        <Box component="footer" sx={{ backgroundColor: 'black', py: 4, color: 'white' }}>
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box
                            component="img"
                            src={imageSvg}
                            alt="Logo"
                            sx={{ height: 60, maxWidth: '100%', borderRadius: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="h6" gutterBottom>
                            Quick Links
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link component={RouterLink} to="/" color="inherit" underline="hover">
                                Home
                            </Link>
                            <Link component={RouterLink} to="/charts" color="inherit" underline="hover">
                                Charts
                            </Link>
                            <Link component={RouterLink} to="/technical" color="inherit" underline="hover">
                                Technical Analysis
                            </Link>
                            <Link component={RouterLink} to="/fundamental" color="inherit" underline="hover">
                                Fundamental Analysis
                            </Link>
                            <Link component={RouterLink} to="/lstm" color="inherit" underline="hover">
                                LSTM
                            </Link>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="h6" gutterBottom>
                            Contact Us
                        </Typography>
                        <Typography variant="body2">
                            Email: support@example.com
                        </Typography>
                        <Typography variant="body2">
                            Phone: +1 234 567 890
                        </Typography>
                    </Grid>
                </Grid>
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="body2">
                        &copy; {new Date().getFullYear()} SilkRoad. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
