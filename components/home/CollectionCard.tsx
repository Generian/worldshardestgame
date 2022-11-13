import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { Collection } from "@prisma/client";

interface LevelCardProps {
  collection: Collection
}

export default function CollectionCard({ collection }: LevelCardProps) {

  const handleImageError = (e) => {
    e.target.onerror = null;
    // e.target.style.display = 'none'
    e.target.src = "/images/placeholder.png"
}

  return (
    <Card
      key={`collection${collection.id}`}
      sx={{ width: 225 }}
      style={{ margin: '0.25rem'}}
    >
      <CardActionArea
        href={`/play?cid=${collection.id}`}
      >
        <CardMedia
          component="img"
          height="150"
          image={`/images/collections/${collection.id}.jpg`}
          alt={collection.title}
          onError={handleImageError}
          style={{backgroundColor: '#fafafa'}}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {collection.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {collection.authorId}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
