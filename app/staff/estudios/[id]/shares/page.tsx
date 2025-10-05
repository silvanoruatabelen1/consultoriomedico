'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface MedicalShareLink {
  id: string
  token: string
  expira_en: string
  creado_por_paciente: boolean
  revocado: boolean
  revocado_en: string | null
  motivo_revocacion: string | null
  created_at: string
}

interface Study {
  id: string
  titulo: string
  paciente: {
    nombre: string
    apellido: string
    dni: string
  }
}

export default function StudySharesPage() {
  const params = useParams()
  const estudioId = params.id as string
  
  const [study, setStudy] = useState<Study | null>(null)
  const [shares, setShares] = useState<MedicalShareLink[]>([])
  const [loading, setLoading] = useState(true)
  const [revoking, setRevoking] = useState<string | null>(null)

  useEffect(() => {
    if (estudioId) {
      fetchShares()
    }
  }, [estudioId])

  const fetchShares = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/studies/${estudioId}/medical-shares`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error obteniendo enlaces de compartir')
      }

      setStudy(result.study)
      setShares(result.shares)
    } catch (error) {
      console.error('Error fetching shares:', error)
      toast.error('Error cargando enlaces de compartir')
    } finally {
      setLoading(false)
    }
  }

  const handleRevoke = async (token: string) => {
    if (!confirm('¿Estás seguro de revocar este enlace? El enlace dejará de funcionar inmediatamente.')) {
      return
    }

    setRevoking(token)
    try {
      const response = await fetch('/api/medical-share/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          motivo: 'Revocado por el staff'
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error revocando enlace')
      }

      toast.success('Enlace revocado exitosamente')
      fetchShares() // Refresh the list
    } catch (error) {
      console.error('Error revoking share:', error)
      toast.error('Error revocando enlace')
    } finally {
      setRevoking(null)
    }
  }

  const getStatusColor = (share: MedicalShareLink) => {
    if (share.revocado) return 'bg-red-100 text-red-800'
    if (new Date(share.expira_en) < new Date()) return 'bg-gray-100 text-gray-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (share: MedicalShareLink) => {
    if (share.revocado) return 'Revocado'
    if (new Date(share.expira_en) < new Date()) return 'Expirado'
    return 'Activo'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/staff/estudios" className="text-primary-600 hover:text-primary-800">
              ← Volver a estudios
            </Link>
          </div>
          
          {study && (
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Enlaces de Compartir Médico
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Estudio:</span>
                  <div className="text-gray-900">{study.titulo}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Paciente:</span>
                  <div className="text-gray-900">{study.paciente.nombre} {study.paciente.apellido}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">DNI:</span>
                  <div className="text-gray-900">{study.paciente.dni}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shares Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Enlaces de Compartir ({shares.length})
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Enlaces temporales para compartir con médicos externos
            </p>
          </div>

          {shares.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No hay enlaces de compartir para este estudio
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creado por
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expira
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shares.map((share) => (
                    <tr key={share.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {share.token.substring(0, 16)}...
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(share)}`}>
                          {getStatusText(share)}
                        </span>
                        {share.revocado && share.motivo_revocacion && (
                          <div className="text-xs text-gray-500 mt-1">
                            Motivo: {share.motivo_revocacion}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {share.creado_por_paciente ? 'Paciente' : 'Staff'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(share.expira_en).toLocaleString('es-AR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(share.created_at).toLocaleString('es-AR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {!share.revocado && new Date(share.expira_en) > new Date() && (
                          <button
                            onClick={() => handleRevoke(share.token)}
                            disabled={revoking === share.token}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            {revoking === share.token ? 'Revocando...' : 'Revocar'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
