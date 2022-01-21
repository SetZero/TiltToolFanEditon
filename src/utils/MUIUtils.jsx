
import * as React from 'react'
import { CircularProgress, Typography, Box, CardMedia } from '@mui/material'
import { Image } from '@mui/icons-material';
import { fontSize, height, padding } from '@mui/system';

export function PlayerStatsCard(props)
{
    return(

        <Box 
            sx={{ 
                position: 'relative', 
                display: 'inline-grid', 
                borderRadius:'5px', 
                backgroundColor:'#570861',
                padding:"10px",
                border: 'dashed',
                borderColor:"#7508f1",
                borderWidth: "2px",
                marginRight: "2px"
                }}>

            <Box sx = {{ position: 'relative', textAlign:'center'}}>
                <Typography variant="subtitle2" component="div" style={{marginTop:"-5px"}}>{props.championName}</Typography>
            </Box>

            <PlayerStatsIcon
                championWinrate={props.championWinrate}  
                championImageSrc={props.championImageSrc} 
                championName={props.championName}
            />

            <Box sx = {{ position: 'relative', textAlign:'center'}}>
            <Typography variant="subtitle1" component="div" color={"goldenrod"} style={{fontSize:"14px"}}>K/D/A</Typography>
            </Box>
        </Box>
        
    );
}


export function PlayerStatsIcon(props)
{
    return(
        <Box sx = {{ position: 'relative', display: 'inline-flex'}}>
            <Box
            sx = {{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <Box
            sx = {{
                position:'absolute',
            }}
            >
            <Typography variant="subtitle1" component="div" color={"white"} style={{ textShadow:"1px 1px #000" }} >{props.championWinrate}%</Typography>
            </Box>
                <CardMedia 
                    component="img"
                    height="95%"
                    width="100%"
                    alt=""
                    image={props.championImageSrc}
                    style={{borderRadius:"50%", border:"2px solid #333344"}}
                />
            </Box>

            <CircularProgress variant="determinate" size={50} value={props.championWinrate} style={{'color': '#ff0a00'}}/>
        </Box>
    );
}
