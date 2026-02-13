import React from "react";
import { Avatar, Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

interface ProfileAvatarProps {
  photoUrl?: string | null;
  size?: number;
  onChange?: (file: File | null) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  photoUrl = null,
  size = 90,
  onChange,
}) => {
  const [preview, setPreview] = React.useState<string | null>(photoUrl);

  React.useEffect(() => {
    if (photoUrl) setPreview(photoUrl);
  }, [photoUrl]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onChange?.(file);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      onChange?.(null);
    }
  };

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        border: "3px solid #f5f5f5",
        transition: "transform 0.3s ease",
        "&:hover": { transform: "scale(1.02)" },
        position: "relative",
      }}
    >
      <Avatar
        src={preview || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
        alt="Profile"
        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "rgba(0,0,0,0.45)",
          opacity: 0,
          transition: "opacity 0.3s ease",
          "&:hover": { opacity: 1 },
        }}
      >
        <IconButton
          component="label"
          sx={{
            color: "white",
            backgroundColor: "rgba(0,0,0,0.6)",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
          }}
        >
          <EditIcon />
          <input hidden accept="image/*" type="file" onChange={handleUpload} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ProfileAvatar;
