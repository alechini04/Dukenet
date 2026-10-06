/**
 * Identidad legal y fechas de las políticas.
 *
 * COMPLETAR ANTES DE PUBLICAR: la Ley 1581 de 2012 y el Decreto 1074 de 2015
 * exigen que la política de tratamiento identifique al responsable con su
 * razón social, domicilio, dirección, correo y teléfono. Lo que no sabemos se
 * deja vacío y la página lo marca como pendiente en vez de inventarlo.
 */
export const LEGAL = {
  nombre: 'DukeNet',
  /** Razón social completa si está constituida; si opera como persona natural, el nombre. */
  razonSocial: '',
  /** NIT o cédula del responsable. */
  nit: '',
  /** Dirección física de notificaciones. */
  domicilio: '',
  ciudad: 'Bucaramanga, Santander',
  pais: 'Colombia',
  /** Correo para ejercer derechos de habeas data. */
  correo: '',
  /** Fecha de entrada en vigencia de las políticas. */
  vigencia: '5 de octubre de 2026',
  /** Última revisión del texto. */
  actualizado: '5 de octubre de 2026',
  /** Vigencia de la base de datos: mientras dure la relación y los plazos legales. */
  vigenciaBase: 'mientras se mantenga la relación comercial y durante los plazos de conservación que exija la ley',
};

/** Marca visible para los datos que faltan por completar. */
export const PENDIENTE = '[por completar]';
export const dato = (v: string) => (v && v.trim() ? v : PENDIENTE);
