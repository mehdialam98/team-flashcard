'use client'
import Image from 'next/image'
import getStripe from '@/utils/get-stripe'
import { useState } from 'react'
import { Container, TextField, Button, Typography, Box, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, AppBar, Toolbar } from '@mui/material'
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from 'next/head';


export default function Home() {
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [setName, setSetName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }
  
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      })
  
      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }
  
      const data = await response.json()
      setFlashcards(data)
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    }
  }

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.')
      return
    }
  
    try {
      const userDocRef = doc(collection(db, 'users'), user.id)
      const userDocSnap = await getDoc(userDocRef)
  
      const batch = writeBatch(db)
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
        const updatedSets = [...(userData.flashcardSets || []), { name: setName }]
        batch.update(userDocRef, { flashcardSets: updatedSets })
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] })
      }
  
      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName)
      batch.set(setDocRef, { flashcards })
  
      await batch.commit()
  
      alert('Flashcards saved successfully!')
      handleCloseDialog()
      setSetName('')
    } catch (error) {
      console.error('Error saving flashcards:', error)
      alert('An error occurred while saving flashcards. Please try again.')
    }
  }


  return (
    <Container maxWidth="100vw" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <Head>
        <title>Flashcard SaaS</title>
      </Head>

      <AppBar position="static" sx={{ width: '100%' }}>
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
        <Typography variant="h2">Welcome to Flashcard SaaS</Typography>
        <Typography variant="h5">
          {' '}
          Create flashcards and study them later
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Get Started
        </Button>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center', width: '100%' }}>
        <Typography variant="h4" component="h2">Features</Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={4} md={4}>
            <Typography variant="h6">Easy Text Input</Typography>
            <Typography>
              {' '}
              Enter your text and generate flashcards in seconds. Creating flashcards has never been easier.
            </Typography>
          </Grid>
          <Grid item xs={4} md={4}>
            <Typography variant="h6">Smart Flashcards</Typography>
            <Typography>
              {' '}
              Our AI intelligently breaks down your text into flashcards, optimizing your learning experience.
            </Typography>
          </Grid>
          <Grid item xs={4} md={4}>
            <Typography variant="h6">Access Anywhere</Typography>
            <Typography>
              {' '}
              Access your flashcards from anywhere, anytime. Our platform is designed to be accessible on any device.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 6, textAlign: 'center', width: '100%' }}>

        <Typography variant="h4" component="h2">Pricing</Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <Typography variant="h5">Basic Plan</Typography>
              <Typography variant="h6">$5 / month</Typography>
              <Typography>
                {' '}
                Access to basic features with limited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>Choose Basic</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <Typography variant="h5">Pro</Typography>
              <Typography variant="h6">$10 / month</Typography>
              <Typography>
                {' '}
                Access to all features with unlimited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>Choose Pro</Button>
            </Box>
          </Grid>
        </Grid>

      </Box>
    </Container>
  )
}