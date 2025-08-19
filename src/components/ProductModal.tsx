import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField
} from '@mui/material';
import type { Product } from '../models/Product';

type Props = {
  open: boolean;
  initial?: Product | null;
  onClose: () => void;
  onSubmit: (data: Omit<Product, 'id'> | Product) => void;
};

const empty: Omit<Product, 'id'> = {
  imageUrl: '',
  name: '',
  count: 0,
  size: { width: 0, height: 0 },
  weight: '',
  comments: [],
};

export default function ProductModal({ open, initial, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<Omit<Product, 'id'>>(
    initial
      ? {
          imageUrl: initial.imageUrl,
          name: initial.name,
          count: initial.count,
          size: { width: initial.size.width, height: initial.size.height },
          weight: initial.weight,
          comments: initial.comments ?? [],
        }
      : empty
  );

  useEffect(() => {
    if (initial) {
      setForm({
        imageUrl: initial.imageUrl,
        name: initial.name,
        count: initial.count,
        size: { width: initial.size.width, height: initial.size.height },
        weight: initial.weight,
        comments: initial.comments ?? [],
      });
    } else {
      setForm(empty);
    }
  }, [initial, open]);

  const canSubmit =
    form.imageUrl.trim() &&
    form.name.trim() &&
    form.count >= 0 &&
    form.size.width > 0 &&
    form.size.height > 0 &&
    form.weight.trim();

  const handleChange = (field: string, value: string | number) => {
    if (field.startsWith('size.')) {
      const key = field.split('.')[1] as 'width' | 'height';
      setForm((p) => ({ ...p, size: { ...p.size, [key]: Number(value) } }));
    } else if (field === 'count') {
      setForm((p) => ({ ...p, count: Number(value) }));
    } else {
      setForm((p) => ({ ...p, [field]: value }));
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (initial) {
      onSubmit({ ...(initial as Product), ...form });
    } else {
      onSubmit(form);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial ? 'Edit product' : 'Add product'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Image URL"
              fullWidth
              value={form.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              label="Name"
              fullWidth
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Count"
              type="number"
              fullWidth
              value={form.count}
              onChange={(e) => handleChange('count', e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Width"
              type="number"
              fullWidth
              value={form.size.width}
              onChange={(e) => handleChange('size.width', e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Height"
              type="number"
              fullWidth
              value={form.size.height}
              onChange={(e) => handleChange('size.height', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Weight (e.g. 200g)"
              fullWidth
              value={form.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!canSubmit}>
          {initial ? 'Save' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
