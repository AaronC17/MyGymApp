# Script de despliegue para Azure App Service (PowerShell)
# Uso: .\azure-deploy.ps1

Write-Host "🚀 Iniciando despliegue de Energym en Azure..." -ForegroundColor Cyan

# Variables
$resourceGroup = "energym-rg"
$appName = "energym-app"
$location = "eastus"

# Verificar si Azure CLI está instalado
try {
    az --version | Out-Null
} catch {
    Write-Host "❌ Azure CLI no está instalado. Por favor instálalo primero." -ForegroundColor Red
    exit 1
}

# Verificar login
Write-Host "📋 Verificando login en Azure..." -ForegroundColor Yellow
$account = az account show 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔐 Por favor inicia sesión en Azure..." -ForegroundColor Yellow
    az login
}

# Crear Resource Group
Write-Host "📦 Creando Resource Group..." -ForegroundColor Yellow
az group create --name $resourceGroup --location $location

# Crear App Service Plan
Write-Host "📋 Creando App Service Plan..." -ForegroundColor Yellow
az appservice plan create `
  --name energym-plan `
  --resource-group $resourceGroup `
  --sku B1 `
  --is-linux

# Crear Web App
Write-Host "🌐 Creando Web App..." -ForegroundColor Yellow
az webapp create `
  --name $appName `
  --resource-group $resourceGroup `
  --plan energym-plan `
  --runtime "NODE:22-lts"

# Configurar startup command
Write-Host "🔧 Configurando startup command..." -ForegroundColor Yellow
az webapp config set `
  --name $appName `
  --resource-group $resourceGroup `
  --startup-file "npm start"

Write-Host "✅ Despliegue completado!" -ForegroundColor Green
Write-Host "🌐 URL: https://$appName.azurewebsites.net" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Configurar variables de entorno" -ForegroundColor White
Write-Host "   2. Conectar repositorio Git o desplegar código" -ForegroundColor White
Write-Host "   3. Verificar que la aplicación esté funcionando" -ForegroundColor White

