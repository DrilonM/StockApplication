import React from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import imageSvg from "../../assets/Logo.png";

const Header = () => {
    return (
        <AppBar position="static" sx={{ background: 'black', display: 'flex', pl: 5,  justifyContent: "center", flexDirection: "row"}}>
            <Toolbar sx={{ display: 'flex', width:"80vw"}}>
                <Box
                    component="img"
                    src={imageSvg}
                    alt="Logo"
                    sx={{
                        display: 'flex',
                        height: 'auto',
                        maxWidth: 50,
                        borderRadius: 2,
                        mx: 'auto',
                        marginLeft: "0",
                        marginRight: "0"
                    }}
                />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: "space-between", ml: 5}}>
                    <Link component={RouterLink} to="/" color="inherit" underline="hover" sx={{fontSize: "20px", mr: 3.5}}>
                        Home
                    </Link>
                    <Link component={RouterLink} to="/charts" color="inherit" underline="hover" sx={{fontSize: "20px", mr: 3.5}}>
                        Charts
                    </Link>
                    <Link component={RouterLink} to="/technical" color="inherit" underline="hover" sx={{fontSize: "20px", mr: 3.5}}>
                        Technical Analysis
                    </Link>
                    <Link component={RouterLink} to="/fundamental" color="inherit" underline="hover" sx={{fontSize: "20px", mr: 3.5}}>
                        Fundamental Analysis
                    </Link>
                    <Link component={RouterLink} to="/lstm" color="inherit" underline="hover" sx={{fontSize: "20px", mr: 3.5}}>
                        LSTM
                    </Link>
                </Box>
                {/*<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>*/}
                {/*    <TextField*/}
                {/*        variant="outlined"*/}
                {/*        size="small"*/}
                {/*        placeholder="Search Stock"*/}
                {/*        InputProps={{*/}
                {/*            endAdornment: (*/}
                {/*                <InputAdornment position="end">*/}
                {/*                    <SearchIcon />*/}
                {/*                </InputAdornment>*/}
                {/*            ),*/}
                {/*            sx: {*/}
                {/*                backgroundColor: 'white',*/}
                {/*                borderRadius: 1,*/}
                {/*                '& .MuiOutlinedInput-notchedOutline': {*/}
                {/*                    borderColor: 'white',*/}
                {/*                },*/}
                {/*                '&:hover .MuiOutlinedInput-notchedOutline': {*/}
                {/*                    borderColor: 'white',*/}
                {/*                },*/}
                {/*                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {*/}
                {/*                    borderColor: 'white',*/}
                {/*                },*/}
                {/*                color: 'black',*/}
                {/*            },*/}
                {/*        }}*/}
                {/*        sx={{*/}
                {/*            width: '200px',*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</Box>*/}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
