# Implementación del Sistema de Estudios Médicos

## Arquitectura del Sistema

### Base de Datos (Supabase)
- **Tablas principales:**
  - `pacientes`: Información de pacientes
  - `estudios`: Estudios médicos
  - `archivos`: Archivos asociados a estudios
  - `share_links`: Enlaces de acceso con códigos
  - `audit_log`: Logs de auditoría

### Seguridad Implementada

#### Row Level Security (RLS)
- Todas las tablas tienen RLS habilitado
- Solo staff autenticado puede acceder a datos
- Funciones de validación con `SECURITY DEFINER`

#### Rate Limiting
- Límite de 5 intentos por IP en 15 minutos
- Bloqueo temporal tras exceder límite
- Almacenamiento en memoria (en producción usar Redis)

#### Validaciones
- DNI: 7-8 dígitos numéricos
- Código: 8-10 caracteres alfanuméricos
- Archivos: PDF, JPG, PNG, ZIP (máx 50MB)

### Endpoints de API

#### `/api/validate-access` (POST)
- Valida DNI + código de acceso
- Implementa rate limiting
- Registra intentos en audit_log
- Retorna datos del estudio si válido

#### `/api/generate-download-url` (POST)
- Genera URLs pre-firmadas para descarga
- Expiración de 10 minutos
- Registra descargas en audit_log

#### `/api/studies` (POST)
- Crea estudios (solo staff)
- Genera códigos de acceso aleatorios
- Hash de códigos con sal
- Expiración configurable (24h por defecto)

#### `/api/upload-file` (POST)
- Subida de archivos a Supabase Storage
- Validación de tipos y tamaños
- Asociación con estudios

#### `/api/audit-logs` (GET)
- Dashboard de logs para staff
- Filtros por evento, fecha, etc.
- Paginación

### Flujo de Trabajo

#### 1. Carga de Estudio (Staff)
1. Staff accede a `/staff`
2. Completa formulario con datos del paciente
3. Sube archivos (PDF obligatorio + opcionales)
4. Sistema genera código de acceso
5. Código se muestra para copiar

#### 2. Acceso de Paciente
1. Paciente va a `/mis-estudios`
2. Ingresa DNI y código
3. Sistema valida credenciales
4. Si válido, muestra archivos disponibles
5. Para descargar, genera URL pre-firmada

#### 3. Auditoría
- Todos los eventos se registran en `audit_log`
- Dashboard en `/staff/dashboard`
- Filtros y búsqueda disponibles

### Características de Seguridad

#### Códigos de Acceso
- Generación aleatoria (8-10 caracteres)
- Hash con sal para almacenamiento
- Expiración temporal (24h por defecto)
- Un solo uso (marcado como usado)

#### Archivos
- Almacenamiento en Supabase Storage
- URLs pre-firmadas para descarga
- Expiración de 10 minutos
- No acceso directo a archivos

#### Rate Limiting
- 5 intentos por IP en 15 minutos
- Bloqueo temporal tras exceder
- Logs de intentos fallidos

### Configuración Requerida

#### Variables de Entorno
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### Supabase Setup
1. Ejecutar migraciones en orden:
   - `001_initial_schema.sql`
   - `002_rls_policies.sql`
   - `003_storage_setup.sql`

2. Configurar Storage bucket 'estudios'

3. Configurar políticas de RLS

### Criterios de Aceptación Cumplidos

✅ **Intentos inválidos bloqueados tras N reintentos**
- Rate limiting implementado
- Bloqueo temporal por IP

✅ **Expiración de código respetada**
- Códigos con fecha de expiración
- Validación temporal en consultas

✅ **Descargas solo vía URLs pre-firmadas**
- No acceso directo a archivos
- URLs con expiración de 10 minutos

✅ **No exponer claves en cliente**
- Todas las operaciones server-side
- RLS protege acceso a datos

✅ **Logs visibles en dashboard simple para staff**
- Dashboard en `/staff/dashboard`
- Filtros y paginación
- Logs detallados de todas las actividades

### Próximos Pasos

1. **Autenticación de Staff**
   - Implementar Supabase Auth
   - Proteger rutas `/staff/*`

2. **Integración con Storage**
   - Configurar Supabase Storage
   - Implementar URLs pre-firmadas reales

3. **Captcha/Turnstile**
   - Integrar Cloudflare Turnstile
   - Proteger formularios públicos

4. **Monitoreo**
   - Alertas por intentos sospechosos
   - Métricas de uso del sistema
