import { Box, Button } from "@mui/material"
import { renderCube } from "../../renderers/cube.ts"

export const Controls = () => {
  const handleCube = () => {
    renderCube()
  }

  return (
    <Box>
      <Button variant="contained" onClick={handleCube}>
        Cube
      </Button>
    </Box>
  )
}
