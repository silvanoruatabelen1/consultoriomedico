import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getClientIP, getUserAgent } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const { token, motivo } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token requerido' },
        { status: 400 }
      )
    }

    // Revoke medical share link using Supabase function
    const { data, error } = await supabaseAdmin.rpc('revoke_medical_share_link', {
      p_token: token,
      p_motivo: motivo || 'Revocado por el usuario'
    })

    if (error) {
      console.error('Error revoking medical share link:', error)
      return NextResponse.json(
        { error: 'Error revocando enlace' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Enlace no encontrado o ya revocado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Enlace revocado exitosamente'
    })

  } catch (error) {
    console.error('Error in revoke medical share:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
