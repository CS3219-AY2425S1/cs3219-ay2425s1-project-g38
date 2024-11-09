import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App.jsx'
import theme from './theme.js'


createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ChakraProvider theme = {theme}>

    <App />
  </ChakraProvider>
  </StrictMode>,
)
