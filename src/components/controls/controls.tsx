import { Box } from "@mui/material"
import { AddPoints } from "../add-points/add-points.tsx"
import { FileSelect } from "../file-select/file-select.tsx"
import { Settings } from "../settings/settings.tsx"

export const Controls = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <FileSelect />
      <Settings />
      <AddPoints />
    </Box>
  )
}
