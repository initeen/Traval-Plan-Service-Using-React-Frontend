import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import React from 'react'

const Header = () => {
  return (
    <AppBar position='static'>
        <Container>
            <Toolbar>
                <Typography variant='h6' component='div' sx={{flexGrow:1}}>
                    Travel Plans Management Portal
                </Typography>
            </Toolbar>
        </Container>
    </AppBar>
  )
}

export default Header