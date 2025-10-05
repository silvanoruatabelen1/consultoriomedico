'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Head from 'next/head'

// Schema de validación
const formSchema = z.object({
  dni: z.string()
    .min(7, 'El DNI debe tener al menos 7 dígitos')
    .max(8, 'El DNI no puede tener más de 8 dígitos')
    .regex(/^\d+$/, 'El DNI solo puede contener números'),
  codigo: z.string()
    .min(1, 'El código es requerido')
    .regex(/^[A-Za-z0-9]+$/, 'El código solo puede contener letras y números')
})

type FormData = z.infer<typeof formSchema>

export default function MisEstudios() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const [studyData, setStudyData] = useState<any>(null)
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set())
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [creatingShare, setCreatingShare] = useState(false)

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setSubmitMessage('')
    
    try {
      const response = await fetch('/api/validate-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error validando acceso')
      }

      setStudyData(result.study)
      setSubmitMessage('Acceso validado correctamente')
    } catch (error) {
      console.error('Error validating access:', error)
      setSubmitMessage(error instanceof Error ? error.message : 'Error validando acceso')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = async (archivoId: string, nombreArchivo: string) => {
    setDownloadingFiles(prev => new Set(prev).add(archivoId))
    
    try {
      const response = await fetch('/api/generate-download-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ archivoId })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error generando URL de descarga')
      }

      // Create temporary download link
      const link = document.createElement('a')
      link.href = result.downloadUrl
      link.download = nombreArchivo
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

    } catch (error) {
      console.error('Error downloading file:', error)
      alert(error instanceof Error ? error.message : 'Error descargando archivo')
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev)
        newSet.delete(archivoId)
        return newSet
      })
    }
  }

  const handleCreateShareLink = async () => {
    if (!studyData?.id) return

    setCreatingShare(true)
    try {
      const response = await fetch('/api/medical-share/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estudioId: studyData.id,
          hoursDuration: 48 // 48 hours default
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error creando enlace de compartir')
      }

      setShareLink(result.shareLink.url)
      setShowShareModal(true)
    } catch (error) {
      console.error('Error creating share link:', error)
      toast.error('Error creando enlace de compartir')
    } finally {
      setCreatingShare(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Enlace copiado al portapapeles')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast.error('Error copiando enlace')
    }
  }

  return (
    <>
      <Head>
        <title>Mis estudios - Dra. María Isabel Ruata</title>
        <meta name="description" content="Accede a tus resultados médicos de forma segura" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mis estudios
          </h1>
          <p className="text-xl text-gray-600">
            Accede a tus resultados médicos de forma segura
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Consultar estudios
            </h2>
            <p className="text-gray-600">
              Ingresa tu DNI y código de acceso para consultar tus resultados médicos
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* DNI Field */}
            <div>
              <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-2">
                DNI *
              </label>
              <input
                type="text"
                id="dni"
                {...register('dni')}
                className={`input-field ${errors.dni ? 'input-error' : ''}`}
                placeholder="12345678"
                maxLength={8}
                aria-describedby={errors.dni ? 'dni-error' : undefined}
              />
              {errors.dni && (
                <p id="dni-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.dni.message}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Ingresa tu DNI sin puntos ni espacios (7-8 dígitos)
              </p>
            </div>

            {/* Código Field */}
            <div>
              <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-2">
                Código de acceso *
              </label>
              <input
                type="text"
                id="codigo"
                {...register('codigo')}
                className={`input-field ${errors.codigo ? 'input-error' : ''}`}
                placeholder="ABC123"
                aria-describedby={errors.codigo ? 'codigo-error' : undefined}
              />
              {errors.codigo && (
                <p id="codigo-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.codigo.message}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Código alfanumérico proporcionado por el consultorio
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Consultando...' : 'Consultar estudios'}
            </button>

            {/* Success/Error Message */}
            {submitMessage && (
              <div className={`p-4 rounded-lg ${
                submitMessage.includes('correctamente') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {submitMessage}
              </div>
            )}
          </form>

          {/* Study Results */}
          {studyData && (
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Resultados del Estudio
              </h3>
              
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {studyData.titulo}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Paciente:</span> {studyData.paciente.nombre} {studyData.paciente.apellido}
                  </div>
                  <div>
                    <span className="font-medium">Fecha del estudio:</span> {new Date(studyData.fecha_estudio).toLocaleDateString('es-AR')}
                  </div>
                </div>
              </div>

              {/* Share Button */}
              <div className="mb-6">
                <button
                  onClick={handleCreateShareLink}
                  disabled={creatingShare}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingShare ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                      Creando enlace...
                    </div>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      Compartir con mi médico
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Crea un enlace temporal (48h) para compartir con tu médico
                </p>
              </div>

              {studyData.archivos && studyData.archivos.length > 0 && (
                <div>
                  <h5 className="text-md font-medium text-gray-900 mb-3">
                    Archivos disponibles:
                  </h5>
                  <div className="space-y-2">
                    {studyData.archivos.map((archivo: any) => (
                      <div key={archivo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {archivo.tipo_mime === 'application/pdf' ? (
                              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{archivo.nombre_original}</p>
                            <p className="text-xs text-gray-500">
                              {(archivo.tamaño_bytes / 1024 / 1024).toFixed(2)} MB
                              {archivo.es_principal && (
                                <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                                  Principal
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(archivo.id, archivo.nombre_original)}
                          disabled={downloadingFiles.has(archivo.id)}
                          className="btn-primary text-sm px-3 py-1 disabled:opacity-50"
                        >
                          {downloadingFiles.has(archivo.id) ? 'Descargando...' : 'Descargar'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Necesitas ayuda?
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>¿No tienes tu código de acceso?</strong><br />
                Contacta con el consultorio para obtener tu código personal.
              </p>
              <p>
                <strong>¿Problemas con el DNI?</strong><br />
                Asegúrate de ingresar solo los números, sin puntos ni espacios.
              </p>
              <p>
                <strong>¿No encuentras tus estudios?</strong><br />
                Verifica que hayan pasado al menos 24 horas desde la realización del estudio.
              </p>
            </div>
            
            <div className="mt-6">
              <a
                href="/contacto"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Contactar con el consultorio →
              </a>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-1">
                Información de seguridad
              </h4>
              <p className="text-sm text-blue-700">
                Tus datos están protegidos con encriptación de extremo a extremo. 
                Solo tú y el personal autorizado del consultorio pueden acceder a tus resultados médicos.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Share Modal */}
      {showShareModal && shareLink && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowShareModal(false)}></div>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Enlace de compartir creado
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Este enlace expirará en 48 horas. Compártelo solo con tu médico de confianza.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enlace para compartir:
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(shareLink)}
                    className="px-3 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm text-yellow-800">
                      <strong>Importante:</strong> Este enlace contiene información médica confidencial. 
                      Solo compártelo con profesionales de la salud autorizados.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="btn-primary"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
