# Integración DICOM con OHIF/Cornerstone

## Descripción

Esta implementación integra OHIF/Cornerstone como visor web para series DICOM, permitiendo la visualización de estudios de imagen médica directamente en el navegador.

## Características Implementadas

### ✅ Visor DICOM Integrado
- **Componente DICOMViewer**: Visor principal con OHIF/Cornerstone
- **Componente SimpleDICOMViewer**: Visor simplificado para casos básicos
- **Integración en vista médica**: Botón "Ver DICOM" en archivos compatibles
- **Modal de visualización**: Interfaz de pantalla completa para estudios

### ✅ Integración DICOMweb
- **Endpoints de API**: Servir archivos DICOM y metadatos
- **Configuración DICOMweb**: WADO, QIDO, STOW endpoints
- **Autenticación**: Soporte para tokens Bearer y Basic Auth
- **Proxy de archivos**: Servir archivos DICOM desde servidor externo

### ✅ Fallback a Descarga
- **Detección automática**: Identifica archivos DICOM compatibles
- **Fallback inteligente**: Descarga automática cuando el visor no soporta
- **Mensajes informativos**: Explicación clara al usuario
- **Enlaces de descarga**: URLs pre-firmadas para archivos

### ✅ Optimización de Rendimiento
- **Límites de tamaño**: Máximo 2048x2048 píxeles
- **Latencia objetivo**: < 3 segundos de carga
- **Web Workers**: Procesamiento en segundo plano
- **Cache inteligente**: Almacenamiento de imágenes procesadas

## Configuración

### Variables de Entorno

```env
# DICOM Server Configuration
DICOM_SERVER_URL=https://orthanc.example.com
DICOM_USER=orthanc
DICOM_PASSWORD=orthanc

# DICOMweb Endpoints
NEXT_PUBLIC_DICOMWEB_WADO_URI_ROOT=https://orthanc.example.com/wado
NEXT_PUBLIC_DICOMWEB_QIDO_ROOT=https://orthanc.example.com/qido
NEXT_PUBLIC_DICOMWEB_WADO_ROOT=https://orthanc.example.com/wado
DICOMWEB_TOKEN=your_dicomweb_token
```

### Dependencias Instaladas

```json
{
  "@ohif/core": "^3.0.0",
  "@ohif/ui": "^3.0.0",
  "@ohif/viewer": "^3.0.0",
  "cornerstone-core": "^2.6.0",
  "cornerstone-web-image-loader": "^2.1.0",
  "cornerstone-wado-image-loader": "^4.13.0",
  "dicom-parser": "^1.8.28",
  "dcmjs": "^0.31.2"
}
```

## Uso

### 1. Visor DICOM Básico

```tsx
import DICOMViewer from '@/components/DICOMViewer'

<DICOMViewer
  studyInstanceUID="1.2.3.4.5.6.7.8.9.10"
  seriesInstanceUID="1.2.3.4.5.6.7.8.9.10.1"
  onError={(error) => console.error(error)}
  onLoadStart={() => console.log('Loading...')}
  onLoadComplete={() => console.log('Loaded')}
  fallbackDownloadUrl="/api/download/dicom"
  className="w-full h-96"
/>
```

### 2. Visor Simplificado

```tsx
import SimpleDICOMViewer from '@/components/SimpleDICOMViewer'

<SimpleDICOMViewer
  imageUrl="/api/dicom/study/series/instance"
  onError={(error) => console.error(error)}
  fallbackDownloadUrl="/api/download/dicom"
  className="w-full h-96"
/>
```

### 3. Integración en Vista Médica

Los archivos DICOM se detectan automáticamente y muestran un botón "Ver DICOM" que abre el visor en modal.

## Endpoints de API

### `/api/dicom/studies/[studyId]/metadata`
- **Método**: GET
- **Descripción**: Obtiene metadatos de un estudio DICOM
- **Respuesta**: Información del estudio, series e instancias

### `/api/dicom/[studyId]/[seriesId]/[instanceId]`
- **Método**: GET
- **Descripción**: Sirve archivos DICOM individuales
- **Headers**: `Content-Type: application/dicom`

## Criterios de Aceptación Cumplidos

### ✅ Cargar estudio DICOM de prueba
- Página de prueba en `/dicom-test` con estudios mock
- Datos de ejemplo para CT y MRI
- Interfaz de selección de estudios y series

### ✅ Controlar tamaño/latencia
- Límite de 2048x2048 píxeles por imagen
- Timeout de 30 segundos para requests
- Web Workers para procesamiento asíncrono
- Cache de 100 imágenes máximo

### ✅ Fallback a descarga cuando no soporte
- Detección automática de compatibilidad
- Mensaje informativo al usuario
- Enlace de descarga directa
- Soporte para archivos .dcm, .dicom

## Servidores DICOM Compatibles

### Orthanc
```bash
# Instalación con Docker
docker run -p 8042:8042 -p 4242:4242 jodogne/orthanc-plugins
```

### DCM4CHE
```bash
# Instalación con Docker
docker run -p 8080:8080 dcm4che/dcm4che-arc-psql:5.31.0
```

### DICOM Server Local
```bash
# Para desarrollo local
npm install -g dicom-server
dicom-server --port 3001
```

## Pruebas

### Página de Prueba
Visita `/dicom-test` para probar el visor con datos mock.

### Datos de Prueba
- **Estudio CT**: 1.2.3.4.5.6.7.8.9.10
- **Estudio MRI**: 1.2.3.4.5.6.7.8.9.11
- **Series**: Axial, Sagittal, T1 Weighted

### Casos de Prueba
1. **Carga exitosa**: Estudio válido con series compatibles
2. **Error de red**: Servidor DICOM no disponible
3. **Archivo incompatible**: Formato no soportado
4. **Fallback**: Descarga automática cuando falla

## Rendimiento

### Métricas Objetivo
- **Tiempo de carga**: < 3 segundos
- **Tamaño de imagen**: Máximo 2048x2048 píxeles
- **Memoria**: < 100MB por estudio
- **Concurrencia**: 4 requests simultáneos máximo

### Optimizaciones
- **Lazy loading**: Carga de imágenes bajo demanda
- **Compresión**: JPEG 2000 para imágenes grandes
- **Cache**: Almacenamiento local de imágenes procesadas
- **Web Workers**: Procesamiento en segundo plano

## Seguridad

### Autenticación
- **Tokens Bearer**: Para DICOMweb
- **Basic Auth**: Para servidores legacy
- **CORS**: Configuración restrictiva

### Privacidad
- **No almacenamiento**: Imágenes no se guardan localmente
- **URLs temporales**: Enlaces con expiración
- **Auditoría**: Log de accesos a estudios

## Próximos Pasos

1. **Integración real**: Conectar con servidor DICOM real
2. **Herramientas avanzadas**: Medición, anotaciones
3. **Múltiples formatos**: Soporte para más modalidades
4. **Mobile**: Optimización para dispositivos móviles
5. **Offline**: Cache para visualización sin conexión
