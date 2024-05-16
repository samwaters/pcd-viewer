import { Box } from "@mui/material"
import { Controls } from "../controls/controls.tsx"
import { View } from "../view/view.tsx"

export const Content = () => {
  return (
    <Box sx={{ display: "flex", height: "100%", paddingTop: "10px" }}>
      <Box sx={{ flex: 1, height: "100%" }}>
        <View />
      </Box>
      <Box sx={{ width: "300px" }}>
        <Controls />
      </Box>
    </Box>
  )
}
