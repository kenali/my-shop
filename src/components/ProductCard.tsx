import { Card, CardContent, CardMedia, Typography, CardActions, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../models/Product';

type Props = {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
};

export default function ProductCard({ product, onEdit, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia component="img" image={product.imageUrl} alt={product.name} height={180} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>{product.name}</Typography>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2">Count: {product.count}</Typography>
          <Typography variant="body2">Size: {product.size.width}×{product.size.height}</Typography>
          <Typography variant="body2">Weight: {product.weight}</Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" onClick={() => onEdit(product)}>Edit</Button>
          <Button size="small" color="error" variant="outlined" onClick={() => onDelete(product)}>Delete</Button>
        </Stack>
        <Button size="small" variant="contained" onClick={() => navigate(`/product/${product.id}`)}>
          View
        </Button>
      </CardActions>
    </Card>
  );
}
