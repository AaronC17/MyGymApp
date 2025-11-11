# 🚀 Guía de Inicio Rápido - Energym

## Instalación Local

### 1. Clonar o descargar el proyecto

```bash
cd mygymapp
```

### 2. Instalar dependencias del Backend

```bash
cd backend
npm install
```

### 3. Configurar variables de entorno del Backend

Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=tu-secret-key-super-seguro-aqui
JWT_EXPIRES_IN=24h

# Cosmos DB (MongoDB API)
# Para desarrollo local, puedes usar MongoDB local o una instancia de Cosmos DB
COSMOS_DB_CONNECTION_STRING=mongodb://localhost:27017/energym-db

# Azure Blob Storage (opcional para desarrollo)
AZURE_STORAGE_CONNECTION_STRING=tu-connection-string
AZURE_STORAGE_CONTAINER_PRODUCTS=products
AZURE_STORAGE_CONTAINER_AVATARS=avatars

# Azure Communication Services (opcional para desarrollo)
AZURE_COMMUNICATION_CONNECTION_STRING=tu-connection-string
AZURE_COMMUNICATION_EMAIL_FROM=DoNotReply@energym.com

# Frontend URL
FRONTEND_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3001
```

### 4. Iniciar el Backend

```bash
npm run dev
```

El backend estará disponible en `http://localhost:3000`

### 5. Instalar dependencias del Frontend

En una nueva terminal:

```bash
cd frontend
npm install
```

### 6. Configurar variables de entorno del Frontend

Crea un archivo `.env.local` en la carpeta `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 7. Iniciar el Frontend

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3001`

## Crear Usuario Administrador

Para crear el primer usuario administrador, puedes usar el siguiente script o hacerlo directamente en la base de datos:

```javascript
// Script para crear admin (ejecutar en MongoDB shell o crear un script Node.js)
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync('admin123', salt);

db.users.insertOne({
  email: 'admin@energym.com',
  password: hashedPassword,
  role: 'admin',
  name: 'Administrador',
  createdAt: new Date(),
  updatedAt: new Date()
});
```

O crear un script en `backend/scripts/createAdmin.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.COSMOS_DB_CONNECTION_STRING);
    
    const admin = new User({
      email: 'admin@energym.com',
      password: 'admin123', // Se hasheará automáticamente
      role: 'admin',
      name: 'Administrador',
    });
    
    await admin.save();
    console.log('✅ Administrador creado exitosamente');
    console.log('Email: admin@energym.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
```

Ejecutar con: `node backend/scripts/createAdmin.js`

## Estructura de URLs

### Páginas Públicas
- `/` - Página principal
- `/planes` - Catálogo de planes
- `/tienda` - Tienda de productos
- `/contacto` - Formulario de contacto
- `/login` - Iniciar sesión
- `/register` - Registro de cliente

### Área de Cliente
- `/dashboard` - Dashboard del cliente
- `/perfil` - Editar perfil
- `/recibos` - Ver recibos

### Panel Administrativo
- `/admin/dashboard` - Dashboard admin
- `/admin/clientes` - Gestión de clientes
- `/admin/planes` - Gestión de planes
- `/admin/pagos` - Gestión de pagos
- `/admin/inventario` - Gestión de productos
- `/admin/reportes` - Reportes y estadísticas

## API Endpoints

La API está disponible en `http://localhost:3000/api`

### Endpoints principales:
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Usuario actual
- `GET /api/clients` - Listar clientes (admin)
- `GET /api/memberships` - Listar membresías
- `GET /api/products` - Listar productos
- `GET /api/admin/stats` - Estadísticas (admin)

Ver documentación completa en `docs/API.md`

## Solución de Problemas

### Error: Cannot find module
- Asegúrate de haber ejecutado `npm install` en ambas carpetas (backend y frontend)

### Error: MongoDB connection failed
- Verifica que MongoDB esté corriendo (si usas local)
- Verifica la connection string en `.env`

### Error: Port already in use
- Cambia el puerto en el archivo `.env` o detén el proceso que está usando el puerto

### Error: JWT_SECRET not defined
- Asegúrate de tener todas las variables de entorno configuradas en `.env`

## Próximos Pasos

1. ✅ Configurar base de datos (MongoDB local o Cosmos DB)
2. ✅ Crear usuario administrador
3. ✅ Probar login y registro
4. ✅ Configurar Azure Storage (opcional para desarrollo)
5. ✅ Configurar Azure Communication Services (opcional)
6. ✅ Revisar documentación completa en `ARCHITECTURE.md`
7. ✅ Preparar para despliegue en Azure (ver `docs/DEPLOYMENT.md`)

## Desarrollo

### Backend
- Usa `npm run dev` para desarrollo con hot-reload (nodemon)
- Los logs aparecerán en la consola

### Frontend
- Usa `npm run dev` para desarrollo con hot-reload
- Los cambios se reflejan automáticamente

## Testing

Para ejecutar tests (cuando estén implementados):

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

¡Listo para comenzar! 🎉

