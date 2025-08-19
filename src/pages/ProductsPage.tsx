import { Box, Paper } from '@mui/material';
import ProductList from '../components/ProductList';

export default function ProductsPage() {
  return (
    <Box>
      <Paper sx={{ p: 2 }}>
        <ProductList />
      </Paper>
    </Box>
  );
}
