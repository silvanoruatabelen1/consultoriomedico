# Portal Médico – Dra. María Isabel Ruata

Sitio web oficial y portal de pacientes para visualizar y descargar informes e imágenes de estudios médicos.

## 🏥 Descripción del Proyecto

Portal médico moderno y seguro que permite a los pacientes de la Dra. María Isabel Ruata acceder de forma segura a sus estudios médicos, informes e imágenes, manteniendo los más altos estándares de privacidad y cumplimiento legal.

### ✨ Características Principales

- **Portal Público**: Sitio web profesional del consultorio
- **Acceso Seguro**: Portal de pacientes con DNI + código temporal
- **Gestión de Estudios**: Panel de administración para el staff
- **Visor DICOM**: Visualización profesional de estudios de imagen
- **Compartir Médicos**: Enlaces temporales para médicos externos
- **Auditoría Completa**: Log de todas las acciones del sistema
- **Cumplimiento Legal**: Ley 25.326 y 26.529

## 🏗️ Estructura del Proyecto

```
consultoriomedico/
├── README.md
├── .gitignore
├── .env.example
├── docs/                          # Documentación completa
│   ├── vision.md
│   ├── requisitos_funcionales.md
│   ├── requisitos_no_funcionales.md
│   ├── arquitectura.md
│   ├── seguridad_y_cumplimiento.md
│   ├── sprints.md
│   └── politicas/
│       ├── privacidad_borrador.md
│       └── terminos_borrador.md
├── app/                           # Next.js App Router
│   ├── page.tsx                   # Página de inicio
│   ├── sobre-mi/                  # Sobre la doctora
│   ├── que-hago/                  # Servicios
│   ├── contacto/                  # Información de contacto
│   ├── mis-estudios/              # Portal de pacientes
│   ├── medical-view/              # Vista médica compartida
│   ├── staff/                     # Panel de administración
│   └── api/                       # API Routes
├── components/                    # Componentes reutilizables
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── DICOMViewer.tsx
│   ├── ImageThumbnail.tsx
│   └── ConfirmationModal.tsx
├── lib/                          # Utilidades y configuración
│   ├── supabase.ts
│   ├── security.ts
│   └── cornerstone-config.ts
├── supabase/                     # Configuración de base de datos
│   └── migrations/
├── scripts/                      # Scripts de deploy
│   └── deploy-notes.md
└── package.json
```

## 🚀 Tecnologías Utilizadas

### Frontend
- **Next.js 14** con App Router
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **React Hook Form + Zod** para formularios
- **React Hot Toast** para notificaciones

### Backend
- **Supabase** (Auth, Database, Storage)
- **PostgreSQL** con Row Level Security
- **API Routes** de Next.js
- **Crypto-js** para hashing seguro

### Seguridad
- **Encriptación AES-256** para datos sensibles
- **TLS 1.3** para comunicaciones
- **Rate Limiting** contra ataques
- **Auditoría completa** de accesos

### Visor DICOM
- **OHIF/Cornerstone** para visualización
- **DICOMweb** (WADO, QIDO, STOW)
- **Integración con servidores DICOM**

## 📋 Funcionalidades Implementadas

### ✅ Sprint 1: Sitio Público
- Portal web profesional
- Navegación clara y accesible
- SEO optimizado
- Responsive design
- Deploy automatizado

### ✅ Sprint 2: Portal de Pacientes
- Acceso seguro con DNI + código
- Visualización de estudios
- Descarga segura de archivos
- Sistema de códigos temporales

### ✅ Sprint 3: Panel de Staff
- Gestión de estudios
- Búsqueda avanzada
- Regeneración de códigos
- Exportación de reportes

### ✅ Sprint 4: Compartir con Médicos
- Enlaces temporales (24-72h)
- Vista de solo lectura
- Revocación de enlaces
- Auditoría de compartir

### ✅ Sprint 5: Visor DICOM
- Integración OHIF/Cornerstone
- Soporte múltiples modalidades
- Fallback a descarga
- Optimización de rendimiento

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta de Supabase
- Servidor DICOM (opcional)

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/silvanoruatabelen1/consultoriomedico.git
cd consultoriomedico

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores
```

### Configuración de Supabase
```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar proyecto
supabase init

# Aplicar migraciones
supabase db push
```

### Ejecutar en Desarrollo
```bash
npm run dev
```

## 🌐 Deploy

### Netlify
```bash
# Build para producción
npm run build

# Deploy automático con GitHub
# Configurar variables de entorno en Netlify
```

### Cloudflare Pages
```bash
# Configurar wrangler.toml
# Deploy con Cloudflare Pages
```

## 🔒 Seguridad y Cumplimiento

### Ley 25.326 - Protección de Datos Personales
- ✅ Consentimiento explícito
- ✅ Calidad de datos
- ✅ Seguridad de la información
- ✅ Derechos del titular

### Ley 26.529 - Derechos del Paciente
- ✅ Acceso a la información
- ✅ Consentimiento informado
- ✅ Confidencialidad
- ✅ Historia clínica

### Medidas de Seguridad
- ✅ Encriptación end-to-end
- ✅ Autenticación robusta
- ✅ Auditoría completa
- ✅ Rate limiting
- ✅ Row Level Security

## 📊 Métricas de Rendimiento

### Objetivos Técnicos
- **Tiempo de carga**: < 3 segundos
- **Lighthouse Score**: > 90
- **Disponibilidad**: > 99.5%
- **Tiempo de respuesta API**: < 500ms

### Objetivos de Negocio
- **Satisfacción del paciente**: > 90%
- **Reducción de consultas administrativas**: 50%
- **Cumplimiento legal**: 100%
- **Incidentes de seguridad**: 0

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:integration

# Tests e2e
npm run test:e2e

# Coverage
npm run test:coverage
```

### Página de Prueba DICOM
Visita `/dicom-test` para probar el visor con datos mock.

## 📚 Documentación

### Documentación Técnica
- [Arquitectura del Sistema](docs/arquitectura.md)
- [Requisitos Funcionales](docs/requisitos_funcionales.md)
- [Requisitos No Funcionales](docs/requisitos_no_funcionales.md)
- [Seguridad y Cumplimiento](docs/seguridad_y_cumplimiento.md)

### Documentación de Usuario
- [Política de Privacidad](docs/politicas/privacidad_borrador.md)
- [Términos y Condiciones](docs/politicas/terminos_borrador.md)
- [Guía de Deploy](scripts/deploy-notes.md)

### Roadmap
- [Sprints de Desarrollo](docs/sprints.md)
- [Visión del Proyecto](docs/vision.md)

## 🤝 Contribución

### Proceso de Contribución
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de Código
- **TypeScript**: Tipado estricto
- **ESLint**: Linting automático
- **Prettier**: Formateo de código
- **Conventional Commits**: Mensajes de commit estandarizados

## 📞 Soporte

### Contacto Técnico
- **Email**: soporte@consultorio-dra-ruata.com
- **Teléfono**: +54 11 1234-5678
- **Horario**: Lunes a Viernes 9:00-18:00

### Documentación
- **Wiki**: https://wiki.consultorio-dra-ruata.com
- **API Docs**: https://api.consultorio-dra-ruata.com/docs
- **Status Page**: https://status.consultorio-dra-ruata.com

## 📄 Licencia

Este proyecto está desarrollado con fines académicos y profesionales. Todos los derechos reservados.

---

**Desarrollado con ❤️ para mejorar la atención médica digital**