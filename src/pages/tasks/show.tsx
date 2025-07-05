import { Stack, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";

export const TaskShow = () => {
  const { query } = useShow({});
  const { data, isLoading } = query;

  const record = data?.data;

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
