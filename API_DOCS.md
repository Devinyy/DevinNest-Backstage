# DevinNest AI Backend

本文档描述了 Devin's Nest 后台管理系统所需的后端 API 接口。

## 1. 基础说明

- **Base URL**: `/api/v1`
- **认证方式**: Bearer Token (Header: `Authorization: Bearer <token>`)
- **数据格式**: JSON
- **响应结构**:

```typescript
interface ApiResponse<T> {
  code: number;      // 200: 成功, 非 200: 失败
  message: string;   // 提示信息
  data: T;           // 业务数据
}
```

## 2. 认证模块 (Auth)

### 2.1 Login
- **URL**: `/api/v1/backstage/auth/login`
- **Method**: `POST`
- **描述**: User login endpoint.
- **请求参数**:
  ```json
{
  "username": "string",
  "password": "string"
}
  ```
- **响应数据**:
  ```json
{
  "token": "string",
  "userInfo": "..."
}
  ```

### 2.2 Get Current User Info
- **URL**: `/api/v1/backstage/auth/me`
- **Method**: `GET`
- **描述**: Get current user info (Mocked implementation for simplicity).
In a real app, you would decode the token to get the user ID.
- **响应数据**:
  ```json
{
  "id": "string",
  "username": "string",
  "avatar": "string"
}
  ```

### 2.3 Logout
- **URL**: `/api/v1/backstage/auth/logout`
- **Method**: `POST`
- **描述**: Logout (Client side clears token).
- **响应数据**:

## 3. 仪表盘 (Dashboard)

### 3.1 Get Dashboard Stats
- **URL**: `/api/v1/backstage/dashboard/stats`
- **Method**: `GET`
- **描述**: Get dashboard statistics.
- **响应数据**:
  ```json
{
  "blogsCount": 0,
  "snippetsCount": 0,
  "categoriesCount": 0,
  "tagsCount": 0,
  "latestActivity": "any"
}
  ```

## 4. 博客管理 (Blogs)

### 4.1 Get Blogs
- **URL**: `/api/v1/backstage/blogs`
- **Method**: `GET`
- **描述**: Get blog list with pagination and filters.
- **Query 参数**:
  - `page`: - 
  - `pageSize`: - 
  - `status`: - 
  - `keyword`: - 
  - `categoryId`: - 
- **响应数据**:
  ```json
{
  "list": [
    "..."
  ],
  "total": 0
}
  ```

### 4.2 Create Blog
- **URL**: `/api/v1/backstage/blogs`
- **Method**: `POST`
- **描述**: Create a new blog.
- **请求参数**:
  ```json
{
  "title": "string",
  "subtitle": "any",
  "cover": "any",
  "categoryId": "string",
  "tagIds": [
    "..."
  ],
  "status": "string",
  "content": "string"
}
  ```
- **响应数据**:
  ```json
{
  "title": "string",
  "subtitle": "any",
  "cover": "any",
  "categoryId": "string",
  "tagIds": [
    "..."
  ],
  "status": "string",
  "id": "string",
  "content": "any",
  "views": 0,
  "createdAt": "string",
  "category": "any",
  "tags": [
    "..."
  ]
}
  ```

### 4.3 Get Blog Detail
- **URL**: `/api/v1/backstage/blogs/{id}`
- **Method**: `GET`
- **描述**: Get blog detail.
- **响应数据**:
  ```json
{
  "title": "string",
  "subtitle": "any",
  "cover": "any",
  "categoryId": "string",
  "tagIds": [
    "..."
  ],
  "status": "string",
  "id": "string",
  "content": "any",
  "views": 0,
  "createdAt": "string",
  "category": "any",
  "tags": [
    "..."
  ]
}
  ```

### 4.4 Update Blog
- **URL**: `/api/v1/backstage/blogs/{id}`
- **Method**: `PUT`
- **描述**: Update blog.
- **请求参数**:
  ```json
{
  "title": "string",
  "subtitle": "any",
  "cover": "any",
  "categoryId": "string",
  "tagIds": [
    "..."
  ],
  "status": "string",
  "content": "any"
}
  ```
- **响应数据**:
  ```json
{
  "title": "string",
  "subtitle": "any",
  "cover": "any",
  "categoryId": "string",
  "tagIds": [
    "..."
  ],
  "status": "string",
  "id": "string",
  "content": "any",
  "views": 0,
  "createdAt": "string",
  "category": "any",
  "tags": [
    "..."
  ]
}
  ```

### 4.5 Delete Blog
- **URL**: `/api/v1/backstage/blogs/{id}`
- **Method**: `DELETE`
- **描述**: Delete blog.
- **响应数据**:

## 5. 碎片管理 (Snippets)

### 5.1 Get Snippets
- **URL**: `/api/v1/backstage/snippets`
- **Method**: `GET`
- **Query 参数**:
  - `page`: - 
  - `pageSize`: - 
- **响应数据**:
  ```json
[
  {
    "content": "...",
    "metadata": "...",
    "tags": "...",
    "id": "..."
  }
]
  ```

### 5.2 Create Snippet
- **URL**: `/api/v1/backstage/snippets`
- **Method**: `POST`
- **请求参数**:
  ```json
{
  "content": [
    "..."
  ],
  "metadata": "...",
  "tags": [
    "..."
  ]
}
  ```
- **响应数据**:
  ```json
{
  "content": [
    "..."
  ],
  "metadata": "...",
  "tags": [
    "..."
  ],
  "id": "string"
}
  ```

### 5.3 Get Snippet Detail
- **URL**: `/api/v1/backstage/snippets/{id}`
- **Method**: `GET`
- **响应数据**:
  ```json
{
  "content": [
    "..."
  ],
  "metadata": "...",
  "tags": [
    "..."
  ],
  "id": "string"
}
  ```

### 5.4 Update Snippet
- **URL**: `/api/v1/backstage/snippets/{id}`
- **Method**: `PUT`
- **请求参数**:
  ```json
{
  "content": [
    "..."
  ],
  "metadata": "...",
  "tags": [
    "..."
  ]
}
  ```
- **响应数据**:
  ```json
{
  "content": [
    "..."
  ],
  "metadata": "...",
  "tags": [
    "..."
  ],
  "id": "string"
}
  ```

### 5.5 Delete Snippet
- **URL**: `/api/v1/backstage/snippets/{id}`
- **Method**: `DELETE`
- **响应数据**:

## 6. 分类与标签 (Taxonomy)

### 6.1 Get Categories
- **URL**: `/api/v1/backstage/categories`
- **Method**: `GET`
- **响应数据**:
  ```json
[
  {
    "name": "...",
    "icon": "...",
    "color": "...",
    "id": "...",
    "count": "..."
  }
]
  ```

### 6.2 Create Category
- **URL**: `/api/v1/backstage/categories`
- **Method**: `POST`
- **请求参数**:
  ```json
{
  "name": "string",
  "icon": "any",
  "color": "any"
}
  ```
- **响应数据**:
  ```json
{
  "name": "string",
  "icon": "any",
  "color": "any",
  "id": "string",
  "count": 0
}
  ```

### 6.3 Delete Category
- **URL**: `/api/v1/backstage/categories/{id}`
- **Method**: `DELETE`
- **响应数据**:

### 6.4 Get Tags
- **URL**: `/api/v1/backstage/tags`
- **Method**: `GET`
- **响应数据**:
  ```json
[
  {
    "name": "...",
    "color": "...",
    "id": "...",
    "count": "..."
  }
]
  ```

### 6.5 Create Tag
- **URL**: `/api/v1/backstage/tags`
- **Method**: `POST`
- **请求参数**:
  ```json
{
  "name": "string",
  "color": "any"
}
  ```
- **响应数据**:
  ```json
{
  "name": "string",
  "color": "any",
  "id": "string",
  "count": 0
}
  ```

### 6.6 Delete Tag
- **URL**: `/api/v1/backstage/tags/{id}`
- **Method**: `DELETE`
- **响应数据**:

## 7. 通用接口 (Common)

### 7.1 Upload File
- **URL**: `/api/v1/backstage/upload`
- **Method**: `POST`
- **描述**: Upload file to local storage.
- **请求参数**:
- **响应数据**:
  ```json
{
  "url": "string",
  "filename": "string"
}
  ```

## 8. AI 服务 (LLM)

### 8.1 Chat Completion
- **URL**: `/api/v1/ai/chat`
- **Method**: `POST`
- **描述**: Generate a chat completion using the configured LLM.
- **请求参数**:
  ```json
{
  "messages": [
    "..."
  ],
  "model": "string",
  "temperature": 0.0
}
  ```
- **响应数据**:
  ```json
{
  "id": "string",
  "choices": [
    "..."
  ],
  "created": 0,
  "model": "string"
}
  ```

## 9. DevinNest 项目 (Projects)

### 9.1 Read Projects
- **URL**: `/api/v1/nest/projects/`
- **Method**: `GET`
- **描述**: Retrieve projects for the current user (DevinNest Web).
- **Query 参数**:
  - `skip`: - 
  - `limit`: - 
- **响应数据**:
  ```json
[
  {
    "id": "...",
    "name": "...",
    "description": "...",
    "owner": "..."
  }
]
  ```

### 9.2 Create Project
- **URL**: `/api/v1/nest/projects/`
- **Method**: `POST`
- **描述**: Create a new project.
- **请求参数**:
  ```json
{
  "id": 0,
  "name": "string",
  "description": "string",
  "owner": "string"
}
  ```
- **响应数据**:
  ```json
{
  "id": 0,
  "name": "string",
  "description": "string",
  "owner": "string"
}
  ```

## 10. Other

### 10.1 Root
- **URL**: `/`
- **Method**: `GET`
- **响应数据**:

