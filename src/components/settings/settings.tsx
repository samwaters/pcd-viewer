import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Slider,
  Typography,
} from "@mui/material"
import { ChangeEvent, useState } from "react"
import { AxisChangeEvent, FOVChangeEvent, ScaleChangeEvent } from "../../events/events.ts"

export const Settings = () => {
  const [fov, setFOV] = useState("60")

  const handleAxisChange = (_: ChangeEvent<HTMLInputElement>, value: string) => {
    window.dispatchEvent(new CustomEvent<AxisChangeEvent>("AXIS_CHANGE", { detail: { newAxis: value } }))
  }

  const handleFOVChange = (e: SelectChangeEvent) => {
    setFOV(e.target.value)
    window.dispatchEvent(
      new CustomEvent<FOVChangeEvent>("FOV_CHANGE", { detail: { newFOV: parseInt(e.target.value) } }),
    )
  }

  const handleScaleChange = (_: Event, value: number | number[]) => {
    const val = Array.isArray(value) ? value[0] : value
    window.dispatchEvent(new CustomEvent<ScaleChangeEvent>("SCALE_CHANGE", { detail: { newScale: val } }))
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Typography variant="body1" component="div">
        Settings
      </Typography>
      <FormControl fullWidth size="small">
        <InputLabel>FOV</InputLabel>
        <Select label="FOV" onChange={handleFOVChange} value={fov}>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={30}>30</MenuItem>
          <MenuItem value={45}>45</MenuItem>
          <MenuItem value={60}>60</MenuItem>
          <MenuItem value={75}>75</MenuItem>
        </Select>
      </FormControl>
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
