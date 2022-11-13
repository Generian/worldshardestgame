import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { Level } from "@prisma/client";

interface LevelCardProps {
  level: Level
}

export default function LevelCard({ level }: LevelCardProps) {

  const handleImageError = (e) => {
    e.target.onerror = null;
    // e.target.style.display = 'none'
    e.target.src = "/images/placeholder.png"
}

  return (
    <Card
      key={`level${level.id}`}
      sx={{ width: 225 }}
      style={{ margin: '0.25rem'}}
    >
      <CardActionArea
        href={`/play?lid=${level.id}`}
      >
        <CardMedia
          component="img"
          height="150"
          image={`/images/levels/${level.id}.jpg`}
          alt={level.title}
          onError={handleImageError}
          style={{backgroundColor: '#fafafa'}}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {level.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {level.authorId}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
