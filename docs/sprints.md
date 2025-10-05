# Sprints de Desarrollo - Portal Médico Dra. María Isabel Ruata

## Sprint 1: Sitio Público + CTA (Completado)

### Objetivo
Crear el sitio público de la Dra. María Isabel Ruata con navegación clara y CTA "Mis estudios".

### Entregables
- ✅ Rutas: `/`, `/sobre-mi`, `/que-hago`, `/contacto`, `/mis-estudios`, `/privacidad`, `/terminos`
- ✅ Header con logo, menú y botón destacado "Mis estudios"
- ✅ Footer con datos de contacto, redes y links a políticas
- ✅ Página "Contacto" con botón WhatsApp y mapa embebido
- ✅ Página "Mis estudios" con formulario DNI + Código (UI solamente)
- ✅ SEO básico (title/description por ruta), noindex en `/mis-estudios`
- ✅ Responsive design con Lighthouse > 90
- ✅ Build y deploy a Cloudflare Pages/Netlify con CI

### Tecnologías
- Next.js 14 con App Router
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Netlify/Cloudflare Pages

### Criterios de Aceptación
- ✅ Navegación clara y accesible
- ✅ Diseño responsive en todos los dispositivos
- ✅ Lighthouse Score > 90 en Performance y Accessibility
- ✅ Textos en español argentino
- ✅ Build y deploy automatizado

---

## Sprint 2: Carga de Estudios + Acceso Paciente (Completado)

### Objetivo
Implementar carga de estudios (staff) y acceso paciente (DNI + código) con Supabase.

### Entregables
- ✅ Modelo de BD: tablas `pacientes`, `estudios`, `archivos`, `share_links`, `audit_log`
- ✅ Seguridad: RLS habilitado, endpoints server-side, rate limiting
- ✅ Carga staff: formulario protegido para crear estudios y subir archivos
- ✅ Portal paciente: validación DNI+código, listado de archivos, descarga segura
- ✅ Auditoría: eventos `create_study`, `patient_view`, `download`

### Tecnologías
- Supabase (Auth, Database, Storage)
- Row Level Security (RLS)
- API Routes de Next.js
- Crypto-js para hashing
- React Dropzone para uploads

### Criterios de Aceptación
- ✅ Intentos inválidos bloqueados tras N reintentos
- ✅ Expiración de código respetada
- ✅ Descargas solo vía URLs pre-firmadas
- ✅ No exposición de claves en cliente
- ✅ Logs visibles en dashboard staff

---

## Sprint 3: Funcionalidades Staff (Completado)

### Objetivo
Buscador staff (DNI/fecha/tipo), regenerar código, ver audit log por estudio, export CSV.

### Entregables
- ✅ Búsqueda de estudios por DNI, fecha, tipo de estudio
- ✅ Regeneración de códigos (revoca anterior y genera nuevo)
- ✅ Vista de audit log por estudio específico
- ✅ Exportación de audit logs a CSV
- ✅ Paginación de resultados
- ✅ Mensajes de confirmación para acciones críticas

### Tecnologías
- API Routes para búsqueda y exportación
- React Hook Form para filtros
- CSV generation
- ConfirmationModal component

### Criterios de Aceptación
- ✅ Acciones auditadas (regenerate_code, export_logs)
- ✅ Resultados paginados
- ✅ Mensajes de confirmación
- ✅ Sin filtrado por código en texto plano

---

## Sprint 4: Compartir con Médicos (Completado)

### Objetivo
Botón "Compartir con mi médico" que cree share-link temporal (24-72h), con página de vista read-only.

### Entregables
- ✅ Enlaces temporales de compartir (24-72 horas)
- ✅ Vista read-only para médicos (sin DNI visible)
- ✅ Revocación de enlaces por paciente/staff
- ✅ Auditoría de acciones de compartir
- ✅ Miniaturas de imágenes automáticas
- ✅ Spinners de carga en todas las operaciones

### Tecnologías
- Tabla `medical_share_links`
- API endpoints para crear/validar/revocar
- Vista médica dedicada
- ImageThumbnail component

### Criterios de Aceptación
- ✅ Enlaces temporales (24-72h)
- ✅ Vista read-only sin DNI
- ✅ Revocable por paciente/staff
- ✅ Auditoría completa
- ✅ Miniaturas de imágenes
- ✅ Spinner de carga

---

## Sprint 5: Visor DICOM (Completado)

### Objetivo
Integrar OHIF/Cornerstone como visor web para series DICOM alojadas.

### Entregables
- ✅ Configuración OHIF/Cornerstone
- ✅ Componente DICOMViewer integrado
- ✅ Integración con DICOMweb
- ✅ Fallback a descarga cuando no soporte
- ✅ Optimización de tamaño y latencia
- ✅ Página de prueba con estudios mock

### Tecnologías
- OHIF/Cornerstone
- DICOMweb (WADO, QIDO, STOW)
- API endpoints para DICOM
- ImageThumbnail component

### Criterios de Aceptación
- ✅ Cargar estudio DICOM de prueba
- ✅ Controlar tamaño/latencia (< 3 segundos)
- ✅ Fallback a descarga cuando no soporte
- ✅ Soporte para múltiples modalidades

---

## Sprint 6: Notificaciones (Pendiente)

### Objetivo
Sistema de notificaciones para pacientes y staff.

### Entregables Planificados
- Notificación de nuevos estudios
- Recordatorios de expiración de códigos
- Alertas de seguridad
- Configuración de preferencias
- Múltiples canales (email, SMS)

### Tecnologías
- Supabase Edge Functions
- Email templates
- SMS integration
- Notification preferences

### Criterios de Aceptación
- Notificaciones automáticas por nuevos estudios
- Recordatorios antes de expiración
- Configuración de preferencias por usuario
- Múltiples canales de notificación

---

## Sprint 7: Analytics y Reportes (Pendiente)

### Objetivo
Sistema de reportes y análisis de uso del portal.

### Entregables Planificados
- Dashboard de métricas
- Reportes de uso por paciente
- Análisis de accesos y descargas
- Exportación de datos
- KPIs del sistema

### Tecnologías
- Supabase Analytics
- Chart.js o similar
- Export functionality
- Scheduled reports

### Criterios de Aceptación
- Dashboard con métricas en tiempo real
- Reportes exportables
- Análisis de tendencias
- KPIs de negocio

---

## Sprint 8: Mobile App (Pendiente)

### Objetivo
Aplicación móvil nativa para iOS y Android.

### Entregables Planificados
- App nativa con React Native
- Sincronización con backend
- Notificaciones push
- Acceso offline limitado
- Biometría para autenticación

### Tecnologías
- React Native
- Expo
- Push notifications
- Biometric authentication
- Offline storage

### Criterios de Aceptación
- App disponible en App Store y Google Play
- Sincronización automática
- Notificaciones push
- Autenticación biométrica
- Funcionalidad offline básica

---

## Sprint 9: Integraciones Externas (Pendiente)

### Objetivo
Integración con sistemas externos del ecosistema de salud.

### Entregables Planificados
- API REST documentada
- Webhooks para notificaciones
- Integración con laboratorios
- Conexión con sistemas hospitalarios
- Sincronización de datos

### Tecnologías
- REST API
- Webhooks
- HL7 FHIR
- OAuth 2.0
- API Gateway

### Criterios de Aceptación
- API documentada y versionada
- Webhooks funcionales
- Integración con al menos 2 sistemas externos
- Autenticación OAuth 2.0
- Sincronización automática

---

## Sprint 10: AI/ML Features (Pendiente)

### Objetivo
Funcionalidades de inteligencia artificial para análisis de imágenes.

### Entregables Planificados
- Análisis automático de imágenes
- Detección de anomalías
- Sugerencias de diagnóstico
- Comparación temporal
- Reportes automáticos

### Tecnologías
- TensorFlow.js
- Computer Vision APIs
- Machine Learning models
- Image processing
- Natural Language Processing

### Criterios de Aceptación
- Análisis automático funcional
- Detección de anomalías con >90% precisión
- Sugerencias de diagnóstico
- Comparación temporal de estudios
- Reportes automáticos generados

---

## Métricas de Progreso

### Completado (Sprints 1-5)
- ✅ **Funcionalidad Core**: 100% completada
- ✅ **Seguridad**: Implementada y auditada
- ✅ **Cumplimiento Legal**: Documentado y aplicado
- ✅ **Visor DICOM**: Integrado y funcional
- ✅ **Compartir Médicos**: Implementado completamente

### En Progreso
- 🔄 **Documentación**: 90% completada
- 🔄 **Testing**: 80% completado
- 🔄 **Deploy**: 95% completado

### Pendiente (Sprints 6-10)
- ⏳ **Notificaciones**: 0% completado
- ⏳ **Analytics**: 0% completado
- ⏳ **Mobile App**: 0% completado
- ⏳ **Integraciones**: 0% completado
- ⏳ **AI/ML**: 0% completado

## Próximos Pasos

### Inmediato (1-2 semanas)
1. **Finalizar documentación**: Completar guías de usuario
2. **Testing completo**: Pruebas de integración y e2e
3. **Deploy a producción**: Configuración final
4. **Capacitación**: Entrenamiento del staff

### Corto Plazo (1-3 meses)
1. **Sprint 6**: Implementar notificaciones
2. **Sprint 7**: Desarrollar analytics
3. **Optimización**: Mejoras de rendimiento
4. **Feedback**: Recopilar feedback de usuarios

### Mediano Plazo (3-6 meses)
1. **Sprint 8**: Desarrollar mobile app
2. **Sprint 9**: Implementar integraciones
3. **Escalabilidad**: Optimizar para mayor carga
4. **Expansión**: Nuevas funcionalidades

### Largo Plazo (6+ meses)
1. **Sprint 10**: Implementar AI/ML
2. **Internacionalización**: Preparar para expansión
3. **Certificaciones**: ISO 27001, SOC 2
4. **Innovación**: Nuevas tecnologías y features
