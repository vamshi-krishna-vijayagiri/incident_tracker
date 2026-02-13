import { Box, Typography, Paper, Alert } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    setLoading(true);
    setError("");
    const success = await login(username, password);
    setLoading(false);

    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Paper
        sx={{
          p: 4,
          width: 350,
        }}
      >
        <Typography variant="h5" mb={2} textAlign="center">
          WELCOME
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <InputField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={!!error}
        />

        <Box mt={2}>
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
          />
        </Box>

        <PrimaryButton
          label={loading ? "Logging in..." : "Login"}
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleLogin}
          disabled={loading}
        />
      </Paper>
    </Box>
  );
};

export default Login;
