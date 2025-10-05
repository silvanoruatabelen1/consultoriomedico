import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getClientIP, getUserAgent } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const { archivoId } = await request.json()

    if (!archivoId) {
      return NextResponse.json(
        { error: 'ID de archivo requerido' },
        { status: 400 }
      )
    }

    // Generate signed URL using Supabase function
    const { data, error } = await supabaseAdmin.rpc('generate_signed_url', {
      p_archivo_id: archivoId,
      p_expires_in_minutes: 10
    })

    if (error) {
      console.error('Error generating signed URL:', error)
      return NextResponse.json(
        { error: 'Error generando URL de descarga' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      downloadUrl: data,
      expiresIn: 600 // 10 minutes in seconds
    })

  } catch (error) {
    console.error('Error in generate-download-url:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
