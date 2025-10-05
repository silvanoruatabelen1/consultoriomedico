import cornerstone from 'cornerstone-core'
import cornerstoneWebImageLoader from 'cornerstone-web-image-loader'
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'

// Configure Cornerstone
export function configureCornerstone() {
  // Configure the image loaders
  cornerstoneWebImageLoader.external.cornerstone = cornerstone
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone
  cornerstoneWADOImageLoader.external.dicomParser = require('dicom-parser')

  // Configure WADO Image Loader
  cornerstoneWADOImageLoader.configure({
    useWebWorkers: true,
    decodeConfig: {
      convertFloatPixelDataToInt: false,
    },
  })

  // Register the image loaders
  cornerstone.registerImageLoader('wadouri', cornerstoneWADOImageLoader.wadouri.loadImage)
  cornerstone.registerImageLoader('wadouri', cornerstoneWADOImageLoader.wadouri.loadImage)
  cornerstone.registerImageLoader('dicomweb', cornerstoneWADOImageLoader.wadouri.loadImage)
  cornerstone.registerImageLoader('dicomfile', cornerstoneWADOImageLoader.wadouri.loadImage)
  cornerstone.registerImageLoader('http', cornerstoneWebImageLoader.loadImage)

  return cornerstone
}

// DICOMweb configuration
export const DICOMWEB_CONFIG = {
  // DICOMweb server configuration
  wadoUriRoot: process.env.NEXT_PUBLIC_DICOMWEB_WADO_URI_ROOT || 'https://dicomweb.example.com/wado',
  qidoRoot: process.env.NEXT_PUBLIC_DICOMWEB_QIDO_ROOT || 'https://dicomweb.example.com/qido',
  wadoRoot: process.env.NEXT_PUBLIC_DICOMWEB_WADO_ROOT || 'https://dicomweb.example.com/wado',
  
  // Authentication
  auth: {
    type: 'bearer', // or 'basic'
    token: process.env.DICOMWEB_TOKEN || '',
  },
  
  // Performance settings
  performance: {
    maxConcurrentRequests: 4,
    requestTimeout: 30000,
    retryAttempts: 3,
  }
}

// Study configuration for OHIF
export const STUDY_CONFIG = {
  // Study metadata
  studyInstanceUID: '',
  seriesInstanceUID: '',
  sopInstanceUID: '',
  
  // Viewer settings
  viewer: {
    showStudyList: false,
    showPatientInfo: true,
    showSeriesInfo: true,
    showToolbar: true,
    showViewportGrid: true,
    showMeasurementPanel: true,
  },
  
  // Performance settings
  performance: {
    maxImageSize: 2048, // Max image size in pixels
    enableWebGL: true,
    enableWebWorkers: true,
    cacheSize: 100, // Number of images to cache
  }
}
