'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import ImageThumbnail from '@/components/ImageThumbnail'
import DICOMViewer from '@/components/DICOMViewer'

interface StudyData {
  id: string
  paciente: {
    nombre: string
    apellido: string
  }
  titulo: string
  fecha_estudio: string
  archivos: {
    id: string
    nombre_original: string
    tipo_mime: string
    tamaño_bytes: number
    es_principal: boolean
  }[]
}

export default function MedicalViewPage() {
  const params = useParams()
  const token = params.token as string
  
  const [studyData, setStudyData] = useState<StudyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [selectedDICOMFile, setSelectedDICOMFile] = useState<any>(null)
  const [showDICOMViewer, setShowDICOMViewer] = useState(false)

  useEffect(() => {
    if (token) {
      validateToken()
    }
  }, [token])

  const validateToken = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/medical-share/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error validando enlace')
      }

      setStudyData(result.study)
    } catch (error) {
      console.error('Error validating token:', error)
      setError(error instanceof Error ? error.message : 'Error validando enlace')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (archivoId: string, nombreArchivo: string) => {
    setDownloadingFiles(prev => new Set(prev).add(archivoId))
    
    try {
      const response = await fetch('/api/medical-share/generate-download-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ archivoId, token })
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
      toast.error('Error descargando archivo')
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev)
        newSet.delete(archivoId)
        return newSet
      })
    }
  }

  const handleDICOMView = (archivo: any) => {
    // Check if it's a DICOM file
    const isDICOM = archivo.tipo_mime === 'application/dicom' || 
                   archivo.nombre_original.toLowerCase().endsWith('.dcm') ||
                   archivo.nombre_original.toLowerCase().endsWith('.dicom')
    
    if (isDICOM) {
      setSelectedDICOMFile(archivo)
      setShowDICOMViewer(true)
    } else {
      toast.error('Este archivo no es compatible con el visor DICOM')
    }
  }

  const getFileIcon = (tipoMime: string) => {
    if (tipoMime === 'application/pdf') {
      return (
        <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      )
    } else if (tipoMime.startsWith('image/')) {
      return (
        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      )
    } else {
      return (
        <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estudio médico...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h1 className="text-xl font-semibold text-red-800 mb-2">
              Enlace no válido
            </h1>
            <p className="text-red-600 mb-4">
              {error}
            </p>
            <p className="text-sm text-red-500">
              El enlace puede haber expirado, sido revocado o ser inválido.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!studyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No se pudo cargar el estudio</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Estudio Médico Compartido
              </h1>
              <p className="text-gray-600 mt-1">
                Vista de solo lectura - Información médica confidencial
              </p>
            </div>
            <div className="text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Vista segura
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Study Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {studyData.titulo}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Paciente:</span>
              <div className="text-gray-900">
                {studyData.paciente.nombre} {studyData.paciente.apellido}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Fecha del estudio:</span>
              <div className="text-gray-900">
                {new Date(studyData.fecha_estudio).toLocaleDateString('es-AR')}
              </div>
            </div>
          </div>
        </div>

        {/* Files Section */}
        {studyData.archivos && studyData.archivos.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Archivos del Estudio ({studyData.archivos.length})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Haz clic en "Descargar" para obtener una copia del archivo
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {studyData.archivos.map((archivo) => (
                  <div key={archivo.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <ImageThumbnail
                          archivoId={archivo.id}
                          nombreArchivo={archivo.nombre_original}
                          tipoMime={archivo.tipo_mime}
                          token={token}
                          className="w-12 h-12"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {archivo.nombre_original}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{(archivo.tamaño_bytes / 1024 / 1024).toFixed(2)} MB</span>
                          <span>{archivo.tipo_mime}</span>
                          {archivo.es_principal && (
                            <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full">
                              Principal
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDICOMView(archivo)}
                        className="btn-secondary text-sm px-3 py-2"
                      >
                        Ver DICOM
                      </button>
                      <button
                        onClick={() => handleDownload(archivo.id, archivo.nombre_original)}
                        disabled={downloadingFiles.has(archivo.id)}
                        className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {downloadingFiles.has(archivo.id) ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Descargando...
                          </div>
                        ) : (
                          'Descargar'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-1">
                Información confidencial
              </h4>
              <p className="text-sm text-blue-700">
                Este enlace contiene información médica confidencial. 
                Por favor, mantén la confidencialidad y no compartas este enlace con terceros no autorizados.
              </p>
            </div>
          </div>
        </div>

        {/* DICOM Viewer Modal */}
        {showDICOMViewer && selectedDICOMFile && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowDICOMViewer(false)}></div>

              <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Visor DICOM - {selectedDICOMFile.nombre_original}
                  </h3>
                  <button
                    onClick={() => setShowDICOMViewer(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <DICOMViewer
                  studyInstanceUID="1.2.3.4.5.6.7.8.9.10" // Mock study ID
                  seriesInstanceUID="1.2.3.4.5.6.7.8.9.10.1" // Mock series ID
                  onError={(error) => {
                    console.error('DICOM Viewer Error:', error)
                    toast.error('Error cargando visor DICOM')
                  }}
                  onLoadStart={() => {
                    console.log('DICOM Viewer loading...')
                  }}
                  onLoadComplete={() => {
                    console.log('DICOM Viewer loaded')
                  }}
                  fallbackDownloadUrl={`/api/medical-share/generate-download-url`}
                  className="w-full h-96"
                />

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowDICOMViewer(false)}
                    className="btn-primary"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
