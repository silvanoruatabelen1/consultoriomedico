'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import FileUpload from '@/components/FileUpload'

// Schema de validación
const studySchema = z.object({
  paciente_dni: z.string()
    .min(7, 'El DNI debe tener al menos 7 dígitos')
    .max(8, 'El DNI no puede tener más de 8 dígitos')
    .regex(/^\d+$/, 'El DNI solo puede contener números'),
  paciente_nombre: z.string().min(2, 'El nombre es requerido'),
  paciente_apellido: z.string().min(2, 'El apellido es requerido'),
  paciente_email: z.string().email('Email inválido').optional().or(z.literal('')),
  titulo: z.string().min(3, 'El título es requerido'),
  descripcion: z.string().optional(),
  fecha_estudio: z.string().min(1, 'La fecha del estudio es requerida'),
  tipo_estudio: z.string().min(1, 'El tipo de estudio es requerido'),
  observaciones: z.string().optional()
})

type StudyFormData = z.infer<typeof studySchema>

export default function StaffPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<StudyFormData>({
    resolver: zodResolver(studySchema)
  })

  useEffect(() => {
    // Check authentication (implement your auth logic here)
    // For now, we'll assume the user is authenticated
    setIsAuthenticated(true)
    setLoading(false)
  }, [])

  const handleFileUpload = async (file: File, esPrincipal: boolean) => {
    // This would be implemented to upload files to Supabase Storage
    // For now, we'll just add to the uploadedFiles state
    const fileData = {
      file,
      esPrincipal,
      id: Date.now().toString()
    }
    setUploadedFiles(prev => [...prev, fileData])
  }

  const onSubmit = async (data: StudyFormData) => {
    if (uploadedFiles.length === 0) {
      toast.error('Debe subir al menos un archivo')
      return
    }

    setSubmitting(true)

    try {
      // Create study
      const studyResponse = await fetch('/api/studies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!studyResponse.ok) {
        const error = await studyResponse.json()
        throw new Error(error.error || 'Error creando estudio')
      }

      const { estudio } = await studyResponse.json()

      // Upload files
      for (const fileData of uploadedFiles) {
        const formData = new FormData()
        formData.append('estudioId', estudio.id)
        formData.append('file', fileData.file)
        formData.append('esPrincipal', fileData.esPrincipal.toString())

        const uploadResponse = await fetch('/api/upload-file', {
          method: 'POST',
          body: formData
        })

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json()
          throw new Error(error.error || 'Error subiendo archivo')
        }
      }

      toast.success('Estudio creado exitosamente')
      
      // Show access code
      toast.success(`Código de acceso: ${estudio.codigo_acceso}`, {
        duration: 10000
      })

      // Reset form
      reset()
      setUploadedFiles([])

    } catch (error) {
      console.error('Error creating study:', error)
      toast.error(error instanceof Error ? error.message : 'Error creando estudio')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso no autorizado</h1>
          <p className="text-gray-600">Necesitas iniciar sesión para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Cargar Estudio Médico
            </h1>
            <p className="text-gray-600">
              Complete la información del paciente y suba los archivos del estudio
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Información del Paciente */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Información del Paciente
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="paciente_dni" className="block text-sm font-medium text-gray-700 mb-1">
                    DNI *
                  </label>
                  <input
                    type="text"
                    id="paciente_dni"
                    {...register('paciente_dni')}
                    className={`input-field ${errors.paciente_dni ? 'input-error' : ''}`}
                    placeholder="12345678"
                    maxLength={8}
                  />
                  {errors.paciente_dni && (
                    <p className="mt-1 text-sm text-red-600">{errors.paciente_dni.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="paciente_email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="paciente_email"
                    {...register('paciente_email')}
                    className="input-field"
                    placeholder="paciente@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="paciente_nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="paciente_nombre"
                    {...register('paciente_nombre')}
                    className={`input-field ${errors.paciente_nombre ? 'input-error' : ''}`}
                    placeholder="Nombre del paciente"
                  />
                  {errors.paciente_nombre && (
                    <p className="mt-1 text-sm text-red-600">{errors.paciente_nombre.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="paciente_apellido" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    id="paciente_apellido"
                    {...register('paciente_apellido')}
                    className={`input-field ${errors.paciente_apellido ? 'input-error' : ''}`}
                    placeholder="Apellido del paciente"
                  />
                  {errors.paciente_apellido && (
                    <p className="mt-1 text-sm text-red-600">{errors.paciente_apellido.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Información del Estudio */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Información del Estudio
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                    Título del Estudio *
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    {...register('titulo')}
                    className={`input-field ${errors.titulo ? 'input-error' : ''}`}
                    placeholder="Ej: Análisis de sangre completo"
                  />
                  {errors.titulo && (
                    <p className="mt-1 text-sm text-red-600">{errors.titulo.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fecha_estudio" className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha del Estudio *
                    </label>
                    <input
                      type="date"
                      id="fecha_estudio"
                      {...register('fecha_estudio')}
                      className={`input-field ${errors.fecha_estudio ? 'input-error' : ''}`}
                    />
                    {errors.fecha_estudio && (
                      <p className="mt-1 text-sm text-red-600">{errors.fecha_estudio.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="tipo_estudio" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Estudio *
                    </label>
                    <select
                      id="tipo_estudio"
                      {...register('tipo_estudio')}
                      className={`input-field ${errors.tipo_estudio ? 'input-error' : ''}`}
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="laboratorio">Laboratorio</option>
                      <option value="radiologia">Radiología</option>
                      <option value="cardiologia">Cardiología</option>
                      <option value="neurologia">Neurología</option>
                      <option value="otro">Otro</option>
                    </select>
                    {errors.tipo_estudio && (
                      <p className="mt-1 text-sm text-red-600">{errors.tipo_estudio.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    {...register('descripcion')}
                    rows={3}
                    className="input-field"
                    placeholder="Descripción del estudio (opcional)"
                  />
                </div>

                <div>
                  <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
                    Observaciones
                  </label>
                  <textarea
                    id="observaciones"
                    {...register('observaciones')}
                    rows={3}
                    className="input-field"
                    placeholder="Observaciones adicionales (opcional)"
                  />
                </div>
              </div>
            </div>

            {/* Subida de Archivos */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Archivos del Estudio *
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Suba los archivos del estudio. El primer archivo será marcado como principal.
              </p>
              
              <FileUpload
                onFileUpload={handleFileUpload}
                disabled={submitting}
                maxFiles={10}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting || uploadedFiles.length === 0}
              >
                {submitting ? 'Creando estudio...' : 'Crear Estudio'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
