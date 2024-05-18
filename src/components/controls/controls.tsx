import { Box, Button } from "@mui/material"
import { renderCube } from "../../renderers/cube.ts"
import { FileSelect } from "../file-select/file-select.tsx"
import { Settings } from "../settings/settings.tsx"

export const Controls = () => {
  const handleCube = () => {
    renderCube()
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <FileSelect />
      <Settings />
      <Button variant="contained" onClick={handleCube}>
        Cube
      </Button>
    </Box>
  )
}
