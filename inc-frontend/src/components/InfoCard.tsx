import React from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
} from "@mui/material";

interface InfoCardProps {
  title: string;
  count: string;
  maxWidth?: number;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  count,
  maxWidth = 400,
}) => {
  return (
    <Card sx={{ maxWidth, height: "70px" }}>
      <CardActionArea>
        <CardContent sx={{ padding: "6px 16px", height: "100%" }}>
          <Typography
            color="text.secondary"
            mb={0.5}
          >
            {title}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            {count}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default InfoCard;
