import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsByProductQuery
} from '../api/productsApi';

function formatNow(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const date = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
  return `${time} ${date}`;
}

export default function CommentSection({ productId }: { productId: number }) {
  const { data, isLoading, isError, refetch } = useGetCommentsByProductQuery(productId);
  const [addComment, { isLoading: adding }] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [text, setText] = useState('');

  const onAdd = async () => {
    const description = text.trim();
    if (!description) return;
    await addComment({ productId, description, date: formatNow() });
    setText('');
  };

  const onDelete = async (id: number) => {
    await deleteComment({ id, productId });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>Comments</Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          label="Add comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button variant="contained" onClick={onAdd} disabled={adding || !text.trim()}>
          Add
        </Button>
      </Stack>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load comments. <Button color="inherit" size="small" onClick={() => refetch()}>Retry</Button>
        </Alert>
      )}

      <Divider />

      {isLoading ? (
        <Typography variant="body2" sx={{ mt: 2 }}>Loading…</Typography>
      ) : (
        <List dense disablePadding sx={{ mt: 1 }}>
          {(data ?? []).map((c) => (
            <ListItem
              key={c.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(c.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={c.description} secondary={c.date} />
            </ListItem>
          ))}
          {(!data || data.length === 0) && (
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              No comments yet.
            </Typography>
          )}
        </List>
      )}
    </Box>
  );
}
