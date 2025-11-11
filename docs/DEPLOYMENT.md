# 🚀 Guía de Despliegue - Energym en Azure

## Requisitos Previos

- Cuenta de Azure activa
- Azure CLI instalado
- Node.js 22 LTS instalado
- Git configurado

## Paso 1: Crear Recursos en Azure

### 1.1 Crear Resource Group

```bash
az group create --name energym-rg --location eastus
```

### 1.2 Crear App Service Plan

```bash
az appservice plan create \
  --name energym-plan \
  --resource-group energym-rg \
  --sku B1 \
  --is-linux
```

### 1.3 Crear App Service

```bash
az webapp create \
  --name energym-app \
  --resource-group energym-rg \
  --plan energym-plan \
  --runtime "NODE:22-lts"
```

### 1.4 Crear Cosmos DB

```bash
az cosmosdb create \
  --name energym-cosmos \
  --resource-group energym-rg \
  --default-consistency-level Session \
  --locations regionName=eastus

az cosmosdb mongodb database create \
  --account-name energym-cosmos \
  --resource-group energym-rg \
  --name energym-db
```

### 1.5 Crear Storage Account

```bash
az storage account create \
  --name energymstorage \
  --resource-group energym-rg \
  --location eastus \
  --sku Standard_LRS
```

### 1.6 Crear Communication Services

```bash
az communication create \
  --name energym-comm \
  --resource-group energym-rg \
  --location global \
  --data-location UnitedStates
```

## Paso 2: Obtener Connection Strings

### 2.1 Cosmos DB Connection String

```bash
az cosmosdb keys list \
  --name energym-cosmos \
  --resource-group energym-rg \
  --type connection-strings
```

### 2.2 Storage Account Connection String

```bash
az storage account show-connection-string \
  --name energymstorage \
  --resource-group energym-rg
```

## Paso 3: Configurar Variables de Entorno en App Service

```bash
# JWT Secret
az webapp config appsettings set \
  --name energym-app \
  --resource-group energym-rg \
  --settings JWT_SECRET="tu-secret-super-seguro-aqui"

# Cosmos DB
az webapp config appsettings set \
  --name energym-app \
  --resource-group energym-rg \
  --settings COSMOS_DB_CONNECTION_STRING="tu-connection-string"

# Storage
az webapp config appsettings set \
  --name energym-app \
  --resource-group energym-rg \
  --settings AZURE_STORAGE_CONNECTION_STRING="tu-storage-connection-string"

# Communication Services
az webapp config appsettings set \
  --name energym-app \
  --resource-group energym-rg \
  --settings AZURE_COMMUNICATION_CONNECTION_STRING="tu-comm-connection-string"

# Frontend URL
az webapp config appsettings set \
  --name energym-app \
  --resource-group energym-rg \
  --settings FRONTEND_URL="https://energym-app.azurewebsites.net"
```

## Paso 4: Configurar Deployment

### 4.1 Opción A: Deploy desde Git

```bash
az webapp deployment source config \
  --name energym-app \
  --resource-group energym-rg \
  --repo-url https://github.com/tu-usuario/energym.git \
  --branch main \
  --manual-integration
```

### 4.2 Opción B: Deploy desde ZIP

```bash
# En el directorio del proyecto
cd backend
npm install --production
cd ../frontend
npm install
npm run build
cd ..

# Crear ZIP
zip -r deploy.zip . -x "node_modules/*" ".git/*"

# Deploy
az webapp deployment source config-zip \
  --resource-group energym-rg \
  --name energym-app \
  --src deploy.zip
```

## Paso 5: Configurar Startup Command

```bash
az webapp config set \
  --name energym-app \
  --resource-group energym-rg \
  --startup-file "npm start"
```

## Paso 6: Verificar Despliegue

1. Visitar `https://energym-app.azurewebsites.net`
2. Verificar logs en Azure Portal
3. Probar endpoints de API

## Configuración de Dominio Personalizado (Opcional)

```bash
az webapp config hostname add \
  --webapp-name energym-app \
  --resource-group energym-rg \
  --hostname www.tudominio.com
```

## Monitoreo y Logs

### Ver logs en tiempo real

```bash
az webapp log tail \
  --name energym-app \
  --resource-group energym-rg
```

### Habilitar Application Insights (Recomendado)

```bash
az monitor app-insights component create \
  --app energym-insights \
  --location eastus \
  --resource-group energym-rg

az webapp config appsettings set \
  --name energym-app \
  --resource-group energym-rg \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY="tu-instrumentation-key"
```

## Troubleshooting

### Verificar configuración

```bash
az webapp config appsettings list \
  --name energym-app \
  --resource-group energym-rg
```

### Reiniciar App Service

```bash
az webapp restart \
  --name energym-app \
  --resource-group energym-rg
```

### Ver métricas

```bash
az monitor metrics list \
  --resource /subscriptions/{subscription-id}/resourceGroups/energym-rg/providers/Microsoft.Web/sites/energym-app \
  --metric "HttpServerErrors,Http2xx"
```

