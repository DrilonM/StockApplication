import {Box, styled, Typography} from "@mui/material";
import React from "react";
import { formatNumberToMacedonian } from "../Utils/Helpres"
const ShowMetric = (props) => {
    return <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography>{props.title}</Typography>
                <Box sx={{display: 'flex', gap: 2}}>
                    <Typography>{props.value ? formatNumberToMacedonian(props.value) : 'N/A'}</Typography>
                    <Maybe sx={{
                        '--color': props.result === 'Buy' ? '#1976D2' : (props.result === "Sell" ? "orange" : props.result === "Hold" ? "gray" : "red")
                    }}>
                        {props.result ? props.result : 'N/A'}
                    </Maybe>
                </Box>
            </Box>
}

export default  ShowMetric

const Maybe = styled(Typography)({
    'color': "var(--color)",
    'fontWeight': 'bold'
})
