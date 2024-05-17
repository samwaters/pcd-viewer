import { Box, Button } from "@mui/material"
import { renderCube } from "../../renderers/cube.ts"
import { FileSelect } from "../file-select/file-select.tsx"

export const Controls = () => {
  const handleCube = () => {
    renderCube()
  }

  return (
    <Box>
      <FileSelect />
      <Button variant="contained" onClick={handleCube}>
        Cube
      </Button>
    </Box>
  )
}
