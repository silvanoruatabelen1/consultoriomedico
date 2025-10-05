# Notas de Deploy - Portal Médico Dra. María Isabel Ruata

## Configuración de Entornos

### Desarrollo Local
```bash
# Instalación de dependencias
npm install

# Configuración de variables de entorno
cp .env.example .env.local
# Editar .env.local con valores de desarrollo

# Ejecutar en modo desarrollo
npm run dev
```

### Staging
```bash
# Build para staging
npm run build

# Deploy a staging
npm run deploy:staging
```

### Producción
```bash
# Build para producción
npm run build

# Deploy a producción
npm run deploy:production
```

## Variables de Entorno

### Desarrollo
```env
# Supabase
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
APP_BASE_URL=http://localhost:3000
NODE_ENV=development

# Security
TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key

# Rate Limiting
RATE_LIMIT_MAX_ATTEMPTS=5
RATE_LIMIT_WINDOW_MS=900000

# Code Expiration
CODE_EXPIRATION_HOURS=24

# File Upload
MAX_FILE_SIZE_MB=50
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,zip

# DICOM
DICOM_SERVER_URL=https://orthanc.example.com
DICOM_USER=orthanc
DICOM_PASSWORD=orthanc
NEXT_PUBLIC_DICOMWEB_WADO_URI_ROOT=https://orthanc.example.com/wado
NEXT_PUBLIC_DICOMWEB_QIDO_ROOT=https://orthanc.example.com/qido
NEXT_PUBLIC_DICOMWEB_WADO_ROOT=https://orthanc.example.com/wado
DICOMWEB_TOKEN=your_dicomweb_token
```

### Producción
```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# App
APP_BASE_URL=https://consultorio-dra-ruata.com
NODE_ENV=production

# Security
TURNSTILE_SITE_KEY=your_production_turnstile_site_key
TURNSTILE_SECRET_KEY=your_production_turnstile_secret_key

# Rate Limiting
RATE_LIMIT_MAX_ATTEMPTS=5
RATE_LIMIT_WINDOW_MS=900000

# Code Expiration
CODE_EXPIRATION_HOURS=24

# File Upload
MAX_FILE_SIZE_MB=50
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,zip

# DICOM
DICOM_SERVER_URL=https://orthanc.production.com
DICOM_USER=orthanc_prod
DICOM_PASSWORD=secure_production_password
NEXT_PUBLIC_DICOMWEB_WADO_URI_ROOT=https://orthanc.production.com/wado
NEXT_PUBLIC_DICOMWEB_QIDO_ROOT=https://orthanc.production.com/qido
NEXT_PUBLIC_DICOMWEB_WADO_ROOT=https://orthanc.production.com/wado
DICOMWEB_TOKEN=your_production_dicomweb_token
```

## Configuración de Supabase

### 1. Crear Proyecto
```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar proyecto
supabase init

# Login
supabase login

# Crear proyecto
supabase projects create consultorio-dra-ruata
```

### 2. Configurar Base de Datos
```bash
# Aplicar migraciones
supabase db push

# Configurar RLS
supabase db push --include-all

# Configurar Storage
supabase storage create medical-files
```

### 3. Configurar Autenticación
```bash
# Configurar providers
supabase auth providers update

# Configurar políticas
supabase db push --include-all
```

## Configuración de Deploy

### Netlify
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://*.cloudflare.com;"
```

### Cloudflare Pages
```toml
# wrangler.toml
name = "consultorio-dra-ruata"
compatibility_date = "2024-01-01"

[env.production]
vars = { NODE_ENV = "production" }

[env.staging]
vars = { NODE_ENV = "staging" }
```

## Configuración de CI/CD

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Build
        run: npm run build
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: '.next'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Configuración de Seguridad

### 1. Headers de Seguridad
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

### 2. Configuración de CORS
```javascript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  response.headers.set('Access-Control-Allow-Origin', 'https://consultorio-dra-ruata.com')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  return response
}
```

## Monitoreo y Logs

### 1. Configuración de Logs
```javascript
// lib/logger.ts
import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
})

export default logger
```

### 2. Métricas de Performance
```javascript
// lib/metrics.ts
export const metrics = {
  pageLoad: (page: string, loadTime: number) => {
    // Enviar métricas a servicio de monitoreo
  },
  apiResponse: (endpoint: string, responseTime: number) => {
    // Enviar métricas de API
  },
  error: (error: Error, context: string) => {
    // Enviar métricas de errores
  }
}
```

## Backup y Recuperación

### 1. Backup de Base de Datos
```bash
# Backup automático diario
pg_dump -h db.supabase.co -U postgres -d postgres > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql -h db.supabase.co -U postgres -d postgres < backup_20240101.sql
```

### 2. Backup de Archivos
```bash
# Backup de archivos de Supabase Storage
supabase storage download medical-files --local ./backup/files

# Restaurar archivos
supabase storage upload medical-files ./backup/files
```

## Troubleshooting

### 1. Problemas Comunes
- **Error de conexión a Supabase**: Verificar variables de entorno
- **Error de autenticación**: Verificar configuración de RLS
- **Error de upload**: Verificar límites de tamaño de archivo
- **Error de DICOM**: Verificar configuración del servidor DICOM

### 2. Logs de Debug
```bash
# Habilitar logs detallados
DEBUG=* npm run dev

# Logs de Supabase
SUPABASE_DEBUG=true npm run dev

# Logs de Next.js
NEXT_DEBUG=true npm run dev
```

### 3. Comandos de Diagnóstico
```bash
# Verificar conexión a Supabase
npm run test:supabase

# Verificar configuración de seguridad
npm run test:security

# Verificar performance
npm run test:performance
```

## Checklist de Deploy

### Pre-Deploy
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Tests pasando
- [ ] Build exitoso
- [ ] Configuración de seguridad verificada

### Deploy
- [ ] Deploy a staging exitoso
- [ ] Tests de integración pasando
- [ ] Deploy a producción exitoso
- [ ] Verificación de funcionalidad
- [ ] Monitoreo activado

### Post-Deploy
- [ ] Verificación de métricas
- [ ] Verificación de logs
- [ ] Verificación de backup
- [ ] Documentación actualizada
- [ ] Equipo notificado

## Contacto de Soporte

### Emergencias
- **Email**: soporte@consultorio-dra-ruata.com
- **Teléfono**: +54 11 1234-5678
- **Horario**: 24/7 para emergencias

### Soporte Técnico
- **Email**: tecnico@consultorio-dra-ruata.com
- **Teléfono**: +54 11 1234-5679
- **Horario**: Lunes a Viernes 9:00-18:00

### Documentación
- **Wiki**: https://wiki.consultorio-dra-ruata.com
- **API Docs**: https://api.consultorio-dra-ruata.com/docs
- **Status Page**: https://status.consultorio-dra-ruata.com
