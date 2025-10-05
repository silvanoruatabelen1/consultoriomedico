import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRateLimit, getClientIP, getUserAgent, validateDNI, validateCode } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const { dni, codigo } = await request.json()

    // Validate input
    if (!dni || !codigo) {
      return NextResponse.json(
        { error: 'DNI y código son requeridos' },
        { status: 400 }
      )
    }

    if (!validateDNI(dni)) {
      return NextResponse.json(
        { error: 'DNI inválido' },
        { status: 400 }
      )
    }

    if (!validateCode(codigo)) {
      return NextResponse.json(
        { error: 'Código inválido' },
        { status: 400 }
      )
    }

    // Check rate limiting
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Demasiados intentos. Intenta nuevamente más tarde.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      )
    }

    // Validate access using Supabase function
    const { data, error } = await supabaseAdmin.rpc('validate_patient_access', {
      p_dni: dni,
      p_codigo: codigo
    })

    if (error) {
      console.error('Error validating access:', error)
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'DNI o código inválido' },
        { status: 401 }
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
    console.error('Error in validate-access:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
