import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { TextField, Button, Typography, Box, Stack } from '@mui/material';
import Link from 'next/link'; // Import Link from next/link
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize useRouter

  const handleLogin = async () => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if email is verified
      if (user.emailVerified) {
        localStorage.setItem('token', user.accessToken);
        router.push('/'); // Navigate to the home page (index.js)
      } else {
        setError('Please verify your email before logging in.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#1E1E1E"
      fontFamily="'Roboto', sans-serif"
    >
      <Stack
        direction="column"
        width="500px"
        height="700px"
        bgcolor="#2E2E2E"
        borderRadius={8}
        boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
        p={3}
        spacing={3}
      >
        <Typography variant="h5" color="#FFFFFF" textAlign="center" fontWeight={500} mb={2}>
          Log In
        </Typography>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            style: {
              backgroundColor: '#333333',
              color: '#FFFFFF',
              borderRadius: 8,
              borderColor: '#555555',
            },
          }}
          InputLabelProps={{
            style: { color: '#BBBBBB' },
          }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            style: {
              backgroundColor: '#333333',
              color: '#FFFFFF',
              borderRadius: 8,
              borderColor: '#555555',
            },
          }}
          InputLabelProps={{
            style: { color: '#BBBBBB' },
          }}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{
            mt: 2,
            bgcolor: '#00BFFF',
            color: '#000000',
            borderRadius: 8,
            '&:hover': {
              bgcolor: '#00FFFF',
            },
            transition: 'background-color 0.3s ease',
          }}
        >
          Log In
        </Button>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="#FFFFFF">
            Don't have an account?{' '}
            <Link href="/signup" passHref>
              <Button variant="text" color="primary">Sign Up</Button>
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default Login;