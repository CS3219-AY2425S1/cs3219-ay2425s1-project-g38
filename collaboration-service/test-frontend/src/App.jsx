import { Box, Input, Button } from '@chakra-ui/react';
import CodeEditor from './components/CodeEditor';
import { useState } from 'react';

function App() {

  const [jwtToken, setJwtToken] = useState('');

  const handleSaveToken = () => {
    if (jwtToken) {
      localStorage.setItem('jwtToken', jwtToken);

      alert('Token saved to localStorage');
    } else {
      alert('Please enter a token');
    }
  };

  return (
    <Box minH={"100vh"} bg="#0f0a19" color='gray.500' px={6} py={8}>
      <Box mb={4}>
        <Input
          placeholder="Enter JWT Token"
          value={jwtToken}
          onChange={(e) => setJwtToken(e.target.value)}
          bg="white" // Input background
          color="black" // Input text color
        />
        <Button mt={2} colorScheme="teal" onClick={handleSaveToken}>
          Save Token
        </Button>
      </Box>
      <CodeEditor/>
    </Box>
  );
}

export default App;
