"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginForm({
  onSubmit,
}: {
  onSubmit?: (data: any) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ email, password });
  };

  return (
    <Card elevation={4} sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 2 }}>
      <CardContent>
        <Typography
          variant="h5"
          component="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Đăng nhập
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={2.5}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 1 }}
            >
              Đăng nhập
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
