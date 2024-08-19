'use client';
import { useEffect, useState } from 'react'; // Corrected 'UseState' to 'useState'
import { useRouter, useSearchParams } from 'next/navigation'; // Corrected 'useRoute' to 'useRouter'
import getStripe from '@/utils/get-stripe';
import { CircularProgress, Typography, Container, Box } from '@mui/material'; // Added missing imports

const ResultPage = () => {
  const router = useRouter(); // Changed 'useRoute' to 'useRouter'
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');

  const [loading, setLoading] = useState(true); // Corrected 'UseState' to 'useState'
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { // Wrapped fetch logic inside useEffect
    const fetchCheckoutSession = async () => {
      if (!session_id) return;
      try {
        const response = await fetch(`/api/checkout_session/${session_id}`);
        const sessionData = await response.json();
        if (response.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error);
        }
      } catch (error) {
        setError('An error occurred while fetching the session');
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutSession();
  }, [session_id]);

  if (loading) {
    return (
      <Container maxWidth="100vw" sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="100vw" sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" sx={{ mt: 2 }}>{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="100vw" sx={{ textAlign: 'center', mt: 4 }}>
      {session.payment_status === 'paid' ? (
        <>
          <Typography variant="h4">Thank you for your purchase</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Session ID: {session_id}</Typography>
            <Typography variant="body1">We have received your payment.</Typography>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h4">Payment Failed</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">Your payment was not successful. Please try again.</Typography>
          </Box>
        </>
      )}
    </Container>
  );
};

export default ResultPage;
