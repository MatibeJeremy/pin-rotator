"use client";

import styles from "./page.module.css";
import { visuallyHidden } from "@mui/utils";
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
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddModeratorIcon from "@mui/icons-material/AddModerator";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useRouter } from "next/navigation";
import checkEmail from "./utils/checkEmail";
import { keyframes } from "@mui/system";
import { Search } from "@mui/icons-material";

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
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailExists, setEmailExits] = useState<boolean>(false);
  const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value.trim();
    setEmail(email);
    if (!email) return;
  };

  const handleEmailChecker = (email: string) => {
    setEmailValid(EMAIL_RE.test(email.trim()));
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      const registered = await checkEmail(email);
      setIsRegistered(registered);
      if(!registered){
        setEmailError('Email is not yet registered. Click create with this field as the email you will use')
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };
  // The label changes with state, so users never have to guess what is happening
  const label = loading ? "Checking…" : "Check registration status";

  // The tooltip explains the button, including why it is disabled
  const hint = loading
    ? "Checking whether this email has a PIN"
    : !emailValid
      ? "Enter a valid email address to enable this"
      : "Looks up whether a PIN already exists for this email";

  useEffect(() => {
    handleEmailChecker(email);
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
              flexDirection:{md:"row", sm:"column", xs: "column"} ,
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
              <>
                <Tooltip title={hint}>
                  {/* The span lets the tooltip appear even when the button is disabled */}
                  <span>
                    <Button
                      variant="contained"
                      onClick={handleClick}
                      disabled={loading || !emailValid}
                      aria-busy={loading} // tells assistive tech the action is in progress
                      startIcon={
                        loading ? (
                          <CircularProgress size={18} color="inherit" /> // spinner means "working"
                        ) : (
                          <Search />
                        )
                      }
                      sx={{
                        mt: 1,
                        minWidth: 240, 
                        borderRadius: "20px",
                        textTransform: "none",
                        backgroundColor: "black",
                        "&:hover": { backgroundColor: "#333" },
                        "&.Mui-disabled": {
                          backgroundColor: "#666",
                          color: "rgba(255, 255, 255, 0.85)", 
                        },
                      }}
                    >
                      {label}
                    </Button>
                  </span>
                </Tooltip>

                {/* Announced by screen readers when loading starts and ends, but invisible on screen */}
                <Typography
                  role="status"
                  aria-live="polite"
                  sx={visuallyHidden}
                >
                  {loading ? "Checking registration status" : ""}
                </Typography>
              </>
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
              Enter a valid email
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
          ) : null}
          {!isRegistered && emailValid && (
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
