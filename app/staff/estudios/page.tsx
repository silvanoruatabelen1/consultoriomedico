'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import ConfirmationModal from '@/components/ConfirmationModal'

interface Study {
  id: string
  titulo: string
  fecha_estudio: string
  tipo_estudio: string
  created_at: string
  pacientes: {
    nombre: string
    apellido: string
    dni: string
  }
  share_links: {
    codigo: string
    expira_en: string
    usado: boolean
  }[]
  archivos: {
    id: string
    nombre_original: string
    tipo_mime: string
    es_principal: boolean
  }[]
}

export default function EstudiosPage() {
  const [studies, setStudies] = useState<Study[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    dni: '',
    fecha_desde: '',
    fecha_hasta: '',
    tipo_estudio: '',
    page: 1
  })
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 20
  })
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedStudyId, setSelectedStudyId] = useState<string | null>(null)

  const fetchStudies = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.dni) params.append('dni', filters.dni)
      if (filters.fecha_desde) params.append('fecha_desde', filters.fecha_desde)
      if (filters.fecha_hasta) params.append('fecha_hasta', filters.fecha_hasta)
      if (filters.tipo_estudio) params.append('tipo_estudio', filters.tipo_estudio)
      params.append('page', filters.page.toString())
      params.append('limit', '20')

      const response = await fetch(`/api/studies/search?${params}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error buscando estudios')
      }

      setStudies(result.studies)
      setPagination(result.pagination)
    } catch (error) {
      console.error('Error fetching studies:', error)
      toast.error('Error cargando estudios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudies()
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

  const handleRegenerateClick = (estudioId: string) => {
    setSelectedStudyId(estudioId)
    setShowConfirmModal(true)
  }

  const regenerateCode = async () => {
    if (!selectedStudyId) return

    try {
      const response = await fetch(`/api/studies/${selectedStudyId}/regenerate-code`, {
        method: 'POST'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error regenerando código')
      }

      toast.success(`Código regenerado: ${result.codigo}`)
      fetchStudies() // Refresh the list
    } catch (error) {
      console.error('Error regenerating code:', error)
      toast.error('Error regenerando código')
    } finally {
      setShowConfirmModal(false)
      setSelectedStudyId(null)
    }
  }

  const getStatusColor = (shareLink: any) => {
    if (shareLink.usado) return 'bg-gray-100 text-gray-800'
    if (new Date(shareLink.expira_en) < new Date()) return 'bg-red-100 text-red-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (shareLink: any) => {
    if (shareLink.usado) return 'Usado'
    if (new Date(shareLink.expira_en) < new Date()) return 'Expirado'
    return 'Activo'
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestión de Estudios
              </h1>
              <p className="text-gray-600">
                Buscar, gestionar y monitorear estudios médicos
              </p>
            </div>
            <Link href="/staff" className="btn-primary">
              Nuevo Estudio
            </Link>
          </div>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros de búsqueda</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DNI del Paciente
              </label>
              <input
                type="text"
                value={filters.dni}
                onChange={(e) => handleFilterChange('dni', e.target.value)}
                className="input-field"
                placeholder="12345678"
                maxLength={8}
              />
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de estudio
              </label>
              <select
                value={filters.tipo_estudio}
                onChange={(e) => handleFilterChange('tipo_estudio', e.target.value)}
                className="input-field"
              >
                <option value="">Todos los tipos</option>
                <option value="laboratorio">Laboratorio</option>
                <option value="radiologia">Radiología</option>
                <option value="cardiologia">Cardiología</option>
                <option value="neurologia">Neurología</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setFilters({
                dni: '',
                fecha_desde: '',
                fecha_hasta: '',
                tipo_estudio: '',
                page: 1
              })}
              className="btn-secondary"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Studies Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Estudios encontrados ({pagination.total})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Buscando estudios...</p>
            </div>
          ) : studies.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No se encontraron estudios con los filtros aplicados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Archivos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studies.map((study) => (
                    <tr key={study.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {study.pacientes.nombre} {study.pacientes.apellido}
                          </div>
                          <div className="text-sm text-gray-500">DNI: {study.pacientes.dni}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{study.titulo}</div>
                          <div className="text-sm text-gray-500">{study.tipo_estudio}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(study.fecha_estudio).toLocaleDateString('es-AR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {study.share_links.length > 0 ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {study.share_links[0].codigo}
                              </code>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(study.share_links[0])}`}>
                                {getStatusText(study.share_links[0])}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Expira: {new Date(study.share_links[0].expira_en).toLocaleDateString('es-AR')}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Sin código</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {study.archivos.length} archivo(s)
                        {study.archivos.some(f => f.es_principal) && (
                          <div className="text-xs text-primary-600">Con archivo principal</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleRegenerateClick(study.id)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Regenerar código
                        </button>
                        <Link
                          href={`/staff/estudios/${study.id}/logs`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Ver logs
                        </Link>
                        <Link
                          href={`/staff/estudios/${study.id}/shares`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Enlaces médicos
                        </Link>
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

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false)
            setSelectedStudyId(null)
          }}
          onConfirm={regenerateCode}
          title="Regenerar Código de Acceso"
          message="¿Estás seguro de regenerar el código? El código anterior será revocado y ya no funcionará para acceder al estudio."
          confirmText="Regenerar"
          cancelText="Cancelar"
          type="warning"
        />
      </div>
    </div>
  )
}
