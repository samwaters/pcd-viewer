import { Box, Typography } from "@mui/material"
import { DropZone } from "./dropzone.tsx"

export const FileSelect = () => {
  return (
    <Box>
      <Typography variant="body1" component="div">
        PCD Selection
      </Typography>
      <DropZone />
    </Box>
  )
}
