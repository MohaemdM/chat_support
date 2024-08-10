'use client';

import { Box, Stack, TextField, Button, Typography, MenuItem, Select, IconButton } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust the import based on your setup
import { useRouter } from 'next/router';

const translations = {
  en: {
    welcome: "Hello! I am your virtual interviewer here to help you practice. Let us get started!",
    placeholder: "Type your message...",
    send: "Send",
    title: "Virtual Interviewer",
    feedbackPrompt: "How was this response?",
    like: "Like",
    dislike: "Dislike",
  },
  // other languages...
};

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: translations.en.welcome,
      feedback: null,
      language: 'en',
    },
  ]);

  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState('en');
  const [firstName, setFirstName] = useState('');
  const messagesContainerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.displayName?.split(' ')[0];
        setFirstName(displayName || '');
      } else {
        router.push('/login'); // Redirect to the login page if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    const newMessage = { role: 'user', content: message, feedback: null, language };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setMessage('');

    const languageInstruction = {
      es: 'Responde en español.',
      ko: '한국어로 응답하세요.',
      ar: 'أجب باللغة العربية.',
    };

    const promptWithLanguage = `${message}\n\n${languageInstruction[language] || ''}`;

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...updatedMessages, { role: 'system', content: promptWithLanguage, language }]),
    });

    const data = await response.json();
    setMessages((messages) => [
      ...messages,
      { role: 'assistant', content: data.message, feedback: null, language },
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleFeedback = (index, feedback) => {
    const updatedMessages = [...messages];
    updatedMessages[index].feedback = feedback;
    setMessages(updatedMessages);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.error('Sign Out Error', error);
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
        <Stack direction="row" justifyContent="space-between">
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{
              bgcolor: '#FF0000',
              color: '#FFFFFF',
              borderRadius: 8,
              '&:hover': {
                bgcolor: '#FF4444',
              },
            }}
          >
            Logout
          </Button>
          <Select
            value={language}
            onChange={handleLanguageChange}
            variant="outlined"
            sx={{
              bgcolor: '#555555',
              color: '#FFFFFF',
              borderRadius: 8,
              minWidth: 120,
            }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Español</MenuItem>
            <MenuItem value="ko">한국어</MenuItem>
            <MenuItem value="ar">العربية</MenuItem>
          </Select>
        </Stack>

        <Typography
          variant="h5"
          color="#FFFFFF"
          textAlign="center"
          fontWeight={500}
          mb={2}
          sx={{
            direction: language === 'ar' ? 'rtl' : 'ltr',
          }}
        >
          {firstName && `${firstName}'s `}{translations[language].title}
        </Typography>

        <Stack
          direction="column"
          spacing={2}
          flexGrow={2}
          overflow="auto"
          maxHeight="100%"
          p={2}
          bgcolor="#1C1C1C"
          borderRadius={8}
          ref={messagesContainerRef}
          sx={{
            direction: language === 'ar' ? 'rtl' : 'ltr',
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              flexDirection="column"
              alignItems={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
              sx={{
                direction: message.language === 'ar' ? 'rtl' : 'ltr',
              }}
            >
              <Box
                bgcolor={message.role === 'assistant' ? '#3A3A3A' : '#00BFFF'}
                color="#FFFFFF"
                borderRadius={8}
                p={2}
                maxWidth="70%"
                boxShadow="0px 2px 8px rgba(0, 0, 0, 0.2)"
                mb={1}
              >
                {message.content}
              </Box>

              {message.role === 'assistant' && 
               message.feedback === null && 
               message.content !== translations[message.language].welcome && (
                <Box display="flex" alignItems="center" mt={1}>
                  <Typography variant="body2" color="#BBBBBB" mr={1}>
                    {translations[message.language].feedbackPrompt}
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={() => handleFeedback(index, 'like')}
                    sx={{ color: '#00FF00' }}
                  >
                    <ThumbUpIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleFeedback(index, 'dislike')}
                    sx={{ color: '#FF0000' }}
                  >
                    <ThumbDownIcon />
                  </IconButton>
                </Box>
              )}

              {message.feedback && (
                <Typography variant="body2" color="#BBBBBB" mt={1}>
                  {message.feedback === 'like' ? translations[message.language].like : translations[message.language].dislike}
                </Typography>
              )}
            </Box>
          ))}
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            label={translations[language].placeholder}
            fullWidth
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#555555',
                },
                '&:hover fieldset': {
                  borderColor: '#00BFFF',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00BFFF',
                  borderWidth: '2px',
                },
              },
              '& input': {
                color: '#FFFFFF',
              },
              direction: language === 'ar' ? 'rtl' : 'ltr',
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            sx={{
              bgcolor: '#00BFFF',
              color: '#000000',
              borderRadius: 8,
              '&:hover': {
                bgcolor: '#00FFFF',
              },
              transition: 'background-color 0.3s ease',
            }}
          >
            {translations[language].send}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
