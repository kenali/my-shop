import { useParams, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import {
  useDeleteProductMutation,
  useGetProductQuery,
  useUpdateProductMutation
} from '../api/productsApi';
import DeleteModal from '../components/DeleteModal';
import ProductModal from '../components/ProductModal';
import { useState } from 'react';
import CommentSection from '../components/CommentSection';

export default function ProductPage() {
  const params = useParams();
  const id = Number(params.id);
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useGetProductQuery(id);
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  if (Number.isNaN(id)) return <Alert severity="error">Invalid product ID</Alert>;

  const onEdit = async (payload: any) => {
    await updateProduct(payload);
    setOpenEdit(false);
  };

  const onConfirmDelete = async () => {
    await deleteProduct(id);
    setOpenDelete(false);
    navigate('/');
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/')}>Back</Button>
        <Typography variant="h5">Product details</Typography>
      </Stack>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load product. <Button color="inherit" size="small" onClick={() => refetch()}>Retry</Button>
        </Alert>
      )}

      {isLoading || !data ? (
        <Skeleton variant="rectangular" height={280} />
      ) : (
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <img
                src={data.imageUrl}
                alt={`Image of ${data.name}`}
                style={{ width: '100%', height: 'auto', borderRadius: 8 }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Stack spacing={1}>
                <Typography variant="h5">{data.name}</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label={`Count: ${data.count}`} />
                  <Chip label={`Size: ${data.size.width}×${data.size.height}`} />
                  <Chip label={`Weight: ${data.weight}`} />
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button variant="outlined" onClick={() => setOpenEdit(true)}>Edit</Button>
                  <Button variant="outlined" color="error" onClick={() => setOpenDelete(true)}>Delete</Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <CommentSection productId={data.id} />
        </Paper>
      )}

      <ProductModal
        open={openEdit}
        initial={data ?? null}
        onClose={() => setOpenEdit(false)}
        onSubmit={onEdit}
      />

      <DeleteModal
        open={openDelete}
        title="Delete product"
        description={`Delete "${data?.name}"? This action cannot be undone.`}
        onCancel={() => setOpenDelete(false)}
        onConfirm={onConfirmDelete}
        confirmText="Delete"
      />
    </Box>
  );
}
