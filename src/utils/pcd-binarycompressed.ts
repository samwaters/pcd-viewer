import { Color } from "three"
import { decompressLZF } from "./lzf.ts"
import { PCDHeader } from "./pcd-header.ts"

/*
 * normally data in PCD files are organized as array of structures: XYZRGBXYZRGB
 * binary compressed PCD files organize their data as structure of arrays: XXYYZZRGBRGB
 * that requires a totally different parsing approach compared to non-compressed data
 */

export const PCDBinaryCompressedParser = (PCDheader: PCDHeader, data: ArrayBuffer) => {
  //---
  const position: number[] = []
  const normal: number[] = []
  const color: number[] = []
  const intensity: number[] = []
  const label: number[] = []
  const c = new Color()
  //---

  const sizes = new Uint32Array(data.slice(PCDheader.headerLen, PCDheader.headerLen + 8))
  const compressedSize = sizes[0]
  const decompressedSize = sizes[1]
  const decompressed = decompressLZF(new Uint8Array(data, PCDheader.headerLen + 8, compressedSize), decompressedSize)
  const dataview = new DataView(decompressed.buffer)

  const offset = PCDheader.offset

  for (let i = 0; i < PCDheader.points; i++) {
    if (offset.x !== undefined) {
      const xIndex = PCDheader.fields.indexOf("x")
      const yIndex = PCDheader.fields.indexOf("y")
      const zIndex = PCDheader.fields.indexOf("z")
      position.push(dataview.getFloat32(PCDheader.points * offset.x + PCDheader.size[xIndex] * i, true))
      position.push(dataview.getFloat32(PCDheader.points * offset.y + PCDheader.size[yIndex] * i, true))
      position.push(dataview.getFloat32(PCDheader.points * offset.z + PCDheader.size[zIndex] * i, true))
    }

    if (offset.rgb !== undefined) {
      const rgbIndex = PCDheader.fields.indexOf("rgb")
      const r = dataview.getUint8(PCDheader.points * offset.rgb + PCDheader.size[rgbIndex] * i + 2) / 255.0
      const g = dataview.getUint8(PCDheader.points * offset.rgb + PCDheader.size[rgbIndex] * i + 1) / 255.0
      const b = dataview.getUint8(PCDheader.points * offset.rgb + PCDheader.size[rgbIndex] * i + 0) / 255.0
      c.set(r, g, b).convertSRGBToLinear()
      color.push(c.r, c.g, c.b)
    }

    if (offset.normal_x !== undefined) {
      const xIndex = PCDheader.fields.indexOf("normal_x")
      const yIndex = PCDheader.fields.indexOf("normal_y")
      const zIndex = PCDheader.fields.indexOf("normal_z")
      normal.push(dataview.getFloat32(PCDheader.points * offset.normal_x + PCDheader.size[xIndex] * i, true))
      normal.push(dataview.getFloat32(PCDheader.points * offset.normal_y + PCDheader.size[yIndex] * i, true))
      normal.push(dataview.getFloat32(PCDheader.points * offset.normal_z + PCDheader.size[zIndex] * i, true))
    }

    if (offset.intensity !== undefined) {
      const intensityIndex = PCDheader.fields.indexOf("intensity")
      intensity.push(
        dataview.getFloat32(PCDheader.points * offset.intensity + PCDheader.size[intensityIndex] * i, true),
      )
    }

    if (offset.label !== undefined) {
      const labelIndex = PCDheader.fields.indexOf("label")
      label.push(dataview.getInt32(PCDheader.points * offset.label + PCDheader.size[labelIndex] * i, true))
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
