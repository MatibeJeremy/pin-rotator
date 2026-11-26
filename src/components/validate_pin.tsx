"use client";

import {
  Typography,
  TextField,
  Button,
  CardContent,
  CardActions,
  Card,
  Box,
  Stack,
  Alert,
  SnackbarCloseReason,
  Snackbar,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import validatePin from "@/app/utils/validatePin";
import { useRouter } from "next/navigation";
import { useEmail } from "@/app/providers/EmailContext";

const PIN_LENGTH = 4;

export default function ValidateCard() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const { email, clearEmail } = useEmail();

  const showToast = (message: string, severity: "success" | "error") =>
    setToast({ open: true, message, severity });

  const handleToastClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") return;
    setToast((t) => ({ ...t, open: false })); // keep the message so it doesn't flash empty
  };

  const readPin = (refs: { current: (HTMLInputElement | null)[] }) =>
    refs.current.map((el) => el?.value ?? "").join("");

  const updateDisabled = () => {
    const pin = readPin(inputRefs);
    setDisabled(!(pin.length === PIN_LENGTH));
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const digit = e.target.value.replace(/\D/g, "").slice(-1);
    e.target.value = digit;
    updateDisabled();
    if (digit && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    const el = inputRefs.current[index];
    if (e.key === "Backspace" && el?.value === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") handleSubmit();
  };

  const handleSubmit = () => {
    if (disabled || loading) return;
    console.log("Pin Entered:", readPin(inputRefs));
    const pin = readPin(inputRefs);
    setLoading(true);
    validatePin(pin, email)
      .then(() => {
        showToast("Pin is Correct", "success");
        clearEmail();
        setTimeout(() => {
          setToast((t) => ({ ...t, open: false }));
          router.push("/");
        }, 2000);
        inputRefs.current.forEach((el) => {
          el && (el.value = "");
        });
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : String(error ?? "");
        console.error("Error validating pin:", message || error);
        showToast(message || String(error ?? ""), "error");
        inputRefs.current.forEach((el) => {
          el && (el.value = "");
        });
      })
      .finally(() => {
        setLoading(false);
        inputRefs.current.forEach((el) => {
          el && (el.value = "");
        });
      });
  };

  return (
    <Stack
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
        width: { xs: "100%", md: "50vw" },
        display: "flex",
        justifyContent: "center",
        alignItems: "right",
      }}
    >
      <Card
        sx={{
          margin: "auto",
          minWidth: 275,
          width: "60%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <CardContent>
          <Typography
            sx={{
              fontFamily: "var(--font-cursive), cursive",
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
              mb: 1.5,
            }}
            variant="h5"
            component="div"
          >
            <TypeAnimation
              sequence={["Enter Your Pin", 3000]}
              speed={10}
              cursor={true}
              repeat={3}
            />
          </Typography>
          <Box sx={{ gap: 2, display: "flex" }}>
            {Array.from({ length: PIN_LENGTH }, (_, i) => (
              <TextField
                key={i}
                variant="outlined"
                defaultValue=""
                inputRef={(el) => (inputRefs.current[i] = el)}
                onChange={(e) =>
                  handleChange(i, e as React.ChangeEvent<HTMLInputElement>)
                }
                onKeyDown={(e) => handleKeyDown(i, e)}
                slotProps={{
                  htmlInput: {
                    inputMode: "numeric",
                    style: { textAlign: "center" },
                  },
                }}
              />
            ))}
          </Box>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            disabled={disabled || loading}
            sx={{
              backgroundColor: disabled ? "lightgray" : "black",
              color: "white",
              width: "60%",
              borderRadius: "20px",
            }}
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </CardActions>
      </Card>
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleToastClose}
      >
        <Alert
          onClose={handleToastClose}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
