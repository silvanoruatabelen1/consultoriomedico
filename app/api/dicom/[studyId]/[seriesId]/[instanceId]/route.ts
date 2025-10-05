import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { studyId: string; seriesId: string; instanceId: string } }
) {
  try {
    const { studyId, seriesId, instanceId } = params

    // In a real implementation, you would:
    // 1. Validate the study/series/instance IDs
    // 2. Check permissions
    // 3. Retrieve the DICOM file from storage
    // 4. Return the DICOM file with proper headers

    // For now, we'll return a placeholder response
    // In production, you would integrate with a DICOM server like Orthanc, DCM4CHE, etc.

    const dicomServerUrl = process.env.DICOM_SERVER_URL || 'https://orthanc.example.com'
    const dicomUrl = `${dicomServerUrl}/studies/${studyId}/series/${seriesId}/instances/${instanceId}/file`

    // Proxy the request to the DICOM server
    const response = await fetch(dicomUrl, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.DICOM_USER}:${process.env.DICOM_PASSWORD}`).toString('base64')}`
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'DICOM file not found' },
        { status: 404 }
      )
    }

    const dicomData = await response.arrayBuffer()

    return new NextResponse(dicomData, {
      status: 200,
      headers: {
        'Content-Type': 'application/dicom',
        'Content-Disposition': `attachment; filename="${instanceId}.dcm"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Error serving DICOM file:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
