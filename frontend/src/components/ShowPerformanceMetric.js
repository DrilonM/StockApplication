import {Box, styled, Typography} from "@mui/material";
import React from "react";
const ShowPerformanceMetric = (props) => {
    return <Box sx={{display: 'flex', justifyContent: 'space-evenly', padding: 0.5}}>
        <Typography sx={{width: "33%", textAlign: "left", fontWeight: "bold"}}>
            {props.title}
        </Typography>
        <Typography sx={{textAlign: "right", width: "33%"}}>
            {props.value}
        </Typography>
        <Typography sx={{textAlign: "right", width: "33%", fontWeight: "bold"}}>
            <Maybe sx={{
                '--color': props.performance === 'Good' ||  props.performance === 'Excellent' ? '#1976D2' : (props.performance === "Poor" ? "orange" : props.performance === "Neutral" ? "gray" : "red")
            }}>
                {props.performance}
            </Maybe>
        </Typography>
    </Box>
}

export default ShowPerformanceMetric


const Maybe = styled(Typography)({
    color: "var(--color)",
    fontWeight: "bold"
})