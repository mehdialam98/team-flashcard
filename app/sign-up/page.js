import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button
} from '@mui/material'
import {
  SignUp
} from '@clerk/nextjs'
import Link from 'next/link'

export default function SignUpPage() {
  return ( <
    Container maxWidth = "100vw" >
    <
    AppBar position = "static" >
    <
    Toolbar >
    <
    Typography variant = "h6"
    component = "div"
    sx = {
      {
        flexGrow: 1
      }
    } >
    Flashcard SaaS <
    /Typography> <
    Button color = "inherit" >
    <
    Link href = "/sign-up"
    passHref >
    Login <
    /Link> <
    /Button> <
    Button color = "inherit" >
    <
    Link href = "/sign-up"
    passHref >
    Sign Up <
    /Link> <
    /Button> <
    /Toolbar> <
    /AppBar>

    <
    Box display = "flex"
    flexDirection = "column"
    alignItems = "center"
    justifyContent = "center"
    minHeight = "calc(100vh - 64px)" >
    <
    Typography component = "h1"
    variant = "h4"
    mb = {
      4
    } >
    Sign In <
    /Typography> <
    SignUp / >
    <
    /Box> <
    /Container>
  )
}