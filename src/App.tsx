import { AppBar, Box, Container, CssBaseline, Toolbar, Typography } from '@mui/material';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">My Shop App</Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <AppRoutes />
        </Container>
      </Box>
    </>
  );
}
