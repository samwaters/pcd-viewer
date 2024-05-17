/**
 * PCD Loader for Three
 * Inspired by https://github.com/mrdoob/three.js/blob/master/examples/jsm/loaders/PCDLoader.js
 */

import {
  BufferGeometry,
  FileLoader,
  Float32BufferAttribute,
  Int32BufferAttribute,
  Loader,
  Points,
  PointsMaterial,
} from "three"
import { PCDAsciiParser } from "../utils/pcd-ascii.ts"
import { PCDBinaryParser } from "../utils/pcd-binary.ts"
import { PCDBinaryCompressedParser } from "../utils/pcd-binarycompressed.ts"
import { parsePCDHeader } from "../utils/pcd-header.ts"

class PCDLoader extends Loader {
  load(
    url: string | ArrayBuffer,
    onLoad: (data: Points) => void,
    onProgress?: (e: ProgressEvent<EventTarget>) => void,
    onError?: (e: unknown) => void,
  ) {
    // Could already be ArrayBuffer if the file is dropped
    if (url instanceof ArrayBuffer) {
      onLoad(this.parse(url))
    } else {
      // Otherwise load it
      const loader = new FileLoader(this.manager)
      loader.setPath(this.path)
      loader.setResponseType("arraybuffer")
      loader.setRequestHeader(this.requestHeader)
      loader.setWithCredentials(this.withCredentials)
      loader.load(
        url,
        (data) => {
          try {
            onLoad(this.parse(data as ArrayBuffer))
          } catch (e) {
            if (onError) {
              onError(e)
            } else {
              console.error(e)
            }
            this.manager.itemError(url)
          }
        },
        onProgress,
        onError,
      )
    }
  }

  parse(data: ArrayBuffer) {
    const textData = new TextDecoder().decode(data)
    // parse header (always ascii format)
    const PCDheader = parsePCDHeader(textData)
    console.log("HEADER", PCDheader)

    // parse data
    let parsedData:
      | { position: number[]; normal: number[]; color: number[]; intensity: number[]; label: number[] }
      | undefined = undefined

    if (PCDheader.data === "ascii") {
      parsedData = PCDAsciiParser(PCDheader, textData)
    }

    if (PCDheader.data === "binary_compressed") {
      parsedData = PCDBinaryCompressedParser(PCDheader, data)
    }

    if (PCDheader.data === "binary") {
      console.log("BIN")
      parsedData = PCDBinaryParser(PCDheader, data)
      console.log(parsedData)
    }

    // build geometry
    if (typeof parsedData === "undefined") throw new Error("Could not parse data")
    const geometry = new BufferGeometry()

    if (parsedData.position.length > 0)
      geometry.setAttribute("position", new Float32BufferAttribute(parsedData.position, 3))
    if (parsedData.normal.length > 0) geometry.setAttribute("normal", new Float32BufferAttribute(parsedData.normal, 3))
    if (parsedData.color.length > 0) geometry.setAttribute("color", new Float32BufferAttribute(parsedData.color, 3))
    if (parsedData.intensity.length > 0)
      geometry.setAttribute("intensity", new Float32BufferAttribute(parsedData.intensity, 1))
    if (parsedData.label.length > 0) geometry.setAttribute("label", new Int32BufferAttribute(parsedData.label, 1))

    geometry.computeBoundingSphere()

    // build material

    const material = new PointsMaterial({ size: 0.005, color: 0x008000 })

    if (parsedData.color.length > 0) {
      material.vertexColors = true
    }

    // build point cloud
    return new Points(geometry, material)
  }
}

export { PCDLoader }
