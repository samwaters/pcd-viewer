import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material"
import { ChangeEvent } from "react"
import { RenderAsChangeEvent } from "../../events/events.ts"

export const RenderAs = () => {
  const handleRenderAsChange = (_: ChangeEvent<HTMLInputElement>, value: string) => {
    window.dispatchEvent(new CustomEvent<RenderAsChangeEvent>("RENDER_AS_CHANGE", { detail: { renderAs: value } }))
  }

  return (
    <Box>
      <Typography variant="body1" component="div">
        Render As
      </Typography>
      <FormControl>
        <RadioGroup defaultValue="points" row onChange={handleRenderAsChange}>
          <FormControlLabel control={<Radio />} label="Points" value="points" />
          <FormControlLabel control={<Radio />} label="Cubes" value="cubes" />
        </RadioGroup>
      </FormControl>
    </Box>
  )
}
