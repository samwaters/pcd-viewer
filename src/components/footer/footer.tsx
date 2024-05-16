import { Box, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"

export const Footer = () => {
  const [fps, setFPS] = useState(0)
  const timerRef = useRef<number>(0)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setFPS(window.frameCounter ?? 0)
      window.frameCounter = 0
    }, 1000)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [])
  return (
    <Box
      sx={{ alignItems: "center", backgroundColor: "lightgrey", display: "flex", height: "32px", padding: "0 10px" }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" component="div">
          FPS: {fps}
        </Typography>
      </Box>
      <Box sx={{}}>
        <Typography variant="body2" component="div">
          PCD Viewer v1.0, hash {__GIT_HASH__}
        </Typography>
      </Box>
    </Box>
  )
}
