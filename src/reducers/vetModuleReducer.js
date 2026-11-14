import { farmReducer as baseFarmReducer, initialFarmState as baseInitialFarmState } from './farmReducer';

export const VET_PROTO_STORAGE_KEY = 'avicontrol_vet_proto_v2';

export const initialVetProtoState = {
  // 1. Galpones y Lotes del ecosistema (Módulo 1 / Plan 001)
  vetBarns: [
    {
      id: 'galpon-1',
      nombre: 'Galpón 1',
      aforoMaximo: 8000,
      estado: 'PRODUCTIVO',
      loteId: 'lote-001',
      loteNombre: 'Lote #LDP-001',
      loteCodigo: '#LDP-001',
      poblacionInicial: 5000,
      poblacionActual: 4982,
      edadDias: 38,
      fechaIngreso: '2026-09-23'
    },
    {
      id: 'galpon-2',
      nombre: 'Galpón 2',
      aforoMaximo: 6000,
      estado: 'PRODUCTIVO',
      loteId: 'lote-002',
      loteNombre: 'Lote #LDP-002',
      loteCodigo: '#LDP-002',
      poblacionInicial: 6000,
      poblacionActual: 5950,
      edadDias: 12,
      fechaIngreso: '2026-10-19'
    },
    {
      id: 'galpon-3',
      nombre: 'Galpón 3',
      aforoMaximo: 6000,
      estado: 'AISLAMIENTO',
      loteId: 'lote-003',
      loteNombre: 'Lote #LDP-003',
      loteCodigo: '#LDP-003',
      poblacionInicial: 3600,
      poblacionActual: 3480,
      edadDias: 35,
      fechaIngreso: '2026-09-26'
    },
    {
      id: 'galpon-4',
      nombre: 'Galpón 4',
      aforoMaximo: 6000,
      estado: 'PRODUCTIVO',
      loteId: 'lote-004',
      loteNombre: 'Lote #LDP-004',
      loteCodigo: '#LDP-004',
      poblacionInicial: 4000,
      poblacionActual: 3950,
      edadDias: 29,
      fechaIngreso: '2026-10-02'
    },
    {
      id: 'galpon-5',
      nombre: 'Galpón 5',
      aforoMaximo: 8000,
      estado: 'AISLAMIENTO',
      loteId: 'lote-005',
      loteNombre: 'Lote #LDP-005',
      loteCodigo: '#LDP-005',
      poblacionInicial: 8000,
      poblacionActual: 7920,
      edadDias: 21,
      fechaIngreso: '2026-10-10'
    },
    {
      id: 'galpon-6',
      nombre: 'Galpón 6',
      aforoMaximo: 8000,
      estado: 'AISLAMIENTO',
      loteId: 'lote-006',
      loteNombre: 'Lote #LDP-006',
      loteCodigo: '#LDP-006',
      poblacionInicial: 7200,
      poblacionActual: 7100,
      edadDias: 24,
      fechaIngreso: '2026-10-07'
    },
    {
      id: 'galpon-7',
      nombre: 'Galpón 7',
      aforoMaximo: 7000,
      estado: 'AISLAMIENTO',
      loteId: 'lote-007',
      loteNombre: 'Lote #LDP-007',
      loteCodigo: '#LDP-007',
      poblacionInicial: 6500,
      poblacionActual: 6400,
      edadDias: 19,
      fechaIngreso: '2026-10-12'
    },
    {
      id: 'galpon-8',
      nombre: 'Galpón 8',
      aforoMaximo: 5000,
      estado: 'VACIADO_SANITARIO',
      loteId: 'lote-008',
      loteNombre: 'Lote #LDP-008',
      loteCodigo: '#LDP-008',
      poblacionInicial: 4200,
      poblacionActual: 0,
      edadDias: 40,
      fechaIngreso: '2026-09-21'
    },
    {
      id: 'galpon-9',
      nombre: 'Galpón 9',
      aforoMaximo: 5000,
      estado: 'PRODUCTIVO',
      loteId: 'lote-009',
      loteNombre: 'Lote #LDP-009',
      loteCodigo: '#LDP-009',
      poblacionInicial: 4800,
      poblacionActual: 4750,
      edadDias: 16,
      fechaIngreso: '2026-10-15'
    },
    {
      id: 'galpon-10',
      nombre: 'Galpón 10',
      aforoMaximo: 7500,
      estado: 'EN_COSECHA',
      loteId: 'lote-010',
      loteNombre: 'Lote #LDP-010',
      loteCodigo: '#LDP-010',
      poblacionInicial: 7400,
      poblacionActual: 7280,
      edadDias: 46,
      fechaIngreso: '2026-09-15'
    },
    {
      id: 'galpon-11',
      nombre: 'Galpón 11',
      aforoMaximo: 7500,
      estado: 'EN_COSECHA',
      loteId: 'lote-011',
      loteNombre: 'Lote #LDP-011',
      loteCodigo: '#LDP-011',
      poblacionInicial: 7300,
      poblacionActual: 7190,
      edadDias: 45,
      fechaIngreso: '2026-09-16'
    },
    {
      id: 'galpon-12',
      nombre: 'Galpón 12',
      aforoMaximo: 8000,
      estado: 'PRODUCTIVO',
      loteId: 'lote-012',
      loteNombre: 'Lote #LDP-012',
      loteCodigo: '#LDP-012',
      poblacionInicial: 7800,
      poblacionActual: 7740,
      edadDias: 14,
      fechaIngreso: '2026-10-17'
    },
    {
      id: 'galpon-13',
      nombre: 'Galpón 13',
      aforoMaximo: 8000,
      estado: 'PRODUCTIVO',
      loteId: 'lote-013',
      loteNombre: 'Lote #LDP-013',
      loteCodigo: '#LDP-013',
      poblacionInicial: 7600,
      poblacionActual: 7550,
      edadDias: 10,
      fechaIngreso: '2026-10-21'
    },
    {
      id: 'galpon-14',
      nombre: 'Galpón 14',
      aforoMaximo: 8000,
      estado: 'PRODUCTIVO',
      loteId: 'lote-014',
      loteNombre: 'Lote #LDP-014',
      loteCodigo: '#LDP-014',
      poblacionInicial: 7900,
      poblacionActual: 7860,
      edadDias: 8,
      fechaIngreso: '2026-10-23'
    }
  ],

  // 2. Bandeja de Alertas Sanitarias Inmutables (Plan 013 / Spec 018 - M-01)
  vetSanitaryAlerts: [
    {
      id: 'alerta-001',
      fechaHoraEmision: '25 Oct 2026, 07:15 AM',
      fechaLarga: '25 de octubre de 2026 a las 07:15 AM',
      prioridad: 'ALTA',
      estado: 'Pendiente de atención veterinaria',
      galpon: {
        galponId: 'galpon-1',
        nombre: 'Galpón 1',
        aforoMaximo: 8000,
        estado: 'PRODUCTIVO'
      },
      lote: {
        loteId: 'lote-001',
        nombre: 'Lote #LDP-001',
        poblacionActual: 4982,
        edadEnDias: 38
      },
      mortalidadAnormal: {
        registroId: 'mort-anorm-001',
        cantidadMuertes: 18,
        porcentajeMortalidad: 0.36,
        nivelSeveridad: 'ALTA',
        causaProbable: 'Problemas digestivos / entéricos',
        observaciones:
          'Durante la inspección matutina se hallaron 18 aves muertas cerca de la línea de bebederos del sector norte, con presencia de heces sanguinolentas y aves decaídas con plumas erizadas.',
        reportadoPor: 'Operario de Granja (Turno Mañana)'
      }
    },
    {
      id: 'alerta-002',
      fechaHoraEmision: '24 Oct 2026, 17:40 PM',
      fechaLarga: '24 de octubre de 2026 a las 17:40 PM',
      prioridad: 'CRITICA',
      estado: 'Pendiente de atención veterinaria',
      galpon: {
        galponId: 'galpon-4',
        nombre: 'Galpón 4',
        aforoMaximo: 6000,
        estado: 'PRODUCTIVO'
      },
      lote: {
        loteId: 'lote-004',
        nombre: 'Lote #LDP-004',
        poblacionActual: 3950,
        edadEnDias: 29
      },
      mortalidadAnormal: {
        registroId: 'mort-anorm-002',
        cantidadMuertes: 46,
        porcentajeMortalidad: 1.15,
        nivelSeveridad: 'CRÍTICA',
        causaProbable: 'Cuadro respiratorio agudo / cianosis',
        observaciones:
          'Se detectaron 46 bajas súbitas en el sector central acompañadas de jadeo intenso, cianosis en crestas y barbillas y caída brusca en el consumo de agua.',
        reportadoPor: 'Operario de Granja (Turno Tarde)'
      }
    },
    {
      id: 'alerta-003',
      fechaHoraEmision: '23 Oct 2026, 06:30 AM',
      fechaLarga: '23 de octubre de 2026 a las 06:30 AM',
      prioridad: 'EMERGENCIA_SANITARIA',
      estado: 'Pendiente de atención veterinaria',
      galpon: {
        galponId: 'galpon-3',
        nombre: 'Galpón 3',
        aforoMaximo: 6000,
        estado: 'AISLAMIENTO'
      },
      lote: {
        loteId: 'lote-003',
        nombre: 'Lote #LDP-003',
        poblacionActual: 3500,
        edadEnDias: 35
      },
      mortalidadAnormal: {
        registroId: 'mort-anorm-003',
        cantidadMuertes: 95,
        porcentajeMortalidad: 2.64,
        nivelSeveridad: 'EMERGENCIA SANITARIA',
        causaProbable: 'Signos nerviosos severos y mortalidad aguda masiva',
        observaciones:
          'Hallazgo crítico al inicio de la jornada con 95 aves muertas, parálisis de alas y patas, edema facial severo y depresión generalizada del lote.',
        reportadoPor: 'Operario de Granja (Turno Mañana)'
      }
    }
  ],

  // 3. Catálogo de Enfermedades (Plan 005 / Spec 009 - P-03)
  vetCatalogDiseases: [
    {
      id: 'enf-aspergilosis',
      nombre: 'Aspergilosis Aviar',
      tipo: 'FUNGICA',
      nivelRiesgo: 'MEDIO',
      descripcionClinica:
        'Disnea, jadeo con pico abierto, somnolencia e inapetencia por infección respiratoria micótica.',
      requiereSacrificioSanitario: false,
      version: 1
    },
    {
      id: 'enf-bronquitis',
      nombre: 'Bronquitis Infecciosa Aviar',
      tipo: 'VIRAL',
      nivelRiesgo: 'MEDIO',
      descripcionClinica:
        'Afección respiratoria aguda con estertores traqueales, tos, secreción nasal y caída de consumo.',
      requiereSacrificioSanitario: false,
      version: 1
    },
    {
      id: 'enf-coccidiosis',
      nombre: 'Coccidiosis Aviar',
      tipo: 'PARASITARIA',
      nivelRiesgo: 'ALTO',
      descripcionClinica:
        'Enteritis parasitaria con diarrea sanguinolenta, deshidratación, plumas erizadas y retraso de crecimiento.',
      requiereSacrificioSanitario: false,
      version: 1
    },
    {
      id: 'enf-coriza',
      nombre: 'Coriza Infecciosa Aviar',
      tipo: 'BACTERIANA',
      nivelRiesgo: 'BAJO',
      descripcionClinica:
        'Inflamación aguda del tracto respiratorio superior, edema facial, conjuntivitis y descarga nasal serosa.',
      requiereSacrificioSanitario: false,
      version: 1
    },
    {
      id: 'enf-newcastle',
      nombre: 'Enfermedad de Newcastle',
      tipo: 'VIRAL',
      nivelRiesgo: 'CRITICO',
      descripcionClinica:
        'Signos nerviosos severos (tortícolis y parálisis), disnea aguda y mortalidad masiva en el galpón.',
      requiereSacrificioSanitario: true,
      version: 1
    },
    {
      id: 'enf-influenza',
      nombre: 'Influenza Aviar (H5N1)',
      tipo: 'VIRAL',
      nivelRiesgo: 'CRITICO',
      descripcionClinica:
        'Edema facial severo, cianosis de cresta y barbillas, hemorragias subcutáneas y muerte súbita.',
      requiereSacrificioSanitario: true,
      version: 1
    }
  ],

  // 4. Catálogo de Medicamentos del Inventario Central y Recepciones FEFO (Planes 002, 010 y 012)
  vetInventoryMedicines: [
    {
      id: 'med-amprolio',
      nombre: 'Amprolio 20% Solución',
      unidadBase: 'GRAMO',
      presentacion: 'Bolsa 500 g'
    },
    {
      id: 'med-tilosina',
      nombre: 'Tilosina Tartrato 50%',
      unidadBase: 'GRAMO',
      presentacion: 'Frasco 500 g'
    },
    {
      id: 'med-enrofloxacina',
      nombre: 'Enrofloxacina 10% Oral',
      unidadBase: 'MILILITRO',
      presentacion: 'Frasco 250 ml'
    },
    {
      id: 'med-toltrazuril',
      nombre: 'Toltrazuril 2.5% Solución',
      unidadBase: 'MILILITRO',
      presentacion: 'Frasco 500 ml'
    },
    {
      id: 'med-sulfato-cobre',
      nombre: 'Sulfato de Cobre Solución',
      unidadBase: 'GRAMO',
      presentacion: 'Bolsa 500 g'
    }
  ],

  vetFefoReceptions: [
    {
      id: 'rec-med-01',
      codigoLoteRecepcion: 'MED-2026-01',
      medicamentoId: 'med-amprolio',
      medicamentoNombre: 'Amprolio 20% Solución',
      unidadBase: 'GRAMO',
      saldoDisponibleUnidadBase: 150.0,
      precioNetoHistoricoUnidadBase: 12.5,
      fechaVencimiento: '2026-11-15',
      moneda: 'COP',
      estado: 'CONFIRMADA'
    },
    {
      id: 'rec-med-02',
      codigoLoteRecepcion: 'MED-2026-02',
      medicamentoId: 'med-amprolio',
      medicamentoNombre: 'Amprolio 20% Solución',
      unidadBase: 'GRAMO',
      saldoDisponibleUnidadBase: 850.0,
      precioNetoHistoricoUnidadBase: 14.0,
      fechaVencimiento: '2026-12-20',
      moneda: 'COP',
      estado: 'CONFIRMADA'
    },
    {
      id: 'rec-med-03',
      codigoLoteRecepcion: 'MED-2026-03',
      medicamentoId: 'med-amprolio',
      medicamentoNombre: 'Amprolio 20% Solución',
      unidadBase: 'GRAMO',
      saldoDisponibleUnidadBase: 1000.0,
      precioNetoHistoricoUnidadBase: 15.2,
      fechaVencimiento: '2027-02-10',
      moneda: 'COP',
      estado: 'CONFIRMADA'
    },
    {
      id: 'rec-med-04',
      codigoLoteRecepcion: 'MED-2026-04',
      medicamentoId: 'med-tilosina',
      medicamentoNombre: 'Tilosina Tartrato 50%',
      unidadBase: 'GRAMO',
      saldoDisponibleUnidadBase: 250.0,
      precioNetoHistoricoUnidadBase: 28.0,
      fechaVencimiento: '2026-11-25',
      moneda: 'COP',
      estado: 'CONFIRMADA'
    },
    {
      id: 'rec-med-05',
      codigoLoteRecepcion: 'MED-2026-05',
      medicamentoId: 'med-tilosina',
      medicamentoNombre: 'Tilosina Tartrato 50%',
      unidadBase: 'GRAMO',
      saldoDisponibleUnidadBase: 750.0,
      precioNetoHistoricoUnidadBase: 31.5,
      fechaVencimiento: '2027-01-15',
      moneda: 'COP',
      estado: 'CONFIRMADA'
    },
    {
      id: 'rec-med-06',
      codigoLoteRecepcion: 'MED-2026-06',
      medicamentoId: 'med-enrofloxacina',
      medicamentoNombre: 'Enrofloxacina 10% Oral',
      unidadBase: 'MILILITRO',
      saldoDisponibleUnidadBase: 500.0,
      precioNetoHistoricoUnidadBase: 18.0,
      fechaVencimiento: '2026-12-01',
      moneda: 'COP',
      estado: 'CONFIRMADA'
    },
    {
      id: 'rec-med-07',
      codigoLoteRecepcion: 'MED-2026-07',
      medicamentoId: 'med-toltrazuril',
      medicamentoNombre: 'Toltrazuril 2.5% Solución',
      unidadBase: 'MILILITRO',
      saldoDisponibleUnidadBase: 1000.0,
      precioNetoHistoricoUnidadBase: 22.0,
      fechaVencimiento: '2027-01-10',
      moneda: 'COP',
      estado: 'CONFIRMADA'
    },
    {
      id: 'rec-med-08',
      codigoLoteRecepcion: 'MED-2026-08',
      medicamentoId: 'med-sulfato-cobre',
      medicamentoNombre: 'Sulfato de Cobre Solución',
      unidadBase: 'GRAMO',
      saldoDisponibleUnidadBase: 600.0,
      precioNetoHistoricoUnidadBase: 8.5,
      fechaVencimiento: '2027-04-01',
      moneda: 'COP',
      estado: 'CONFIRMADA'
    }
  ],

  // 5. Catálogo de Medicaciones (Plan 006 / Spec 008 - P-04)
  vetCatalogMedications: [
    {
      id: 'medicacion-001',
      enfermedadId: 'enf-coccidiosis',
      enfermedadNombre: 'Coccidiosis Aviar',
      medicamentoId: 'med-amprolio',
      medicamentoNombre: 'Amprolio 20% Solución',
      dosis: '200 g diluidos en 100 L de agua potable',
      diasTotales: 5,
      descripcion: 'Agua de bebida en bebederos automáticos, renovando cada 24 horas',
      version: 1
    },
    {
      id: 'medicacion-002',
      enfermedadId: 'enf-bronquitis',
      enfermedadNombre: 'Bronquitis Infecciosa Aviar',
      medicamentoId: 'med-tilosina',
      medicamentoNombre: 'Tilosina Tartrato 50%',
      dosis: '0.5 g por litro de agua de bebida',
      diasTotales: 7,
      descripcion: 'Suministro continuo en agua de bebida matutina como soporte respiratorio',
      version: 1
    },
    {
      id: 'medicacion-003',
      enfermedadId: 'enf-coriza',
      enfermedadNombre: 'Coriza Infecciosa Aviar',
      medicamentoId: 'med-enrofloxacina',
      medicamentoNombre: 'Enrofloxacina 10% Oral',
      dosis: '10 mg por kg de peso vivo',
      diasTotales: 5,
      descripcion: 'Vía oral disuelto en el tanque principal del galpón durante 5 días continuos',
      version: 1
    },
    {
      id: 'medicacion-004',
      enfermedadId: 'enf-coccidiosis',
      enfermedadNombre: 'Coccidiosis Aviar',
      medicamentoId: 'med-toltrazuril',
      medicamentoNombre: 'Toltrazuril 2.5% Solución',
      dosis: '7 mg por kg de peso vivo',
      diasTotales: 2,
      descripcion: 'Agua de bebida continua durante 24 horas por 2 días consecutivos',
      version: 1
    },
    {
      id: 'medicacion-005',
      enfermedadId: 'enf-aspergilosis',
      enfermedadNombre: 'Aspergilosis Aviar',
      medicamentoId: 'med-sulfato-cobre',
      medicamentoNombre: 'Sulfato de Cobre Solución',
      dosis: '1 g por cada 2 litros de agua',
      diasTotales: 3,
      descripcion: 'Agua de bebida en bebederos plásticos evitando tuberías metálicas',
      version: 1
    }
  ],

  // 6. Solicitudes de Validación de Aislamiento (Plan 014 / Specs 020 y 010 - P-05 y M-04)
  vetIsolationRequests: [
    {
      id: 'sol-aisl-001',
      galponId: 'galpon-5',
      galponNombre: 'Galpón 5',
      loteId: 'lote-005',
      loteNombre: 'Lote #LDP-005',
      poblacionActualReportada: 7920,
      edadLoteDias: 21,
      fechaEmision: '25 Oct 2026',
      horaEmision: '13:10 PM',
      emitidaTexto: '25 Oct 2026, 13:10 PM',
      motivo: 'Sospecha de cuadro respiratorio agudo en sector norte',
      signosObservados:
        'Estertores traqueales, decaimiento general, plumas erizadas y disminución en el consumo de agua.',
      estadoActualGalpon: 'PRODUCTIVO',
      estado: 'PENDIENTE_VALIDACION',
      decision: null,
      version: 1
    },
    {
      id: 'sol-aisl-002',
      galponId: 'galpon-1',
      galponNombre: 'Galpón 1',
      loteId: 'lote-001',
      loteNombre: 'Lote #LDP-001',
      poblacionActualReportada: 4982,
      edadLoteDias: 38,
      fechaEmision: '25 Oct 2026',
      horaEmision: '09:45 AM',
      emitidaTexto: '25 Oct 2026, 09:45 AM',
      motivo: 'Incremento repentino de aves decaídas y diarrea',
      signosObservados: 'Aves postradas cerca de bebederos y heces sanguinolentas.',
      estadoActualGalpon: 'PRODUCTIVO',
      estado: 'PENDIENTE_VALIDACION',
      decision: null,
      version: 1
    },
    {
      id: 'sol-aisl-003',
      galponId: 'galpon-4',
      galponNombre: 'Galpón 4',
      loteId: 'lote-004',
      loteNombre: 'Lote #LDP-004',
      poblacionActualReportada: 3950,
      edadLoteDias: 29,
      fechaEmision: '24 Oct 2026',
      horaEmision: '16:20 PM',
      emitidaTexto: '24 Oct 2026, 16:20 PM',
      motivo: 'Decaimiento súbito y jadeo constante en zona central',
      signosObservados: 'Crestas pálidas, letargo generalizado y caída de ingesta.',
      estadoActualGalpon: 'PRODUCTIVO',
      estado: 'PENDIENTE_VALIDACION',
      decision: null,
      version: 1
    },
    {
      id: 'sol-aisl-004',
      galponId: 'galpon-7',
      galponNombre: 'Galpón 7',
      loteId: 'lote-007',
      loteNombre: 'Lote #LDP-007',
      poblacionActualReportada: 6400,
      edadLoteDias: 19,
      fechaEmision: '23 Oct 2026',
      horaEmision: '15:20 PM',
      emitidaTexto: '23 Oct 2026, 15:20 PM',
      motivo: 'Presencia de diarrea mucosa y bajo consumo de alimento',
      signosObservados: 'Plumas erizadas, camas húmedas y heces rojizas.',
      estadoActualGalpon: 'AISLAMIENTO',
      estado: 'APROBADA',
      decision: {
        veterinarioId: 'vet-001',
        decididaEn: '23 Oct 2026, 15:40 PM',
        resultado: 'APROBADA',
        observaciones: 'Aislamiento aprobado para diagnóstico clínico.'
      },
      version: 2
    },
    {
      id: 'sol-aisl-005',
      galponId: 'galpon-2',
      galponNombre: 'Galpón 2',
      loteId: 'lote-002',
      loteNombre: 'Lote #LDP-002',
      poblacionActualReportada: 5950,
      edadLoteDias: 12,
      fechaEmision: '21 Oct 2026',
      horaEmision: '11:05 AM',
      emitidaTexto: '21 Oct 2026, 11:05 AM',
      motivo: 'Jadeo leve en horas de mediodía por temperatura',
      signosObservados: 'Aves abriendo el pico en horas pico de calor sin mortalidad asociada.',
      estadoActualGalpon: 'PRODUCTIVO',
      estado: 'RECHAZADA',
      decision: {
        veterinarioId: 'vet-001',
        decididaEn: '21 Oct 2026, 11:30 AM',
        resultado: 'RECHAZADA',
        observaciones: 'Estrés calórico transitorio sin riesgo infeccioso.'
      },
      version: 2
    }
  ],

  // 7. Diagnósticos Clínicos de Galpón con Snapshot Inmutable (Plan 015 / Spec 011 - P-06 y M-05)
  vetActiveDiagnoses: [
    {
      id: 'diag-001',
      galponId: 'galpon-7',
      galponNombreHistorico: 'Galpón 7',
      loteId: 'lote-007',
      loteNombreHistorico: 'Lote #LDP-007',
      poblacionMomento: 6400,
      enfermedadId: 'enf-coccidiosis',
      nombreEnfermedadHistorico: 'Coccidiosis Aviar',
      requiereSacrificioHistorico: false,
      habilitaSacrificioSanitario: false,
      medicacionId: 'medicacion-001',
      medicamentoIdHistorico: 'med-amprolio',
      medicamentoNombreHistorico: 'Amprolio 20% Solución',
      unidadBaseHistorica: 'GRAMO',
      dosisHistorica: '200 g diluidos en 100 L de agua potable',
      viaAdministracionHistorica: 'Agua de bebida en bebederos automáticos',
      descripcionHistorica: 'Agua de bebida en bebederos automáticos, renovando cada 24 horas',
      diasMedicacion: 5,
      diaActualAvance: 2,
      fechaDiagnostico: '2026-10-29',
      fechaDiagnosticoCorta: '29 Oct',
      fechaReintegro: '2026-11-03',
      fechaReintegroCorta: '03 Nov 2026',
      estado: 'ACTIVO',
      version: 1
    },
    {
      id: 'diag-002',
      galponId: 'galpon-6',
      galponNombreHistorico: 'Galpón 6',
      loteId: 'lote-006',
      loteNombreHistorico: 'Lote #LDP-006',
      poblacionMomento: 7100,
      enfermedadId: 'enf-bronquitis',
      nombreEnfermedadHistorico: 'Bronquitis Infecciosa Aviar',
      requiereSacrificioHistorico: false,
      habilitaSacrificioSanitario: false,
      medicacionId: 'medicacion-002',
      medicamentoIdHistorico: 'med-tilosina',
      medicamentoNombreHistorico: 'Tilosina Tartrato 50%',
      unidadBaseHistorica: 'GRAMO',
      dosisHistorica: '0.5 g por litro de agua de bebida',
      viaAdministracionHistorica: 'Suministro continuo en agua de bebida matutina',
      descripcionHistorica:
        'Suministro continuo en agua de bebida matutina como soporte respiratorio',
      diasMedicacion: 7,
      diaActualAvance: 1,
      fechaDiagnostico: '2026-10-30',
      fechaDiagnosticoCorta: '30 Oct',
      fechaReintegro: '2026-11-06',
      fechaReintegroCorta: '06 Nov 2026',
      estado: 'ACTIVO',
      version: 1
    },
    {
      id: 'diag-003',
      galponId: 'galpon-3',
      galponNombreHistorico: 'Galpón 3',
      loteId: 'lote-003',
      loteNombreHistorico: 'Lote #LDP-003',
      poblacionMomento: 3500,
      enfermedadId: 'enf-influenza',
      nombreEnfermedadHistorico: 'Influenza Aviar (H5N1)',
      requiereSacrificioHistorico: true,
      habilitaSacrificioSanitario: true,
      medicacionId: null,
      medicamentoIdHistorico: null,
      medicamentoNombreHistorico: null,
      unidadBaseHistorica: null,
      dosisHistorica: null,
      viaAdministracionHistorica: null,
      descripcionHistorica: null,
      diasMedicacion: null,
      diaActualAvance: null,
      fechaDiagnostico: '2026-10-30',
      fechaDiagnosticoCorta: '30 Oct',
      fechaReintegro: null,
      fechaReintegroCorta: null,
      estado: 'ACTIVO',
      version: 1
    }
  ],

  // 8. Historial de Consumos Reales de Medicamentos y Desglose FEFO (Plan 012 / Spec 013 - M-06)
  vetMedConsumptions: [
    {
      id: 'cons-001',
      diagnosticoId: 'diag-001',
      galponId: 'galpon-7',
      galponNombre: 'Galpón 7',
      loteId: 'lote-007',
      loteNombre: 'Lote #LDP-007',
      medicamentoId: 'med-amprolio',
      medicamentoNombre: 'Amprolio 20% Solución',
      cantidadIngresada: 200,
      unidadIngresada: 'GRAMO',
      cantidadNormalizada: 200.0,
      unidadBase: 'GRAMO',
      fechaAplicacion: '2026-10-29',
      fechaAplicacionCorta: '29 Oct 2026',
      detalles: [
        {
          id: 'det-cons-01',
          recepcionId: 'rec-med-01',
          codigoLoteRecepcion: 'MED-2026-01 (Vence más próximo)',
          cantidadDescontadaUnidadBase: 150.0,
          unidadBase: 'GRAMO',
          precioNetoHistoricoUnidadBase: 12.5,
          moneda: 'COP',
          fechaAplicacionCorta: '29 Oct 2026'
        },
        {
          id: 'det-cons-02',
          recepcionId: 'rec-med-02',
          codigoLoteRecepcion: 'MED-2026-02 (Segunda recepción FEFO)',
          cantidadDescontadaUnidadBase: 50.0,
          unidadBase: 'GRAMO',
          precioNetoHistoricoUnidadBase: 14.0,
          moneda: 'COP',
          fechaAplicacionCorta: '29 Oct 2026'
        }
      ]
    },
    {
      id: 'cons-002',
      diagnosticoId: 'diag-002',
      galponId: 'galpon-6',
      galponNombre: 'Galpón 6',
      loteId: 'lote-006',
      loteNombre: 'Lote #LDP-006',
      medicamentoId: 'med-tilosina',
      medicamentoNombre: 'Tilosina Tartrato 50%',
      cantidadIngresada: 120,
      unidadIngresada: 'GRAMO',
      cantidadNormalizada: 120.0,
      unidadBase: 'GRAMO',
      fechaAplicacion: '2026-10-30',
      fechaAplicacionCorta: '30 Oct 2026',
      detalles: [
        {
          id: 'det-cons-03',
          recepcionId: 'rec-med-04',
          codigoLoteRecepcion: 'MED-2026-04 (Vence más próximo)',
          cantidadDescontadaUnidadBase: 120.0,
          unidadBase: 'GRAMO',
          precioNetoHistoricoUnidadBase: 28.0,
          moneda: 'COP',
          fechaAplicacionCorta: '30 Oct 2026'
        }
      ]
    }
  ],

  // 9. Órdenes de Sacrificio Sanitario Total (Plan 008 / Spec 012 - P-07, M-07A, M-07B)
  vetSanitarySlaughterOrders: [
    {
      id: 'ord-san-001',
      diagnosticoId: 'diag-003',
      galponId: 'galpon-3',
      galponNombre: 'Galpón 3',
      loteId: 'lote-003',
      loteNombre: 'Lote #LDP-003',
      enfermedadNombre: 'Influenza Aviar',
      poblacionAfectadaMomento: 3500,
      poblacionSacrificada: null,
      motivoClinico:
        'Brote agudo confirmado de Influenza Aviar de alta patogenicidad.',
      subMotivo: 'Disposición sanitaria urgente sobre el 100% del lote alojado.',
      estadoGalponMomento: 'AISLAMIENTO',
      estado: 'PENDIENTE_EJECUCION',
      emitidaEnTexto: '30 Oct, 14:30',
      ejecutadaEnTexto: null,
      observacionesEjecucion: null,
      version: 1
    },
    {
      id: 'ord-san-002',
      diagnosticoId: 'diag-hist-008',
      galponId: 'galpon-8',
      galponNombre: 'Galpón 8',
      loteId: 'lote-008',
      loteNombre: 'Lote #LDP-008',
      enfermedadNombre: 'Enfermedad de Newcastle',
      poblacionAfectadaMomento: 4120,
      poblacionSacrificada: 4120,
      motivoClinico: 'Signos nerviosos severos y mortalidad masiva confirmada.',
      subMotivo: 'Ejecución: Sacrificio total culminado. Galpón sellado para desinfección.',
      estadoGalponMomento: 'VACIADO_SANITARIO',
      estado: 'EJECUTADA',
      emitidaEnTexto: '18 Oct, 10:15',
      ejecutadaEnTexto: '18 Oct, 16:00',
      observacionesEjecucion:
        'Sacrificio total culminado. Galpón sellado para desinfección.',
      version: 2
    }
  ]
};

export const combinedInitialFarmState = {
  ...baseInitialFarmState,
  ...initialVetProtoState
};

function formatShortDate(isoDate) {
  if (!isoDate) return '30 Oct 2026';
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  const parts = String(isoDate).split('-');
  if (parts.length !== 3) return isoDate;
  const year = parts[0];
  const monthIdx = Math.max(0, Math.min(11, parseInt(parts[1], 10) - 1));
  const day = parts[2];
  return `${day} ${months[monthIdx]} ${year}`;
}

function addDaysToIso(isoDate, daysToAdd) {
  const base = isoDate ? new Date(`${isoDate}T12:00:00`) : new Date('2026-10-30T12:00:00');
  if (Number.isNaN(base.getTime())) return '2026-11-04';
  base.setDate(base.getDate() + (Number(daysToAdd) || 0));
  return base.toISOString().slice(0, 10);
}

export function vetModuleReducer(state, action) {
  switch (action.type) {
    // =========================================================================
    // PLAN 005 / SPEC 009: CATÁLOGO DE ENFERMEDADES (REGISTRAR Y EDITAR)
    // =========================================================================
    case 'VET_SAVE_CATALOG_DISEASE': {
      const payload = action.payload || {};
      const nombre = String(payload.nombre || '').trim();
      const tipo = String(payload.tipo || '').trim().toUpperCase();
      const nivelRiesgo = String(payload.nivelRiesgo || '').trim().toUpperCase();
      const descripcionClinica = String(payload.descripcionClinica || '').trim();
      const requiereSacrificioSanitario = Boolean(payload.requiereSacrificioSanitario);

      if (!nombre || !tipo || !nivelRiesgo || !descripcionClinica) {
        return state;
      }

      const exists = state.vetCatalogDiseases.find((d) => d.id === payload.id);
      let nextCatalog;
      if (exists) {
        nextCatalog = state.vetCatalogDiseases.map((d) =>
          d.id === payload.id
            ? {
                ...d,
                nombre,
                tipo,
                nivelRiesgo,
                descripcionClinica,
                requiereSacrificioSanitario,
                version: (Number(d.version) || 1) + 1
              }
            : d
        );
      } else {
        const newDisease = {
          id: payload.id || `enf-${Date.now()}`,
          nombre,
          tipo,
          nivelRiesgo,
          descripcionClinica,
          requiereSacrificioSanitario,
          version: 1
        };
        nextCatalog = [...state.vetCatalogDiseases, newDisease];
      }

      // Ordenar alfabéticamente A-Z conforme a Plan 005 Decisiones #5
      nextCatalog.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

      return {
        ...state,
        vetCatalogDiseases: nextCatalog
      };
    }

    // =========================================================================
    // PLAN 006 / SPEC 008: CATÁLOGO DE MEDICACIONES (REGISTRAR Y EDITAR)
    // =========================================================================
    case 'VET_SAVE_CATALOG_MEDICATION': {
      const payload = action.payload || {};
      const enfermedad = state.vetCatalogDiseases.find(
        (d) => d.id === payload.enfermedadId
      );
      // FR-003: Solo enfermedades tratables (requiereSacrificioSanitario === false)
      if (!enfermedad || enfermedad.requiereSacrificioSanitario) {
        return state;
      }

      const medicamento = state.vetInventoryMedicines.find(
        (m) => m.id === payload.medicamentoId
      );
      const dosis = String(payload.dosis || '').trim();
      const descripcion = String(payload.descripcion || '').trim();
      const diasTotales = Math.max(1, parseInt(payload.diasTotales, 10) || 1);

      if (!medicamento || !dosis || !descripcion) {
        return state;
      }

      const exists = state.vetCatalogMedications.find((m) => m.id === payload.id);
      let nextMeds;
      if (exists) {
        nextMeds = state.vetCatalogMedications.map((m) =>
          m.id === payload.id
            ? {
                ...m,
                enfermedadId: enfermedad.id,
                enfermedadNombre: enfermedad.nombre,
                medicamentoId: medicamento.id,
                medicamentoNombre: medicamento.nombre,
                dosis,
                diasTotales,
                descripcion,
                version: (Number(m.version) || 1) + 1
              }
            : m
        );
      } else {
        const newMed = {
          id: payload.id || `medicacion-${Date.now()}`,
          enfermedadId: enfermedad.id,
          enfermedadNombre: enfermedad.nombre,
          medicamentoId: medicamento.id,
          medicamentoNombre: medicamento.nombre,
          dosis,
          diasTotales,
          descripcion,
          version: 1
        };
        nextMeds = [newMed, ...state.vetCatalogMedications];
      }

      // Nota Spec 008 FR-010: No altera snapshots de diagnósticos existentes
      return {
        ...state,
        vetCatalogMedications: nextMeds
      };
    }

    // =========================================================================
    // PLAN 014 / SPEC 020: CREAR SOLICITUD DE AISLAMIENTO (DESDE TRABAJADOR O SIMULADOR)
    // =========================================================================
    case 'VET_CREATE_ISOLATION_REQUEST': {
      const { galponId, motivo, signosObservados } = action.payload || {};
      const barn = state.vetBarns.find((b) => b.id === galponId);
      if (!barn || barn.estado !== 'PRODUCTIVO' || barn.poblacionActual <= 0) {
        return state;
      }
      // FR-011: Impedir solicitud duplicada en PENDIENTE_VALIDACION para el mismo galpón
      const duplicatePending = state.vetIsolationRequests.some(
        (r) => r.galponId === galponId && r.estado === 'PENDIENTE_VALIDACION'
      );
      if (duplicatePending) {
        return state;
      }

      const newReq = {
        id: `sol-aisl-${Date.now()}`,
        galponId: barn.id,
        galponNombre: barn.nombre,
        loteId: barn.loteId,
        loteNombre: barn.loteNombre,
        poblacionActualReportada: barn.poblacionActual,
        edadLoteDias: barn.edadDias,
        fechaEmision: '30 Oct 2026',
        horaEmision: '14:15 PM',
        emitidaTexto: '30 Oct 2026, 14:15 PM',
        motivo: String(motivo || '').trim(),
        signosObservados: String(signosObservados || '').trim(),
        estadoActualGalpon: 'PRODUCTIVO',
        estado: 'PENDIENTE_VALIDACION',
        decision: null,
        version: 1
      };

      return {
        ...state,
        vetIsolationRequests: [newReq, ...state.vetIsolationRequests]
      };
    }

    // =========================================================================
    // PLAN 014 / SPEC 010: EVALUAR Y VALIDAR / RECHAZAR AISLAMIENTO (M-04)
    // =========================================================================
    case 'VET_VALIDATE_ISOLATION_REQUEST': {
      const { solicitudId, resultado, observaciones } = action.payload || {};
      const targetReq = state.vetIsolationRequests.find((r) => r.id === solicitudId);
      if (!targetReq || targetReq.estado !== 'PENDIENTE_VALIDACION') {
        return state;
      }

      const isApproved = resultado === 'APROBADA';
      const newBarnState = isApproved ? 'AISLAMIENTO' : 'PRODUCTIVO';

      const nextRequests = state.vetIsolationRequests.map((req) => {
        if (req.id !== solicitudId) return req;
        return {
          ...req,
          estado: isApproved ? 'APROBADA' : 'RECHAZADA',
          estadoActualGalpon: newBarnState,
          decision: {
            veterinarioId: 'vet-001',
            decididaEn: '30 Oct 2026, 15:00 PM',
            resultado: isApproved ? 'APROBADA' : 'RECHAZADA',
            observaciones: String(observaciones || '').trim()
          },
          version: (Number(req.version) || 1) + 1
        };
      });

      const nextBarns = state.vetBarns.map((b) =>
        b.id === targetReq.galponId
          ? {
              ...b,
              estado: isApproved ? 'AISLAMIENTO' : b.estado
            }
          : b
      );

      const nextAdminBarns = Array.isArray(state.adminBarns)
        ? state.adminBarns.map((b) =>
            b.id === targetReq.galponId && isApproved
              ? {
                  ...b,
                  estado: 'Aislamiento',
                  badgeBg: '#ffbaba',
                  badgeColor: '#bf0000',
                  dotColor: '#dc2626'
                }
              : b
          )
        : state.adminBarns;

      return {
        ...state,
        vetIsolationRequests: nextRequests,
        vetBarns: nextBarns,
        adminBarns: nextAdminBarns
      };
    }

    // =========================================================================
    // PLAN 015 / SPEC 011: REGISTRAR DIAGNÓSTICO CLÍNICO DE GALPÓN (M-05)
    // =========================================================================
    case 'VET_REGISTER_DIAGNOSIS': {
      const { galponId, enfermedadId, medicacionId, fechaDiagnostico } = action.payload || {};
      const barn = state.vetBarns.find((b) => b.id === galponId);
      const enfermedad = state.vetCatalogDiseases.find((d) => d.id === enfermedadId);
      if (!barn || barn.estado !== 'AISLAMIENTO' || !enfermedad) {
        return state;
      }

      const fechaDiagIso = fechaDiagnostico || '2026-10-30';
      const fechaDiagCorta = formatShortDate(fechaDiagIso).slice(0, 6);

      let medicacionSnapshot = {
        medicacionId: null,
        medicamentoIdHistorico: null,
        medicamentoNombreHistorico: null,
        unidadBaseHistorica: null,
        dosisHistorica: null,
        viaAdministracionHistorica: null,
        descripcionHistorica: null,
        diasMedicacion: null,
        diaActualAvance: null,
        fechaReintegro: null,
        fechaReintegroCorta: null
      };

      if (!enfermedad.requiereSacrificioSanitario) {
        const med = state.vetCatalogMedications.find(
          (m) => m.id === medicacionId && m.enfermedadId === enfermedad.id
        );
        if (!med) return state;
        const invMed = state.vetInventoryMedicines.find(
          (im) => im.id === med.medicamentoId
        );
        const fechaReintegroIso = addDaysToIso(fechaDiagIso, med.diasTotales);
        medicacionSnapshot = {
          medicacionId: med.id,
          medicamentoIdHistorico: med.medicamentoId,
          medicamentoNombreHistorico: med.medicamentoNombre,
          unidadBaseHistorica: invMed ? invMed.unidadBase : 'GRAMO',
          dosisHistorica: med.dosis,
          viaAdministracionHistorica: med.descripcion,
          descripcionHistorica: med.descripcion,
          diasMedicacion: med.diasTotales,
          diaActualAvance: 1,
          fechaReintegro: fechaReintegroIso,
          fechaReintegroCorta: formatShortDate(fechaReintegroIso)
        };
      }

      const newDiag = {
        id: `diag-${Date.now()}`,
        galponId: barn.id,
        galponNombreHistorico: barn.nombre,
        loteId: barn.loteId,
        loteNombreHistorico: barn.loteNombre,
        poblacionMomento: barn.poblacionActual,
        enfermedadId: enfermedad.id,
        nombreEnfermedadHistorico: enfermedad.nombre,
        requiereSacrificioHistorico: Boolean(enfermedad.requiereSacrificioSanitario),
        habilitaSacrificioSanitario: Boolean(enfermedad.requiereSacrificioSanitario),
        ...medicacionSnapshot,
        fechaDiagnostico: fechaDiagIso,
        fechaDiagnosticoCorta: fechaDiagCorta,
        estado: 'ACTIVO',
        version: 1
      };

      return {
        ...state,
        vetActiveDiagnoses: [newDiag, ...state.vetActiveDiagnoses]
      };
    }

    // =========================================================================
    // PLAN 015 / SPEC 011: PROCESAR REINTEGRO SANITARIO AUTOMÁTICO (SCHEDULER)
    // =========================================================================
    case 'VET_PROCESS_REINTEGRATION': {
      const { diagnosticoId } = action.payload || {};
      const targetDiag = state.vetActiveDiagnoses.find((d) => d.id === diagnosticoId);
      if (!targetDiag || targetDiag.estado !== 'ACTIVO' || targetDiag.requiereSacrificioHistorico) {
        return state;
      }

      // Ajuste B Plan 015: Precedencia mortal (no reintegrar a PRODUCTIVO si existe diagnóstico mortal ACTIVO en el mismo galpón)
      const hasActiveMortalInSameBarn = state.vetActiveDiagnoses.some(
        (d) =>
          d.id !== targetDiag.id &&
          d.galponId === targetDiag.galponId &&
          d.estado === 'ACTIVO' &&
          d.requiereSacrificioHistorico
      );

      const nextDiagnoses = state.vetActiveDiagnoses.map((d) =>
        d.id === diagnosticoId
          ? {
              ...d,
              estado: 'CERRADO_POR_REINTEGRO',
              version: (Number(d.version) || 1) + 1
            }
          : d
      );

      const hasOtherActiveTreatableInSameBarn = nextDiagnoses.some(
        (d) => d.galponId === targetDiag.galponId && d.estado === 'ACTIVO'
      );

      const shouldReturnToProductivo =
        !hasActiveMortalInSameBarn && !hasOtherActiveTreatableInSameBarn;

      const nextBarns = state.vetBarns.map((b) =>
        b.id === targetDiag.galponId && b.estado === 'AISLAMIENTO' && shouldReturnToProductivo
          ? { ...b, estado: 'PRODUCTIVO' }
          : b
      );

      return {
        ...state,
        vetActiveDiagnoses: nextDiagnoses,
        vetBarns: nextBarns
      };
    }

    // =========================================================================
    // PLAN 012 / SPEC 013: REGISTRAR CONSUMO REAL DE MEDICAMENTO (DESCUENTO FEFO)
    // =========================================================================
    case 'VET_REGISTER_MED_CONSUMPTION_FEFO': {
      const { diagnosticoId, cantidad, unidad, fechaAplicacion } = action.payload || {};
      const diag = state.vetActiveDiagnoses.find((d) => d.id === diagnosticoId);
      if (!diag || diag.estado !== 'ACTIVO' || diag.requiereSacrificioHistorico) {
        return state;
      }

      const rawQty = parseFloat(cantidad);
      if (!rawQty || rawQty <= 0) return state;

      const unidadBase = diag.unidadBaseHistorica || 'GRAMO';
      // Conversión dimensional (Spec 013 FR-004: 1.000 mg = 1 g)
      let cantidadNormalizada = rawQty;
      if (unidadBase === 'GRAMO') {
        if (unidad === 'MILIGRAMO') {
          cantidadNormalizada = Number((rawQty / 1000).toFixed(4));
        } else if (unidad !== 'GRAMO') {
          return state; // Dimensión incompatible
        }
      } else if (unidadBase !== unidad) {
        return state; // Dimensión incompatible
      }

      // Filtrar recepciones vigentes del medicamento prescrito ordenadas por vencimiento ascendente (FEFO)
      const eligibleReceptions = state.vetFefoReceptions
        .filter(
          (r) =>
            r.medicamentoId === diag.medicamentoIdHistorico &&
            r.estado === 'CONFIRMADA' &&
            r.saldoDisponibleUnidadBase > 0
        )
        .sort((a, b) => a.fechaVencimiento.localeCompare(b.fechaVencimiento));

      const totalAvailable = eligibleReceptions.reduce(
        (acc, r) => acc + Number(r.saldoDisponibleUnidadBase || 0),
        0
      );

      // FR-006: Cero descuentos parciales si el stock total no cubre el 100%
      if (totalAvailable + 1e-6 < cantidadNormalizada) {
        return state;
      }

      let remainingToDeduct = cantidadNormalizada;
      const deductionMap = {};
      const detallesGenerados = [];
      const fechaCorta = formatShortDate(fechaAplicacion || '2026-10-30');

      eligibleReceptions.forEach((rec, idx) => {
        if (remainingToDeduct <= 0) return;
        const available = Number(rec.saldoDisponibleUnidadBase);
        const taken = Math.min(available, remainingToDeduct);
        const roundedTaken = Number(taken.toFixed(4));
        remainingToDeduct = Number((remainingToDeduct - roundedTaken).toFixed(4));
        deductionMap[rec.id] = Number((available - roundedTaken).toFixed(4));

        detallesGenerados.push({
          id: `det-cons-${Date.now()}-${idx}`,
          recepcionId: rec.id,
          codigoLoteRecepcion:
            idx === 0
              ? `${rec.codigoLoteRecepcion} (Vence más próximo · ${rec.fechaVencimiento})`
              : `${rec.codigoLoteRecepcion} (Siguiente recepción FEFO · ${rec.fechaVencimiento})`,
          cantidadDescontadaUnidadBase: roundedTaken,
          unidadBase,
          precioNetoHistoricoUnidadBase: rec.precioNetoHistoricoUnidadBase,
          moneda: rec.moneda || 'COP',
          fechaAplicacionCorta: fechaCorta
        });
      });

      const nextReceptions = state.vetFefoReceptions.map((r) =>
        deductionMap[r.id] !== undefined
          ? { ...r, saldoDisponibleUnidadBase: deductionMap[r.id] }
          : r
      );

      const newConsumption = {
        id: `cons-${Date.now()}`,
        diagnosticoId: diag.id,
        galponId: diag.galponId,
        galponNombre: diag.galponNombreHistorico,
        loteId: diag.loteId,
        loteNombre: diag.loteNombreHistorico,
        medicamentoId: diag.medicamentoIdHistorico,
        medicamentoNombre: diag.medicamentoNombreHistorico,
        cantidadIngresada: rawQty,
        unidadIngresada: unidad,
        cantidadNormalizada,
        unidadBase,
        fechaAplicacion: fechaAplicacion || '2026-10-30',
        fechaAplicacionCorta: fechaCorta,
        detalles: detallesGenerados
      };

      return {
        ...state,
        vetFefoReceptions: nextReceptions,
        vetMedConsumptions: [newConsumption, ...state.vetMedConsumptions]
      };
    }

    // =========================================================================
    // PLAN 008 / SPEC 012: EMITIR ORDEN DE SACRIFICIO SANITARIO TOTAL (M-07A)
    // =========================================================================
    case 'VET_EMIT_SANITARY_SLAUGHTER_ORDER': {
      const { diagnosticoId, motivoClinico } = action.payload || {};
      const diag = state.vetActiveDiagnoses.find((d) => d.id === diagnosticoId);
      if (!diag || !diag.requiereSacrificioHistorico || diag.estado !== 'ACTIVO') {
        return state;
      }
      const barn = state.vetBarns.find((b) => b.id === diag.galponId);
      if (!barn || barn.estado !== 'AISLAMIENTO' || barn.poblacionActual <= 0) {
        return state;
      }
      // FR-005: Impedir segunda orden en PENDIENTE_EJECUCION para el mismo galpón
      const duplicatePending = state.vetSanitarySlaughterOrders.some(
        (o) => o.galponId === barn.id && o.estado === 'PENDIENTE_EJECUCION'
      );
      if (duplicatePending) {
        return state;
      }

      const newOrder = {
        id: `ord-san-${Date.now()}`,
        diagnosticoId: diag.id,
        galponId: barn.id,
        galponNombre: barn.nombre,
        loteId: barn.loteId,
        loteNombre: barn.loteNombre,
        enfermedadNombre: diag.nombreEnfermedadHistorico,
        poblacionAfectadaMomento: barn.poblacionActual,
        poblacionSacrificada: null,
        motivoClinico: String(motivoClinico || '').trim(),
        subMotivo: 'Disposición sanitaria urgente sobre el 100% del lote alojado.',
        estadoGalponMomento: 'AISLAMIENTO',
        estado: 'PENDIENTE_EJECUCION',
        emitidaEnTexto: '30 Oct, 15:20',
        ejecutadaEnTexto: null,
        observacionesEjecucion: null,
        version: 1
      };

      // FR-007: La emisión en PENDIENTE_EJECUCION conserva intactos el lote y el estado AISLAMIENTO
      return {
        ...state,
        vetSanitarySlaughterOrders: [newOrder, ...state.vetSanitarySlaughterOrders]
      };
    }

    // =========================================================================
    // PLAN 008 / SPEC 012: CONFIRMAR EJECUCIÓN FÍSICA DE SACRIFICIO SANITARIO (M-07B)
    // =========================================================================
    case 'VET_CONFIRM_SANITARY_SLAUGHTER_EXECUTION': {
      const { ordenId, observacionesEjecucion } = action.payload || {};
      const order = state.vetSanitarySlaughterOrders.find((o) => o.id === ordenId);
      if (!order || order.estado !== 'PENDIENTE_EJECUCION') {
        return state;
      }

      const barn = state.vetBarns.find((b) => b.id === order.galponId);
      const remanenteVivo = barn && barn.poblacionActual > 0
        ? barn.poblacionActual
        : order.poblacionAfectadaMomento;

      // 1. Extinción de inventario vivo a 0 y 2. Transición de galpón a VACIADO_SANITARIO
      const nextBarns = state.vetBarns.map((b) =>
        b.id === order.galponId
          ? {
              ...b,
              poblacionActual: 0,
              estado: 'VACIADO_SANITARIO'
            }
          : b
      );

      // 3. Cierre de diagnóstico en Plan 015 como CERRADO_POR_SACRIFICIO
      const nextDiagnoses = state.vetActiveDiagnoses.map((d) =>
        d.id === order.diagnosticoId || (d.galponId === order.galponId && d.estado === 'ACTIVO')
          ? {
              ...d,
              estado: 'CERRADO_POR_SACRIFICIO',
              version: (Number(d.version) || 1) + 1
            }
          : d
      );

      // 4. Orden en estado EJECUTADA (inmutable)
      const obs = String(
        observacionesEjecucion ||
          'Sacrificio sanitario total culminado bajo protocolo de bioseguridad nivel 3. Galpón sellado para inicio de desinfección.'
      ).trim();

      const nextOrders = state.vetSanitarySlaughterOrders.map((o) =>
        o.id === ordenId
          ? {
              ...o,
              poblacionSacrificada: remanenteVivo,
              estadoGalponMomento: 'VACIADO_SANITARIO',
              estado: 'EJECUTADA',
              ejecutadaEnTexto: '30 Oct, 16:45',
              subMotivo: `Ejecución: ${obs}`,
              observacionesEjecucion: obs,
              version: (Number(o.version) || 1) + 1
            }
          : o
      );

      return {
        ...state,
        vetBarns: nextBarns,
        vetActiveDiagnoses: nextDiagnoses,
        vetSanitarySlaughterOrders: nextOrders
      };
    }

    // =========================================================================
    // PLAN 007 -> PLAN 013 (SPECS 017, 018, 019): SIMULAR MORTALIDAD ANORMAL Y ALERTA
    // =========================================================================
    case 'VET_SIMULATE_ABNORMAL_MORTALITY_ALERT': {
      const { galponId, cantidadMuertes, causaProbable, observaciones } = action.payload || {};
      const barn = state.vetBarns.find((b) => b.id === galponId);
      const deaths = Math.max(1, parseInt(cantidadMuertes, 10) || 1);
      if (!barn || barn.poblacionActual < deaths) {
        return state;
      }

      const prevPop = barn.poblacionActual;
      const newPop = Math.max(0, prevPop - deaths);
      const pct = Number(((deaths / prevPop) * 100).toFixed(2));

      let prioridad = 'ALTA';
      let severidad = 'ALTA';
      if (newPop === 0 || pct >= 2.0) {
        prioridad = 'EMERGENCIA_SANITARIA';
        severidad = 'EMERGENCIA SANITARIA';
      } else if (pct >= 1.0) {
        prioridad = 'CRITICA';
        severidad = 'CRÍTICA';
      }

      const nextBarns = state.vetBarns.map((b) =>
        b.id === barn.id ? { ...b, poblacionActual: newPop } : b
      );

      const newAlert = {
        id: `alerta-${Date.now()}`,
        fechaHoraEmision: '30 Oct 2026, 08:20 AM',
        fechaLarga: '30 de octubre de 2026 a las 08:20 AM',
        prioridad,
        estado: 'Pendiente de atención veterinaria',
        galpon: {
          galponId: barn.id,
          nombre: barn.nombre,
          aforoMaximo: barn.aforoMaximo,
          estado: barn.estado
        },
        lote: {
          loteId: barn.loteId,
          nombre: barn.loteNombre,
          poblacionActual: newPop,
          edadEnDias: barn.edadDias
        },
        mortalidadAnormal: {
          registroId: `mort-anorm-${Date.now()}`,
          cantidadMuertes: deaths,
          porcentajeMortalidad: pct,
          nivelSeveridad: severidad,
          causaProbable: String(causaProbable || 'Sospecha infecciosa en evaluación').trim(),
          observaciones: String(
            observaciones ||
              'Hallazgo reportado por operario de granja tras superar el umbral diario de mortalidad del lote.'
          ).trim(),
          reportadoPor: 'Operario de Granja (Turno Mañana)'
        }
      };

      return {
        ...state,
        vetBarns: nextBarns,
        vetSanitaryAlerts: [newAlert, ...state.vetSanitaryAlerts]
      };
    }

    // =========================================================================
    // RESTAURAR DATOS SEMILLA DE DEMOSTRACIÓN DEL VETERINARIO
    // =========================================================================
    case 'VET_RESET_PROTO_DATA': {
      return {
        ...state,
        ...initialVetProtoState
      };
    }

    // =========================================================================
    // SINCRONIZACIÓN AUTOMÁTICA CON ACCIONES DE TRABAJADOR / ADMIN
    // =========================================================================
    case 'REQUEST_BARN_ISOLATION': {
      const nextBase = baseFarmReducer(state, action);
      const { barnId, motivo, signos } = action.payload || {};
      const barn = state.vetBarns.find((b) => b.id === barnId);
      const alreadyPending = state.vetIsolationRequests.some(
        (r) => r.galponId === barnId && r.estado === 'PENDIENTE_VALIDACION'
      );
      if (!barn || alreadyPending) return nextBase;

      const newIsolationReq = {
        id: `sol-aisl-${Date.now()}`,
        galponId: barn.id,
        galponNombre: barn.nombre,
        loteId: barn.loteId,
        loteNombre: barn.loteNombre,
        poblacionActualReportada: barn.poblacionActual,
        edadLoteDias: barn.edadDias,
        fechaEmision: '30 Oct 2026',
        horaEmision: '10:30 AM',
        emitidaTexto: '30 Oct 2026, 10:30 AM',
        motivo: motivo || 'Sospecha sanitaria reportada desde panel de trabajador',
        signosObservados:
          signos || 'Decaimiento general, plumas erizadas y baja ingesta observada en recorrido.',
        estadoActualGalpon: barn.estado,
        estado: 'PENDIENTE_VALIDACION',
        decision: null,
        version: 1
      };

      return {
        ...nextBase,
        vetIsolationRequests: [newIsolationReq, ...state.vetIsolationRequests]
      };
    }

    default:
      return baseFarmReducer(state, action);
  }
}
