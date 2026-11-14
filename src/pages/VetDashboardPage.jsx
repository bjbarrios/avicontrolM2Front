import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VetShell from '../components/VetShell';
import { FarmContext } from '../context/FarmContext';

function VetDashboardPage() {
  const navigate = useNavigate();
  const {
    vetBarns = [],
    vetSanitaryAlerts = [],
    vetIsolationRequests = [],
    vetActiveDiagnoses = [],
    validateIsolationRequest
  } = useContext(FarmContext);

  // Modales rápidos directamente desde el Dashboard P-02
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [evaluatingRequest, setEvaluatingRequest] = useState(null);
  const [evalResult, setEvalResult] = useState('APROBADA');
  const [evalObs, setEvalObs] = useState(
    'Se confirma cuadro infeccioso en inspección clínica. Se ordena aislamiento preventivo inmediato para proceder al diagnóstico del galpón.'
  );
  const [evalError, setEvalError] = useState('');

  const pendingIsolationRequests = vetIsolationRequests.filter(
    (r) => r.estado === 'PENDIENTE_VALIDACION'
  );
  const isolatedBarnsCount = vetBarns.filter((b) => b.estado === 'AISLAMIENTO').length;
  const activeDiagnosesList = vetActiveDiagnoses.filter((d) => d.estado === 'ACTIVO');
  const treatableActiveCount = activeDiagnosesList.filter(
    (d) => !d.requiereSacrificioHistorico
  ).length;
  const mortalActiveCount = activeDiagnosesList.filter(
    (d) => d.requiereSacrificioHistorico
  ).length;

  const totalBarns = vetBarns.length || 14;
  const countProductivo = vetBarns.filter((b) => b.estado === 'PRODUCTIVO').length;
  const countCosecha = vetBarns.filter((b) => b.estado === 'EN_COSECHA').length;
  const countAislamiento = vetBarns.filter((b) => b.estado === 'AISLAMIENTO').length;

  const pctProductivo = Math.round((countProductivo / totalBarns) * 100);
  const pctCosecha = Math.round((countCosecha / totalBarns) * 100);
  const pctAislamiento = Math.round((countAislamiento / totalBarns) * 100);

  const openEvalModal = (req) => {
    setEvaluatingRequest(req);
    setEvalResult('APROBADA');
    setEvalObs(
      'Se confirma cuadro infeccioso en inspección clínica. Se ordena aislamiento preventivo inmediato para proceder al diagnóstico del galpón.'
    );
    setEvalError('');
  };

  const handleConfirmValidation = () => {
    if (!evaluatingRequest) return;
    if (!evalObs.trim()) {
      setEvalError('Las observaciones clínicas del veterinario son obligatorias.');
      return;
    }
    validateIsolationRequest({
      solicitudId: evaluatingRequest.id,
      resultado: evalResult,
      observaciones: evalObs.trim()
    });
    setEvaluatingRequest(null);
  };

  return (
    <VetShell activeNav="inicio">
      <main className="flex-1 px-6 py-4 flex flex-col gap-3.5 overflow-hidden">
        {/* TÍTULO PRINCIPAL */}
        <div className="shrink-0">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight m-0">
            Inicio de veterinario
          </h2>
          <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
            Resumen general de la operación — Viernes, 30 de octubre de 2026
          </p>
        </div>

        {/* 3. FILA DE 4 TARJETAS KPI COMPACTAS */}
        <section className="grid grid-cols-4 gap-3.5 shrink-0">
          {/* KPI 1: Alerta Sanitaria (Plan 013) */}
          <div
            onClick={() => navigate('/veterinario/alertas')}
            className="bg-white rounded-xl p-3.5 shadow-sm border border-red-100 flex items-center gap-3.5 cursor-pointer hover:border-red-300 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#DC2626] shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-600 truncate m-0">
                Alerta Sanitaria (Plan 013)
              </p>
              <p className="text-2xl font-extrabold text-[#DC2626] leading-tight m-0">
                {vetSanitaryAlerts.length}
              </p>
              <p className="text-[10px] font-semibold text-red-600/90 truncate m-0">
                Alertas de Mortalidad Pendientes
              </p>
            </div>
          </div>

          {/* KPI 2: Solicitudes de Aislamiento (Plan 014) */}
          <div
            onClick={() => navigate('/veterinario/aislamiento')}
            className="bg-white rounded-xl p-3.5 shadow-sm border border-stone-200/70 flex items-center gap-3.5 cursor-pointer hover:border-amber-300 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#F59E0B] shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-600 truncate m-0">
                Solicitudes por Validar
              </p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-2xl font-extrabold text-[#F59E0B] leading-tight m-0">
                  {vetIsolationRequests.length}
                </p>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  {pendingIsolationRequests.length} pendientes
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 truncate m-0">
                Enviadas por trabajadores (Plan 014)
              </p>
            </div>
          </div>

          {/* KPI 3: Galpones Aislados */}
          <div
            onClick={() => navigate('/veterinario/diagnosticar')}
            className="bg-white rounded-xl p-3.5 shadow-sm border border-stone-200/70 flex items-center gap-3.5 cursor-pointer hover:border-sky-300 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#0EA5E9] shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-600 truncate m-0">
                Galpones Aislados
              </p>
              <p className="text-2xl font-extrabold text-[#0EA5E9] leading-tight m-0">
                {isolatedBarnsCount}
              </p>
              <p className="text-[10px] font-semibold text-sky-700 truncate m-0">
                En estado &quot;Aislamiento&quot;
              </p>
            </div>
          </div>

          {/* KPI 4: Diagnósticos Activos */}
          <div
            onClick={() => navigate('/veterinario/diagnosticar')}
            className="bg-white rounded-xl p-3.5 shadow-sm border border-stone-200/70 flex items-center gap-3.5 cursor-pointer hover:border-emerald-300 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#10B981] shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-600 truncate m-0">
                Diagnósticos Activos
              </p>
              <p className="text-2xl font-extrabold text-[#10B981] leading-tight m-0">
                {activeDiagnosesList.length}
              </p>
              <p className="text-[10px] font-semibold text-emerald-700 truncate m-0">
                {treatableActiveCount} en tratamiento, {mortalActiveCount} sacrificio
              </p>
            </div>
          </div>
        </section>

        {/* 4. DISTRIBUCIÓN CENTRAL (DOS COLUMNAS: 8 IZQUIERDA / 4 DERECHA) */}
        <div className="flex-1 grid grid-cols-12 gap-3.5 min-h-0">
          {/* COLUMNA IZQUIERDA (8 de 12 columnas) */}
          <div className="col-span-8 flex flex-col gap-3.5 min-h-0">
            {/* TABLA: Bandeja de Solicitudes de Aislamiento (Plan 014) */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200/70 flex flex-col shrink-0">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#185C2B] flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 m-0">
                      Bandeja de Solicitudes de Aislamiento (Plan 014)
                    </h3>
                    <p className="text-[10px] text-slate-500 m-0">
                      Solicitudes en{' '}
                      <span className="font-semibold text-amber-700">PENDIENTE_VALIDACION</span>{' '}
                      sobre galpones en estado Productivo (Specs 020 / 010)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {pendingIsolationRequests.length} Pendientes de Validar
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/veterinario/aislamiento')}
                    className="text-[10px] font-bold text-[#185C2B] hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Ver todas →
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-stone-200/80">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-stone-100/90 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-b border-stone-200">
                      <th className="py-2 px-3 w-[22%]">Galpón / Lote</th>
                      <th className="py-2 px-2.5 w-[15%]">Fecha / Hora</th>
                      <th className="py-2 px-3 w-[35%]">Motivo / Signos Observados</th>
                      <th className="py-2 px-2 text-center w-[15%]">Estado Galpón</th>
                      <th className="py-2 px-3 text-right w-[13%]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200/70 text-[11px]">
                    {pendingIsolationRequests.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-5 text-center text-slate-400">
                          No hay solicitudes pendientes de validación en este momento.
                        </td>
                      </tr>
                    ) : (
                      pendingIsolationRequests.slice(0, 3).map((req) => (
                        <tr key={req.id} className="hover:bg-stone-50/80 transition">
                          <td className="py-2 px-3">
                            <p className="font-bold text-slate-900 leading-tight m-0">
                              {req.galponNombre}
                            </p>
                            <span className="inline-block mt-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded">
                              {req.loteNombre} ·{' '}
                              {Number(req.poblacionActualReportada).toLocaleString('es-CO')} aves
                            </span>
                          </td>
                          <td className="py-2 px-2.5 text-slate-600 font-medium whitespace-nowrap">
                            {req.fechaEmision.replace(' 2026', '')}, {req.horaEmision.slice(0, 5)}
                            <span className="block text-[10px] text-slate-400">
                              Edad: {req.edadLoteDias} días
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <p className="font-semibold text-slate-800 truncate m-0">
                              {req.motivo}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate m-0">
                              Signos: {req.signosObservados}
                            </p>
                          </td>
                          <td className="py-2 px-2 text-center">
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              PRODUCTIVO
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => openEvalModal(req)}
                              className="bg-[#185C2B] hover:bg-[#134821] text-white text-[11px] font-semibold px-3 py-1 rounded-lg shadow-sm transition inline-flex items-center gap-1 border-0 cursor-pointer"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.3"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Evaluar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PANEL DE ALERTAS SANITARIAS (Plan 013 / Spec 018) */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-red-200/80 flex-1 flex flex-col justify-between min-h-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-[#DC2626] flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 m-0">
                      Alertas Recientes de Mortalidad Anormal (Plan 013)
                    </h3>
                    <p className="text-[10px] text-slate-500 m-0">
                      Generadas automáticamente al superar el umbral diario de bajas (Spec 017 /
                      Spec 018)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Prioridad Alta / Crítica
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/veterinario/alertas')}
                    className="text-[10px] font-bold text-[#DC2626] hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Bandeja completa →
                  </button>
                </div>
              </div>

              <div className="space-y-2 my-auto">
                {vetSanitaryAlerts.slice(0, 2).map((alerta) => (
                  <div
                    key={alerta.id}
                    className="flex items-center justify-between bg-red-50/60 border border-red-200/80 rounded-xl px-3.5 py-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`${
                          alerta.prioridad === 'ALTA' ? 'bg-[#DC2626]' : 'bg-red-800'
                        } text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0`}
                      >
                        {alerta.mortalidadAnormal.porcentajeMortalidad}% Mortalidad
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-900 truncate m-0">
                          {alerta.galpon.nombre} ({alerta.lote.nombre}) —{' '}
                          <span className="text-red-700">
                            {alerta.mortalidadAnormal.cantidadMuertes} muertes anormales registradas
                          </span>
                        </p>
                        <p className="text-[10px] text-slate-600 truncate m-0">
                          <span className="font-semibold">Causa probable:</span>{' '}
                          {alerta.mortalidadAnormal.causaProbable} ·{' '}
                          <span className="text-slate-500">{alerta.fechaHoraEmision}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedAlert(alerta)}
                      className="bg-[#DC2626] hover:bg-red-700 text-white text-[11px] font-semibold px-3 py-1 rounded-lg shadow-sm transition shrink-0 ml-3 border-0 cursor-pointer"
                    >
                      Ver Alerta
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA (4 de 12 columnas) */}
          <div className="col-span-4 flex flex-col gap-3.5 min-h-0">
            {/* TARJETA: Galpones Diagnosticados (Plan 015 + Acciones Plan 012 y Plan 008) */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200/70 flex flex-col shrink-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[#185C2B]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  <h3 className="text-xs font-bold text-slate-900 m-0">
                    Galpones Diagnosticados (Plan 015)
                  </h3>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mb-2.5 m-0">
                Seguimiento terapéutico activo y órdenes sanitarias
              </p>

              <div className="space-y-2">
                {activeDiagnosesList.slice(0, 3).map((diag) => {
                  const isMortal = diag.requiereSacrificioHistorico;
                  return (
                    <div
                      key={diag.id}
                      className={`p-2.5 rounded-xl flex flex-col gap-1.5 ${
                        isMortal
                          ? 'bg-red-50/50 border border-red-200'
                          : 'bg-stone-50 border border-stone-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-bold text-slate-900 m-0">
                            {diag.galponNombreHistorico}{' '}
                            <span className="text-slate-400 font-medium">
                              ({diag.loteNombreHistorico.replace('Lote ', '')})
                            </span>
                          </p>
                          {isMortal ? (
                            <p className="text-[10px] text-red-700 font-semibold m-0">
                              {diag.nombreEnfermedadHistorico} (Mortal · Sin reintegro)
                            </p>
                          ) : (
                            <p className="text-[10px] text-slate-600 m-0">
                              {diag.nombreEnfermedadHistorico} ·{' '}
                              <span className="font-semibold text-emerald-800">
                                Reintegro: {diag.fechaReintegroCorta?.slice(0, 6)}
                              </span>
                            </p>
                          )}
                        </div>
                        {isMortal ? (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            Sacrificio
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            Reintegro
                          </span>
                        )}
                      </div>
                      <div
                        className={`flex items-center justify-between pt-1 border-t ${
                          isMortal ? 'border-red-200/60' : 'border-stone-200/60'
                        }`}
                      >
                        {isMortal ? (
                          <>
                            <span className="text-[10px] text-red-700 font-medium">
                              {Number(diag.poblacionMomento).toLocaleString('es-CO')} aves en
                              aislamiento
                            </span>
                            <button
                              type="button"
                              onClick={() => navigate('/veterinario/ordenes')}
                              className="bg-[#DC2626] hover:bg-red-700 text-white text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-sm transition border-0 cursor-pointer"
                            >
                              Emitir Orden
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-[10px] text-slate-500 font-medium truncate max-w-[190px]">
                              {diag.medicamentoNombreHistorico} (Día {diag.diaActualAvance || 1} de{' '}
                              {diag.diasMedicacion})
                            </span>
                            <button
                              type="button"
                              onClick={() => navigate('/veterinario/diagnosticar')}
                              className="bg-[#185C2B] hover:bg-[#134821] text-white text-[10px] font-semibold px-2.5 py-1 rounded-md transition border-0 cursor-pointer"
                            >
                              + Consumo
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TARJETA: Estado General de Galpones (Barras Delgadas Compactas) */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200/70 flex-1 flex flex-col justify-between min-h-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-slate-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <h3 className="text-xs font-bold text-slate-900 m-0">Estado de Galpones</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Total: {totalBarns}
                </span>
              </div>

              <div className="space-y-2.5 my-auto text-[11px]">
                {/* Productivo */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-600">Productivo</span>
                    <span className="font-bold text-slate-900">{countProductivo}</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="bg-[#10B981] h-full rounded-full"
                      style={{ width: `${pctProductivo}%` }}
                    />
                  </div>
                </div>

                {/* En cosecha */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-600">En cosecha</span>
                    <span className="font-bold text-slate-900">{countCosecha}</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="bg-[#F59E0B] h-full rounded-full"
                      style={{ width: `${pctCosecha}%` }}
                    />
                  </div>
                </div>

                {/* Aislamiento */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-600">Aislamiento</span>
                    <span className="font-bold text-slate-900">{countAislamiento}</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="bg-[#DC2626] h-full rounded-full"
                      style={{ width: `${pctAislamiento}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL M-01 DIRECTO DESDE EL DASHBOARD */}
      {selectedAlert && (
        <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white w-[680px] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 bg-red-50/70 border-b border-red-200/80 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900 m-0">
                      Detalle de Alerta Sanitaria
                    </h3>
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                      Prioridad: {selectedAlert.prioridad}
                    </span>
                    <span className="bg-red-100 text-red-800 border border-red-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {selectedAlert.estado}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 m-0">
                    Emitida automáticamente el{' '}
                    <strong className="text-slate-800">{selectedAlert.fechaLarga}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-red-100/60 flex items-center justify-center transition bg-transparent border-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-stone-200/70">
                    <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      1. Contexto del Galpón
                    </span>
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      {selectedAlert.galpon.estado}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Nombre del galpón</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {selectedAlert.galpon.nombre}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Aforo máximo</span>
                      <span className="font-bold text-slate-800 text-sm">
                        {Number(selectedAlert.galpon.aforoMaximo).toLocaleString('es-CO')} aves
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-stone-200/70">
                    <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      2. Contexto del Lote Activo
                    </span>
                    <span className="text-[11px] font-bold text-[#185C2B]">
                      Edad: {selectedAlert.lote.edadEnDias} días
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Código / Nombre</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {selectedAlert.lote.nombre}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">
                        Población viva actual
                      </span>
                      <span className="font-bold text-slate-800 text-sm">
                        {Number(selectedAlert.lote.poblacionActual).toLocaleString('es-CO')} aves
                        vivas
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-50/40 border border-red-200/90 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-red-200/60">
                  <span className="text-[11px] font-extrabold text-red-900 uppercase tracking-wider">
                    3. Evento Detonante: Registro de Mortalidad Anormal
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600">
                    Reportado por:{' '}
                    <strong className="text-slate-900">
                      {selectedAlert.mortalidadAnormal.reportadoPor}
                    </strong>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-red-100">
                    <span className="text-[11px] text-slate-500 block">Muertes anormales</span>
                    <span className="text-lg font-extrabold text-[#DC2626]">
                      {selectedAlert.mortalidadAnormal.cantidadMuertes} aves
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-red-100">
                    <span className="text-[11px] text-slate-500 block">
                      % de Mortalidad calculado
                    </span>
                    <span className="text-lg font-extrabold text-[#DC2626]">
                      {selectedAlert.mortalidadAnormal.porcentajeMortalidad} %
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-red-100">
                    <span className="text-[11px] text-slate-500 block">Severidad clínica</span>
                    <span className="text-sm font-extrabold text-amber-800 mt-0.5 block">
                      {selectedAlert.mortalidadAnormal.nivelSeveridad}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5 text-xs pt-1">
                  <div className="bg-white p-3 rounded-xl border border-stone-200/80">
                    <span className="text-[11px] font-bold text-slate-500 block mb-0.5">
                      Causa probable o sospechosa reportada:
                    </span>
                    <p className="font-bold text-slate-900 m-0">
                      {selectedAlert.mortalidadAnormal.causaProbable}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-stone-200/80">
                    <span className="text-[11px] font-bold text-slate-500 block mb-0.5">
                      Observaciones adicionales del trabajador en campo:
                    </span>
                    <p className="text-slate-700 leading-relaxed m-0">
                      &ldquo;{selectedAlert.mortalidadAnormal.observaciones}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="px-5 py-2 rounded-xl bg-[#185C2B] hover:bg-[#134821] text-white text-xs font-bold shadow-sm transition border-0 cursor-pointer"
              >
                Entendido / Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL M-04 DIRECTO DESDE EL DASHBOARD */}
      {evaluatingRequest && (
        <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center z-50">
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
                  (Spec 010)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEvaluatingRequest(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-200/60 flex items-center justify-center transition bg-transparent border-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200/70">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900">
                      {evaluatingRequest.galponNombre} · {evaluatingRequest.loteNombre}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      (Emitida el {evaluatingRequest.emitidaTexto})
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
                      {Number(evaluatingRequest.poblacionActualReportada).toLocaleString('es-CO')}{' '}
                      aves vivas
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-stone-200/70">
                    <span className="text-[10px] text-slate-400 block">
                      Edad del lote al reporte
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {evaluatingRequest.edadLoteDias} días
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block">
                      Motivo de la sospecha sanitaria:
                    </span>
                    <p className="font-semibold text-slate-900 m-0">{evaluatingRequest.motivo}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block">
                      Signos clínicos observados en campo:
                    </span>
                    <p className="text-slate-700 m-0">{evaluatingRequest.signosObservados}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Dictamen de evaluación veterinaria <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    onClick={() => setEvalResult('APROBADA')}
                    className={`flex items-start gap-2.5 p-3 rounded-xl cursor-pointer transition ${
                      evalResult === 'APROBADA'
                        ? 'border-2 border-[#185C2B] bg-emerald-50/50'
                        : 'border border-stone-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="resultadoValidacionDash"
                      checked={evalResult === 'APROBADA'}
                      onChange={() => setEvalResult('APROBADA')}
                      className="mt-0.5 accent-[#185C2B]"
                    />
                    <div>
                      <span className="block text-xs font-extrabold text-emerald-950">
                        Aprobar Aislamiento (APROBADA)
                      </span>
                      <span className="text-[11px] text-emerald-800 leading-tight block mt-0.5">
                        Cambia el galpón de <strong>Productivo</strong> a{' '}
                        <strong>Aislamiento</strong> y habilita el diagnóstico clínico.
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => setEvalResult('RECHAZADA')}
                    className={`flex items-start gap-2.5 p-3 rounded-xl cursor-pointer transition ${
                      evalResult === 'RECHAZADA'
                        ? 'border-2 border-red-600 bg-red-50/40'
                        : 'border border-stone-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="resultadoValidacionDash"
                      checked={evalResult === 'RECHAZADA'}
                      onChange={() => setEvalResult('RECHAZADA')}
                      className="mt-0.5 accent-red-600"
                    />
                    <div>
                      <span className="block text-xs font-extrabold text-slate-800">
                        Rechazar Solicitud (RECHAZADA)
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
                  value={evalObs}
                  onChange={(e) => {
                    setEvalObs(e.target.value);
                    setEvalError('');
                  }}
                  placeholder="Registre el fundamento clínico de la aprobación del aislamiento o del rechazo de la solicitud..."
                  className="w-full rounded-xl border border-stone-300 p-3 text-xs text-slate-800 focus:outline-none focus:border-[#185C2B] resize-none"
                />
                {evalError && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1 m-0">{evalError}</p>
                )}
              </div>
            </div>

            <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEvaluatingRequest(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmValidation}
                className="px-5 py-2 rounded-xl bg-[#185C2B] hover:bg-[#134821] text-white text-xs font-bold shadow-sm transition border-0 cursor-pointer"
              >
                Confirmar Decisión
              </button>
            </div>
          </div>
        </div>
      )}
    </VetShell>
  );
}

export default VetDashboardPage;
