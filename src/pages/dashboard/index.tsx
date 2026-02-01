import React from "react";
import { useList } from "@refinedev/core";
import {
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Chip,
} from "@mui/material";
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

export const Dashboard = () => {
  const listResult = useList<Task>({
    resource: "tasks",
    pagination: { pageSize: 1000 }, // Загружаем все задачи для статистики
  });

  const tasks = listResult.result?.data || [];
  const isLoading = listResult.query.isLoading;

  // Считаем статистику
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task: Task) => task.status === TaskStatus.COMPLETED).length;
  const inProgressTasks = tasks.filter((task: Task) => 
    task.status === TaskStatus.STARTED || task.status === TaskStatus.INWORK
  ).length;
  const draftTasks = tasks.filter((task: Task) => task.status === TaskStatus.DRAFT).length;
  const errorTasks = tasks.filter((task: Task) => task.status === TaskStatus.ERROR).length;

  // Группируем по статусам
  const statusCounts = Object.values(TaskStatus).map(status => ({
    status,
    count: tasks.filter((task: Task) => task.status === status).length,
  }));

  // Последние задачи
  const recentTasks = tasks.slice(-5).reverse();

  if (isLoading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Task Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Основные метрики */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="primary">
                Total Tasks
              </Typography>
              <Typography variant="h3">
                {totalTasks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="success.main">
                Completed
              </Typography>
              <Typography variant="h3" color="success.main">
                {completedTasks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% completion rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="info.main">
                In Progress
              </Typography>
              <Typography variant="h3" color="info.main">
                {inProgressTasks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="error.main">
                Draft/Error
              </Typography>
              <Typography variant="h3" color="error.main">
                {draftTasks + errorTasks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Статистика по статусам */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tasks by Status
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {statusCounts.map(({ status, count }) => (
                  <Chip
                    key={status}
                    label={`${status}: ${count}`}
                    color={statusColors[status] || "default"}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Последние задачи */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Tasks
              </Typography>
              {recentTasks.length > 0 ? (
                <Box>
                  {recentTasks.map((task: Task) => (
                    <Box key={task.id} mb={1}>
                      <Typography variant="body2">
                        {task.name}
                      </Typography>
                      <Chip
                        label={task.status}
                        color={statusColors[task.status] || "default"}
                        size="small"
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No tasks yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
