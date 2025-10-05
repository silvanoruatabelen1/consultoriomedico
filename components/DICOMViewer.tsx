'use client'

import { useEffect, useRef, useState } from 'react'
import { configureCornerstone, DICOMWEB_CONFIG, STUDY_CONFIG } from '@/lib/cornerstone-config'

interface DICOMViewerProps {
  studyInstanceUID: string
  seriesInstanceUID?: string
  onError?: (error: string) => void
  onLoadStart?: () => void
  onLoadComplete?: () => void
  fallbackDownloadUrl?: string
  className?: string
}

export default function DICOMViewer({
  studyInstanceUID,
  seriesInstanceUID,
  onError,
  onLoadStart,
  onLoadComplete,
  fallbackDownloadUrl,
  className = "w-full h-96"
}: DICOMViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFallback, setShowFallback] = useState(false)
  const [cornerstone, setCornerstone] = useState<any>(null)

  useEffect(() => {
    initializeViewer()
    return () => {
      cleanup()
    }
  }, [studyInstanceUID, seriesInstanceUID])

  const initializeViewer = async () => {
    try {
      setLoading(true)
      setError(null)
      onLoadStart?.()

      // Configure Cornerstone
      const cs = configureCornerstone()
      setCornerstone(cs)

      // Wait for container to be ready
      if (!containerRef.current) {
        throw new Error('Container not ready')
      }

      // Initialize the viewer
      await loadDICOMStudy(cs)
      
      setLoading(false)
      onLoadComplete?.()
    } catch (err) {
      console.error('Error initializing DICOM viewer:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error cargando visor DICOM'
      setError(errorMessage)
      setShowFallback(true)
      onError?.(errorMessage)
      setLoading(false)
    }
  }

  const loadDICOMStudy = async (cs: any) => {
    try {
      // Create DICOMweb URL for the study
      const studyUrl = `${DICOMWEB_CONFIG.qidoRoot}/studies/${studyInstanceUID}`
      
      // Fetch study metadata
      const response = await fetch(studyUrl, {
        headers: {
          'Accept': 'application/dicom+json',
          'Authorization': `Bearer ${DICOMWEB_CONFIG.auth.token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Error fetching study: ${response.status}`)
      }

      const studyData = await response.json()
      
      if (!studyData || studyData.length === 0) {
        throw new Error('No study data found')
      }

      // Get series data
      const seriesUrl = `${DICOMWEB_CONFIG.qidoRoot}/studies/${studyInstanceUID}/series`
      const seriesResponse = await fetch(seriesUrl, {
        headers: {
          'Accept': 'application/dicom+json',
          'Authorization': `Bearer ${DICOMWEB_CONFIG.auth.token}`
        }
      })

      if (!seriesResponse.ok) {
        throw new Error(`Error fetching series: ${seriesResponse.status}`)
      }

      const seriesData = await seriesResponse.json()
      
      if (!seriesData || seriesData.length === 0) {
        throw new Error('No series data found')
      }

      // Find the target series or use the first one
      const targetSeries = seriesInstanceUID 
        ? seriesData.find((s: any) => s['0020000E'].Value[0] === seriesInstanceUID)
        : seriesData[0]

      if (!targetSeries) {
        throw new Error('Target series not found')
      }

      // Get instances for the series
      const instancesUrl = `${DICOMWEB_CONFIG.qidoRoot}/studies/${studyInstanceUID}/series/${targetSeries['0020000E'].Value[0]}/instances`
      const instancesResponse = await fetch(instancesUrl, {
        headers: {
          'Accept': 'application/dicom+json',
          'Authorization': `Bearer ${DICOMWEB_CONFIG.auth.token}`
        }
      })

      if (!instancesResponse.ok) {
        throw new Error(`Error fetching instances: ${instancesResponse.status}`)
      }

      const instancesData = await instancesResponse.json()
      
      if (!instancesData || instancesData.length === 0) {
        throw new Error('No instances found for series')
      }

      // Create image IDs for Cornerstone
      const imageIds = instancesData.map((instance: any) => {
        const sopInstanceUID = instance['00080018'].Value[0]
        return `wadouri:${DICOMWEB_CONFIG.wadoRoot}/studies/${studyInstanceUID}/series/${targetSeries['0020000E'].Value[0]}/instances/${sopInstanceUID}`
      })

      // Load the first image
      if (imageIds.length > 0 && containerRef.current) {
        const element = containerRef.current
        await cs.enable(element)
        
        // Load the first image
        const image = await cs.loadImage(imageIds[0])
        await cs.displayImage(element, image)
        
        // Set up viewport
        const viewport = cs.getViewport(element)
        viewport.setVOILUTFunction(cs.VOILUTFunction.LINEAR)
        cs.updateImage(element)
      }

    } catch (err) {
      console.error('Error loading DICOM study:', err)
      throw err
    }
  }

  const cleanup = () => {
    if (cornerstone && containerRef.current) {
      try {
        cornerstone.disable(containerRef.current)
      } catch (err) {
        console.error('Error cleaning up cornerstone:', err)
      }
    }
  }

  const handleDownloadFallback = () => {
    if (fallbackDownloadUrl) {
      window.open(fallbackDownloadUrl, '_blank')
    }
  }

  if (showFallback) {
    return (
      <div className={`${className} bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-8`}>
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Visor DICOM no disponible
        </h3>
        <p className="text-gray-600 text-center mb-4">
          Este tipo de archivo DICOM no es compatible con el visor web. 
          Puedes descargar el archivo para visualizarlo con software especializado.
        </p>
        {fallbackDownloadUrl && (
          <button
            onClick={handleDownloadFallback}
            className="btn-primary"
          >
            Descargar archivo DICOM
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={`${className} relative`}>
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando visor DICOM...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-800 font-medium mb-2">Error cargando visor</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}
      
      <div 
        ref={containerRef}
        className="w-full h-full bg-black rounded-lg"
        style={{ minHeight: '400px' }}
      />
    </div>
  )
}
