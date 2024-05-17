/**
 * PCD Header Parser
 */

export interface PCDHeader {
  version: number
  fields: string[]
  size: number[]
  type: string[]
  count: number[]
  width: number
  height: number
  viewpoint: string
  points: number
  data: string
  headerLen: number
  rowSize?: number
  offset: Record<string, number>
}

export const parsePCDHeader = (data: string) => {
  // @ts-expect-error data will be populated
  const PCDheader: PCDHeader = {}
  const result1 = data.search(/[\r\n]DATA\s(\S*)\s/i)
  const result2 = /[\r\n]DATA\s(\S*)\s/i.exec(data.slice(result1 - 1))

  PCDheader.data = result2![1]
  PCDheader.headerLen = result2![0].length + result1
  let headerStr = data.slice(0, PCDheader.headerLen)

  // remove comments
  headerStr = headerStr.replace(/#.*/gi, "")

  // parse
  const parsedVersion = /VERSION (.*)/i.exec(headerStr)
  const parsedFields = /FIELDS (.*)/i.exec(headerStr)
  const parsedSize = /SIZE (.*)/i.exec(headerStr)
  const parsedType = /TYPE (.*)/i.exec(headerStr)
  const parsedCount = /COUNT (.*)/i.exec(headerStr)
  const parsedWidth = /WIDTH (.*)/i.exec(headerStr)
  const parsedHeight = /HEIGHT (.*)/i.exec(headerStr)
  const parsedViewpoint = /VIEWPOINT (.*)/i.exec(headerStr)
  const parsedPoints = /POINTS (.*)/i.exec(headerStr)

  // evaluate
  if (PCDheader.version !== null) PCDheader.version = parseFloat(parsedVersion![1])

  PCDheader.fields = parsedFields ? parsedFields[1].split(" ") : []

  if (parsedType !== null) PCDheader.type = parsedType[1].split(" ")

  if (parsedWidth !== null) PCDheader.width = parseInt(parsedWidth[1])

  if (parsedHeight !== null) PCDheader.height = parseInt(parsedHeight[1])

  if (parsedViewpoint !== null) PCDheader.viewpoint = parsedViewpoint[1]

  PCDheader.points = parsedPoints === null ? PCDheader.width! * PCDheader.height! : parseInt(parsedPoints[1], 10)

  if (parsedSize !== null) {
    PCDheader.size = parsedSize[1].split(" ").map((x) => parseInt(x, 10))
  }

  if (parsedCount !== null) {
    PCDheader.count = parsedCount[1].split(" ").map((x) => parseInt(x, 10))
  } else {
    PCDheader.count = []
    for (let i = 0, l = PCDheader.fields.length; i < l; i++) {
      PCDheader.count.push(1)
    }
  }

  PCDheader.offset = {}
  let sizeSum = 0
  for (let i = 0, l = PCDheader.fields.length; i < l; i++) {
    if (PCDheader.data === "ascii") {
      PCDheader.offset[PCDheader.fields[i]] = i
    } else {
      PCDheader.offset[PCDheader.fields[i]] = sizeSum
      sizeSum += PCDheader.size![i] * PCDheader.count[i]
    }
  }

  // for binary only
  PCDheader.rowSize = sizeSum

  return PCDheader
}
