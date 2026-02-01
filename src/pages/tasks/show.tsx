import { Stack, Typography, Chip, Box } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import { Task, TaskStatus } from "../../types/task";

const statusColors: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
  DRAFT: "default",
  STARTED: "info",
  INWORK: "primary",
  ONPAUSE: "warning",
  CANCELED: "error",
  COMPLETED: "success",
  ERROR: "error",
};

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
      <Stack gap={2}>
        <Box>
          <Typography variant="body1" color="gray">
            {"ID"}
          </Typography>
          <TextField value={record?.id} fontWeight="bold"/>
        </Box>
        
        <Box>
          <Typography variant="body1" color="gray">
            {"Name"}
          </Typography>
          <TextField value={record?.name} fontWeight="bold"/>
        </Box>
        
        <Box>
          <Typography variant="body1" color="gray">
            {"Status"}
          </Typography>
          {record?.status && (
            <Chip
              label={record.status}
              color={statusColors[record.status] || "default"}
              size="small"
            />
          )}
        </Box>
        
        <Box>
          <Typography variant="body1" color="gray">
            {"Description"}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {record?.description || "-"}
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="body1" color="gray">
            {"Comment"}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {record?.comment || "-"}
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="body1" color="gray">
            {"Project ID"}
          </Typography>
          <TextField value={record?.projectId || "-"} />
        </Box>
        
        <Box>
          <Typography variant="body1" color="gray">
            {"Created By"}
          </Typography>
          <TextField value={record?.createdBy || "-"} />
        </Box>
        
        <Box>
          <Typography variant="body1" color="gray">
            {"Created At"}
          </Typography>
          <TextField value={record?.createdAt ? new Date(record.createdAt).toLocaleString() : "-"} />
        </Box>
        
        <Box>
          <Typography variant="body1" color="gray">
            {"Updated By"}
          </Typography>
          <TextField value={record?.updatedBy || "-"} />
        </Box>
        
        <Box>
          <Typography variant="body1" color="gray">
            {"Updated At"}
          </Typography>
          <TextField value={record?.updatedAt ? new Date(record.updatedAt).toLocaleString() : "-"} />
        </Box>
      </Stack>
    </Show>
  );
};
