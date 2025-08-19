import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import {
  useAddProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation
} from '../api/productsApi';
import type { Product } from '../models/Product';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import DeleteModal from './DeleteModal';

type SortOption = 'name' | 'count';

export default function ProductList() {
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const { data, isLoading, isError, refetch } = useGetProductsQuery({ sortBy, order: 'asc' });

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const [addProduct, { isLoading: adding }] = useAddProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  const handleSortChange = (e: SelectChangeEvent) => setSortBy(e.target.value as SortOption);

  const products = useMemo(() => data ?? [], [data]);

  const openAdd = () => {
    setEditing(null);
    setOpenModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setOpenModal(true);
  };

  const onSubmitProduct = async (payload: Omit<Product, 'id'> | Product) => {
    if ('id' in payload) {
      await updateProduct(payload as Product);
    } else {
      await addProduct(payload as Omit<Product, 'id'>);
    }
    setOpenModal(false);
  };

  const onAskDelete = (p: Product) => {
    setToDelete(p);
    setOpenDelete(true);
  };

  const onConfirmDelete = async () => {
    if (toDelete) {
      await deleteProduct(toDelete.id);
      setOpenDelete(false);
      setToDelete(null);
    }
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h5">Products</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="sort-by-label">Sort by</InputLabel>
            <Select
              labelId="sort-by-label"
              label="Sort by"
              value={sortBy}
              onChange={handleSortChange}
            >
              <MenuItem value="name">Alphabetically (name)</MenuItem>
              <MenuItem value="count">Count</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={openAdd} disabled={adding || updating || deleting}>
            Add product
          </Button>
        </Stack>
      </Stack>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load products. <Button color="inherit" size="small" onClick={() => refetch()}>Retry</Button>
        </Alert>
      )}

      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={260} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {products.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <ProductCard
                product={p}
                onEdit={openEdit}
                onDelete={onAskDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <ProductModal
        open={openModal}
        initial={editing}
        onClose={() => setOpenModal(false)}
        onSubmit={onSubmitProduct}
      />

      <DeleteModal
        open={openDelete}
        title="Delete product"
        description={`Delete "${toDelete?.name}"? This action cannot be undone.`}
        onCancel={() => setOpenDelete(false)}
        onConfirm={onConfirmDelete}
        confirmText="Delete"
      />
    </Box>
  );
}
