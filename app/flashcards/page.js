'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useRouter } from 'next/navigation'
import { Card, CardActionArea, CardContent, Container, Grid, Typography, Box, ThemeProvider, createTheme } from '@mui/material'

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

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const router = useRouter()

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return
      const docRef = doc(collection(db, 'users'), user.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || []
        setFlashcards(collections)
      } else {
        await setDoc(docRef, { flashcards: [] })
      }
    }
    getFlashcards();
  }, [user])

  if (!isLoaded || !isSignedIn) {
    return <></>
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`)
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="100vw" sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="primary.main">
            Your Flashcard Collections
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ bgcolor: 'background.paper' }}>
                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                  <CardContent>
                    <Typography variant="h5" color="text.primary">
                      {flashcard.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  )
}
