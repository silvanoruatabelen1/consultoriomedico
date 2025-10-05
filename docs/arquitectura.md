# Arquitectura del Sistema - Portal Médico Dra. María Isabel Ruata

## Visión General de la Arquitectura

El portal médico está diseñado con una arquitectura moderna, escalable y segura que separa claramente las responsabilidades entre frontend, backend y almacenamiento de datos.

## Arquitectura de Alto Nivel

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Supabase)    │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • Portal Público│    │ • Auth          │    │ • Pacientes     │
│ • Portal Paciente│   │ • Storage       │    │ • Estudios      │
│ • Panel Staff   │    │ • RLS           │    │ • Archivos      │
│ • Visor DICOM   │    │ • API Routes    │    │ • Audit Log     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Componentes Principales

### 1. Frontend (Next.js 14)

#### Tecnologías
- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Formularios**: React Hook Form + Zod
- **Estado**: React Hooks + Context
- **Notificaciones**: React Hot Toast

#### Estructura
```
frontend/
├── app/                    # App Router (Next.js 14)
│   ├── page.tsx           # Página de inicio
│   ├── sobre-mi/          # Página sobre la doctora
│   ├── que-hago/          # Servicios ofrecidos
│   ├── contacto/          # Información de contacto
│   ├── mis-estudios/      # Portal de pacientes
│   ├── medical-view/      # Vista médica compartida
│   ├── staff/             # Panel de administración
│   └── api/               # API Routes
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuración
└── types/                # Definiciones de TypeScript
```

### 2. Backend (Supabase)

#### Servicios Utilizados
- **Autenticación**: Supabase Auth
- **Base de Datos**: PostgreSQL con RLS
- **Almacenamiento**: Supabase Storage
- **API**: Supabase REST API + Next.js API Routes

#### Estructura de Base de Datos
```sql
-- Tablas principales
pacientes (id, nombre, apellido, dni_hash, created_at)
estudios (id, paciente_id, titulo, descripcion, created_at)
archivos (id, estudio_id, nombre_original, tipo_mime, tamaño_bytes)
share_links (id, estudio_id, token_hash, expira_en, created_at)
medical_share_links (id, estudio_id, token_hash, expira_en, revocado)
audit_log (id, accion, usuario_id, detalles, created_at)
```

### 3. Seguridad

#### Autenticación y Autorización
- **Staff**: Supabase Auth con roles
- **Pacientes**: DNI + código temporal
- **Médicos**: Tokens de compartir temporales
- **RLS**: Row Level Security en todas las tablas

#### Protección de Datos
- **Hashing**: SHA-256 con salt para DNI y códigos
- **Encriptación**: AES-256 para datos sensibles
- **Rate Limiting**: Protección contra ataques
- **Auditoría**: Log completo de todas las acciones

## Flujos de Datos Principales

### 1. Acceso de Paciente
```
Paciente → Formulario DNI+Código → Validación → Lista de Estudios → Visualización/Descarga
```

### 2. Carga de Estudio (Staff)
```
Staff → Login → Formulario Estudio → Subida Archivos → Generación Código → Notificación
```

### 3. Compartir con Médico
```
Paciente → Botón Compartir → Generación Token → Enlace Temporal → Vista Médica
```

## Patrones de Diseño Implementados

### 1. Repository Pattern
- Abstracción de acceso a datos
- Separación entre lógica de negocio y persistencia
- Facilita testing y mantenimiento

### 2. Middleware Pattern
- Autenticación centralizada
- Rate limiting
- Logging de requests
- Validación de entrada

### 3. Observer Pattern
- Notificaciones de eventos
- Auditoría automática
- Webhooks para integraciones

## Integraciones Externas

### 1. DICOM Server
- **Propósito**: Almacenamiento y acceso a estudios de imagen
- **Protocolo**: DICOMweb (WADO, QIDO, STOW)
- **Autenticación**: Basic Auth o Bearer Token
- **Formato**: Soporte para múltiples modalidades

### 2. Cloudflare/Netlify
- **Hosting**: Sitio estático optimizado
- **CDN**: Distribución global de contenido
- **SSL**: Certificados automáticos
- **Deploy**: CI/CD automatizado

### 3. Turnstile (Captcha)
- **Propósito**: Protección contra bots
- **Integración**: Formularios públicos
- **Configuración**: Site key y secret key

## Consideraciones de Escalabilidad

### 1. Base de Datos
- **Índices**: Optimizados para consultas frecuentes
- **Particionamiento**: Por fecha para tablas grandes
- **Conexiones**: Pool de conexiones configurado
- **Backup**: Automático y geográficamente distribuido

### 2. Almacenamiento
- **CDN**: Distribución global de archivos
- **Compresión**: Automática para imágenes
- **Limpieza**: Archivos temporales automáticos
- **Redundancia**: Múltiples copias de seguridad

### 3. Aplicación
- **Stateless**: Sin estado en la aplicación
- **Cache**: Redis para sesiones y datos frecuentes
- **Load Balancing**: Distribución de carga
- **Monitoring**: Métricas en tiempo real

## Seguridad y Cumplimiento

### 1. Protección de Datos
- **Ley 25.326**: Cumplimiento completo
- **Ley 26.529**: Derechos del paciente
- **GDPR**: Preparado para expansión internacional
- **Auditoría**: Logs inmutables y completos

### 2. Medidas Técnicas
- **HTTPS**: Obligatorio en todas las comunicaciones
- **HSTS**: Headers de seguridad estrictos
- **CSP**: Content Security Policy configurado
- **CORS**: Configuración restrictiva

### 3. Medidas Organizacionales
- **Políticas**: Documentadas y actualizadas
- **Capacitación**: Staff entrenado en seguridad
- **Incidentes**: Plan de respuesta documentado
- **Auditorías**: Revisiones periódicas

## Monitoreo y Observabilidad

### 1. Métricas de Aplicación
- **Performance**: Tiempo de respuesta, throughput
- **Errores**: Rate de errores, tipos de fallos
- **Usuarios**: Activos, nuevos, retención
- **Negocio**: Estudios cargados, accesos, descargas

### 2. Métricas de Infraestructura
- **CPU/Memory**: Uso de recursos
- **Storage**: Espacio utilizado, crecimiento
- **Network**: Ancho de banda, latencia
- **Database**: Queries lentas, conexiones

### 3. Alertas
- **Críticas**: Caídas, errores de seguridad
- **Advertencias**: Performance degradado
- **Informativas**: Nuevos usuarios, picos de uso

## Plan de Despliegue

### 1. Entornos
- **Development**: Local con Docker
- **Staging**: Réplica de producción
- **Production**: Cloudflare Pages + Supabase

### 2. CI/CD
- **GitHub Actions**: Automatización completa
- **Tests**: Unitarios, integración, e2e
- **Deploy**: Automático tras merge a main
- **Rollback**: Automático en caso de fallos

### 3. Backup y Recuperación
- **Database**: Backup diario automático
- **Files**: Replicación en múltiples zonas
- **Code**: Git con tags de versión
- **Config**: Variables de entorno versionadas

## Consideraciones Futuras

### 1. Escalabilidad Horizontal
- **Microservicios**: Separación por dominio
- **API Gateway**: Punto único de entrada
- **Message Queue**: Comunicación asíncrona
- **Service Mesh**: Gestión de servicios

### 2. Integraciones
- **HL7 FHIR**: Estándar de interoperabilidad
- **Sistemas Hospitalarios**: Integración con HIS
- **Laboratorios**: Conexión automática
- **Imágenes**: PACS integration

### 3. Funcionalidades Avanzadas
- **AI/ML**: Análisis automático de imágenes
- **Telemedicina**: Consultas virtuales
- **Mobile**: Aplicación nativa
- **IoT**: Dispositivos médicos conectados
