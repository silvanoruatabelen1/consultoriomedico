import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const evento = searchParams.get('evento')
    const fechaDesde = searchParams.get('fecha_desde')
    const fechaHasta = searchParams.get('fecha_hasta')
    const estudioId = searchParams.get('estudio_id')

    let query = supabaseAdmin
      .from('audit_log')
      .select(`
        *,
        estudios!inner(titulo, fecha_estudio),
        pacientes!inner(nombre, apellido, dni)
      `)

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

    if (estudioId) {
      query = query.eq('estudio_id', estudioId)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(10000) // Limit for CSV export

    if (error) {
      console.error('Error fetching logs for export:', error)
      return NextResponse.json(
        { error: 'Error obteniendo logs para exportar' },
        { status: 500 }
      )
    }

    // Generate CSV content
    const csvHeaders = [
      'Fecha',
      'Evento',
      'Paciente',
      'DNI',
      'Estudio',
      'Fecha Estudio',
      'IP Address',
      'User Agent',
      'Detalles'
    ]

    const csvRows = data?.map(log => [
      new Date(log.created_at).toLocaleString('es-AR'),
      log.evento,
      log.pacientes ? `${log.pacientes.nombre} ${log.pacientes.apellido}` : '',
      log.pacientes?.dni || '',
      log.estudios?.titulo || '',
      log.estudios?.fecha_estudio ? new Date(log.estudios.fecha_estudio).toLocaleDateString('es-AR') : '',
      log.ip_address || '',
      log.user_agent || '',
      log.detalles ? JSON.stringify(log.detalles) : ''
    ]) || []

    // Create CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => 
        row.map(field => 
          typeof field === 'string' && field.includes(',') 
            ? `"${field.replace(/"/g, '""')}"` 
            : field
        ).join(',')
      )
    ].join('\n')

    // Log export action
    await supabaseAdmin
      .from('audit_log')
      .insert({
        evento: 'export_csv',
        detalles: {
          filtros: { evento, fechaDesde, fechaHasta, estudioId },
          registros_exportados: csvRows.length
        }
      })

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="audit_logs_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

  } catch (error) {
    console.error('Error in audit-logs export:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
