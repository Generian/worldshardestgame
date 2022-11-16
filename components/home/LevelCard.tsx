import { Card, CardActionArea, CardContent, CardMedia, Skeleton, Typography } from "@mui/material";
import { useAsync } from "react-async-hook";
import { formatFrameCountToTime } from "../../lib/helper";
import { LevelWithAuthor } from "../../pages/api/levels";
import { getHighscores } from "../../pages/api/levels/[lid]/highscores";

interface LevelCardProps {
  level?: LevelWithAuthor
}

export default function LevelCard({ level }: LevelCardProps) {
  const { loading, result, error } = useAsync(() => getHighscores(level.id, 1), [])

  const handleImageError = (e) => {
    e.target.onerror = null;
    // e.target.style.display = 'none'
    e.target.src = "/images/placeholder.png"
  }
  if (level) {
    return (
      <Card
        key={`level${level.id}`}
        sx={{ width: 225 }}
        style={{ margin: '0.25rem' }}
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
            style={{ backgroundColor: '#fafafa' }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {level.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {level.author.name}
            </Typography>
            {!loading && !error && result && <Typography variant="body2" color="text.secondary">
              {`${result[0].author.name} ${formatFrameCountToTime(result[0].length)}`}
            </Typography>}
            {!loading && (error || !result) && <Typography variant="body2" color="text.secondary">
              {"No highscore yet"}
            </Typography>}
            {loading && <Skeleton variant="rectangular" width={150} height={20} />
}
          </CardContent>
        </CardActionArea>
      </Card>
    )
  } else {
    return (
      <Card
        sx={{ width: 225 }}
        style={{ margin: '0.25rem' }}
      >
        <Skeleton variant="rectangular" width={225} height={150} />
        <CardContent>
          <Skeleton variant="rectangular" width={150} height={25} />
        </CardContent>
      </Card>
    )
  }
}
