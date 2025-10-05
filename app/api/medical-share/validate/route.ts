import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getClientIP, getUserAgent } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token requerido' },
        { status: 400 }
      )
    }

    // Validate medical share link using Supabase function
    const { data, error } = await supabaseAdmin.rpc('validate_medical_share_link', {
      p_token: token
    })

    if (error) {
      console.error('Error validating medical share link:', error)
      return NextResponse.json(
        { error: 'Error validando enlace' },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Enlace inválido, expirado o revocado' },
        { status: 404 }
      )
    }

    const study = data[0]

    return NextResponse.json({
      success: true,
      study: {
        id: study.estudio_id,
        paciente: {
          nombre: study.paciente_nombre,
          apellido: study.paciente_apellido
        },
        titulo: study.titulo,
        fecha_estudio: study.fecha_estudio,
        archivos: study.archivos
      }
    })

  } catch (error) {
    console.error('Error in validate medical share:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
