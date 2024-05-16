import { Global, css } from "@emotion/react"
import { Box, Container } from "@mui/material"
import reset from "emotion-reset"
import { Footer } from "./components/footer/footer"
import { Header } from "./components/header/header"

export const App = () => {
  return (
    <>
      <Global
        styles={css`
          ${reset}
          html, body, #root {
            height: 100%;
          }
        `}
      />
      <Container maxWidth="xl" sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Header />
        <Box sx={{ flex: 1, paddingTop: "10px" }}>FOO Bar</Box>
        <Footer />
      </Container>
    </>
  )
}
