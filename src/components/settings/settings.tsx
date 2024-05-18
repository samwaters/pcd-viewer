import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Slider, Typography } from "@mui/material"
import { ChangeEvent } from "react"
import { AxisChangeEvent, ScaleChangeEvent } from "../../events/events.ts"

export const Settings = () => {
  const handleAxisChange = (_: ChangeEvent<HTMLInputElement>, value: string) => {
    window.dispatchEvent(new CustomEvent<AxisChangeEvent>("AXIS_CHANGE", { detail: { newAxis: value } }))
  }

  const handleScaleChange = (_: Event, value: number | number[]) => {
    const val = Array.isArray(value) ? value[0] : value
    window.dispatchEvent(new CustomEvent<ScaleChangeEvent>("SCALE_CHANGE", { detail: { newScale: val } }))
  }

  return (
    <Box>
      <Typography variant="body1" component="div">
        Settings
      </Typography>
      <FormControl>
        <FormLabel>Up Axis</FormLabel>
        <RadioGroup defaultValue="upY" row onChange={handleAxisChange}>
          <FormControlLabel control={<Radio />} label="-X" value="downX" />
          <FormControlLabel control={<Radio />} label="+X" value="upX" />
          <FormControlLabel control={<Radio />} label="-Y" value="downY" />
          <FormControlLabel control={<Radio />} label="+Y" value="upY" />
          <FormControlLabel control={<Radio />} label="-Z" value="downZ" />
          <FormControlLabel control={<Radio />} label="+Z" value="upZ" />
        </RadioGroup>
      </FormControl>
      <FormControl fullWidth>
        <FormLabel>Scale</FormLabel>
        <Slider defaultValue={0.2} step={0.01} min={0.05} max={0.5} onChange={handleScaleChange} />
      </FormControl>
    </Box>
  )
}
