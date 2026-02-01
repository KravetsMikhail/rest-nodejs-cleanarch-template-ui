import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";
import { Chip, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
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

export const TaskList = () => {
  const { dataGridProps } = useDataGrid({});

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        type: "number",
        minWidth: 50,
        display: "flex",
        align: "left",
        headerAlign: "left",
      },
      {
        field: "name",
        flex: 1,
        headerName: "Name",
        minWidth: 200,
        display: "flex",
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 120,
        type: "singleSelect",
        valueOptions: Object.values(TaskStatus),
        renderCell: function render({ row }) {
          return (
            <Chip
              label={row.status}
              color={statusColors[row.status] || "default"}
              size="small"
            />
          );
        },
      },
      {
        field: "description",
        headerName: "Description",
        minWidth: 200,
        flex: 1,
        renderCell: function render({ row }) {
          return row.description || "-";
        },
      },
      {
        field: "projectId",
        headerName: "Project",
        minWidth: 100,
        renderCell: function render({ row }) {
          return row.projectId || "-";
        },
      },
      {
        field: "createdAt",
        headerName: "Created",
        minWidth: 150,
        renderCell: function render({ row }) {
          return row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-";
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        align: "right",
        headerAlign: "right",
        minWidth: 120,
        sortable: false,
        display: "flex",
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton hideText recordItemId={row.id} />
            </>
          );
        },
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} />
    </List>
  );
};
