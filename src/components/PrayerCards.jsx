import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

const PrayerCards = ({name,time,image}) => {
    return (
        <>
        <Card sx={{width:230}}>
        <CardActionArea>
        <CardMedia
        component="img"
        height="140"
        image={image}
        />
        <CardContent>
        <Typography gutterBottom variant="h5" component="div" style={{fontFamily:'IBM Plex Sans Arabic'}}>{name}</Typography>
        <Typography variant="h2">{time}</Typography>
        </CardContent>
        </CardActionArea>
        </Card>
        </>
    )
}
export default PrayerCards;