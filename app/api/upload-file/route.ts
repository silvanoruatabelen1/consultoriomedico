import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const estudioId = formData.get('estudioId') as string
    const file = formData.get('file') as File
    const esPrincipal = formData.get('esPrincipal') === 'true'

    if (!estudioId || !file) {
      return NextResponse.json(
        { error: 'ID de estudio y archivo son requeridos' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/zip']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido' },
        { status: 400 }
      )
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Archivo demasiado grande (máximo 50MB)' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const uniqueFilename = `${estudioId}_${timestamp}.${fileExtension}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('estudios')
      .upload(`estudios/${uniqueFilename}`, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return NextResponse.json(
        { error: 'Error subiendo archivo' },
        { status: 500 }
      )
    }

    // Save file record to database
    const { data: archivo, error: archivoError } = await supabaseAdmin
      .from('archivos')
      .insert({
        estudio_id: estudioId,
        nombre_original: file.name,
        nombre_archivo: uniqueFilename,
        tipo_mime: file.type,
        tamaño_bytes: file.size,
        ruta_s3: uploadData.path,
        es_principal: esPrincipal
      })
      .select()
      .single()

    if (archivoError) {
      console.error('Error saving file record:', archivoError)
      return NextResponse.json(
        { error: 'Error guardando información del archivo' },
        { status: 500 }
      )
    }

    // Log file upload
    await supabaseAdmin
      .from('audit_log')
      .insert({
        evento: 'upload_file',
        estudio_id: estudioId,
        detalles: {
          archivo_nombre: archivo.nombre_original,
          tipo_mime: archivo.tipo_mime,
          tamaño_bytes: archivo.tamaño_bytes,
          es_principal: archivo.es_principal,
          staff_action: true
        }
      })

    return NextResponse.json({
      success: true,
      archivo: {
        id: archivo.id,
        nombre_original: archivo.nombre_original,
        tipo_mime: archivo.tipo_mime,
        tamaño_bytes: archivo.tamaño_bytes,
        es_principal: archivo.es_principal
      }
    })

  } catch (error) {
    console.error('Error in upload-file:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
