import { Box, Typography } from "@mui/material"
import { useEffect, useRef } from "react"

export const Footer = () => {
  const timerRef = useRef<number>(0)
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      document.getElementById("fps")!.innerText = "" + window.frameCounter
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
          FPS: <span id="fps">0</span>
        </Typography>
      </Box>
      <Box sx={{}}>
        <Typography variant="body2" component="div">
          PCD Viewer {__VERSION__}, hash {__GIT_HASH__}
        </Typography>
      </Box>
    </Box>
  )
}
