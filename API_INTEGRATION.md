# API Integration Documentation

## Overview

This document describes the API integration between the React frontend and the REST API backend for the Task Management System.

## Base Configuration

### Environment Variables

```env
VITE_API_URL=http://localhost:1234/api/v1
```

### Data Provider Configuration

The application uses a custom data provider (`src/providers/core-provider.ts`) that handles:

- Authentication with JWT tokens
- Request/response transformation
- Error handling
- Pagination and sorting

## API Endpoints

### Task Management

#### Get All Tasks
```
GET /api/v1/tasks
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Task Name",
      "search": "task name",
      "status": "DRAFT",
      "description": "Task description",
      "comment": "Task comment",
      "projectId": "123",
      "createdBy": "user1",
      "updatedBy": "user1",
      "createdAt": "2026-02-01T15:00:00.000Z",
      "updatedAt": "2026-02-01T15:00:00.000Z"
    }
  ],
  "total": 1
}
```

#### Create Task
```
POST /api/v1/tasks
```

**Request Body:**
```json
{
  "name": "New Task",
  "status": "DRAFT",
  "description": "Task description",
  "comment": "Task comment",
  "projectId": "123"
}
```

**Response:**
```json
{
  "id": 2,
  "name": "New Task",
  "search": "new task",
  "status": "DRAFT",
  "description": "Task description",
  "comment": "Task comment",
  "projectId": "123",
  "createdBy": "user1",
  "updatedBy": "user1",
  "createdAt": "2026-02-01T15:30:00.000Z",
  "updatedAt": "2026-02-01T15:30:00.000Z"
}
```

#### Get Task by ID
```
GET /api/v1/tasks/:id
```

#### Update Task
```
PUT /api/v1/tasks/:id
```

**Request Body:**
```json
{
  "name": "Updated Task",
  "status": "INWORK",
  "description": "Updated description",
  "comment": "Updated comment",
  "projectId": "456"
}
```

#### Delete Task
```
DELETE /api/v1/tasks/:id
```

## Authentication

### Keycloak Integration

The application uses Keycloak for authentication. The authentication flow:

1. **Login:** User is redirected to Keycloak login page
2. **Token Exchange:** JWT tokens are exchanged and stored
3. **API Requests:** Authorization header is automatically added to all API requests

### Request Headers

All API requests include:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Token Management

```typescript
// Automatic token injection
axiosInstance.interceptors.request.use((config) => {
  const token = keycloak.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Data Transformation

### Request Processing

Before sending requests to the API, the data provider:

1. **Removes `search` field** - Backend generates this field automatically
2. **Converts `projectId` to string** - Handles BigInt serialization
3. **Validates data** - Ensures data integrity

```typescript
const processedVariables = {
  ...variablesWithoutSearch,
  ...(variablesWithoutSearch.projectId && { 
    projectId: String(variablesWithoutSearch.projectId) 
  }),
};
```

### Response Processing

The data provider handles:

1. **Empty responses** - Creates temporary data for UI updates
2. **Error responses** - Transforms API errors to HttpError format
3. **Data transformation** - Ensures consistent data structure

## Error Handling

### HTTP Error Codes

- **200/201** - Success
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (invalid/missing token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Internal Server Error

### Error Response Format

```json
{
  "code": "Error",
  "message": "Error description",
  "stack": "Error stack trace"
}
```

### Frontend Error Handling

```typescript
try {
  const response = await httpClient.post(url, data);
  return { data: response.data };
} catch (error) {
  console.error('API Error:', error);
  throw Object.assign(new Error(), {
    ...error,
    message: error.response?.data?.message,
    statusCode: error.response?.status,
  });
}
```

## Data Models

### Task Entity

```typescript
interface Task {
  id: number;
  name: string;
  search: string;
  status: TaskStatus;
  description?: string;
  comment?: string;
  projectId?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

enum TaskStatus {
  DRAFT = "DRAFT",
  STARTED = "STARTED",
  INWORK = "INWORK",
  ONPAUSE = "ONPAUSE",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR"
}
```

### Request DTOs

```typescript
interface CreateTaskRequest {
  name: string;
  status?: TaskStatus;
  description?: string;
  comment?: string;
  projectId?: string;
}

interface UpdateTaskRequest {
  name: string;
  status?: TaskStatus;
  description?: string;
  comment?: string;
  projectId?: string;
}
```

## Pagination and Sorting

### Request Parameters

```
GET /api/v1/tasks?offset=0&limit=10&_sort=createdAt&_order=desc
```

### Parameters

- `offset` - Number of items to skip (default: 0)
- `limit` - Number of items to return (default: 10)
- `_sort` - Field to sort by
- `_order` - Sort direction (asc/desc)

### Response Headers

```
x-total-count: 25
```

## Filtering

### Status Filtering

The frontend supports filtering by task status:

```typescript
// Filter request
{
  field: "status",
  operator: "eq",
  value: "COMPLETED"
}
```

### API Filter Format

```
GET /api/v1/tasks?status=eq:COMPLETED
```

## Development

### Mock API

For development without backend, you can use mock data:

```typescript
const mockTasks: Task[] = [
  {
    id: 1,
    name: "Mock Task",
    status: TaskStatus.DRAFT,
    // ... other fields
  }
];
```

### API Testing

Use browser dev tools or Postman to test API endpoints:

1. **Get JWT token** from Keycloak
2. **Add Authorization header** with Bearer token
3. **Make requests** to API endpoints

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend allows frontend origin
   - Check CORS configuration in backend

2. **Authentication Errors**
   - Verify Keycloak configuration
   - Check token validity
   - Ensure proper redirect URIs

3. **BigInt Serialization**
   - Frontend converts projectId to string
   - Backend handles string to BigInt conversion

4. **Empty Responses**
   - Backend may return empty data on success
   - Frontend handles this with temporary data

### Debug Logging

Enable debug logging in browser console:

```typescript
console.log('API Request:', { url, data });
console.log('API Response:', response);
```

## Security Considerations

### Token Storage

- JWT tokens are stored in memory
- No persistent storage of sensitive data
- Tokens are automatically refreshed

### Data Validation

- Frontend validates form inputs
- Backend validates all incoming data
- SQL injection prevention through parameterized queries

### HTTPS

- Use HTTPS in production
- Ensure secure token transmission
- Configure secure cookies if used
