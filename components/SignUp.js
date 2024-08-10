import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { TextField, Button, Container, Typography, Box, Stack } from '@mui/material';
import Link from 'next/link';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(firestore, 'users', user.uid), {
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString(),
      });

      alert('User signed up successfully! Please verify your email.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#1E1E1E',
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Stack
        sx={{
          width: '90%',
          maxWidth: '500px',
          height: 'auto',
          bgcolor: '#2E2E2E',
          borderRadius: 8,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          p: 3,
          spacing: 3,
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          color="#FFFFFF"
          textAlign="center"
          fontWeight={500}
          mb={2}
        >
          Sign Up
        </Typography>

        <TextField
          fullWidth
          label="First Name"
          margin="normal"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
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
          label="Last Name"
          margin="normal"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
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
          onClick={handleSignUp}
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
          Sign Up
        </Button>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="#FFFFFF">
            Already have an account?{' '}
            <Link href="/login" passHref>
              <Button variant="text" color="primary">Log in</Button>
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default SignUp;
