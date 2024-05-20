import { Box, Typography } from "@mui/material"

export const View = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
      <Box
        id="view-container"
        sx={{ display: "flex", justifyContent: "center", minHeight: "600px", minWidth: "800px" }}
      ></Box>
      <Typography variant="body1" component="div">
        Controls
      </Typography>
      <Typography variant="body2" component="div">
        Drag to pan around, scroll to zoom.
        <br />
        Select an object by clicking it, then drag to rotate and scroll to resize
      </Typography>
    </Box>
  )
}
