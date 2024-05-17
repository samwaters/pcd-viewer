import { Color } from "three"
import { PCDHeader } from "./pcd-header.ts"

export const PCDBinaryParser = (PCDheader: PCDHeader, data: ArrayBuffer) => {
  //---
  const position: number[] = []
  const normal: number[] = []
  const color: number[] = []
  const intensity: number[] = []
  const label: number[] = []
  const c = new Color()
  //---

  const dataview = new DataView(data, PCDheader.headerLen)
  const offset = PCDheader.offset

  for (let i = 0, row = 0; i < PCDheader.points; i++, row += PCDheader.rowSize!) {
    if (offset.x !== undefined) {
      position.push(dataview.getFloat32(row + offset.x, true))
      position.push(dataview.getFloat32(row + offset.y, true))
      position.push(dataview.getFloat32(row + offset.z, true))
    }

    if (offset.rgb !== undefined) {
      const r = dataview.getUint8(row + offset.rgb + 2) / 255.0
      const g = dataview.getUint8(row + offset.rgb + 1) / 255.0
      const b = dataview.getUint8(row + offset.rgb + 0) / 255.0
      c.set(r, g, b).convertSRGBToLinear()
      color.push(c.r, c.g, c.b)
    }

    if (offset.normal_x !== undefined) {
      normal.push(dataview.getFloat32(row + offset.normal_x, true))
      normal.push(dataview.getFloat32(row + offset.normal_y, true))
      normal.push(dataview.getFloat32(row + offset.normal_z, true))
    }

    if (offset.intensity !== undefined) {
      intensity.push(dataview.getFloat32(row + offset.intensity, true))
    }

    if (offset.label !== undefined) {
      label.push(dataview.getInt32(row + offset.label, true))
    }
  }

  return {
    position,
    normal,
    color,
    intensity,
    label,
  }
}
