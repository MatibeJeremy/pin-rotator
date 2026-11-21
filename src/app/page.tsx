"use client"

import styles from "./page.module.css";
import {TypeAnimation} from "react-type-animation";
import {Box, Button, Stack, Typography} from "@mui/material";
import React from "react";
import AddModeratorIcon from "@mui/icons-material/AddModerator";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  return (
    <div className={styles.page}>
      <main className={styles.main}>
          <Typography
              sx={{ fontFamily: "var(--font-cursive), cursive",textAlign: "center", fontSize: 50, fontWeight: "bold", mb: 1.5 }}
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
          <Box sx={{ gap: 2, display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                  variant="contained"
                  startIcon={<AddModeratorIcon />}
                  onClick={() => router.push("/home")}
                  sx={{ borderRadius: "20px", backgroundColor: "black", textTransform: "none" }}
              >
                  Create PIN
              </Button>

              <Button
                  variant="outlined"
                  startIcon={<VerifiedUserIcon />}
                  onClick={() => router.push("/home/validate")}
                  sx={{ borderRadius: "20px", color: "black", borderColor: "black", textTransform: "none" }}
              >
                  Validate PIN
              </Button>
          </Box>
      </main>
    </div>
  );
}
