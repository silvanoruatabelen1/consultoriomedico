'use client'

import { useState, useEffect } from 'react'

interface ImageThumbnailProps {
  archivoId: string
  nombreArchivo: string
  tipoMime: string
  token?: string
  className?: string
}

export default function ImageThumbnail({ 
  archivoId, 
  nombreArchivo, 
  tipoMime, 
  token,
  className = "w-16 h-16" 
}: ImageThumbnailProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (tipoMime.startsWith('image/')) {
      generateThumbnail()
    }
  }, [archivoId, tipoMime, token])

  const generateThumbnail = async () => {
    setLoading(true)
    setError(false)
    
    try {
      // Generate a temporary download URL for the image
      const response = await fetch('/api/medical-share/generate-download-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          archivoId, 
          token: token || '' 
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error generando miniatura')
      }

      setThumbnailUrl(result.downloadUrl)
    } catch (error) {
      console.error('Error generating thumbnail:', error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (!tipoMime.startsWith('image/')) {
    // Show file icon for non-image files
    return (
      <div className={`${className} bg-gray-100 rounded flex items-center justify-center`}>
        {tipoMime === 'application/pdf' ? (
          <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`${className} bg-gray-100 rounded flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !thumbnailUrl) {
    return (
      <div className={`${className} bg-gray-100 rounded flex items-center justify-center`}>
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }

  return (
    <div className={`${className} bg-gray-100 rounded overflow-hidden`}>
      <img
        src={thumbnailUrl}
        alt={nombreArchivo}
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  )
}
