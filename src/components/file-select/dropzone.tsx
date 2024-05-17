import { Box, Typography } from "@mui/material"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { renderPCD } from "../../renderers/pcd.ts"

export const DropZone = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 1) {
      console.error("Multiple files not supported")
      return
    }
    const reader = new FileReader()
    reader.onerror = () => console.error("Could not read PCD")
    reader.onload = () => {
      renderPCD(reader.result!)
    }
    reader.readAsArrayBuffer(acceptedFiles[0])
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ maxFiles: 1, multiple: false, onDrop })

  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: isDragActive ? "lightgrey" : "none",
        border: isDragActive ? "3px solid lightgrey" : "3px dashed darkgrey",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        justifyContent: "center",
        height: "100px",
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Typography variant="body2" component="div">
        Drop PCD File here
      </Typography>
      <Typography variant="body2" component="div">
        Or click/tap to select
      </Typography>
    </Box>
  )
}
