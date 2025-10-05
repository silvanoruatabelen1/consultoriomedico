import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre mí - Dra. María Isabel Ruata',
  description: 'Conoce la trayectoria profesional y experiencia de la Dra. María Isabel Ruata en el campo médico.',
  keywords: 'Dra. María Isabel Ruata, médico, experiencia, trayectoria profesional',
}

export default function SobreMi() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sobre mí
          </h1>
          <p className="text-xl text-gray-600">
            Conoce mi trayectoria y compromiso con la salud
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Dra. María Isabel Ruata
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Soy una profesional de la salud comprometida con brindar atención médica 
                de calidad y personalizada a cada uno de mis pacientes. Mi enfoque se 
                centra en el bienestar integral de las personas.
              </p>
              <p>
                Con años de experiencia en el campo médico, he desarrollado un profundo 
                conocimiento y habilidades que me permiten ofrecer diagnósticos precisos 
                y tratamientos efectivos.
              </p>
              <p>
                Mi filosofía de trabajo se basa en la escucha activa, la empatía y el 
                respeto hacia cada paciente, entendiendo que cada persona es única y 
                merece una atención individualizada.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-8">
            <div className="bg-primary-600 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-4xl font-bold">MR</span>
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-900 mb-4">
              Especialidades
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Medicina General
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Medicina Preventiva
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Control de Salud
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Seguimiento Médico
              </li>
            </ul>
          </div>
        </div>

        {/* Experience Section */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Experiencia Profesional</h3>
          <div className="space-y-6">
            <div className="border-l-4 border-primary-600 pl-6">
              <h4 className="text-lg font-semibold text-gray-900">Formación Académica</h4>
              <p className="text-gray-600 mt-2">
                Graduada en Medicina con especialización en medicina general y 
                medicina preventiva. Formación continua en las últimas técnicas 
                y avances médicos.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-600 pl-6">
              <h4 className="text-lg font-semibold text-gray-900">Experiencia Clínica</h4>
              <p className="text-gray-600 mt-2">
                Amplia experiencia en atención ambulatoria, diagnóstico y tratamiento 
                de diversas patologías. Enfoque en medicina preventiva y promoción 
                de la salud.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-600 pl-6">
              <h4 className="text-lg font-semibold text-gray-900">Compromiso Profesional</h4>
              <p className="text-gray-600 mt-2">
                Mi compromiso es brindar atención médica de calidad, manteniendo 
                los más altos estándares éticos y profesionales en cada consulta.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Mis Valores</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Empatía</h4>
              <p className="text-gray-600">
                Entiendo y me preocupo por las necesidades de cada paciente
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Excelencia</h4>
              <p className="text-gray-600">
                Busco siempre la mejor calidad en la atención médica
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Confidencialidad</h4>
              <p className="text-gray-600">
                Respeto absoluto por la privacidad de mis pacientes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
