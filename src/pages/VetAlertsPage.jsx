import { useContext, useState } from 'react';
import VetShell from '../components/VetShell';
import { FarmContext } from '../context/FarmContext';

function VetAlertsPage() {
  const {
    vetSanitaryAlerts = [],
    vetBarns = [],
    simulateAbnormalMortalityAlert
  } = useContext(FarmContext);

  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedAlert, setSelectedAlert] = useState(vetSanitaryAlerts[0] || null);
  const [simModalOpen, setSimModalOpen] = useState(false);

  // Estado del simulador de evento de mortalidad anormal (Plan 007 -> Plan 013)
  const [simGalponId, setSimGalponId] = useState('galpon-1');
  const [simMuertes, setSimMuertes] = useState('24');
  const [simCausa, setSimCausa] = useState('Síndrome respiratorio agudo / jadeo severo');
  const [simObs, setSimObs] = useState(
    'Durante el recorrido se identificaron aves postradas cerca de la línea de comederos centrales con signos respiratorios agudos.'
  );
  const [simError, setSimError] = useState('');

  const countAll = vetSanitaryAlerts.length;
  const countAlta = vetSanitaryAlerts.filter((a) => a.prioridad === 'ALTA').length;
  const countCritica = vetSanitaryAlerts.filter((a) => a.prioridad === 'CRITICA').length;
  const countEmergencia = vetSanitaryAlerts.filter(
    (a) => a.prioridad === 'EMERGENCIA_SANITARIA'
  ).length;

  const filteredAlerts = vetSanitaryAlerts.filter((a) => {
    if (priorityFilter === 'ALL') return true;
    return a.prioridad === priorityFilter;
  });

  const handleSimulateSubmit = (e) => {
    e.preventDefault();
    const barn = vetBarns.find((b) => b.id === simGalponId);
    const deathsNum = parseInt(simMuertes, 10);
    if (!barn) {
      setSimError('Seleccione un galpón válido.');
      return;
    }
    if (!deathsNum || deathsNum <= 0) {
      setSimError('La cantidad de muertes anormales debe ser un entero mayor que cero.');
      return;
    }
    if (deathsNum > barn.poblacionActual) {
      setSimError(
        `La cantidad de bajas (${deathsNum}) supera la población viva actual del lote (${barn.poblacionActual} aves).`
      );
      return;
    }
    if (!simCausa.trim()) {
      setSimError('Debe indicar la causa probable o sospechosa reportada.');
      return;
    }

    simulateAbnormalMortalityAlert({
      galponId: simGalponId,
      cantidadMuertes: deathsNum,
      causaProbable: simCausa.trim(),
      observaciones: simObs.trim()
    });
    setSimModalOpen(false);
    setSimError('');
  };

  const renderPriorityBadge = (prioridad) => {
    if (prioridad === 'ALTA') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          ALTA
        </span>
      );
    }
    if (prioridad === 'CRITICA') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 border border-red-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
          CRÍTICA
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 bg-red-900 text-white border border-red-950 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        EMERGENCIA SANITARIA
      </span>
    );
  };

  return (
    <VetShell activeNav="alertas">
      <main className="flex-1 px-8 py-5 flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">
              Bandeja de Alertas Sanitarias
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5 m-0">
              Notificaciones automáticas e inmutables generadas por eventos de mortalidad anormal en
              galpones (Plan 013 / Spec 018)
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setSimError('');
                setSimModalOpen(true);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-sm transition border-0 cursor-pointer"
            >
              + Simular Evento Mortalidad Anormal (Spec 017 → 018)
            </button>
            <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-3.5 py-1.5 rounded-full">
              {countAll} Alertas en estado: Pendiente de atención veterinaria
            </span>
          </div>
        </div>

        {/* TARJETA DE LISTADO PAGINADO (GET /api/alertas-sanitarias) */}
        <section className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-stone-200/80 flex flex-col justify-between min-h-0">
          <div className="flex flex-col min-h-0">
            {/* Filtro por Prioridad (ALTA | CRITICA | EMERGENCIA_SANITARIA) */}
            <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
              <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPriorityFilter('ALL')}
                  className={`px-3.5 py-1.5 rounded-lg transition border-0 cursor-pointer ${
                    priorityFilter === 'ALL'
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'bg-transparent text-slate-600 hover:bg-white/60'
                  }`}
                >
                  Todas las prioridades ({countAll})
                </button>
                <button
                  type="button"
                  onClick={() => setPriorityFilter('ALTA')}
                  className={`px-3.5 py-1.5 rounded-lg transition border-0 cursor-pointer ${
                    priorityFilter === 'ALTA'
                      ? 'bg-white text-amber-900 shadow-sm font-bold'
                      : 'bg-transparent text-amber-800 hover:bg-white/60'
                  }`}
                >
                  Prioridad Alta ({countAlta})
                </button>
                <button
                  type="button"
                  onClick={() => setPriorityFilter('CRITICA')}
                  className={`px-3.5 py-1.5 rounded-lg transition border-0 cursor-pointer ${
                    priorityFilter === 'CRITICA'
                      ? 'bg-white text-red-700 shadow-sm font-bold'
                      : 'bg-transparent text-red-700 hover:bg-white/60'
                  }`}
                >
                  Prioridad Crítica ({countCritica})
                </button>
                <button
                  type="button"
                  onClick={() => setPriorityFilter('EMERGENCIA_SANITARIA')}
                  className={`px-3.5 py-1.5 rounded-lg transition border-0 cursor-pointer ${
                    priorityFilter === 'EMERGENCIA_SANITARIA'
                      ? 'bg-white text-red-900 shadow-sm font-bold'
                      : 'bg-transparent text-red-900 hover:bg-white/60'
                  }`}
                >
                  Emergencia Sanitaria ({countEmergencia})
                </button>
              </div>

              <span className="text-xs text-slate-500 font-medium">
                Ordenadas por fecha y hora de emisión (más recientes primero)
              </span>
            </div>

            {/* Tabla de Alertas */}
            <div className="overflow-auto rounded-xl border border-stone-200/90">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-stone-100/90 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-stone-200">
                    <th className="py-3 px-4 w-[16%]">Fecha / Emisión</th>
                    <th className="py-3 px-3 w-[16%]">Galpón / Lote</th>
                    <th className="py-3 px-3 text-center w-[15%]">Muertes / %</th>
                    <th className="py-3 px-4 w-[25%]">Causa Probable Reportada</th>
                    <th className="py-3 px-3 text-center w-[16%]">Prioridad</th>
                    <th className="py-3 px-4 text-right w-[12%]">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/70 text-xs">
                  {filteredAlerts.map((alerta) => (
                    <tr
                      key={alerta.id}
                      className={`${
                        selectedAlert?.id === alerta.id
                          ? 'bg-red-50/40 hover:bg-red-50/70'
                          : 'hover:bg-stone-50'
                      } transition`}
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {alerta.fechaHoraEmision}
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-slate-900 m-0">{alerta.galpon.nombre}</p>
                        <span className="text-[11px] text-slate-500">
                          {alerta.lote.nombre} · {alerta.lote.edadEnDias} días
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`${
                            alerta.prioridad === 'ALTA' ? 'bg-[#DC2626]' : 'bg-red-800'
                          } text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg`}
                        >
                          {alerta.mortalidadAnormal.cantidadMuertes} aves (
                          {alerta.mortalidadAnormal.porcentajeMortalidad}%)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800 truncate">
                        {alerta.mortalidadAnormal.causaProbable}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {renderPriorityBadge(alerta.prioridad)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedAlert(alerta)}
                          className="bg-[#DC2626] hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition border-0 cursor-pointer"
                        >
                          Ver Alerta
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <p className="m-0">
              Las alertas sanitarias forman parte de la bitácora inmutable de bioseguridad y no
              pueden ser eliminadas.
            </p>
            <span className="font-semibold text-slate-700">Página 1 de 1</span>
          </div>
        </section>
      </main>

      {/* 3. MODAL M-01: DETALLE CONSOLIDADO DE ALERTA SANITARIA (Plan 013 / Spec 018 - US2) */}
      {selectedAlert && (
        <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white w-[680px] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            {/* Cabecera del Modal con Estado y Prioridad */}
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

            {/* Cuerpo Consolidado en Solo Lectura (3 Bloques Exactos del JSON de Plan 013 US2) */}
            <div className="p-6 space-y-4">
              {/* Fila Superior: Bloque 1 (Galpón) + Bloque 2 (Lote Activo) */}
              <div className="grid grid-cols-2 gap-4">
                {/* Bloque 1: Datos del Galpón (FR-004: Nombre, Aforo máximo, Estado) */}
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

                {/* Bloque 2: Datos del Lote Activo (FR-005: Nombre, Población actual, Edad en días) */}
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

              {/* Bloque 3: Reporte de Mortalidad Anormal que originó la alerta (FR-006 y FR-011) */}
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

                {/* Métricas Cuantitativas del Evento */}
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

                {/* Causa Probable y Observaciones del Trabajador */}
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

              {/* Nota de Solo Lectura */}
              <div className="px-3.5 py-2.5 rounded-xl bg-stone-100 text-[11px] text-slate-600 flex items-center gap-2">
                <span className="font-bold text-slate-800">Nota operativa:</span>
                <span>
                  Esta vista consolida el contexto del evento en modo de solo lectura. La validación
                  de aislamiento y el diagnóstico clínico se ejecutan desde sus bandejas
                  correspondientes.
                </span>
              </div>
            </div>

            {/* Pie del Modal */}
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

      {/* MODAL AUXILIAR DE SIMULACIÓN DE EVENTO DE MORTALIDAD ANORMAL (Spec 017 -> Spec 018) */}
      {simModalOpen && (
        <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white w-[560px] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 m-0">
                  Simular Mortalidad Anormal y Alerta Automática
                </h3>
                <p className="text-xs text-slate-500 m-0 mt-0.5">
                  Descuenta aves vivas del lote y dispara automáticamente la alerta sanitaria
                  inmutable (Specs 017, 018 y 019)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSimModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 bg-transparent border-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimulateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Galpón con lote activo <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={simGalponId}
                    onChange={(e) => setSimGalponId(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    {vetBarns
                      .filter((b) => b.poblacionActual > 0)
                      .map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.nombre} ({b.loteCodigo} · {b.poblacionActual} vivas)
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cantidad de muertes anormales <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={simMuertes}
                    onChange={(e) => setSimMuertes(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Causa probable o sospechosa reportada <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={simCausa}
                  onChange={(e) => setSimCausa(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observaciones del operario en campo
                </label>
                <textarea
                  rows={3}
                  value={simObs}
                  onChange={(e) => setSimObs(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 p-3 text-xs text-slate-800 resize-none"
                />
              </div>

              {simError && (
                <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 m-0">
                  {simError}
                </p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSimModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold shadow-sm border-0 cursor-pointer"
                >
                  Generar Alerta Sanitaria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </VetShell>
  );
}

export default VetAlertsPage;
