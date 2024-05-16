import { AppBar, Avatar, Box, Toolbar, Typography } from "@mui/material"

export const Header = () => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PointCloud Visualizer
          </Typography>
          <Avatar>PC</Avatar>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
