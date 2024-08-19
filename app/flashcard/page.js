'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'

import {
  Container,
  CardContent, Grid,
  Card,
  Typography,
  Box,
  CardActionArea,
  ThemeProvider,
  createTheme
} from "@mui/material"

import { useSearchParams } from 'next/navigation'

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

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])

  const searchParams = useSearchParams()
  const search = searchParams.get('id')

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return
      const colRef = collection(doc(collection(db, 'users'), user.id), search)
      const docs = await getDocs(colRef)
      const flashcards = []
      docs.forEach(doc => {
        flashcards.push({ id: doc.id, ...doc.data() })
      })
      setFlashcards(flashcards)
    }
    getFlashcard();
  }, [user, search])

  const handleCardClick = (id) => {
    setFlipped(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  if (!isLoaded || !isSignedIn) {
    return <></>
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="100vw" sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="primary.main">
            Your Flashcards
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ bgcolor: 'background.paper' }}>
                <CardActionArea onClick={() => handleCardClick(index)}>
                  <CardContent>
                    <Box sx={{
                      perspective: '1000px',
                      '& > div': {
                        transition: 'transform 0.6s',
                        transformStyle: 'preserve-3d',
                        position: 'relative',
                        width: '100%',
                        height: '200px',
                        boxShadow: '0 4px 8px 0 rgba(255,255,255, 0.2)',
                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      },
                      '& > div > div': {
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 2,
                        boxSizing: 'border-box',
                      },
                      '& > div > div:nth-of-type(2)': {
                        transform: 'rotateY(180deg)',
                      }
                    }}>
                      <div>
                        <div>
                          <Typography variant="h5" component="div" color="text.primary">
                            {flashcard.front}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="h5" component="div" color="text.primary">
                            {flashcard.back}
                          </Typography>
                        </div>
                      </div>
                    </Box>
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
