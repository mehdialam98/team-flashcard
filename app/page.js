'use client'
import Image from 'next/image'
import getStripe from '@/utils/get-stripe'
import { useState } from 'react'
import { Container, TextField, Button, Typography, Box, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, AppBar, Toolbar } from '@mui/material'
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from 'next/head';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Define a new dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#BB86FC', // A soft purple color
    },
    secondary: {
      main: '#03DAC6', // A teal accent color
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1E1E1E', // Slightly lighter dark for cards
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
  },
});

export default function Home() {
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [setName, setSetName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)

  // ... (rest of the functions remain unchanged)

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="100vw" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.default', minHeight: '100vh' }}>
        <Head>
          <title>Flashcard SaaS</title>
        </Head>

        <AppBar position="static" sx={{ width: '100%', bgcolor: '#1A237E' }}> {/* Unique dark blue color for navbar */}
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>Flashcard SaaS</Typography>
            <SignedOut>
              <Button color="inherit" href='/sign-in'>Login</Button>
              <Button color="inherit" href='/sign-up'>Sign Up</Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h2" color="primary.main">Welcome to Flashcard SaaS</Typography>
          <Typography variant="h5" color="text.secondary">
            Create flashcards and study them later
          </Typography>
          <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
            Get Started
          </Button>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center', width: '100%' }}>
          <Typography variant="h4" component="h2" color="primary.main">Features</Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={4} md={4}>
              <Typography variant="h6" color="secondary.main">Easy Text Input</Typography>
              <Typography color="text.secondary">
                Enter your text and generate flashcards in seconds. Creating flashcards has never been easier.
              </Typography>
            </Grid>
            <Grid item xs={4} md={4}>
              <Typography variant="h6" color="secondary.main">Smart Flashcards</Typography>
              <Typography color="text.secondary">
                Our AI intelligently breaks down your text into flashcards, optimizing your learning experience.
              </Typography>
            </Grid>
            <Grid item xs={4} md={4}>
              <Typography variant="h6" color="secondary.main">Access Anywhere</Typography>
              <Typography color="text.secondary">
                Access your flashcards from anywhere, anytime. Our platform is designed to be accessible on any device.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 6, textAlign: 'center', width: '100%' }}>
          <Typography variant="h4" component="h2" color="primary.main">Pricing</Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, border: '1px solid #333', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', bgcolor: 'background.paper' }}>
                <Typography variant="h5" color="primary.main">Basic Plan</Typography>
                <Typography variant="h6" color="text.secondary">$5 / month</Typography>
                <Typography color="text.secondary">
                  Access to basic features with limited storage.
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>Choose Basic</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, border: '1px solid #333', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', bgcolor: 'background.paper' }}>
                <Typography variant="h5" color="primary.main">Pro</Typography>
                <Typography variant="h6" color="text.secondary">$10 / month</Typography>
                <Typography color="text.secondary">
                  Access to all features with unlimited storage.
                </Typography>
                <Button variant="contained" color="secondary" sx={{ mt: 2 }}>Choose Pro</Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  )
}