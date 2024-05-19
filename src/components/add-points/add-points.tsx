import { Box, Button, TextField, Typography } from "@mui/material"
import { MuiColorInput } from "mui-color-input"
import { ChangeEvent, useState } from "react"
import { Color } from "three"
import { PCDRenderer } from "../../renderers/pcd.ts"

export const AddPoints = () => {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [z, setZ] = useState(0)
  const [intensity, setIntensity] = useState(0)
  const [color, setColor] = useState("#ffffff")
  const actualColor = new Color("#ffffff")

  const addPoint = () => {
    PCDRenderer.addData({
      position: [x, y, z],
      color: [actualColor.r, actualColor.g, actualColor.b],
      normal: [],
      intensity: [],
      label: [],
    })
  }

  const changeX = (e: ChangeEvent<HTMLInputElement>) => {
    const newX = parseFloat(e.target.value)
    setX(newX < -1 || newX > 1 ? 0 : newX)
  }

  const changeY = (e: ChangeEvent<HTMLInputElement>) => {
    const newY = parseFloat(e.target.value)
    setY(newY < -1 || newY > 1 ? 0 : newY)
  }

  const changeZ = (e: ChangeEvent<HTMLInputElement>) => {
    const newZ = parseFloat(e.target.value)
    setZ(newZ < -1 || newZ > 1 ? 0 : newZ)
  }

  const changeIntensity = (e: ChangeEvent<HTMLInputElement>) => {
    setIntensity(parseInt(e.target.value))
  }

  const changeColor = (color: string) => {
    setColor(color)
    // RGB between 0 and 1
    actualColor.set(color)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Typography variant="body1" component="div">
        Add Point
      </Typography>
      <Box sx={{ display: "flex", gap: "5px" }}>
        <TextField label="X" onChange={changeX} size="small" type="number" value={x} />
        <TextField label="Y" onChange={changeY} size="small" type="number" value={y} />
        <TextField label="Z" onChange={changeZ} size="small" type="number" value={z} />
        <TextField label="Intensity" onChange={changeIntensity} size="small" type="number" value={intensity} />
      </Box>
      <Box sx={{ alignItems: "center", display: "flex", flexDirection: "row", gap: "10px" }}>
        <Typography variant="body2" component="div">
          Colour
        </Typography>
        <MuiColorInput format="hex" onChange={changeColor} size="small" value={color} />
      </Box>
      <Button onClick={addPoint} variant="contained">
        Add
      </Button>
    </Box>
  )
}
