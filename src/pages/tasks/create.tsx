import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { TaskStatus, CreateTaskRequest } from "../../types/task";

export const TaskCreate = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    control,
    register,
    formState: { errors },
  } = useForm<CreateTaskRequest>({
    defaultValues: {
      name: "",
      status: TaskStatus.DRAFT,
    },
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        autoComplete="off"
      >
        <TextField
          {...register("name", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.name}
          helperText={(errors as any)?.name?.message}
          fullWidth
          label="Name"
          name="name"
        />
        
        <FormControl fullWidth>
          <InputLabel id="status-label">Status</InputLabel>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="status-label"
                label="Status"
              >
                <MenuItem value={TaskStatus.DRAFT}>Draft</MenuItem>
                <MenuItem value={TaskStatus.STARTED}>Started</MenuItem>
                <MenuItem value={TaskStatus.INWORK}>In Work</MenuItem>
                <MenuItem value={TaskStatus.ONPAUSE}>On Pause</MenuItem>
                <MenuItem value={TaskStatus.CANCELED}>Canceled</MenuItem>
                <MenuItem value={TaskStatus.COMPLETED}>Completed</MenuItem>
                <MenuItem value={TaskStatus.ERROR}>Error</MenuItem>
              </Select>
            )}
          />
        </FormControl>
        
        <TextField
          {...register("description")}
          fullWidth
          multiline
          rows={3}
          label="Description"
          name="description"
        />
        
        <TextField
          {...register("comment")}
          fullWidth
          multiline
          rows={2}
          label="Comment"
          name="comment"
        />
        
        <TextField
          {...register("projectId", {
            pattern: {
              value: /^[0-9]*$/,
              message: "Project ID must contain only numbers"
            }
          })}
          error={!!(errors as any)?.projectId}
          helperText={(errors as any)?.projectId?.message}
          fullWidth
          label="Project ID"
          name="projectId"
          placeholder="Enter project ID (optional)"
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*'
          }}
        />
      </Box>
    </Create>
  );
};
