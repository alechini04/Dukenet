export const WHATSAPP = [
  { tel: '573163289924', label: '316 328 9924' },
  { tel: '573203945482', label: '320 394 5482' },
];

export const wa = (tel = WHATSAPP[0].tel, text?: string) =>
  `https://wa.me/${tel}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const FRENTES = [
  { id: 'inicio', code: 'FR-01', name: 'Inicio' },
  { id: 'manifiesto', code: 'FR-02', name: 'Manifiesto' },
  { id: 'obras', code: 'FR-03', name: 'Obras' },
  { id: 'entregadas', code: 'FR-04', name: 'Entregadas' },
  { id: 'cronograma', code: 'FR-05', name: 'Cronograma' },
  { id: 'panel', code: 'FR-06', name: 'Panel' },
  { id: 'contacto', code: 'FR-07', name: 'Cotizar' },
];

export const SERVICIOS = [
  {
    id: 'tienda',
    letra: 'A',
    nombre: 'Tienda en línea',
    corto: 'Vende 24/7',
    texto: 'Vende 24/7: carrito, pasarela de pagos, envíos, cupones y combos. Catálogo cargado, pruebas en celular y capacitación para que la manejes tú.',
    incluye: ['Pasarela de pagos', 'Envíos', 'Inventario', 'Cupones y combos', 'Capacitación'],
    cta: 'Cotizar tienda',
    foto: '/fotos/obra-tienda.jpg',
    alt: 'Productos organizados sobre una mesa, listos para fotografiar',
  },
  {
    id: 'negocio',
    letra: 'B',
    nombre: 'Página de negocio',
    corto: 'Convence antes del primer mensaje',
    texto: 'La página que convence antes de que te escriban: tus servicios, tu trabajo, tus precios si quieres, y contacto directo por WhatsApp desde cualquier pantalla.',
    incluye: ['Servicios', 'Menú o catálogo', 'Portafolio', 'WhatsApp en cada pantalla'],
    cta: 'Cotizar página',
    foto: '/fotos/obra-negocio.jpg',
    alt: 'Clientes dentro de un café atendido detrás de la barra',
  },
  {
    id: 'landing',
    letra: 'C',
    nombre: 'Landing de campaña',
    corto: 'Una página, un objetivo',
    texto: 'Una página, un objetivo. Para lanzamientos, promociones y pauta: cada clic que pagas llega a un sitio hecho para convertirlo, no a tu inicio.',
    incluye: ['Lanzamientos', 'Promociones', 'Pauta en redes', 'Medición de conversión'],
    cta: 'Cotizar landing',
    foto: '/fotos/obra-landing.jpg',
    alt: 'Persona revisando su celular frente a un portátil',
  },
  {
    id: 'datos',
    letra: 'D',
    nombre: 'Datos y acompañamiento',
    corto: 'Donde el negocio escala',
    texto: 'Un panel en español y un reporte cada mes: qué se vende, qué no, de dónde llega la gente y qué vamos a ajustar. Aquí es donde el negocio empieza a escalar.',
    incluye: ['Panel en español', 'Reporte mensual', 'Mejoras continuas'],
    cta: 'Cotizar acompañamiento',
    foto: '/fotos/obra-datos.jpg',
    alt: 'Portátil con gráficas junto a una libreta de notas',
  },
];

export const FASES = [
  { n: '01', nombre: 'Diagnóstico', texto: 'Videollamada o presencial: tu negocio, tus productos y a quién le vendes. Salimos con un diagnóstico escrito. Sin costo.', entrega: 'Diagnóstico escrito' },
  { n: '02', nombre: 'Propuesta', texto: 'Qué páginas lleva, qué hace cada una, precio fijo y fecha de entrega. Firmas sabiendo exactamente qué recibes.', entrega: 'Precio fijo y fecha' },
  { n: '03', nombre: 'Diseño', texto: 'Ves tu página antes de que exista, pantalla por pantalla, y la ajustamos hasta que sea inconfundiblemente tuya.', entrega: 'Pantallas aprobadas' },
  { n: '04', nombre: 'Lanzamiento', texto: 'Programación a mano, pruebas en celular, pagos y envíos configurados, medición instalada y salida al aire.', entrega: 'Sitio en producción' },
  { n: '05', nombre: 'Crecer', texto: 'Cada mes: reporte, decisiones y ajustes. Aquí se ve la diferencia entre tener página y tener un canal de ventas.', entrega: 'Reporte mes a mes' },
];

export const CIUDADES = ['Bucaramanga', 'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cúcuta', 'Pereira', 'Santa Marta'];
