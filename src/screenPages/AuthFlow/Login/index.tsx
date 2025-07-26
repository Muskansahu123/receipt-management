import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import InputAdornment from "@mui/material/InputAdornment";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { VALID_USER } from "@/hooks/useAuth";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const handleLogin = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (
      trimmedEmail === VALID_USER.email &&
      trimmedPassword === VALID_USER.password
    ) {
      localStorage.setItem(
        "user",
        JSON.stringify({ email: trimmedEmail, password: trimmedPassword })
      );
      toast.success("Login successful!");
      router.push("/");
    } else {
      toast.error("Invalid email or password");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      router.replace("/");
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return null;

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ backgroundColor: "#f5f5f5", p: 2 }}
    >
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          width: { xs: "100%", sm: 700 },
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            p: 4,
            borderBottom: { xs: "1px solid #ccc", sm: "none" },
            borderRight: { sm: "1px solid #ccc" },
          }}
        >
          <Image
            src="/alit_logo.png"
            alt="Logo"
            width={150}
            height={150}
            style={{ objectFit: "contain" }}
          />
        </Box>

        <Box flex={2} p={4}>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            align="center"
          >
            Welcome To Receipt Management
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            align="center"
            gutterBottom
          >
            Enter your login credentials to access your account
          </Typography>

          <Box mt={3}>
            <Typography fontWeight="bold" gutterBottom>
              Email
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter email..."
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Typography fontWeight="bold" gutterBottom>
              Password
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter password..."
              type={showPassword ? "text" : "password"}
              variant="outlined"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Link
              href="/login"
              style={{ display: "flex", justifyContent: "end" }}
            >
              {" "}
              Forget Password
            </Link>

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, backgroundColor: "#1976d2", borderRadius: 2 }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
