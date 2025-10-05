'use client'

import { useEffect, useRef, useState } from 'react'

interface SimpleDICOMViewerProps {
  imageUrl: string
  onError?: (error: string) => void
  onLoadStart?: () => void
  onLoadComplete?: () => void
  fallbackDownloadUrl?: string
  className?: string
}

export default function SimpleDICOMViewer({
  imageUrl,
  onError,
  onLoadStart,
  onLoadComplete,
  fallbackDownloadUrl,
  className = "w-full h-96"
}: SimpleDICOMViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    loadImage()
  }, [imageUrl])

  const loadImage = async () => {
    try {
      setLoading(true)
      setError(null)
      onLoadStart?.()

      // Check if the image URL is accessible
      const response = await fetch(imageUrl, { method: 'HEAD' })
      
      if (!response.ok) {
        throw new Error(`Error accessing image: ${response.status}`)
      }

      // Check content type
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('dicom')) {
        throw new Error('File is not a DICOM image')
      }

      // For now, we'll show a placeholder since we need Cornerstone to be properly configured
      // In a real implementation, you would load the DICOM image here
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div class="flex items-center justify-center h-full bg-gray-900 text-white">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>DICOM Viewer Loading...</p>
              <p class="text-sm text-gray-300 mt-2">Study Instance UID: ${imageUrl}</p>
            </div>
          </div>
        `
      }

      setLoading(false)
      onLoadComplete?.()
    } catch (err) {
      console.error('Error loading DICOM image:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error cargando imagen DICOM'
      setError(errorMessage)
      setShowFallback(true)
      onError?.(errorMessage)
      setLoading(false)
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
            <p className="text-gray-600">Cargando imagen DICOM...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-800 font-medium mb-2">Error cargando imagen</p>
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
