# 🏋️ Energym - Arquitectura y Planificación del Proyecto

## 📘 Resumen del Proyecto

**Energym** es una plataforma web completa para la administración de un gimnasio, diseñada para gestionar 100 clientes activos y 4 administradores. La aplicación está construida con tecnologías modernas y se despliega en Azure App Service.

### Características Principales

- **Página pública**: Visualización de planes, suscripciones y productos
- **Área de cliente**: Gestión personal de membresías y perfil
- **Panel administrativo**: Dashboard completo con métricas, gestión de clientes, pagos e inventario
- **Notificaciones automáticas**: Alertas por correo para membresías próximas a expirar
- **Almacenamiento en la nube**: Azure Blob Storage para imágenes

---

## 🧩 Estructura de Carpetas Recomendada

```
energym/
├── frontend/                    # Aplicación Next.js
│   ├── src/
│   │   ├── app/                # App Router de Next.js
│   │   │   ├── (public)/       # Rutas públicas
│   │   │   │   ├── page.tsx    # Página principal
│   │   │   │   ├── planes/
│   │   │   │   ├── tienda/
│   │   │   │   └── contacto/
│   │   │   ├── (auth)/         # Rutas de autenticación
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (client)/       # Área de cliente
│   │   │   │   ├── dashboard/
│   │   │   │   ├── perfil/
│   │   │   │   └── recibos/
│   │   │   └── (admin)/        # Panel administrativo
│   │   │       ├── dashboard/
│   │   │       ├── clientes/
│   │   │       ├── planes/
│   │   │       ├── pagos/
│   │   │       ├── inventario/
│   │   │       └── reportes/
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── ui/             # Componentes base (botones, cards, etc.)
│   │   │   ├── layout/         # Layouts y headers
│   │   │   └── charts/         # Componentes de gráficos
│   │   ├── lib/                # Utilidades y helpers
│   │   │   ├── api.ts          # Cliente API
│   │   │   ├── auth.ts         # Utilidades de autenticación
│   │   │   └── utils.ts        # Funciones auxiliares
│   │   ├── hooks/              # Custom React hooks
│   │   ├── types/              # TypeScript types
│   │   └── styles/             # Estilos globales
│   ├── public/                 # Archivos estáticos
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                     # API Express.js
│   ├── src/
│   │   ├── config/             # Configuraciones
│   │   │   ├── database.js     # Conexión Cosmos DB
│   │   │   ├── azure.js        # Config Azure Storage/Communication
│   │   │   └── jwt.js          # Config JWT
│   │   ├── models/             # Modelos de datos
│   │   │   ├── User.js
│   │   │   ├── Membership.js
│   │   │   ├── Payment.js
│   │   │   └── Product.js
│   │   ├── routes/             # Rutas de la API
│   │   │   ├── auth.js
│   │   │   ├── clients.js
│   │   │   ├── memberships.js
│   │   │   ├── payments.js
│   │   │   ├── products.js
│   │   │   └── admin.js
│   │   ├── middleware/         # Middlewares
│   │   │   ├── auth.js         # Verificación JWT
│   │   │   └── roles.js        # Control de roles
│   │   ├── services/           # Lógica de negocio
│   │   │   ├── emailService.js # Azure Communication Services
│   │   │   ├── storageService.js # Azure Blob Storage
│   │   │   └── membershipService.js # Lógica de membresías
│   │   ├── utils/              # Utilidades
│   │   │   └── validators.js
│   │   └── server.js           # Punto de entrada
│   ├── package.json
│   └── .env.example
│
├── docs/                        # Documentación adicional
│   ├── API.md                   # Documentación de API
│   └── DEPLOYMENT.md            # Guía de despliegue
│
├── .gitignore
├── README.md
└── ARCHITECTURE.md              # Este archivo
```

---

## ⚙️ Componentes y Endpoints Principales

### Backend API (Express.js)

#### Autenticación
- `POST /api/auth/login` - Login de usuarios (cliente/admin)
- `POST /api/auth/register` - Registro de clientes
- `POST /api/auth/refresh` - Renovar token JWT
- `GET /api/auth/me` - Obtener usuario actual

#### Clientes
- `GET /api/clients` - Listar clientes (admin)
- `GET /api/clients/:id` - Obtener cliente específico
- `POST /api/clients` - Crear cliente (admin)
- `PUT /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente (admin)
- `GET /api/clients/search?q=` - Buscar clientes

#### Membresías
- `GET /api/memberships` - Listar membresías
- `GET /api/memberships/:id` - Obtener membresía
- `POST /api/memberships` - Crear membresía (admin)
- `PUT /api/memberships/:id` - Actualizar membresía
- `GET /api/memberships/expiring` - Membresías por expirar
- `PUT /api/memberships/:id/renew` - Renovar membresía

#### Pagos
- `GET /api/payments` - Listar pagos
- `GET /api/payments/:id` - Obtener pago
- `POST /api/payments` - Registrar pago
- `GET /api/payments/receipt/:id` - Generar recibo PDF
- `GET /api/payments/stats` - Estadísticas de pagos (admin)

#### Productos
- `GET /api/products` - Listar productos (público)
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)
- `POST /api/products/:id/upload` - Subir imagen (admin)

#### Dashboard Admin
- `GET /api/admin/stats` - Métricas generales
- `GET /api/admin/revenue` - Ingresos por período
- `GET /api/admin/memberships-stats` - Estadísticas de membresías

### Frontend (Next.js)

#### Páginas Públicas
- `/` - Página principal (inicio, servicios, planes destacados)
- `/planes` - Catálogo de planes de membresía
- `/tienda` - Tienda de productos
- `/contacto` - Formulario de contacto

#### Autenticación
- `/login` - Login (cliente/admin)
- `/register` - Registro de cliente

#### Área de Cliente
- `/dashboard` - Dashboard del cliente
- `/perfil` - Editar perfil personal
- `/recibos` - Ver y descargar recibos

#### Panel Administrativo
- `/admin/dashboard` - Dashboard con métricas
- `/admin/clientes` - Gestión de clientes
- `/admin/planes` - Gestión de planes
- `/admin/pagos` - Gestión de pagos
- `/admin/inventario` - Gestión de productos
- `/admin/reportes` - Reportes y estadísticas

---

## 🌐 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        Azure Cloud                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Azure App Service (Linux, Node 22)         │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │         Next.js Frontend (SSR/SSG)             │  │  │
│  │  │  - Páginas públicas                             │  │  │
│  │  │  - Panel cliente                                │  │  │
│  │  │  - Panel admin                                  │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │         Express.js Backend API                  │  │  │
│  │  │  - Autenticación JWT                            │  │  │
│  │  │  - REST API endpoints                           │  │  │
│  │  │  - Middleware de autorización                   │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Azure Cosmos DB (MongoDB API)                 │  │
│  │  Collections:                                         │  │
│  │  - users (clientes y admins)                          │  │
│  │  - memberships (membresías activas)                   │  │
│  │  - payments (historial de pagos)                      │  │
│  │  - products (inventario)                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Azure Blob Storage                            │  │
│  │  - Imágenes de productos                              │  │
│  │  - Avatares de usuarios                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │    Azure Communication Services                       │  │
│  │  - Envío de correos (notificaciones)                  │  │
│  │  - Alertas de membresías por expirar                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

                    ↓ HTTPS ↓

┌─────────────────────────────────────────────────────────────┐
│                    Clientes y Administradores                │
│  - Navegadores web (Chrome, Firefox, Safari, Edge)          │
│  - Dispositivos: Desktop, Tablet, Mobile                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Diagrama de Flujo de Usuarios

### Flujo Cliente

```
Usuario Anónimo
    │
    ├─→ Página Principal (/)
    │   ├─→ Ver Planes (/planes)
    │   ├─→ Ver Tienda (/tienda)
    │   └─→ Contacto (/contacto)
    │
    └─→ Login (/login)
        │
        ├─→ Autenticación JWT
        │
        └─→ Dashboard Cliente (/dashboard)
            ├─→ Ver Estado Membresía
            ├─→ Ver Recibos (/recibos)
            └─→ Editar Perfil (/perfil)
```

### Flujo Administrador

```
Administrador
    │
    └─→ Login (/login) [rol: admin]
        │
        ├─→ Autenticación JWT + Verificación de Rol
        │
        └─→ Dashboard Admin (/admin/dashboard)
            │
            ├─→ Gestión Clientes (/admin/clientes)
            │   ├─→ Crear Cliente
            │   ├─→ Editar Cliente
            │   ├─→ Eliminar Cliente
            │   └─→ Buscar Cliente
            │
            ├─→ Gestión Planes (/admin/planes)
            │   ├─→ Crear Plan
            │   ├─→ Editar Plan
            │   └─→ Eliminar Plan
            │
            ├─→ Gestión Pagos (/admin/pagos)
            │   ├─→ Registrar Pago
            │   ├─→ Ver Historial
            │   └─→ Generar Reportes
            │
            ├─→ Inventario (/admin/inventario)
            │   ├─→ Agregar Producto
            │   ├─→ Editar Producto
            │   ├─→ Subir Imagen
            │   └─→ Eliminar Producto
            │
            └─→ Reportes (/admin/reportes)
                ├─→ Ingresos Mensuales
                ├─→ Membresías Activas
                └─→ Gráficos Estadísticos
```

---

## 🗄️ Modelo de Datos (Cosmos DB)

### Collection: `users`
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed),
  role: String ("client" | "admin"),
  name: String,
  phone: String,
  avatar: String (URL Blob Storage),
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: `memberships`
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  planType: String ("monthly" | "quarterly" | "annual" | "premium"),
  startDate: Date,
  endDate: Date,
  status: String ("active" | "suspended" | "expired"),
  price: Number,
  autoRenew: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: `payments`
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  membershipId: ObjectId (ref: memberships),
  amount: Number,
  paymentMethod: String ("cash" | "card" | "transfer"),
  status: String ("completed" | "pending" | "failed"),
  receiptUrl: String,
  paidAt: Date,
  createdAt: Date
}
```

### Collection: `products`
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String ("protein" | "accessories" | "clothing"),
  stock: Number,
  imageUrl: String (URL Blob Storage),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Pasos de Despliegue en Azure

### Fase 1: Preparación del Entorno

1. **Crear recursos en Azure Portal**
   - Azure App Service (Linux, Node 22 LTS)
   - Azure Cosmos DB (MongoDB API)
   - Azure Blob Storage
   - Azure Communication Services

2. **Configurar variables de entorno**
   - Obtener connection strings
   - Configurar JWT secret
   - Configurar Azure credentials

### Fase 2: Configuración de Base de Datos

1. **Conectar a Cosmos DB**
   - Crear database: `energym-db`
   - Crear collections: `users`, `memberships`, `payments`, `products`
   - Configurar índices necesarios

2. **Inicializar datos**
   - Crear usuarios administradores iniciales
   - Crear planes de membresía base

### Fase 3: Despliegue del Backend

1. **Configurar App Service**
   - Establecer Node.js version (22 LTS)
   - Configurar variables de entorno
   - Habilitar CORS

2. **Desplegar código**
   - Conectar repositorio Git
   - Configurar CI/CD (opcional)
   - Deploy manual o automático

### Fase 4: Despliegue del Frontend

1. **Build de producción**
   - `npm run build` en frontend
   - Generar archivos estáticos optimizados

2. **Configurar Next.js en App Service**
   - Configurar `next.config.js` para producción
   - Establecer variables de entorno del frontend

### Fase 5: Configuración de Servicios Adicionales

1. **Azure Blob Storage**
   - Crear containers: `products`, `avatars`
   - Configurar permisos de acceso

2. **Azure Communication Services**
   - Configurar email service
   - Probar envío de notificaciones

### Fase 6: Testing y Validación

1. **Pruebas funcionales**
   - Autenticación
   - CRUD de entidades
   - Generación de reportes

2. **Pruebas de rendimiento**
   - Carga de página
   - Tiempo de respuesta API

---

## 📦 Dependencias Principales

### Backend
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "@azure/storage-blob": "^12.17.0",
  "@azure/communication-email": "^1.0.0",
  "express-validator": "^7.0.1",
  "pdfkit": "^0.13.0"
}
```

### Frontend
```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "tailwindcss": "^3.3.0",
  "axios": "^1.6.0",
  "recharts": "^2.10.0",
  "react-hook-form": "^7.48.0",
  "zustand": "^4.4.0",
  "date-fns": "^2.30.0"
}
```

---

## 🔐 Seguridad

- **JWT Tokens**: Tokens con expiración de 24 horas
- **Password Hashing**: bcrypt con salt rounds 10
- **CORS**: Configurado para dominios específicos
- **Rate Limiting**: Implementado en endpoints críticos
- **Input Validation**: Validación en backend y frontend
- **Role-Based Access Control**: Middleware de verificación de roles

---

## 📊 Funciones Automáticas

1. **Verificación de Membresías**
   - Job diario que verifica membresías expiradas
   - Actualiza estado automáticamente

2. **Notificaciones de Expiración**
   - Envío de email 7 días antes de expirar
   - Envío de email 1 día antes de expirar

3. **Cálculo de Métricas**
   - Ingresos mensuales calculados en tiempo real
   - Estadísticas de membresías actualizadas automáticamente

---

## 🎨 Diseño Frontend

- **Framework**: Next.js 14 con App Router
- **Estilos**: TailwindCSS con diseño moderno y responsive
- **Componentes**: Componentes reutilizables y accesibles
- **Tema**: Colores profesionales (azul/verde para energía y salud)
- **Responsive**: Mobile-first approach

---

## 📝 Próximos Pasos

1. Crear estructura de carpetas
2. Configurar dependencias
3. Implementar modelos de datos
4. Desarrollar API endpoints
5. Crear componentes frontend
6. Integrar servicios de Azure
7. Testing
8. Despliegue en Azure

---

**Versión**: 1.0.0  
**Última actualización**: 2024

