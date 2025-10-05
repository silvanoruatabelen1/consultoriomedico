import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const evento = searchParams.get('evento')
    const fechaDesde = searchParams.get('fecha_desde')
    const fechaHasta = searchParams.get('fecha_hasta')

    let query = supabaseAdmin
      .from('audit_log')
      .select(`
        *,
        estudios!inner(titulo, fecha_estudio),
        pacientes!inner(nombre, apellido, dni)
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (evento) {
      query = query.eq('evento', evento)
    }

    if (fechaDesde) {
      query = query.gte('created_at', fechaDesde)
    }

    if (fechaHasta) {
      query = query.lte('created_at', fechaHasta)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)

    if (error) {
      console.error('Error fetching audit logs:', error)
      return NextResponse.json(
        { error: 'Error obteniendo logs de auditoría' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      logs: data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Error in audit-logs GET:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
