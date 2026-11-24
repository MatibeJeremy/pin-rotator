"use client";

import {
    Typography,
    TextField,
    Button,
    CardContent,
    CardActions,
    Card,
    Box, Stack, Snackbar, SnackbarCloseReason, Alert,
} from "@mui/material";
import { useRef, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { useRouter } from "next/navigation";
import createPin from "@/app/utils/setPin";
import React from "react";
import { useEmail } from "@/app/providers/EmailContext";


const PIN_LENGTH = 4;

export default function DisplayCard() {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const inputRefsConfirm = useRef<(HTMLInputElement | null)[]>([]);
    const [disabled, setDisabled] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false, message: "", severity: "success",
    });
    const { email } = useEmail();

    const showToast = (message: string, severity: "success" | "error") =>
        setToast({ open: true, message, severity });

    const handleToastClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === "clickaway") return;
        setToast((t) => ({ ...t, open: false }));      // keep the message so it doesn't flash empty
    };

    const readPin = (refs: { current: (HTMLInputElement | null)[] }) =>
        refs.current.map((el) => el?.value ?? "").join("");

    const updateDisabled = () => {
        const pin = readPin(inputRefs);
        const confirm = readPin(inputRefsConfirm);
        setDisabled(!(pin.length === PIN_LENGTH && pin === confirm));
    };

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const digit = e.target.value.replace(/\D/g, "").slice(-1);
        e.target.value = digit;
        updateDisabled();
        if (digit && index < PIN_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    const handleChangeConfirm = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const digit = e.target.value.replace(/\D/g, "").slice(-1);
        e.target.value = digit;
        updateDisabled();
        if (digit && index < PIN_LENGTH - 1) {
            inputRefsConfirm.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        const el = inputRefs.current[index];
        if (e.key === "Backspace" && el?.value === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "Enter") handleSubmit();
    };
    const handleKeyDownConfirm = (index: number, e: React.KeyboardEvent) => {
        const el = inputRefsConfirm.current[index];
        if (e.key === "Backspace" && el?.value === "" && index > 0) {
            inputRefsConfirm.current[index - 1]?.focus();
        }
        if (e.key === "Enter") handleSubmit();
    };

    const handleSubmit = () => {
        if (disabled || loading) return;

        const pin = readPin(inputRefs);
        setLoading(true);
        createPin(pin, email)
            .then(() => {
                setTimeout(() => {
                    showToast("Pin set!", "success");
                    router.push("/home/validate");
                }, 3000);
            })
            .catch((error: unknown) => {
                console.error("Error creating pin:", error);
                showToast("Failed to create pin", "error");
            })
            .finally(() => {
                setLoading(false);
                setToast((t) => ({ ...t, open: false }));
                inputRefs.current.forEach((el) => {
                    el && (el.value = "");
                });
                inputRefsConfirm.current.forEach((el) => {
                    el && (el.value = "");
                });
            });
    };

    return (
        <Stack sx={{
            backgroundColor: "background.default",
            minHeight: "100vh",
            width: { xs: "100%", md: "50vw" },
            display: "flex",
            justifyContent: "center",
            alignItems: "right"
        }}>
            <Card sx={{ margin:"auto", minWidth: 275, width: "60%", display: "flex", justifyContent: "center", flexDirection: "column" }}>
                <CardContent>
                    <Typography
                        sx={{ fontFamily: "var(--font-cursive), cursive",textAlign: "center", fontSize: 20, fontWeight: "bold", mb: 1.5 }}
                        variant="h5"
                        component="div"
                    >
                        <TypeAnimation
                            sequence={["Choose Your Pin", 3000]}
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
                                onChange={(e) => handleChange(i, e as React.ChangeEvent<HTMLInputElement>)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                slotProps={{
                                    htmlInput: { inputMode: "numeric", style: { textAlign: "center" } },
                                }}
                            />
                        ))}
                    </Box>
                    <Typography
                        sx={{ fontFamily: "var(--font-cursive), cursive",textAlign: "center", fontSize: 20, fontWeight: "bold", mb: 1.5 }}
                        variant="h5"
                        component="div"
                    >
                        <TypeAnimation
                            sequence={["Confirm Your Pin", 3000]}
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
                                inputRef={(el) => (inputRefsConfirm.current[i] = el)}
                                onChange={(e) => handleChangeConfirm(i, e as React.ChangeEvent<HTMLInputElement>)}
                                onKeyDown={(e) => handleKeyDownConfirm(i, e)}
                                slotProps={{
                                    htmlInput: { inputMode: "numeric", style: { textAlign: "center" } },
                                }}
                            />
                        ))}
                    </Box>
                </CardContent>
                <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                    <Button disabled={disabled || loading} sx={{
                        backgroundColor: disabled ? "lightgray" : "black",
                        color: "white",
                        width: "60%",
                        borderRadius: "20px"
                    }} onClick={handleSubmit}>
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                </CardActions>
            </Card>
            <Snackbar open={toast.open} autoHideDuration={6000} onClose={handleToastClose}>
                <Alert onClose={handleToastClose} severity={toast.severity} variant="filled" sx={{ width: "100%" }}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}