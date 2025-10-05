'use client'

import { useState, useEffect } from 'react'
import DICOMViewer from '@/components/DICOMViewer'
import SimpleDICOMViewer from '@/components/SimpleDICOMViewer'

interface DICOMStudy {
  studyInstanceUID: string
  studyDate: string
  studyDescription: string
  patientName: string
  series: Array<{
    seriesInstanceUID: string
    seriesDescription: string
    modality: string
    numberOfInstances: number
  }>
}

export default function DICOMTestPage() {
  const [studies, setStudies] = useState<DICOMStudy[]>([])
  const [selectedStudy, setSelectedStudy] = useState<DICOMStudy | null>(null)
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock study data for testing
  const mockStudies: DICOMStudy[] = [
    {
      studyInstanceUID: '1.2.3.4.5.6.7.8.9.10',
      studyDate: '20240101',
      studyDescription: 'CT Chest',
      patientName: 'Test^Patient',
      series: [
        {
          seriesInstanceUID: '1.2.3.4.5.6.7.8.9.10.1',
          seriesDescription: 'Axial CT',
          modality: 'CT',
          numberOfInstances: 50
        },
        {
          seriesInstanceUID: '1.2.3.4.5.6.7.8.9.10.2',
          seriesDescription: 'Sagittal CT',
          modality: 'CT',
          numberOfInstances: 30
        }
      ]
    },
    {
      studyInstanceUID: '1.2.3.4.5.6.7.8.9.11',
      studyDate: '20240102',
      studyDescription: 'MRI Brain',
      patientName: 'Test^Patient2',
      series: [
        {
          seriesInstanceUID: '1.2.3.4.5.6.7.8.9.11.1',
          seriesDescription: 'T1 Weighted',
          modality: 'MR',
          numberOfInstances: 20
        }
      ]
    }
  ]

  useEffect(() => {
    // Simulate loading studies
    setLoading(true)
    setTimeout(() => {
      setStudies(mockStudies)
      setLoading(false)
    }, 1000)
  }, [])

  const handleStudySelect = (study: DICOMStudy) => {
    setSelectedStudy(study)
    setSelectedSeries(null)
    setError(null)
  }

  const handleSeriesSelect = (seriesId: string) => {
    setSelectedSeries(seriesId)
    setError(null)
  }

  const handleViewerError = (error: string) => {
    setError(error)
    console.error('DICOM Viewer Error:', error)
  }

  const handleViewerLoadStart = () => {
    setError(null)
  }

  const handleViewerLoadComplete = () => {
    console.log('DICOM Viewer loaded successfully')
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Visor DICOM - Prueba
          </h1>
          <p className="text-gray-600">
            Prueba del visor DICOM integrado con OHIF/Cornerstone
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Studies List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Estudios DICOM
              </h2>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando estudios...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studies.map((study) => (
                    <div
                      key={study.studyInstanceUID}
                      onClick={() => handleStudySelect(study)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedStudy?.studyInstanceUID === study.studyInstanceUID
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="font-medium text-gray-900">
                        {study.studyDescription}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Paciente: {study.patientName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Fecha: {study.studyDate}
                      </p>
                      <p className="text-sm text-gray-600">
                        Series: {study.series.length}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Series List */}
          {selectedStudy && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Series del Estudio
                </h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {selectedStudy.series.map((series) => (
                    <div
                      key={series.seriesInstanceUID}
                      onClick={() => handleSeriesSelect(series.seriesInstanceUID)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedSeries === series.seriesInstanceUID
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="font-medium text-gray-900">
                        {series.seriesDescription}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Modalidad: {series.modality}
                      </p>
                      <p className="text-sm text-gray-600">
                        Instancias: {series.numberOfInstances}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DICOM Viewer */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Visor DICOM
                </h2>
              </div>
              
              <div className="p-6">
                {selectedStudy && selectedSeries ? (
                  <div className="space-y-4">
                    <DICOMViewer
                      studyInstanceUID={selectedStudy.studyInstanceUID}
                      seriesInstanceUID={selectedSeries}
                      onError={handleViewerError}
                      onLoadStart={handleViewerLoadStart}
                      onLoadComplete={handleViewerLoadComplete}
                      fallbackDownloadUrl={`/api/dicom/${selectedStudy.studyInstanceUID}/download`}
                      className="w-full h-96"
                    />
                    
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">
                          <strong>Error:</strong> {error}
                        </p>
                        <p className="text-red-600 text-sm mt-1">
                          El visor DICOM no pudo cargar esta serie. 
                          Puedes descargar el archivo para visualizarlo con software especializado.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500">
                      Selecciona un estudio y una serie para visualizar
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Información de Rendimiento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-800">Tamaño máximo:</span>
              <div className="text-blue-700">2048x2048 píxeles</div>
            </div>
            <div>
              <span className="font-medium text-blue-800">Latencia objetivo:</span>
              <div className="text-blue-700">&lt; 3 segundos</div>
            </div>
            <div>
              <span className="font-medium text-blue-800">Fallback:</span>
              <div className="text-blue-700">Descarga automática</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
