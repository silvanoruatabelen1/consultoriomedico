import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones - Dra. María Isabel Ruata',
  description: 'Términos y condiciones de uso del consultorio de la Dra. María Isabel Ruata.',
  keywords: 'términos y condiciones, consultorio médico, condiciones de uso',
}

export default function Terminos() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-xl text-gray-600">
            Última actualización: {new Date().toLocaleDateString('es-AR')}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Aceptación de los términos
            </h2>
            <p className="text-gray-600">
              Al utilizar los servicios del consultorio de la Dra. María Isabel Ruata, 
              usted acepta estos términos y condiciones. Si no está de acuerdo con 
              alguna parte de estos términos, no debe utilizar nuestros servicios.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Servicios médicos
            </h2>
            <p className="text-gray-600 mb-4">
              Los servicios médicos ofrecidos incluyen:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Consultas médicas generales</li>
              <li>Medicina preventiva</li>
              <li>Control de salud</li>
              <li>Solicitud e interpretación de estudios de laboratorio</li>
              <li>Medicina familiar</li>
              <li>Atención de emergencias médicas</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Todos los servicios se brindan con profesionalismo y siguiendo 
              los más altos estándares médicos y éticos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Responsabilidades del paciente
            </h2>
            <p className="text-gray-600 mb-4">
              Como paciente, usted se compromete a:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Proporcionar información médica veraz y completa</li>
              <li>Asistir a las citas programadas o cancelar con anticipación</li>
              <li>Seguir las indicaciones médicas prescritas</li>
              <li>Informar sobre cambios en su estado de salud</li>
              <li>Respetar las normas del consultorio</li>
              <li>Mantener la confidencialidad de otros pacientes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Confidencialidad médica
            </h2>
            <p className="text-gray-600">
              Nos comprometemos a mantener la confidencialidad de toda la información 
              médica y personal de nuestros pacientes, de acuerdo con las leyes 
              de protección de datos y el secreto profesional médico.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Limitación de responsabilidad
            </h2>
            <p className="text-gray-600">
              Aunque nos esforzamos por brindar la mejor atención médica posible, 
              no podemos garantizar resultados específicos. La medicina es una 
              ciencia en constante evolución y cada paciente es único.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Cancelaciones y reprogramaciones
            </h2>
            <p className="text-gray-600">
              Las citas pueden ser canceladas o reprogramadas con al menos 24 horas 
              de anticipación. Las cancelaciones de último momento pueden estar 
              sujetas a una tarifa de cancelación.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Pagos y facturación
            </h2>
            <p className="text-gray-600 mb-4">
              Los pagos deben realizarse según las modalidades acordadas:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Efectivo al momento de la consulta</li>
              <li>Transferencia bancaria (con comprobante)</li>
              <li>Tarjeta de débito/crédito (según disponibilidad)</li>
              <li>Obra social (según convenio)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Uso del sitio web
            </h2>
            <p className="text-gray-600 mb-4">
              Al utilizar nuestro sitio web, usted acepta:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>No utilizar el sitio para fines ilegales o no autorizados</li>
              <li>No interferir con el funcionamiento del sitio</li>
              <li>Respetar los derechos de propiedad intelectual</li>
              <li>No intentar acceder a áreas restringidas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Modificaciones
            </h2>
            <p className="text-gray-600">
              Nos reservamos el derecho de modificar estos términos y condiciones 
              en cualquier momento. Los cambios serán notificados a través de 
              nuestro sitio web o por otros medios apropiados.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Ley aplicable
            </h2>
            <p className="text-gray-600">
              Estos términos y condiciones se rigen por las leyes de la República 
              Argentina. Cualquier disputa será resuelta en los tribunales competentes 
              de la jurisdicción correspondiente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Contacto
            </h2>
            <p className="text-gray-600 mb-4">
              Si tiene preguntas sobre estos términos y condiciones, puede contactarnos:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                <strong>Dra. María Isabel Ruata</strong><br />
                Email: [email de contacto]<br />
                Teléfono: [número de teléfono]<br />
                Dirección: [dirección del consultorio]
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
