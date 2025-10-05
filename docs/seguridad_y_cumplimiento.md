# Seguridad y Cumplimiento - Portal Médico Dra. María Isabel Ruata

## Marco Legal Aplicable

### Ley 25.326 - Protección de Datos Personales
- **Artículo 1**: Objeto y ámbito de aplicación
- **Artículo 2**: Definiciones (datos personales, datos sensibles)
- **Artículo 3**: Principios generales
- **Artículo 4**: Consentimiento del titular
- **Artículo 5**: Calidad de los datos
- **Artículo 6**: Seguridad de los datos
- **Artículo 7**: Deber de confidencialidad
- **Artículo 8**: Derechos del titular

### Ley 26.529 - Derechos del Paciente
- **Artículo 2**: Derecho a la información
- **Artículo 3**: Consentimiento informado
- **Artículo 4**: Historia clínica
- **Artículo 5**: Confidencialidad
- **Artículo 6**: Acceso a la información
- **Artículo 7**: Rectificación y actualización

## Medidas de Seguridad Implementadas

### 1. Seguridad de Datos

#### Encriptación
- **En Tránsito**: TLS 1.3 para todas las comunicaciones
- **En Reposo**: AES-256 para datos sensibles en base de datos
- **Archivos**: Encriptación automática en Supabase Storage
- **Backup**: Encriptación de respaldos

#### Hashing y Salt
- **DNI**: SHA-256 con salt único por registro
- **Códigos**: SHA-256 con salt aleatorio
- **Passwords**: bcrypt con salt automático
- **Tokens**: SHA-256 con timestamp

### 2. Autenticación y Autorización

#### Autenticación Multi-Factor
- **Staff**: Supabase Auth con MFA opcional
- **Pacientes**: DNI + código temporal
- **Médicos**: Tokens de compartir con expiración
- **Rate Limiting**: 5 intentos por IP en 15 minutos

#### Row Level Security (RLS)
```sql
-- Ejemplo de política RLS
CREATE POLICY "pacientes_policy" ON pacientes
FOR ALL USING (
  auth.uid() = user_id OR 
  auth.role() = 'staff'
);
```

### 3. Protección de Archivos

#### URLs Pre-firmadas
- **Expiración**: 10 minutos máximo
- **Validación**: Verificación de permisos
- **Auditoría**: Log de todas las descargas
- **Revocación**: Inmediata por staff

#### Almacenamiento Seguro
- **Supabase Storage**: Encriptación automática
- **CORS**: Configuración restrictiva
- **Access Control**: Basado en RLS
- **Backup**: Replicación geográfica

### 4. Auditoría y Monitoreo

#### Logs de Auditoría
```typescript
interface AuditLog {
  id: string
  accion: 'create_study' | 'patient_view' | 'download' | 'share_create' | 'share_revoke'
  usuario_id?: string
  ip_address: string
  user_agent: string
  detalles: Record<string, any>
  created_at: string
}
```

#### Eventos Auditados
- **Accesos**: Login, logout, intentos fallidos
- **Estudios**: Creación, modificación, eliminación
- **Archivos**: Subida, descarga, visualización
- **Compartir**: Creación, uso, revocación de enlaces
- **Staff**: Todas las acciones administrativas

### 5. Protección contra Ataques

#### Rate Limiting
- **API**: 100 requests por minuto por IP
- **Login**: 5 intentos por 15 minutos
- **Download**: 10 descargas por hora por usuario
- **Share**: 5 enlaces por día por paciente

#### Validación de Entrada
- **Sanitización**: Todos los inputs
- **Validación**: Esquemas Zod estrictos
- **CSRF**: Tokens en formularios
- **XSS**: Content Security Policy

#### Captcha
- **Turnstile**: En formularios públicos
- **Configuración**: Site key y secret key
- **Fallback**: Para casos de error
- **Analytics**: Métricas de uso

## Cumplimiento Legal

### 1. Principios de la Ley 25.326

#### Legalidad
- **Base Legal**: Consentimiento explícito del paciente
- **Propósito**: Atención médica y gestión de salud
- **Proporcionalidad**: Datos mínimos necesarios
- **Transparencia**: Políticas claras y accesibles

#### Calidad de Datos
- **Exactitud**: Validación y verificación
- **Actualización**: Proceso de rectificación
- **Pertinencia**: Solo datos médicos relevantes
- **Completitud**: Información necesaria para atención

#### Seguridad
- **Técnicas**: Encriptación, autenticación, auditoría
- **Organizacionales**: Políticas, capacitación, controles
- **Físicas**: Protección de servidores y backups
- **Lógicas**: RLS, permisos, monitoreo

### 2. Derechos del Paciente (Ley 26.529)

#### Derecho a la Información
- **Acceso**: Portal 24/7 para consultar estudios
- **Historia Clínica**: Visualización completa
- **Resultados**: Descarga de informes e imágenes
- **Transparencia**: Políticas claras de uso

#### Consentimiento Informado
- **Explícito**: Checkbox de aceptación
- **Específico**: Para cada tipo de uso
- **Reversible**: Revocación en cualquier momento
- **Documentado**: Registro de consentimientos

#### Confidencialidad
- **Médico-Paciente**: Comunicación privada
- **Datos Sensibles**: Protección especial
- **Acceso Limitado**: Solo personal autorizado
- **Auditoría**: Control de accesos

### 3. Políticas de Privacidad

#### Recopilación de Datos
- **DNI**: Para identificación única
- **Datos Médicos**: Estudios, informes, imágenes
- **Datos de Contacto**: Para comunicación
- **Datos de Uso**: Para mejora del servicio

#### Uso de Datos
- **Atención Médica**: Propósito principal
- **Comunicación**: Notificaciones importantes
- **Mejora**: Análisis anónimo de uso
- **Legal**: Cumplimiento de obligaciones

#### Compartir Datos
- **Médicos**: Con consentimiento explícito
- **Autoridades**: Solo cuando sea legalmente requerido
- **Terceros**: Nunca sin autorización
- **Internacional**: No se transfieren datos

## Plan de Respuesta a Incidentes

### 1. Clasificación de Incidentes

#### Críticos
- **Brecha de datos**: Acceso no autorizado a información médica
- **Caída del sistema**: Indisponibilidad > 1 hora
- **Ataque activo**: Intento de compromiso del sistema
- **Pérdida de datos**: Corrupción o eliminación de información

#### Altos
- **Acceso no autorizado**: Intento de login con credenciales válidas
- **Degradación**: Performance < 50% de lo normal
- **Error de configuración**: Configuración incorrecta de seguridad
- **Fallo de backup**: Error en proceso de respaldo

#### Medios
- **Intentos de ataque**: Rate limiting activado
- **Errores de aplicación**: Bugs que afectan funcionalidad
- **Problemas de rendimiento**: Lentitud en operaciones
- **Alertas de monitoreo**: Umbrales superados

### 2. Procedimientos de Respuesta

#### Inmediato (0-15 minutos)
1. **Identificación**: Confirmar tipo y severidad
2. **Contención**: Aislar sistemas afectados
3. **Notificación**: Alertar al equipo técnico
4. **Documentación**: Registrar detalles del incidente

#### Corto Plazo (15-60 minutos)
1. **Análisis**: Determinar causa raíz
2. **Mitigación**: Implementar medidas temporales
3. **Comunicación**: Informar a stakeholders
4. **Monitoreo**: Vigilar evolución del incidente

#### Mediano Plazo (1-24 horas)
1. **Resolución**: Implementar solución permanente
2. **Verificación**: Confirmar que el problema está resuelto
3. **Comunicación**: Informar resolución a usuarios
4. **Documentación**: Actualizar procedimientos

#### Largo Plazo (1-7 días)
1. **Post-mortem**: Análisis completo del incidente
2. **Mejoras**: Implementar medidas preventivas
3. **Capacitación**: Entrenar al equipo
4. **Actualización**: Revisar políticas y procedimientos

### 3. Comunicación

#### Interna
- **Equipo Técnico**: Inmediata vía Slack/Email
- **Management**: Dentro de 1 hora
- **Legal**: Si hay implicaciones legales
- **Compliance**: Para incidentes de seguridad

#### Externa
- **Usuarios**: Si afecta funcionalidad crítica
- **Autoridades**: Si hay brecha de datos
- **Proveedores**: Si hay dependencias externas
- **Medios**: Solo si es necesario y apropiado

## Auditorías y Revisiones

### 1. Auditorías Internas

#### Mensual
- **Logs de Seguridad**: Revisión de accesos
- **Performance**: Análisis de métricas
- **Backup**: Verificación de respaldos
- **Updates**: Revisión de actualizaciones

#### Trimestral
- **Políticas**: Revisión y actualización
- **Capacitación**: Entrenamiento del equipo
- **Procedimientos**: Actualización de procesos
- **Tecnología**: Evaluación de herramientas

#### Anual
- **Auditoría Completa**: Revisión integral
- **Penetration Testing**: Pruebas de seguridad
- **Compliance**: Verificación de cumplimiento
- **Plan de Mejoras**: Roadmap de seguridad

### 2. Auditorías Externas

#### Certificaciones
- **ISO 27001**: Gestión de seguridad de la información
- **SOC 2**: Controles de seguridad y disponibilidad
- **HIPAA**: Preparación para estándares internacionales
- **GDPR**: Cumplimiento para expansión internacional

#### Consultores
- **Seguridad**: Evaluación de arquitectura
- **Legal**: Revisión de cumplimiento
- **Técnica**: Auditoría de código y configuración
- **Procesos**: Evaluación de procedimientos

## Continuidad y Recuperación

### 1. Plan de Continuidad

#### Objetivos
- **RTO**: Tiempo de recuperación < 4 horas
- **RPO**: Pérdida de datos < 1 hora
- **Disponibilidad**: > 99.5% uptime
- **Escalabilidad**: Crecimiento sin interrupciones

#### Estrategias
- **Redundancia**: Múltiples copias de datos
- **Geografía**: Distribución en múltiples zonas
- **Automatización**: Recuperación automática
- **Monitoreo**: Detección proactiva de problemas

### 2. Plan de Recuperación

#### Backup
- **Frecuencia**: Diaria automática
- **Retención**: 30 días para datos, 1 año para logs
- **Ubicación**: Geográficamente distribuido
- **Verificación**: Pruebas mensuales de restauración

#### Restauración
- **Base de Datos**: < 2 horas
- **Archivos**: < 4 horas
- **Aplicación**: < 1 hora
- **Configuración**: < 30 minutos

#### Pruebas
- **Mensual**: Restauración parcial
- **Trimestral**: Simulación completa
- **Anual**: Prueba de desastre
- **Documentación**: Procedimientos actualizados
