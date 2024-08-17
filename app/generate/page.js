'use client'

import { useUser } from "@clerk/nextjs"
import { Box, Container, TextField, Typography, Paper, Button } from "@mui/material"
import { collection } from "firebase/firestore"
import { useRouter } from 'next/navigation'
import { useState } from 'react'



export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)

  const handleSubmit = async () => {
    fetch('/api/flashcards', {
      method: 'POST',
      body: text
    })
    .then(res => res.json())
    .then(data => setFlashcards(data))
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
    const userDocRef = doc(db, 'users', user.id)
    const docSnap = await getDoc(userDocRef)

    if (!docSnap.exists()) {
        const collections = docSnap.data().flashcards || []
        if (collections.find((f) => f.name === name)) {
            alert('You already have a collection with this name')
            return
        } else {
            collections.push({name})
            batch.set(userDocRef, {flashcards: collections}, {merge: true})
        }
    } else {
        batch.set(userDocRef, {flashcards: [{name}]})
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
    <Container maxWidth="md">

        <Box sx={{mt: 4,
            mb: 6, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center'}}>

            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                Generate Flashcards
            </Typography>

            <Paper sx={{p: 4, width: '100%'}}>
                <TextField
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    label="Enter text to generate flashcards"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{mb: 2}}
                />

                <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                    Submit
                </Button>
            </Paper>
        </Box>

    </Container>
    )
}