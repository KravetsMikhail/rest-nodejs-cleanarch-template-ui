import { Stack, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";

export const TaskShow = () => {
  console.log('TaskShow - rendering');
  const { query } = useShow();
  console.log('TaskShow - query:', query);
  const { data, isLoading, error } = query;
  console.log('TaskShow - data:', data);
  console.log('TaskShow - isLoading:', isLoading);
  console.log('TaskShow - error:', error);

  const record = data?.data;
  console.log('TaskShow - record:', record);

  // Показываем ошибку API, но не редиректим
  if (error) {
    return (
      <Show>
        <Stack gap={1}>
          <Typography variant="h6" color="error">
            Error loading task
          </Typography>
          <Typography variant="body2">
            {error?.message || 'Unknown error occurred'}
          </Typography>
        </Stack>
      </Show>
    );
  }

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" color="gray">
          {"ID"}
        </Typography>
        <TextField value={record?.id} fontWeight="bold"/>
        <Typography variant="body1" color="gray">
          {"Name"}
        </Typography>
        <TextField value={record?.name} fontWeight="bold"/>
      </Stack>
    </Show>
  );
};
