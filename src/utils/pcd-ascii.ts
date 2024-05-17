import { Color } from "three"
import { PCDHeader } from "./pcd-header.ts"

export const PCDAsciiParser = (PCDheader: PCDHeader, textData: string) => {
  //---
  const position: number[] = []
  const normal: number[] = []
  const color: number[] = []
  const intensity: number[] = []
  const label: number[] = []
  const c = new Color()
  //---

  const offset = PCDheader.offset
  const pcdData = textData.slice(PCDheader.headerLen)
  const lines = pcdData.split("\n")

  for (let i = 0, l = lines.length; i < l; i++) {
    if (lines[i] === "") continue
    const line = lines[i].split(" ")
    if (offset.x !== undefined) {
      position.push(parseFloat(line[offset.x]))
      position.push(parseFloat(line[offset.y]))
      position.push(parseFloat(line[offset.z]))
    }

    if (offset.rgb !== undefined) {
      const rgb_field_index = PCDheader.fields.findIndex((field) => field === "rgb")
      const rgb_type = PCDheader.type[rgb_field_index]
      const float = parseFloat(line[offset.rgb])
      let rgb = float

      if (rgb_type === "F") {
        // treat float values as int
        // https://github.com/daavoo/pyntcloud/pull/204/commits/7b4205e64d5ed09abe708b2e91b615690c24d518
        const farr = new Float32Array(1)
        farr[0] = float
        rgb = new Int32Array(farr.buffer)[0]
      }

      const r = ((rgb >> 16) & 0x0000ff) / 255
      const g = ((rgb >> 8) & 0x0000ff) / 255
      const b = ((rgb >> 0) & 0x0000ff) / 255
      c.set(r, g, b).convertSRGBToLinear()
      color.push(c.r, c.g, c.b)
    }

    if (offset.normal_x !== undefined) {
      normal.push(parseFloat(line[offset.normal_x]))
      normal.push(parseFloat(line[offset.normal_y]))
      normal.push(parseFloat(line[offset.normal_z]))
    }

    if (offset.intensity !== undefined) {
      intensity.push(parseFloat(line[offset.intensity]))
    }

    if (offset.label !== undefined) {
      label.push(parseInt(line[offset.label]))
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
