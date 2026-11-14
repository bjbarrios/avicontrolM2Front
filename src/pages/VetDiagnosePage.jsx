import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VetShell from '../components/VetShell';
import { FarmContext } from '../context/FarmContext';

function addDaysFormatted(isoDate, days) {
  const base = isoDate ? new Date(`${isoDate}T12:00:00`) : new Date('2026-10-30T12:00:00');
  if (Number.isNaN(base.getTime())) return '04 Nov 2026';
  base.setDate(base.getDate() + (Number(days) || 0));
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  const day = String(base.getDate()).padStart(2, '0');
  return `${day} ${months[base.getMonth()]} ${base.getFullYear()}`;
}

function VetDiagnosePage({ defaultTab = 'aislados' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    vetBarns = [],
    vetCatalogDiseases = [],
    vetCatalogMedications = [],
    vetIsolationRequests = [],
    vetActiveDiagnoses = [],
    vetFefoReceptions = [],
    vetMedConsumptions = [],
    validateIsolationRequest,
    registerBarnDiagnosis,
    processDiagnosisReintegration,
    registerMedConsumptionFefo
  } = useContext(FarmContext);

  const [activeTab, setActiveTab] = useState(
    location.pathname.includes('/aislamiento') ? 'solicitudes' : defaultTab
  );

  useEffect(() => {
    if (location.pathname.includes('/aislamiento')) {
      setActiveTab('solicitudes');
    } else if (location.pathname.includes('/diagnosticar')) {
      setActiveTab('aislados');
    }
  }, [location.pathname]);

  // ESTADOS: SOLICITUDES Y VALIDACIÓN DE AISLAMIENTO
  const [reqStatusFilter, setReqStatusFilter] = useState('PENDIENTE_VALIDACION');
  const [reqGalponFilter, setReqGalponFilter] = useState('');
  const [evaluatingReq, setEvaluatingReq] = useState(null);
  const [evalResultado, setEvalResultado] = useState('APROBADA');
  const [evalObservaciones, setEvalObservaciones] = useState(
    'Se confirma cuadro respiratorio infeccioso en inspección clínica. Se ordena aislamiento preventivo inmediato para proceder al diagnóstico del galpón.'
  );
  const [evalError, setEvalError] = useState('');

  // ESTADOS: GALPONES AISLADOS, DIAGNÓSTICO Y CONSUMO FEFO
  const [isolatedFilter, setIsolatedFilter] = useState('ALL');
  const [diagModalOpen, setDiagModalOpen] = useState(false);
  const [diagGalponId, setDiagGalponId] = useState('galpon-5');
  const [diagEnfermedadId, setDiagEnfermedadId] = useState('enf-coccidiosis');
  const [diagMedicacionId, setDiagMedicacionId] = useState('medicacion-001');
  const [diagError, setDiagError] = useState('');

  const [consumoModalDiag, setConsumoModalDiag] = useState(null);
  const [consumoCantidad, setConsumoCantidad] = useState('200');
  const [consumoUnidad, setConsumoUnidad] = useState('GRAMO');
  const [consumoFecha, setConsumoFecha] = useState('2026-10-30');
  const [consumoError, setConsumoError] = useState('');
  const [consumoSuccess, setConsumoSuccess] = useState('');

  const countReqPending = vetIsolationRequests.filter(
    (r) => r.estado === 'PENDIENTE_VALIDACION'
  ).length;
  const countReqApproved = vetIsolationRequests.filter(
    (r) => r.estado === 'APROBADA'
  ).length;
  const countReqRejected = vetIsolationRequests.filter(
    (r) => r.estado === 'RECHAZADA'
  ).length;

  const filteredRequests = vetIsolationRequests.filter((r) => {
    if (reqStatusFilter !== 'ALL' && r.estado !== reqStatusFilter) return false;
    if (reqGalponFilter && r.galponId !== reqGalponFilter) return false;
    return true;
  });

  const isolatedBarns = vetBarns.filter((b) => b.estado === 'AISLAMIENTO');
  const activeDiagnoses = vetActiveDiagnoses.filter((d) => d.estado === 'ACTIVO');

  const isolatedRows = [];
  isolatedBarns.forEach((barn) => {
    const diagsForBarn = activeDiagnoses.filter((d) => d.galponId === barn.id);
    if (diagsForBarn.length === 0) {
      isolatedRows.push({
        rowKey: `undx-${barn.id}`,
        type: 'UNDIAGNOSED',
        barn,
        diag: null
      });
    } else {
      diagsForBarn.forEach((diag) => {
        isolatedRows.push({
          rowKey: `dx-${diag.id}`,
          type: diag.requiereSacrificioHistorico ? 'MORTAL' : 'TRATABLE',
          barn,
          diag
        });
      });
    }
  });

  const countIsoAll = isolatedRows.length;
  const countIsoUndiagnosed = isolatedRows.filter((r) => r.type === 'UNDIAGNOSED').length;
  const countIsoTreatable = isolatedRows.filter((r) => r.type === 'TRATABLE').length;
  const countIsoMortal = isolatedRows.filter((r) => r.type === 'MORTAL').length;

  const filteredIsolatedRows = isolatedRows.filter((r) => {
    if (isolatedFilter === 'ALL') return true;
    return r.type === isolatedFilter;
  });

  const openEvaluateModal = (req) => {
    setEvaluatingReq(req);
    setEvalResultado('APROBADA');
    setEvalObservaciones(
      'Se confirma cuadro respiratorio infeccioso en inspección clínica. Se ordena aislamiento preventivo inmediato para proceder al diagnóstico del galpón.'
    );
    setEvalError('');
  };

  const handleConfirmValidation = (e) => {
    e.preventDefault();
    if (!evaluatingReq) return;
    if (!evalObservaciones.trim()) {
      setEvalError('Las observaciones clínicas del veterinario son obligatorias.');
      return;
    }
    const barn = vetBarns.find((b) => b.id === evaluatingReq.galponId);
    if (evalResultado === 'APROBADA' && barn && barn.estado !== 'PRODUCTIVO' && barn.estado !== 'AISLAMIENTO') {
      setEvalError(`El galpón ${barn.nombre} ya no se encuentra en estado Productivo.`);
      return;
    }
    validateIsolationRequest({
      solicitudId: evaluatingReq.id,
      resultado: evalResultado,
      observaciones: evalObservaciones.trim()
    });
    setEvaluatingReq(null);
  };

  const openDiagnosisModal = (preselectedGalponId) => {
    const targetId =
      preselectedGalponId || isolatedBarns[0]?.id || 'galpon-5';
    setDiagGalponId(targetId);
    const defaultDisease =
      vetCatalogDiseases.find((d) => !d.requiereSacrificioSanitario) ||
      vetCatalogDiseases[0];
    setDiagEnfermedadId(defaultDisease?.id || '');
    const compatMeds = vetCatalogMedications.filter(
      (m) => m.enfermedadId === defaultDisease?.id
    );
    setDiagMedicacionId(compatMeds[0]?.id || '');
    setDiagError('');
    setDiagModalOpen(true);
  };

  const selectedDiagBarn =
    vetBarns.find((b) => b.id === diagGalponId) || isolatedBarns[0];
  const selectedDiagDisease = vetCatalogDiseases.find(
    (d) => d.id === diagEnfermedadId
  );
  const compatibleMedications = vetCatalogMedications.filter(
    (m) => m.enfermedadId === diagEnfermedadId
  );
  const selectedDiagMedication =
    compatibleMedications.find((m) => m.id === diagMedicacionId) ||
    compatibleMedications[0];

  const handleConfirmDiagnosis = (e) => {
    e.preventDefault();
    if (!selectedDiagBarn || selectedDiagBarn.estado !== 'AISLAMIENTO') {
      setDiagError(
        'El galpón debe encontrarse en estado Aislamiento para registrar el diagnóstico.'
      );
      return;
    }
    if (!selectedDiagDisease) {
      setDiagError('Debe seleccionar una enfermedad registrada del catálogo.');
      return;
    }
    if (!selectedDiagDisease.requiereSacrificioSanitario && !selectedDiagMedication) {
      setDiagError(
        'Debe seleccionar una medicación compatible para enfermedades tratables.'
      );
      return;
    }

    registerBarnDiagnosis({
      galponId: selectedDiagBarn.id,
      enfermedadId: selectedDiagDisease.id,
      medicacionId: selectedDiagDisease.requiereSacrificioSanitario
        ? null
        : selectedDiagMedication.id,
      fechaDiagnostico: '2026-10-30'
    });
    setDiagModalOpen(false);
  };

  const openConsumoModal = (diag) => {
    setConsumoModalDiag(diag);
    setConsumoCantidad('200');
    setConsumoUnidad(diag.unidadBaseHistorica || 'GRAMO');
    setConsumoFecha('2026-10-30');
    setConsumoError('');
    setConsumoSuccess('');
  };

  const handleConfirmConsumo = (e) => {
    e.preventDefault();
    if (!consumoModalDiag) return;

    const rawQty = parseFloat(consumoCantidad);
    if (!rawQty || rawQty <= 0) {
      setConsumoError('La cantidad aplicada debe ser un valor positivo mayor a cero.');
      return;
    }

    const baseUnit = consumoModalDiag.unidadBaseHistorica || 'GRAMO';
    let normalizedQty = rawQty;
    if (baseUnit === 'GRAMO') {
      if (consumoUnidad === 'MILIGRAMO') {
        normalizedQty = Number((rawQty / 1000).toFixed(4));
      } else if (consumoUnidad !== 'GRAMO') {
        setConsumoError(
          `El medicamento se controla en unidad base ${baseUnit}; la unidad ${consumoUnidad} no es compatible.`
        );
        return;
      }
    } else if (baseUnit !== consumoUnidad) {
      setConsumoError(
        `El medicamento se controla en unidad base ${baseUnit}; la unidad ${consumoUnidad} no es compatible.`
      );
      return;
    }

    const activeRecs = vetFefoReceptions
      .filter(
        (r) =>
          r.medicamentoId === consumoModalDiag.medicamentoIdHistorico &&
          r.estado === 'CONFIRMADA' &&
          r.saldoDisponibleUnidadBase > 0
      )
      .sort((a, b) => a.fechaVencimiento.localeCompare(b.fechaVencimiento));

    const totalStock = activeRecs.reduce(
      (sum, r) => sum + Number(r.saldoDisponibleUnidadBase || 0),
      0
    );

    if (totalStock + 1e-6 < normalizedQty) {
      setConsumoError(
        `Las existencias vigentes (${totalStock.toFixed(
          2
        )} ${baseUnit}) no cubren los ${normalizedQty.toFixed(
          2
        )} ${baseUnit} solicitados.`
      );
      return;
    }

    registerMedConsumptionFefo({
      diagnosticoId: consumoModalDiag.id,
      cantidad: rawQty,
      unidad: consumoUnidad,
      fechaAplicacion: consumoFecha
    });

    setConsumoError('');
    setConsumoSuccess(
      `Consumo confirmado: ${normalizedQty.toFixed(
        2
      )} ${baseUnit} descontados por orden de vencimiento (FEFO).`
    );
  };

  const headerSubNav = (
    <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl border border-stone-200">
      <button
        type="button"
        onClick={() => {
          setActiveTab('solicitudes');
          navigate('/veterinario/aislamiento');
        }}
        className={`px-4 py-1.5 rounded-lg text-xs transition flex items-center gap-2 whitespace-nowrap border-0 cursor-pointer ${
          activeTab === 'solicitudes'
            ? 'bg-[#185C2B] text-white font-bold shadow-sm'
            : 'bg-transparent text-slate-600 hover:bg-white/70 font-semibold'
        }`}
      >
        <span>1. Solicitudes de Revisión</span>
        <span
          className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
            activeTab === 'solicitudes'
              ? 'bg-amber-400 text-slate-950'
              : 'bg-stone-200 text-slate-700'
          }`}
        >
          {countReqPending}
        </span>
      </button>

      <button
        type="button"
        onClick={() => {
          setActiveTab('aislados');
          navigate('/veterinario/diagnosticar');
        }}
        className={`px-4 py-1.5 rounded-lg text-xs transition flex items-center gap-2 whitespace-nowrap border-0 cursor-pointer ${
          activeTab === 'aislados'
            ? 'bg-[#185C2B] text-white font-bold shadow-sm'
            : 'bg-transparent text-slate-600 hover:bg-white/70 font-semibold'
        }`}
      >
        <span>2. Galpones Aislados y En Tratamiento</span>
        <span
          className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
            activeTab === 'aislados'
              ? 'bg-amber-400 text-slate-950'
              : 'bg-stone-200 text-slate-700'
          }`}
        >
          {countIsoAll}
        </span>
      </button>
    </div>
  );

  const currentDiagConsumptions = consumoModalDiag
    ? vetMedConsumptions.filter((c) => c.diagnosticoId === consumoModalDiag.id)
    : [];
  const currentDiagDetails = currentDiagConsumptions.flatMap((c) => c.detalles || []);
  const availableStockForModal = consumoModalDiag
    ? vetFefoReceptions
        .filter(
          (r) =>
            r.medicamentoId === consumoModalDiag.medicamentoIdHistorico &&
            r.estado === 'CONFIRMADA'
        )
        .reduce((acc, r) => acc + Number(r.saldoDisponibleUnidadBase || 0), 0)
    : 0;

  return (
    <VetShell activeNav="aislamiento-diagnostico" headerLeft={headerSubNav}>
      {activeTab === 'solicitudes' ? (
        /* =====================================================================
           SOLICITUDES DE VALIDACIÓN DE AISLAMIENTO
           ===================================================================== */
        <main
          className="flex-1 px-8 py-5 flex flex-col gap-4"
          style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}
        >
          <div className="flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">
                Solicitudes de Validación de Aislamiento
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5 m-0">
                Bandeja de peticiones enviadas por trabajadores de granja para evaluar y aprobar o
                rechazar el paso a aislamiento
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-3.5 py-1.5 rounded-xl">
                {countReqPending} Solicitudes pendientes de decisión veterinaria
              </span>
            </div>
          </div>

          <section
            className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-stone-200/80 flex flex-col justify-between"
            style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
                <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setReqStatusFilter('PENDIENTE_VALIDACION')}
                    className={`px-3.5 py-1.5 rounded-lg transition border-0 cursor-pointer ${
                      reqStatusFilter === 'PENDIENTE_VALIDACION'
                        ? 'bg-white text-slate-900 shadow-sm font-bold'
                        : 'bg-transparent text-slate-600 hover:bg-white/60'
                    }`}
                  >
                    Pendientes de Validación ({countReqPending})
                  </button>
                  <button
                    type="button"
                    onClick={() => setReqStatusFilter('APROBADA')}
                    className={`px-3.5 py-1.5 rounded-lg transition border-0 cursor-pointer ${
                      reqStatusFilter === 'APROBADA'
                        ? 'bg-white text-emerald-800 shadow-sm font-bold'
                        : 'bg-transparent text-emerald-800 hover:bg-white/60'
                    }`}
                  >
                    Aprobadas · En Aislamiento ({countReqApproved})
                  </button>
                  <button
                    type="button"
                    onClick={() => setReqStatusFilter('RECHAZADA')}
                    className={`px-3.5 py-1.5 rounded-lg transition border-0 cursor-pointer ${
                      reqStatusFilter === 'RECHAZADA'
                        ? 'bg-white text-slate-800 shadow-sm font-bold'
                        : 'bg-transparent text-slate-600 hover:bg-white/60'
                    }`}
                  >
                    Rechazadas ({countReqRejected})
                  </button>
                  <button
                    type="button"
                    onClick={() => setReqStatusFilter('ALL')}
                    className={`px-3.5 py-1.5 rounded-lg transition border-0 cursor-pointer ${
                      reqStatusFilter === 'ALL'
                        ? 'bg-white text-slate-900 shadow-sm font-bold'
                        : 'bg-transparent text-slate-600 hover:bg-white/60'
                    }`}
                  >
                    Todas ({vetIsolationRequests.length})
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  <label className="text-xs font-bold text-slate-700">Filtrar por galpón:</label>
                  <select
                    value={reqGalponFilter}
                    onChange={(e) => setReqGalponFilter(e.target.value)}
                    className="w-[220px] rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#185C2B]"
                  >
                    <option value="">Todos los galpones</option>
                    {vetBarns.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-hidden rounded-xl border border-stone-200/90">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-stone-100/90 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-stone-200">
                      <th className="py-3 px-4 w-[14%]">Galpón / Lote</th>
                      <th className="py-3 px-3 w-[14%]">Población / Edad</th>
                      <th className="py-3 px-3 w-[13%]">Fecha Emisión</th>
                      <th className="py-3 px-3 w-[26%]">Motivo y Signos Observados</th>
                      <th className="py-3 px-2.5 text-center w-[12%]">Estado Galpón</th>
                      <th className="py-3 px-2.5 text-center w-[10%]">Solicitud</th>
                      <th className="py-3 px-4 text-right w-[11%]">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200/70 text-xs">
                    {filteredRequests.map((req) => {
                      const isPending = req.estado === 'PENDIENTE_VALIDACION';
                      const isApproved = req.estado === 'APROBADA';
                      return (
                        <tr
                          key={req.id}
                          className={
                            isPending
                              ? 'bg-amber-50/30 hover:bg-amber-50/60 transition'
                              : 'hover:bg-stone-50 transition'
                          }
                        >
                          <td className="py-3 px-4">
                            <p className="font-bold text-slate-900 m-0">{req.galponNombre}</p>
                            <span className="text-[11px] font-semibold text-[#185C2B]">
                              {req.loteNombre}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-bold text-slate-800 m-0">
                              {Number(req.poblacionActualReportada).toLocaleString('es-CO')} aves
                              vivas
                            </p>
                            <span className="text-[11px] text-slate-500">
                              Edad: {req.edadLoteDias} días
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-medium">
                            {req.fechaEmision}
                            <span className="block text-[11px] text-slate-400">
                              {req.horaEmision}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-bold text-slate-800 truncate m-0">{req.motivo}</p>
                            {req.decision ? (
                              <p
                                className={`text-[11px] truncate m-0 ${
                                  isApproved
                                    ? 'text-emerald-800 font-medium'
                                    : 'text-slate-500'
                                }`}
                              >
                                Dictamen: {req.decision.observaciones}
                              </p>
                            ) : (
                              <p className="text-[11px] text-slate-500 truncate m-0">
                                Signos: {req.signosObservados}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-2.5 text-center">
                            {req.estadoActualGalpon === 'AISLAMIENTO' ? (
                              <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                                AISLAMIENTO
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                PRODUCTIVO
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-2.5 text-center">
                            {isPending && (
                              <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Pendiente
                              </span>
                            )}
                            {isApproved && (
                              <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Aprobada
                              </span>
                            )}
                            {!isPending && !isApproved && (
                              <span className="inline-block bg-stone-200 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Rechazada
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {isPending ? (
                              <button
                                type="button"
                                onClick={() => openEvaluateModal(req)}
                                className="bg-[#185C2B] hover:bg-[#134821] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition border-0 cursor-pointer whitespace-nowrap"
                              >
                                Evaluar
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 font-semibold">
                                Resuelta
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-stone-200/80 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <p className="m-0">
                El estado del galpón solo cambia de <strong>Productivo</strong> a{' '}
                <strong>Aislamiento</strong> cuando el veterinario aprueba la solicitud.
              </p>
              <span className="font-semibold text-slate-700">
                Página 1 de 1 (Mostrando {filteredRequests.length} solicitudes)
              </span>
            </div>
          </section>
        </main>
      ) : (
        /* =====================================================================
           GALPONES AISLADOS Y DIAGNÓSTICO CLÍNICO
           ===================================================================== */
        <main
          className="flex-1 px-8 py-5 flex flex-col gap-4"
          style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}
        >
          <div className="flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">
                Galpones Aislados y Diagnóstico Clínico
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5 m-0">
                Monitoreo de galpones en aislamiento, registro de diagnósticos clínicos, fecha de
                reintegro y consumos reales de medicamentos
              </p>
            </div>

            <button
              type="button"
              onClick={() => openDiagnosisModal()}
              className="bg-[#185C2B] hover:bg-[#134821] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 whitespace-nowrap shrink-0 border-0 cursor-pointer"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Registrar Diagnóstico de Galpón</span>
            </button>
          </div>

          <section
            className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-stone-200/80 flex flex-col justify-between"
            style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
                <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setIsolatedFilter('ALL')}
                    className={`px-3.5 py-1.5 rounded-lg transition border-0 cursor-pointer ${
                      isolatedFilter === 'ALL'
                        ? 'bg-white text-slate-900 shadow-sm font-bold'
                        : 'bg-transparent text-slate-600 hover:bg-white/60'
                    }`}
                  >
                    Activos en Aislamiento ({countIsoAll})
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsolatedFilter('UNDIAGNOSED')}
                    className={`px-3.5 py-1.5 rounded-lg transition border-0 cursor-pointer ${
                      isolatedFilter === 'UNDIAGNOSED'
                        ? 'bg-white text-amber-800 shadow-sm font-bold'
                        : 'bg-transparent text-amber-800 hover:bg-white/60'
                    }`}
                  >
                    Pendientes de Diagnóstico ({countIsoUndiagnosed})
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsolatedFilter('TRATABLE')}
                    className={`px-3.5 py-1.5 rounded-lg transition border-0 cursor-pointer ${
                      isolatedFilter === 'TRATABLE'
                        ? 'bg-white text-emerald-800 shadow-sm font-bold'
                        : 'bg-transparent text-emerald-800 hover:bg-white/60'
                    }`}
                  >
                    En Tratamiento · Reintegro Programado ({countIsoTreatable})
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsolatedFilter('MORTAL')}
                    className={`px-3.5 py-1.5 rounded-lg transition border-0 cursor-pointer ${
                      isolatedFilter === 'MORTAL'
                        ? 'bg-white text-red-700 shadow-sm font-bold'
                        : 'bg-transparent text-red-700 hover:bg-white/60'
                    }`}
                  >
                    Rama Mortal · Sacrificio Habilitado ({countIsoMortal})
                  </button>
                </div>

                <span className="bg-sky-50 text-sky-900 border border-sky-200 text-[11px] font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap">
                  Reintegro automático a Productivo al cumplirse la fecha de reintegro
                </span>
              </div>

              <div className="flex-1 overflow-hidden rounded-xl border border-stone-200/90">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-stone-100/90 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-stone-200">
                      <th className="py-3 px-4 w-[14%]">Galpón / Lote</th>
                      <th className="py-3 px-3 text-center w-[11%]">Estado Galpón</th>
                      <th className="py-3 px-3 w-[18%]">Enfermedad</th>
                      <th className="py-3 px-3 w-[23%]">Medicación y Dosis Prescrita</th>
                      <th className="py-3 px-3 text-center w-[18%]">
                        Fecha Diagnóstico → Reintegro
                      </th>
                      <th className="py-3 px-4 text-right w-[16%]">Acción Clínica</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200/70 text-xs">
                    {filteredIsolatedRows.map((row) => {
                      const { barn, diag, type } = row;
                      if (type === 'UNDIAGNOSED') {
                        return (
                          <tr
                            key={row.rowKey}
                            className="bg-amber-50/35 hover:bg-amber-50/60 transition"
                          >
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-900 m-0">{barn.nombre}</p>
                              <span className="text-[11px] font-semibold text-slate-500">
                                {barn.loteNombre} ·{' '}
                                {Number(barn.poblacionActual).toLocaleString('es-CO')} aves
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-900 border border-sky-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                                AISLAMIENTO
                              </span>
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                Sin diagnóstico registrado
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-slate-400 italic">
                              Pendiente de evaluación patológica inicial
                            </td>
                            <td className="py-3.5 px-3 text-center text-slate-400">—</td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => openDiagnosisModal(barn.id)}
                                className="bg-[#185C2B] hover:bg-[#134821] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-sm transition whitespace-nowrap border-0 cursor-pointer"
                              >
                                + Diagnosticar Galpón
                              </button>
                            </td>
                          </tr>
                        );
                      }

                      if (type === 'TRATABLE') {
                        return (
                          <tr key={row.rowKey} className="hover:bg-stone-50 transition">
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-900 m-0">
                                {diag.galponNombreHistorico}
                              </p>
                              <span className="text-[11px] font-semibold text-[#185C2B]">
                                {diag.loteNombreHistorico} ·{' '}
                                {Number(barn.poblacionActual).toLocaleString('es-CO')} aves
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-900 border border-sky-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                                AISLAMIENTO
                              </span>
                            </td>
                            <td className="py-3.5 px-3">
                              <p className="font-bold text-slate-900 m-0">
                                {diag.nombreEnfermedadHistorico}
                              </p>
                              <span className="text-[10px] font-bold text-emerald-700">
                                Tratable (Sin sacrificio)
                              </span>
                            </td>
                            <td className="py-3.5 px-3">
                              <p className="font-bold text-slate-800 m-0">
                                {diag.medicamentoNombreHistorico}{' '}
                                <span className="text-amber-800">({diag.diasMedicacion} días)</span>
                              </p>
                              <p className="text-[11px] text-slate-500 truncate m-0">
                                {diag.dosisHistorica}
                              </p>
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              <div className="inline-flex flex-col items-center gap-1">
                                <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                                  <span>{diag.fechaDiagnosticoCorta}</span>
                                  <span>→</span>
                                  <span className="text-[#185C2B] underline">
                                    {diag.fechaReintegroCorta}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => processDiagnosisReintegration(diag.id)}
                                  className="text-[10px] font-bold text-emerald-700 hover:underline bg-transparent border-0 cursor-pointer"
                                  title="Confirmar cumplimiento de fecha de reintegro"
                                >
                                  ✓ Confirmar reintegro cumplido
                                </button>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => openConsumoModal(diag)}
                                className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold px-3.5 py-1.5 rounded-lg shadow-sm transition whitespace-nowrap border-0 cursor-pointer"
                              >
                                + Registrar Consumo
                              </button>
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr
                          key={row.rowKey}
                          className="bg-red-50/30 hover:bg-red-50/50 transition"
                        >
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-900 m-0">
                              {diag.galponNombreHistorico}
                            </p>
                            <span className="text-[11px] font-semibold text-red-800">
                              {diag.loteNombreHistorico} ·{' '}
                              {Number(barn.poblacionActual).toLocaleString('es-CO')} aves
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-900 border border-sky-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                              AISLAMIENTO
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <p className="font-bold text-red-900 m-0">
                              {diag.nombreEnfermedadHistorico}
                            </p>
                            <span className="text-[10px] font-extrabold text-red-700">
                              Mortal · Requiere Sacrificio
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="text-[11px] font-semibold text-red-700 bg-red-100/80 px-2.5 py-1 rounded-md">
                              No admite medicación
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className="text-[11px] font-bold text-red-800">
                              Sin fecha de reintegro
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => navigate('/veterinario/ordenes')}
                              className="inline-block bg-red-100 hover:bg-red-200 text-red-900 border border-red-300 text-[11px] font-extrabold px-3 py-1 rounded-lg whitespace-nowrap cursor-pointer transition"
                            >
                              Habilita Sacrificio
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-stone-200/80 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <p className="m-0">
                Cada diagnóstico conserva el registro histórico de la enfermedad y de la medicación
                vigente al momento de su confirmación.
              </p>
              <span className="font-semibold text-slate-700">
                Mostrando {filteredIsolatedRows.length} registros en estado Aislamiento
              </span>
            </div>
          </section>
        </main>
      )}

      {/* MODAL EVALUAR Y VALIDAR / RECHAZAR AISLAMIENTO */}
      {evaluatingReq && (
        <div className="fixed inset-0 bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white w-[640px] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 m-0">
                    Evaluar Solicitud de Aislamiento
                  </h3>
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    PENDIENTE DE VALIDACIÓN
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 m-0">
                  Revise los signos reportados por el trabajador y registre su decisión clínica
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEvaluatingReq(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 bg-transparent border-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmValidation} className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200/70">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900">
                      {evaluatingReq.galponNombre} · {evaluatingReq.loteNombre}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      (Emitida el {evaluatingReq.emitidaTexto})
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Estado verificado: PRODUCTIVO
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-stone-200/70">
                    <span className="text-[10px] text-slate-400 block">
                      Población actual en riesgo
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {Number(evaluatingReq.poblacionActualReportada).toLocaleString('es-CO')} aves
                      vivas
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-stone-200/70">
                    <span className="text-[10px] text-slate-400 block">
                      Edad del lote al reporte
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {evaluatingReq.edadLoteDias} días
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block">
                      Motivo de la sospecha sanitaria:
                    </span>
                    <p className="font-semibold text-slate-900 m-0">{evaluatingReq.motivo}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block">
                      Signos clínicos observados en campo:
                    </span>
                    <p className="text-slate-700 m-0">{evaluatingReq.signosObservados}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Dictamen de evaluación veterinaria <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    onClick={() => setEvalResultado('APROBADA')}
                    className={`flex items-start gap-2.5 p-3 rounded-xl cursor-pointer transition ${
                      evalResultado === 'APROBADA'
                        ? 'border-2 border-[#185C2B] bg-emerald-50/50'
                        : 'border border-stone-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="resultadoValidacion"
                      checked={evalResultado === 'APROBADA'}
                      onChange={() => setEvalResultado('APROBADA')}
                      className="mt-0.5 accent-[#185C2B]"
                    />
                    <div>
                      <span className="block text-xs font-extrabold text-emerald-950">
                        Aprobar Aislamiento
                      </span>
                      <span className="text-[11px] text-emerald-800 leading-tight block mt-0.5">
                        Cambia el galpón de <strong>Productivo</strong> a{' '}
                        <strong>Aislamiento</strong> y habilita el diagnóstico clínico.
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => setEvalResultado('RECHAZADA')}
                    className={`flex items-start gap-2.5 p-3 rounded-xl cursor-pointer transition ${
                      evalResultado === 'RECHAZADA'
                        ? 'border-2 border-red-600 bg-red-50/40'
                        : 'border border-stone-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="resultadoValidacion"
                      checked={evalResultado === 'RECHAZADA'}
                      onChange={() => setEvalResultado('RECHAZADA')}
                      className="mt-0.5 accent-red-600"
                    />
                    <div>
                      <span className="block text-xs font-extrabold text-slate-800">
                        Rechazar Solicitud
                      </span>
                      <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                        Descarta el riesgo de aislamiento y conserva el galpón en estado{' '}
                        <strong>Productivo</strong>.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observaciones clínicas / técnicas del veterinario{' '}
                  <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={evalObservaciones}
                  onChange={(e) => {
                    setEvalObservaciones(e.target.value);
                    setEvalError('');
                  }}
                  placeholder="Registre el fundamento clínico de la aprobación del aislamiento o del rechazo de la solicitud..."
                  className="w-full rounded-xl border border-stone-300 p-3 text-xs text-slate-800 focus:outline-none focus:border-[#185C2B] resize-none"
                />
                {evalError && (
                  <p className="text-xs font-bold text-red-600 mt-1 m-0">{evalError}</p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEvaluatingReq(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#185C2B] hover:bg-[#134821] text-white text-xs font-bold shadow-sm transition border-0 cursor-pointer"
                >
                  Confirmar Decisión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR DIAGNÓSTICO CLÍNICO DE GALPÓN */}
      {diagModalOpen && (
        <div className="fixed inset-0 bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white w-[640px] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 m-0">
                    Registrar Diagnóstico Clínico de Galpón
                  </h3>
                  <span className="bg-sky-100 text-sky-900 border border-sky-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    ESTADO: AISLAMIENTO
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 m-0">
                  Vincule la enfermedad diagnosticada y defina el manejo sanitario del lote aislado
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDiagModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 bg-transparent border-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmDiagnosis} className="p-6 space-y-4">
              {/* 1. Selección de Galpón en Aislamiento y su Lote Activo */}
              <div className="grid grid-cols-2 gap-4 p-3.5 rounded-xl bg-stone-50 border border-stone-200/90">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Galpón en estado Aislamiento <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={diagGalponId}
                    onChange={(e) => setDiagGalponId(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#185C2B]"
                  >
                    {isolatedBarns.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nombre} (Estado: AISLAMIENTO)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-600 mb-1">
                    Lote activo alojado
                  </span>
                  <div className="px-3 py-2 rounded-xl bg-stone-200/70 border border-stone-300/80 text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>{selectedDiagBarn?.loteNombre || 'Lote #LDP-005'}</span>
                    <span className="text-[11px] font-semibold text-[#185C2B]">
                      {Number(selectedDiagBarn?.poblacionActual || 0).toLocaleString('es-CO')} aves
                      vivas
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Selección de Enfermedad */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Enfermedad diagnosticada <span className="text-red-600">*</span>
                  </label>
                </div>

                <select
                  value={diagEnfermedadId}
                  onChange={(e) => {
                    const nextEnfId = e.target.value;
                    setDiagEnfermedadId(nextEnfId);
                    const nextCompat = vetCatalogMedications.filter(
                      (m) => m.enfermedadId === nextEnfId
                    );
                    setDiagMedicacionId(nextCompat[0]?.id || '');
                    setDiagError('');
                  }}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#185C2B]"
                >
                  {vetCatalogDiseases.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombre} — [Requiere sacrificio sanitario:{' '}
                      {d.requiereSacrificioSanitario
                        ? 'SÍ · Enfermedad Mortal'
                        : 'NO · Enfermedad Tratable'}
                      ]
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Sección Condicional según si requiere sacrificio sanitario */}
              {!selectedDiagDisease?.requiereSacrificioSanitario ? (
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                    <span className="text-xs font-extrabold text-emerald-950">
                      Rama Tratable: Prescripción de Medicación y Cálculo de Reintegro
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                      Requiere Sacrificio: NO
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Medicación compatible para {selectedDiagDisease?.nombre}{' '}
                      <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={selectedDiagMedication?.id || ''}
                      onChange={(e) => setDiagMedicacionId(e.target.value)}
                      className="w-full rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#185C2B]"
                    >
                      {compatibleMedications.length === 0 ? (
                        <option value="">
                          No hay medicaciones registradas para esta enfermedad
                        </option>
                      ) : (
                        compatibleMedications.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.medicamentoNombre} — {m.dosis} (Duración: {m.diasTotales} días)
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs pt-1">
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200/80">
                      <span className="text-[10px] text-slate-400 block">
                        Fecha del diagnóstico
                      </span>
                      <span className="font-extrabold text-slate-800">30 Oct 2026</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200/80">
                      <span className="text-[10px] text-slate-400 block">Días de medicación</span>
                      <span className="font-extrabold text-amber-800">
                        {selectedDiagMedication?.diasTotales || 0} días totales
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border-2 border-[#185C2B]">
                      <span className="text-[10px] text-emerald-800 font-bold block">
                        Fecha automática reintegro
                      </span>
                      <span className="font-extrabold text-[#185C2B]">
                        {addDaysFormatted('2026-10-30', selectedDiagMedication?.diasTotales || 5)}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-emerald-900 leading-snug m-0">
                    Al cumplirse el{' '}
                    <strong>
                      {addDaysFormatted('2026-10-30', selectedDiagMedication?.diasTotales || 5)}
                    </strong>
                    , el sistema cambiará automáticamente el estado del galpón de{' '}
                    <strong>Aislamiento</strong> a <strong>Productivo</strong>.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-red-200 pb-2">
                    <span className="text-xs font-extrabold text-red-950">
                      Rama Mortal: Contención Biológica sin Medicación
                    </span>
                    <span className="bg-red-100 text-red-800 border border-red-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                      Requiere Sacrificio: SÍ
                    </span>
                  </div>
                  <p className="text-xs text-red-900 leading-relaxed m-0">
                    La patología seleccionada exige sacrificio sanitario total. Este diagnóstico{' '}
                    <strong>no acepta medicación</strong>,{' '}
                    <strong>no calcula fecha de reintegro</strong> y habilita la emisión de la{' '}
                    <strong>Orden de Sacrificio Sanitario Total</strong>.
                  </p>
                </div>
              )}

              {diagError && (
                <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 m-0">
                  {diagError}
                </p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDiagModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#185C2B] hover:bg-[#134821] text-white text-xs font-bold shadow-sm transition border-0 cursor-pointer"
                >
                  Confirmar Diagnóstico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR CONSUMO REAL DE MEDICAMENTO FEFO */}
      {consumoModalDiag && (
        <div className="fixed inset-0 bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white w-[660px] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 m-0">
                    Registrar Consumo Real de Medicamento
                  </h3>
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    DESCUENTO ATÓMICO FEFO
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 m-0">
                  Descuenta existencias del inventario por fecha de vencimiento más próxima y
                  conserva precios históricos
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConsumoModalDiag(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 bg-transparent border-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmConsumo} className="p-6 space-y-4">
              {/* 1. Datos Derivados Automáticamente desde el Diagnóstico */}
              <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Datos derivados automáticamente del diagnóstico activo
                  </span>
                  <span className="text-[10px] font-bold text-[#185C2B] bg-emerald-100 px-2 py-0.5 rounded">
                    Unidad Base Inventario: {consumoModalDiag.unidadBaseHistorica || 'GRAMO'} ·
                    Stock disponible: {availableStockForModal.toFixed(2)}{' '}
                    {consumoModalDiag.unidadBaseHistorica || 'GRAMO'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-slate-400 block">Galpón y Lote</span>
                    <span className="font-extrabold text-slate-900">
                      {consumoModalDiag.galponNombreHistorico} ·{' '}
                      {consumoModalDiag.loteNombreHistorico}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-slate-400 block">Enfermedad Tratable</span>
                    <span className="font-extrabold text-slate-900">
                      {consumoModalDiag.nombreEnfermedadHistorico}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-slate-400 block">Medicamento Prescrito</span>
                    <span className="font-extrabold text-[#185C2B]">
                      {consumoModalDiag.medicamentoNombreHistorico}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Formulario con los 3 Campos Editables */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cantidad aplicada <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={consumoCantidad}
                    onChange={(e) => {
                      setConsumoCantidad(e.target.value);
                      setConsumoError('');
                      setConsumoSuccess('');
                    }}
                    placeholder="Ej. 200"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#185C2B]"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Valor positivo (&gt; 0)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Unidad de medida <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={consumoUnidad}
                    onChange={(e) => {
                      setConsumoUnidad(e.target.value);
                      setConsumoError('');
                      setConsumoSuccess('');
                    }}
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#185C2B]"
                  >
                    <option value="GRAMO">GRAMO (g)</option>
                    <option value="MILIGRAMO">MILIGRAMO (mg → 1.000 mg = 1 g)</option>
                    <option value="MILILITRO">MILILITRO (ml)</option>
                    <option value="UNIDAD">UNIDAD (u)</option>
                  </select>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Debe ser compatible con la unidad base
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fecha de aplicación <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={consumoFecha}
                    onChange={(e) => setConsumoFecha(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#185C2B]"
                  />
                </div>
              </div>

              {consumoError && (
                <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 m-0">
                  {consumoError}
                </p>
              )}
              {consumoSuccess && (
                <p className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 m-0">
                  {consumoSuccess}
                </p>
              )}

              {/* 3. Desglose Histórico por Recepción FEFO */}
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <div className="bg-stone-50 px-4 py-2 border-b border-stone-200 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700">
                    Historial de Consumos y Trazabilidad FEFO por Recepción
                  </span>
                </div>
                <div className="max-h-36 overflow-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-stone-100/70 text-slate-500 font-bold uppercase text-[10px] border-b border-stone-200">
                        <th className="py-2 px-3">Fecha Aplicación</th>
                        <th className="py-2 px-3">Lote Recepción (FEFO)</th>
                        <th className="py-2 px-3 text-right">Cantidad Base Descontada</th>
                        <th className="py-2 px-3 text-right">Precio Neto Histórico / Base</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200/70">
                      {currentDiagDetails.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-slate-400">
                            Aún no se han registrado consumos reales para este diagnóstico.
                          </td>
                        </tr>
                      ) : (
                        currentDiagDetails.map((det) => (
                          <tr key={det.id}>
                            <td className="py-2 px-3 font-semibold text-slate-700">
                              {det.fechaAplicacionCorta}
                            </td>
                            <td className="py-2 px-3 font-bold text-slate-900">
                              {det.codigoLoteRecepcion}
                            </td>
                            <td className="py-2 px-3 text-right font-bold text-[#185C2B]">
                              {Number(det.cantidadDescontadaUnidadBase).toFixed(2)} {det.unidadBase}
                            </td>
                            <td className="py-2 px-3 text-right font-semibold text-slate-800">
                              $ {Number(det.precioNetoHistoricoUnidadBase).toFixed(2)}{' '}
                              {det.moneda || 'COP'} / {det.unidadBase === 'GRAMO' ? 'g' : 'u'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setConsumoModalDiag(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#185C2B] hover:bg-[#134821] text-white text-xs font-bold shadow-sm transition border-0 cursor-pointer"
                >
                  Confirmar Consumo y Descontar Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </VetShell>
  );
}

export default VetDiagnosePage;
