import Link from 'next/link';
import { Check, Dumbbell } from 'lucide-react';

const plans = [
  {
    name: 'Mensual',
    price: 50,
    period: 'mes',
    features: [
      'Acceso ilimitado al gimnasio',
      'Uso de todos los equipos',
      'Consulta con entrenadores',
      'App móvil incluida',
      'Clases grupales',
    ],
    popular: false,
  },
  {
    name: 'Trimestral',
    price: 135,
    period: '3 meses',
    savings: 'Ahorra 10%',
    features: [
      'Todo del plan Mensual',
      'Ahorro del 10%',
      'Renovación automática',
      'Prioridad en reservas',
    ],
    popular: true,
  },
  {
    name: 'Anual',
    price: 480,
    period: '12 meses',
    savings: 'Ahorra 20%',
    features: [
      'Todo del plan Trimestral',
      'Ahorro del 20%',
      'Regalo de bienvenida',
      'Sesión personalizada gratis',
      'Descuentos en productos',
    ],
    popular: false,
  },
  {
    name: 'Premium',
    price: 80,
    period: 'mes',
    features: [
      'Todo del plan Mensual',
      'Entrenador personal (2 sesiones/mes)',
      'Consulta con nutricionista',
      'Análisis de composición corporal',
      'Plan nutricional personalizado',
    ],
    popular: false,
  },
];

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">Energym</span>
            </Link>
            <Link href="/login" className="btn btn-primary">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Elige el Plan Perfecto para Ti
          </h1>
          <p className="text-xl text-gray-600">
            Planes flexibles adaptados a tus necesidades y objetivos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`card relative ${plan.popular ? 'border-2 border-primary-500 shadow-lg' : 'border-2 border-gray-200'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Más Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-primary-600">${plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-600">/{plan.period}</span>
                  )}
                </div>
                {plan.savings && (
                  <p className="text-sm text-green-600 font-medium">{plan.savings}</p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`btn w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
              >
                Elegir Plan
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            ¿Tienes preguntas sobre nuestros planes?
          </p>
          <Link href="/contacto" className="text-primary-600 hover:underline font-medium">
            Contáctanos
          </Link>
        </div>
      </main>
    </div>
  );
}

