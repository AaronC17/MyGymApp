# 📡 Documentación de API - Energym

## Base URL

```
https://energym-app.azurewebsites.net/api
```

## Autenticación

La mayoría de los endpoints requieren autenticación mediante JWT. Incluir el token en el header:

```
Authorization: Bearer <token>
```

---

## Endpoints de Autenticación

### POST /api/auth/login

Login de usuario (cliente o administrador).

**Request Body:**
```json
{
  "email": "cliente@example.com",
  "password": "password123"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "cliente@example.com",
    "name": "Juan Pérez",
    "role": "client"
  }
}
```

### POST /api/auth/register

Registro de nuevo cliente.

**Request Body:**
```json
{
  "email": "nuevo@example.com",
  "password": "password123",
  "name": "Nuevo Cliente",
  "phone": "+1234567890"
}
```

**Response 201:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "email": "nuevo@example.com",
    "name": "Nuevo Cliente",
    "role": "client"
  }
}
```

### GET /api/auth/me

Obtener información del usuario actual.

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "cliente@example.com",
  "name": "Juan Pérez",
  "role": "client",
  "phone": "+1234567890"
}
```

---

## Endpoints de Clientes

### GET /api/clients

Listar todos los clientes (solo admin).

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Items por página (default: 10)
- `search`: Búsqueda por nombre o email

**Response 200:**
```json
{
  "clients": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "email": "cliente@example.com",
      "name": "Juan Pérez",
      "phone": "+1234567890",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pages": 10
}
```

### GET /api/clients/:id

Obtener cliente específico.

**Response 200:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "cliente@example.com",
  "name": "Juan Pérez",
  "phone": "+1234567890",
  "avatar": "https://energymstorage.blob.core.windows.net/avatars/avatar.jpg",
  "membership": {
    "status": "active",
    "endDate": "2024-02-15T10:00:00Z"
  }
}
```

### POST /api/clients

Crear nuevo cliente (solo admin).

**Request Body:**
```json
{
  "email": "nuevo@example.com",
  "password": "password123",
  "name": "Nuevo Cliente",
  "phone": "+1234567890"
}
```

### PUT /api/clients/:id

Actualizar cliente.

**Request Body:**
```json
{
  "name": "Nombre Actualizado",
  "phone": "+9876543210",
  "weight": 75,
  "goal": "Perder peso"
}
```

### DELETE /api/clients/:id

Eliminar cliente (solo admin).

**Response 200:**
```json
{
  "message": "Cliente eliminado exitosamente"
}
```

---

## Endpoints de Membresías

### GET /api/memberships

Listar membresías.

**Query Parameters:**
- `userId`: Filtrar por usuario
- `status`: Filtrar por estado (active, suspended, expired)

**Response 200:**
```json
{
  "memberships": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "userId": "507f1f77bcf86cd799439011",
      "planType": "monthly",
      "startDate": "2024-01-15T10:00:00Z",
      "endDate": "2024-02-15T10:00:00Z",
      "status": "active",
      "price": 50
    }
  ]
}
```

### POST /api/memberships

Crear membresía (solo admin).

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "planType": "monthly",
  "startDate": "2024-01-15T10:00:00Z",
  "endDate": "2024-02-15T10:00:00Z",
  "price": 50
}
```

### PUT /api/memberships/:id/renew

Renovar membresía.

**Request Body:**
```json
{
  "months": 1
}
```

### GET /api/memberships/expiring

Obtener membresías por expirar (solo admin).

**Query Parameters:**
- `days`: Días antes de expirar (default: 7)

---

## Endpoints de Pagos

### GET /api/payments

Listar pagos.

**Query Parameters:**
- `userId`: Filtrar por usuario
- `startDate`: Fecha inicio
- `endDate`: Fecha fin

**Response 200:**
```json
{
  "payments": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "userId": "507f1f77bcf86cd799439011",
      "membershipId": "507f1f77bcf86cd799439020",
      "amount": 50,
      "paymentMethod": "card",
      "status": "completed",
      "paidAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### POST /api/payments

Registrar pago.

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "membershipId": "507f1f77bcf86cd799439020",
  "amount": 50,
  "paymentMethod": "card"
}
```

### GET /api/payments/receipt/:id

Generar recibo PDF.

**Response:** PDF file

### GET /api/payments/stats

Estadísticas de pagos (solo admin).

**Query Parameters:**
- `period`: monthly, quarterly, annual

**Response 200:**
```json
{
  "totalRevenue": 5000,
  "monthlyRevenue": 1500,
  "paymentMethods": {
    "card": 60,
    "cash": 30,
    "transfer": 10
  }
}
```

---

## Endpoints de Productos

### GET /api/products

Listar productos (público).

**Query Parameters:**
- `category`: Filtrar por categoría
- `search`: Búsqueda por nombre

**Response 200:**
```json
{
  "products": [
    {
      "_id": "507f1f77bcf86cd799439040",
      "name": "Proteína Whey",
      "description": "Proteína de suero de leche",
      "price": 45.99,
      "category": "protein",
      "stock": 50,
      "imageUrl": "https://energymstorage.blob.core.windows.net/products/protein.jpg"
    }
  ]
}
```

### POST /api/products

Crear producto (solo admin).

**Request Body:**
```json
{
  "name": "Proteína Whey",
  "description": "Proteína de suero de leche",
  "price": 45.99,
  "category": "protein",
  "stock": 50
}
```

### POST /api/products/:id/upload

Subir imagen de producto (solo admin).

**Request:** multipart/form-data
- `image`: Archivo de imagen

---

## Endpoints de Dashboard Admin

### GET /api/admin/stats

Métricas generales del dashboard.

**Response 200:**
```json
{
  "activeClients": 85,
  "totalRevenue": 5000,
  "expiringMemberships": 12,
  "productSales": 45,
  "monthlyGrowth": 15.5
}
```

### GET /api/admin/revenue

Ingresos por período.

**Query Parameters:**
- `period`: monthly, quarterly, annual
- `startDate`: Fecha inicio
- `endDate`: Fecha fin

**Response 200:**
```json
{
  "revenue": [
    {
      "month": "2024-01",
      "amount": 1500
    },
    {
      "month": "2024-02",
      "amount": 1800
    }
  ]
}
```

---

## Códigos de Error

- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (token inválido o faltante)
- `403` - Forbidden (sin permisos)
- `404` - Not Found (recurso no encontrado)
- `500` - Internal Server Error (error del servidor)

---

## Ejemplos de Uso

### Ejemplo: Login y obtener datos del usuario

```javascript
// Login
const loginResponse = await fetch('https://energym-app.azurewebsites.net/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'cliente@example.com',
    password: 'password123'
  })
});

const { token, user } = await loginResponse.json();

// Obtener información del usuario
const meResponse = await fetch('https://energym-app.azurewebsites.net/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const userData = await meResponse.json();
```

### Ejemplo: Crear cliente (admin)

```javascript
const response = await fetch('https://energym-app.azurewebsites.net/api/clients', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    email: 'nuevo@example.com',
    password: 'password123',
    name: 'Nuevo Cliente',
    phone: '+1234567890'
  })
});
```

