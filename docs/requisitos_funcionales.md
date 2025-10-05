# Requisitos Funcionales - Portal Médico Dra. María Isabel Ruata

## RF-001: Portal Público del Consultorio

### Descripción
Sitio web público que presente información del consultorio y la Dra. María Isabel Ruata.

### Criterios de Aceptación
- Página de inicio con información general
- Sección "Sobre mí" con trayectoria profesional
- Sección "Qué hago" con servicios ofrecidos
- Página de contacto con información de contacto
- Diseño responsive y accesible
- SEO optimizado

### Prioridad: Alta

---

## RF-002: Portal de Acceso para Pacientes

### Descripción
Sistema de acceso seguro para pacientes que deseen consultar sus estudios médicos.

### Criterios de Aceptación
- Formulario de acceso con DNI (7-8 dígitos)
- Campo de código de acceso (alfanumérico)
- Validación de credenciales
- Visualización de estudios disponibles
- Interfaz intuitiva y accesible

### Prioridad: Alta

---

## RF-003: Gestión de Estudios Médicos

### Descripción
Sistema para que el staff pueda cargar y gestionar estudios médicos de los pacientes.

### Criterios de Aceptación
- Formulario de carga de estudios
- Subida de archivos (PDF, imágenes, DICOM)
- Generación automática de códigos de acceso
- Asociación de archivos con pacientes
- Validación de tipos de archivo

### Prioridad: Alta

---

## RF-004: Sistema de Códigos de Acceso

### Descripción
Generación y gestión de códigos temporales para acceso a estudios médicos.

### Criterios de Aceptación
- Códigos alfanuméricos únicos (8-10 caracteres)
- Expiración configurable (24-72 horas)
- Hash seguro de códigos en base de datos
- Revocación manual por staff
- Auditoría de uso

### Prioridad: Alta

---

## RF-005: Visualización de Archivos

### Descripción
Visualización segura de archivos médicos en el navegador.

### Criterios de Aceptación
- Visualización de PDFs
- Visualización de imágenes (JPG, PNG)
- Visor DICOM integrado para estudios de imagen
- Miniaturas de imágenes
- Descarga segura de archivos

### Prioridad: Alta

---

## RF-006: Descarga Segura de Archivos

### Descripción
Sistema de descarga segura mediante URLs pre-firmadas.

### Criterios de Aceptación
- URLs con expiración de 10 minutos
- No acceso directo a archivos
- Validación de permisos
- Auditoría de descargas
- Soporte para múltiples formatos

### Prioridad: Alta

---

## RF-007: Panel de Administración

### Descripción
Panel para que el staff gestione estudios y monitoree accesos.

### Criterios de Aceptación
- Listado de estudios por paciente
- Búsqueda por DNI, fecha, tipo de estudio
- Regeneración de códigos de acceso
- Vista de logs de auditoría
- Exportación de reportes

### Prioridad: Media

---

## RF-008: Sistema de Auditoría

### Descripción
Registro completo de todas las acciones del sistema.

### Criterios de Aceptación
- Log de accesos de pacientes
- Log de acciones del staff
- Log de descargas de archivos
- Log de intentos fallidos
- Dashboard de auditoría

### Prioridad: Alta

---

## RF-009: Compartir con Médicos

### Descripción
Funcionalidad para compartir estudios con médicos externos.

### Criterios de Aceptación
- Enlaces temporales (24-72 horas)
- Vista de solo lectura para médicos
- Revocación de enlaces
- Sin exposición de DNI
- Auditoría de compartir

### Prioridad: Media

---

## RF-010: Rate Limiting y Seguridad

### Descripción
Protección contra ataques y uso indebido del sistema.

### Criterios de Aceptación
- Límite de 5 intentos por IP en 15 minutos
- Bloqueo temporal tras exceder límite
- Captcha para formularios públicos
- Validación de entrada
- Sanitización de datos

### Prioridad: Alta

---

## RF-011: Visor DICOM Avanzado

### Descripción
Visualización profesional de estudios de imagen médica.

### Criterios de Aceptación
- Integración con OHIF/Cornerstone
- Soporte para múltiples modalidades
- Herramientas de medición
- Fallback a descarga
- Optimización de rendimiento

### Prioridad: Media

---

## RF-012: Notificaciones

### Descripción
Sistema de notificaciones para pacientes y staff.

### Criterios de Aceptación
- Notificación de nuevos estudios
- Recordatorios de expiración
- Alertas de seguridad
- Configuración de preferencias
- Múltiples canales (email, SMS)

### Prioridad: Baja

---

## RF-013: Integración con Sistemas Externos

### Descripción
Integración con sistemas de salud externos.

### Criterios de Aceptación
- API REST para integraciones
- Webhooks para notificaciones
- Sincronización de datos
- Autenticación de terceros
- Documentación de API

### Prioridad: Baja

---

## RF-014: Reportes y Analytics

### Descripción
Sistema de reportes y análisis de uso.

### Criterios de Aceptación
- Reportes de uso por paciente
- Métricas de rendimiento
- Análisis de accesos
- Exportación de datos
- Dashboard de métricas

### Prioridad: Baja

---

## RF-015: Backup y Recuperación

### Descripción
Sistema de respaldo y recuperación de datos.

### Criterios de Aceptación
- Backup automático diario
- Recuperación de datos
- Pruebas de restauración
- Almacenamiento seguro
- Documentación de procedimientos

### Prioridad: Media
