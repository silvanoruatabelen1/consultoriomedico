import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getClientIP, getUserAgent } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const { estudioId, hoursDuration = 48 } = await request.json()

    if (!estudioId) {
      return NextResponse.json(
        { error: 'ID de estudio requerido' },
        { status: 400 }
      )
    }

    // Validate hours duration (24-72 hours)
    if (hoursDuration < 24 || hoursDuration > 72) {
      return NextResponse.json(
        { error: 'La duración debe estar entre 24 y 72 horas' },
        { status: 400 }
      )
    }

    // Create medical share link using Supabase function
    const { data, error } = await supabaseAdmin.rpc('create_medical_share_link', {
      p_estudio_id: estudioId,
      p_hours_duration: hoursDuration,
      p_creado_por_paciente: true
    })

    if (error) {
      console.error('Error creating medical share link:', error)
      return NextResponse.json(
        { error: 'Error creando enlace de compartir' },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Error creando enlace de compartir' },
        { status: 500 }
      )
    }

    const shareLink = data[0]

    // Log share link creation
    await supabaseAdmin
      .from('audit_log')
      .insert({
        evento: 'create_medical_share',
        estudio_id: estudioId,
        detalles: {
          token: shareLink.token,
          expira_en: shareLink.expira_en,
          duracion_horas: hoursDuration,
          ip_address: getClientIP(request),
          user_agent: getUserAgent(request)
        }
      })

    return NextResponse.json({
      success: true,
      shareLink: {
        id: shareLink.id,
        token: shareLink.token,
        expira_en: shareLink.expira_en,
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/medical-view/${shareLink.token}`
      }
    })

  } catch (error) {
    console.error('Error in create medical share:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
