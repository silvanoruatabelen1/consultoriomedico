import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getClientIP, getUserAgent } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const { archivoId, token } = await request.json()

    if (!archivoId || !token) {
      return NextResponse.json(
        { error: 'ID de archivo y token requeridos' },
        { status: 400 }
      )
    }

    // First validate the token to ensure it's still valid
    const { data: tokenData, error: tokenError } = await supabaseAdmin.rpc('validate_medical_share_link', {
      p_token: token
    })

    if (tokenError || !tokenData || tokenData.length === 0) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
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

    // Log download attempt
    await supabaseAdmin
      .from('audit_log')
      .insert({
        evento: 'medical_share_download',
        detalles: {
          archivo_id: archivoId,
          token: token,
          ip_address: getClientIP(request),
          user_agent: getUserAgent(request)
        }
      })

    return NextResponse.json({
      success: true,
      downloadUrl: data,
      expiresIn: 600 // 10 minutes in seconds
    })

  } catch (error) {
    console.error('Error in medical share download:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
