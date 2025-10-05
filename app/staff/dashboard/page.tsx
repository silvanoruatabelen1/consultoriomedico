'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface AuditLog {
  id: string
  evento: string
  created_at: string
  ip_address: string
  user_agent: string
  detalles: any
  estudios?: {
    titulo: string
    fecha_estudio: string
  }
  pacientes?: {
    nombre: string
    apellido: string
    dni: string
  }
}

export default function StaffDashboard() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    evento: '',
    fecha_desde: '',
    fecha_hasta: '',
    page: 1
  })
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 50
  })

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.evento) params.append('evento', filters.evento)
      if (filters.fecha_desde) params.append('fecha_desde', filters.fecha_desde)
      if (filters.fecha_hasta) params.append('fecha_hasta', filters.fecha_hasta)
      params.append('page', filters.page.toString())
      params.append('limit', '50')

      const response = await fetch(`/api/audit-logs?${params}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error obteniendo logs')
      }

      setLogs(result.logs)
      setPagination(result.pagination)
    } catch (error) {
      console.error('Error fetching logs:', error)
      toast.error('Error cargando logs de auditoría')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.evento) params.append('evento', filters.evento)
      if (filters.fecha_desde) params.append('fecha_desde', filters.fecha_desde)
      if (filters.fecha_hasta) params.append('fecha_hasta', filters.fecha_hasta)

      const response = await fetch(`/api/audit-logs/export?${params}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error exportando CSV')
      }

      // Download the CSV file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success('CSV exportado exitosamente')
    } catch (error) {
      console.error('Error exporting CSV:', error)
      toast.error('Error exportando CSV')
    }
  }

  const getEventColor = (evento: string) => {
    switch (evento) {
      case 'create_study':
        return 'bg-green-100 text-green-800'
      case 'patient_view':
        return 'bg-blue-100 text-blue-800'
      case 'download':
        return 'bg-purple-100 text-purple-800'
      case 'invalid_access_attempt':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEventLabel = (evento: string) => {
    switch (evento) {
      case 'create_study':
        return 'Estudio Creado'
      case 'patient_view':
        return 'Acceso Paciente'
      case 'download':
        return 'Descarga'
      case 'invalid_access_attempt':
        return 'Intento Inválido'
      default:
        return evento
    }
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard de Auditoría
          </h1>
          <p className="text-gray-600">
            Monitoreo de actividades del sistema y accesos de pacientes
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
            <button
              onClick={handleExportCSV}
              className="btn-primary"
            >
              Exportar CSV
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Evento
              </label>
              <select
                value={filters.evento}
                onChange={(e) => handleFilterChange('evento', e.target.value)}
                className="input-field"
              >
                <option value="">Todos los eventos</option>
                <option value="create_study">Estudio Creado</option>
                <option value="patient_view">Acceso Paciente</option>
                <option value="download">Descarga</option>
                <option value="invalid_access_attempt">Intento Inválido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha desde
              </label>
              <input
                type="date"
                value={filters.fecha_desde}
                onChange={(e) => handleFilterChange('fecha_desde', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha hasta
              </label>
              <input
                type="date"
                value={filters.fecha_hasta}
                onChange={(e) => handleFilterChange('fecha_hasta', e.target.value)}
                className="input-field"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({
                  evento: '',
                  fecha_desde: '',
                  fecha_hasta: '',
                  page: 1
                })}
                className="btn-secondary w-full"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Logs de Auditoría ({pagination.total})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No se encontraron logs con los filtros aplicados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Evento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detalles
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.created_at).toLocaleString('es-AR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventColor(log.evento)}`}>
                          {getEventLabel(log.evento)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.pacientes ? (
                          <div>
                            <div className="font-medium">{log.pacientes.nombre} {log.pacientes.apellido}</div>
                            <div className="text-gray-500">DNI: {log.pacientes.dni}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.estudios ? (
                          <div>
                            <div className="font-medium">{log.estudios.titulo}</div>
                            <div className="text-gray-500">{new Date(log.estudios.fecha_estudio).toLocaleDateString('es-AR')}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.ip_address || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.detalles ? (
                          <details className="cursor-pointer">
                            <summary className="text-primary-600 hover:text-primary-800">
                              Ver detalles
                            </summary>
                            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-w-xs">
                              {JSON.stringify(log.detalles, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando página {pagination.page} de {pagination.totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
