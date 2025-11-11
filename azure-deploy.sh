#!/bin/bash

# Script de despliegue para Azure App Service
# Uso: ./azure-deploy.sh

echo "🚀 Iniciando despliegue de Energym en Azure..."

# Variables
RESOURCE_GROUP="energym-rg"
APP_NAME="energym-app"
LOCATION="eastus"

# Verificar si Azure CLI está instalado
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI no está instalado. Por favor instálalo primero."
    exit 1
fi

# Verificar login
echo "📋 Verificando login en Azure..."
az account show &> /dev/null
if [ $? -ne 0 ]; then
    echo "🔐 Por favor inicia sesión en Azure..."
    az login
fi

# Crear Resource Group
echo "📦 Creando Resource Group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Crear App Service Plan
echo "📋 Creando App Service Plan..."
az appservice plan create \
  --name energym-plan \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux

# Crear Web App
echo "🌐 Creando Web App..."
az webapp create \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --plan energym-plan \
  --runtime "NODE:22-lts"

# Configurar variables de entorno (ejemplo - ajustar según necesidad)
echo "⚙️ Configurando variables de entorno..."
echo "⚠️  IMPORTANTE: Debes configurar manualmente las siguientes variables:"
echo "   - JWT_SECRET"
echo "   - COSMOS_DB_CONNECTION_STRING"
echo "   - AZURE_STORAGE_CONNECTION_STRING"
echo "   - AZURE_COMMUNICATION_CONNECTION_STRING"
echo ""
echo "Usa: az webapp config appsettings set --name $APP_NAME --resource-group $RESOURCE_GROUP --settings KEY=VALUE"

# Configurar startup command
echo "🔧 Configurando startup command..."
az webapp config set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --startup-file "npm start"

echo "✅ Despliegue completado!"
echo "🌐 URL: https://$APP_NAME.azurewebsites.net"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Configurar variables de entorno"
echo "   2. Conectar repositorio Git o desplegar código"
echo "   3. Verificar que la aplicación esté funcionando"

