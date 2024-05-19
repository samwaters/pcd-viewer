/**
 * PCD Loader for Three
 * Inspired by https://github.com/mrdoob/three.js/blob/master/examples/jsm/loaders/PCDLoader.js
 */

import { FileLoader, Loader } from "three"
import { PCDAsciiParser } from "../utils/pcd-ascii.ts"
import { PCDBinaryParser } from "../utils/pcd-binary.ts"
import { PCDBinaryCompressedParser } from "../utils/pcd-binarycompressed.ts"
import { parsePCDHeader } from "../utils/pcd-header.ts"

export interface ParsedPCDData {
  position: number[]
  normal: number[]
  color: number[]
  intensity: number[]
  label: number[]
}

class PCDLoader extends Loader {
  load(
    url: string | ArrayBuffer,
    onLoad: (data: ParsedPCDData | undefined) => void,
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

    // parse data
    let parsedData: ParsedPCDData | undefined = undefined

    if (PCDheader.data === "ascii") {
      parsedData = PCDAsciiParser(PCDheader, textData)
    }

    if (PCDheader.data === "binary_compressed") {
      parsedData = PCDBinaryCompressedParser(PCDheader, data)
    }

    if (PCDheader.data === "binary") {
      parsedData = PCDBinaryParser(PCDheader, data)
    }

    return parsedData
  }
}

export { PCDLoader }
