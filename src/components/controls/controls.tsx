import { Box } from "@mui/material"
import { AddPoints } from "../add-points/add-points.tsx"
import { FileSelect } from "../file-select/file-select.tsx"
import { RenderAs } from "../render-as/render-as.tsx"
import { Settings } from "../settings/settings.tsx"

export const Controls = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <FileSelect />
      <RenderAs />
      <Settings />
      <AddPoints />
    </Box>
  )
}
