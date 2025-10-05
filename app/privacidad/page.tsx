import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad - Dra. María Isabel Ruata',
  description: 'Política de privacidad y protección de datos del consultorio de la Dra. María Isabel Ruata.',
  keywords: 'política de privacidad, protección de datos, consultorio médico',
}

export default function Privacidad() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Política de Privacidad
          </h1>
          <p className="text-xl text-gray-600">
            Última actualización: {new Date().toLocaleDateString('es-AR')}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Información que recopilamos
            </h2>
            <p className="text-gray-600 mb-4">
              En nuestro consultorio médico, recopilamos la siguiente información personal:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Datos de identificación personal (nombre, apellido, DNI)</li>
              <li>Información de contacto (teléfono, email, dirección)</li>
              <li>Historia clínica y datos médicos</li>
              <li>Resultados de estudios médicos</li>
              <li>Información de seguros médicos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Cómo utilizamos su información
            </h2>
            <p className="text-gray-600 mb-4">
              Utilizamos su información personal para:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Brindar atención médica y tratamiento</li>
              <li>Mantener su historia clínica actualizada</li>
              <li>Coordinar citas y seguimientos médicos</li>
              <li>Comunicarnos con usted sobre su salud</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Protección de datos
            </h2>
            <p className="text-gray-600 mb-4">
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Encriptación de datos sensibles</li>
              <li>Acceso restringido al personal autorizado</li>
              <li>Copias de seguridad seguras</li>
              <li>Capacitación del personal en protección de datos</li>
              <li>Auditorías regulares de seguridad</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Compartir información
            </h2>
            <p className="text-gray-600 mb-4">
              No compartimos su información personal con terceros, excepto en los siguientes casos:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Con su consentimiento explícito</li>
              <li>Para cumplir con obligaciones legales</li>
              <li>En casos de emergencia médica</li>
              <li>Con otros profesionales de la salud involucrados en su tratamiento</li>
              <li>Con compañías de seguros cuando sea necesario</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Sus derechos
            </h2>
            <p className="text-gray-600 mb-4">
              Usted tiene los siguientes derechos respecto a su información personal:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Acceder a su información personal</li>
              <li>Rectificar datos incorrectos o incompletos</li>
              <li>Solicitar la eliminación de su información</li>
              <li>Limitar el procesamiento de sus datos</li>
              <li>Portabilidad de datos</li>
              <li>Oponerse al procesamiento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Retención de datos
            </h2>
            <p className="text-gray-600">
              Conservamos su información médica durante el tiempo requerido por la legislación vigente, 
              generalmente por un período mínimo de 10 años desde la última consulta, o según lo 
              establecido por las autoridades sanitarias competentes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Cookies y tecnologías similares
            </h2>
            <p className="text-gray-600">
              Nuestro sitio web puede utilizar cookies para mejorar su experiencia de navegación. 
              Puede configurar su navegador para rechazar cookies, aunque esto puede afectar 
              la funcionalidad del sitio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Cambios en esta política
            </h2>
            <p className="text-gray-600">
              Nos reservamos el derecho de actualizar esta política de privacidad. 
              Los cambios significativos serán notificados a través de nuestro sitio web 
              o por otros medios apropiados.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Contacto
            </h2>
            <p className="text-gray-600 mb-4">
              Si tiene preguntas sobre esta política de privacidad o desea ejercer sus derechos, 
              puede contactarnos:
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
