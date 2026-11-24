"use client";

import styles from "./page.module.css";
import { TypeAnimation } from "react-type-animation";
import {
  Box,
  IconButton,
  Button,
  TextField,
  Tooltip,
  Typography,
  Stack,
  formLabelClasses,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddModeratorIcon from "@mui/icons-material/AddModerator";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useRouter } from "next/navigation";
import checkEmail from "./utils/checkEmail";
import { keyframes } from "@mui/system";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;
// const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailExists, setEmailExits] = useState<boolean>(false);
  const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value.trim();
    setEmail(email);
    if (!email) return;
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      const registered = await checkEmail(email);
      setEmailError(registered ? "This email is already registered" : null);
    } catch {
      setEmailError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEmailValid(EMAIL_RE.test(email.trim()));
  }, [email]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Typography
          sx={{
            fontFamily: "var(--font-cursive), cursive",
            textAlign: "center",
            fontSize: 50,
            fontWeight: "bold",
            mb: 1.5,
          }}
          variant="h1"
          component="div"
        >
          <TypeAnimation
            sequence={["Hello, World!", 3000]}
            speed={10}
            cursor={true}
            repeat={3}
          />
        </Typography>
        <Stack>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "5px",
            }}
          >
            <TextField
              label="Email"
              type="email"
              onBlur={handleEmailBlur}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              error={Boolean(emailError)}
              helperText={emailError ?? " "}
              sx={{
                justifyItems: "center",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  width: "100%",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #eef2ff 55%, #e0e7ff 100%)",
                  boxShadow: "0 4px 14px rgba(79, 70, 229, 0.12)",
                  transition: "box-shadow 0.2s ease",

                  "& fieldset": { borderColor: "rgba(79, 70, 229, 0.25)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(79, 70, 229, 0.55)",
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 6px 20px rgba(79, 70, 229, 0.25)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4f46e5",
                    borderWidth: 2,
                  },

                  "&.Mui-error fieldset": { borderColor: "error.main" },
                  "&.Mui-error:hover fieldset": { borderColor: "error.main" },
                },
                "& label.Mui-focused": { color: "#4f46e5" },
                "& label.Mui-error": { color: "error.main" },
              }}
            />
            {emailValid ? (
              <Tooltip title="Submit your email">
                <span>
                  <IconButton
                    aria-label="Rotate PIN"
                    onClick={handleClick}
                    disabled={loading || !emailValid}
                    sx={{
                      marginTop: "20%",
                      backgroundColor: "black",
                      color: "white",
                      "&:hover": { backgroundColor: "#333" },
                      "&.Mui-disabled": {
                        backgroundColor: "#666",
                        color: "white",
                      },
                    }}
                  >
                    <AutorenewIcon
                      sx={{
                        animation: loading
                          ? `${spin} 1s linear infinite`
                          : "none",
                        "@media (prefers-reduced-motion: reduce)": {
                          animation: "none",
                        },
                      }}
                    />
                  </IconButton>
                </span>
              </Tooltip>
            ) : null}
          </Box>
          {emailValid ? null : (
            <Typography
              role="alert"
              sx={{
                fontFamily: "var(--font-cursive), cursive",
                fontWeight: 400,
                fontSize: 18,
                color: "#ffb4ab",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.35)",
              }}
            >
              Enter a valid pin
            </Typography>
          )}
        </Stack>

        <Box sx={{ gap: 2, display: "flex", justifyContent: "center", mt: 4 }}>
          {emailExists ? (
            <Button
              variant="outlined"
              startIcon={<VerifiedUserIcon />}
              onClick={() => router.push("/home/validate")}
              sx={{
                borderRadius: "20px",
                color: "black",
                borderColor: "black",
                textTransform: "none",
              }}
            >
              Validate PIN
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<AddModeratorIcon />}
              onClick={() => router.push("/home")}
              sx={{
                borderRadius: "20px",
                backgroundColor: "black",
                textTransform: "none",
              }}
            >
              Create PIN
            </Button>
          )}
        </Box>
      </main>
    </div>
  );
}
