'use client'

import React from 'react'
import { useUser } from "@clerk/nextjs"
import {
  Container,
  CardContent, Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  Card,
  Paper,
  Typography,
  Box,
  CardActionArea,
} from "@mui/material"
import { writeBatch } from "firebase/firestore"
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { db, collection, doc, getDoc } from '../../firebase.js'

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

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    console.log('Flashcards state updated:', flashcards);
  }, [flashcards]);

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: text })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data); // Log the received data
      setFlashcards(data);

      if (data.length === 0) {
        console.log('No flashcards were generated.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`An error occurred while generating flashcards: ${error.message}`);
    }
  }

  const handleCardClick = (id) => {
    setFlipped(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const saveFlashcards = async () => {
    if (!name) {
      alert('Please enter a name for the flashcards')
      return
    }

    const batch = writeBatch(db)
    const userDocRef = doc(collection(db, 'users'), user.id)
    const docSnap = await getDoc(userDocRef)

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || []
      if (collections.find((f) => f.name === name)) {
        alert('You already have a collection with this name')
        return
      } else {
        collections.push({ name })
        batch.set(userDocRef, { flashcards: collections }, { merge: true })
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] })
    }

    const colRef = collection(userDocRef, name)
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef)
      batch.set(cardDocRef, flashcard)
    })

    await batch.commit()
    handleClose()
    router.push('/flashcards')
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="100vw" sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Box sx={{
          mt: 4,
          mb: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Typography component="h1" variant="h2" align="center" color="primary" gutterBottom>
            Generate Flashcards
          </Typography>

          <Paper sx={{ p: 4, width: '100%', bgcolor: 'background.paper' }}>
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              label="Enter text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
              Submit
            </Button>
          </Paper>
        </Box>

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" color="primary">Flashcard Preview</Typography>
            <Grid container spacing={3}>
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
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" color="secondary" onClick={handleOpen}>
                Save
              </Button>
            </Box>
          </Box>
        )}

        <Dialog open={open} onClose={handleClose} PaperProps={{
          style: { backgroundColor: theme.palette.background.paper }
        }}>
          <DialogTitle>Save Flashcards</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter a name for the flashcards collection
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Collection Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={saveFlashcards}>Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  )
}