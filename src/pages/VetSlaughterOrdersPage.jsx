import { useContext, useState } from 'react';
import VetShell from '../components/VetShell';
import { FarmContext } from '../context/FarmContext';

function VetSlaughterOrdersPage() {
  const {
    vetBarns = [],
    vetActiveDiagnoses = [],
    vetSanitarySlaughterOrders = [],
    emitSanitarySlaughterOrder,
    confirmSanitarySlaughterExecution
  } = useContext(FarmContext);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [galponFilter, setGalponFilter] = useState('');

  const [emitModalOpen, setEmitModalOpen] = useState(false);
  const [selectedDiagnosticoId, setSelectedDiagnosticoId] = useState('');
  const [motivoClinico, setMotivoClinico] = useState(
    'Brote agudo confirmado de patología mortal de alta patogenicidad. Disposición sanitaria urgente de toda la población del lote.'
  );
  const [emitError, setEmitError] = useState('');

  const [confirmingOrder, setConfirmingOrder] = useState(null);
  const [observacionesEjecucion, setObservacionesEjecucion] = useState(
    'Sacrificio sanitario total culminado bajo protocolo de bioseguridad nivel 3. Galpón sellado para inicio de desinfección.'
  );

  const countAll = vetSanitarySlaughterOrders.length;
  const countPending = vetSanitarySlaughterOrders.filter(
    (o) => o.estado === 'PENDIENTE_EJECUCION'
  ).length;
  const countExecuted = vetSanitarySlaughterOrders.filter(
    (o) => o.estado === 'EJECUTADA'
  ).length;

  const filteredOrders = vetSanitarySlaughterOrders.filter((o) => {
    if (statusFilter !== 'ALL' && o.estado !== statusFilter) return false;
    if (galponFilter && o.galponId !== galponFilter) return false;
    return true;
  });

  const mortalActiveDiagnoses = vetActiveDiagnoses.filter(
    (d) => d.estado === 'ACTIVO' && d.requiereSacrificioHistorico
  );

  const openEmitModal = () => {
    const firstEligible =
      mortalActiveDiagnoses.find(
        (d) =>
          !vetSanitarySlaughterOrders.some(
            (o) => o.galponId === d.galponId && o.estado === 'PENDIENTE_EJECUCION'
          )
      ) || mortalActiveDiagnoses[0];

    setSelectedDiagnosticoId(firstEligible?.id || '');
    setMotivoClinico(
      'Brote agudo confirmado de Influenza Aviar de alta patogenicidad. Disposición sanitaria urgente de toda la población del lote.'
    );
    setEmitError('');
    setEmitModalOpen(true);
  };

  const selectedDiagObj = mortalActiveDiagnoses.find(
    (d) => d.id === selectedDiagnosticoId
  );
  const selectedDiagBarn = selectedDiagObj
    ? vetBarns.find((b) => b.id === selectedDiagObj.galponId)
    : null;

  const handleEmitOrder = (e) => {
    e.preventDefault();
    if (!selectedDiagObj) {
      setEmitError(
        'Debe contar con un diagnóstico confirmado cuya enfermedad requiera sacrificio sanitario.'
      );
      return;
    }
    if (!motivoClinico.trim()) {
      setEmitError('El motivo clínico de la orden sanitaria es obligatorio.');
      return;
    }
    const alreadyPending = vetSanitarySlaughterOrders.some(
      (o) =>
        o.galponId === selectedDiagObj.galponId && o.estado === 'PENDIENTE_EJECUCION'
    );
    if (alreadyPending) {
      setEmitError(
        `El ${selectedDiagObj.galponNombreHistorico} ya cuenta con una orden de sacrificio sanitario pendiente de ejecución.`
      );
      return;
    }

    emitSanitarySlaughterOrder({
      diagnosticoId: selectedDiagObj.id,
      motivoClinico: motivoClinico.trim()
    });
    setEmitModalOpen(false);
  };

  const openConfirmModal = (order) => {
    setConfirmingOrder(order);
    setObservacionesEjecucion(
      'Sacrificio sanitario total culminado bajo protocolo de bioseguridad nivel 3. Galpón sellado para inicio de desinfección.'
    );
  };

  const handleConfirmExecution = (e) => {
    e.preventDefault();
    if (!confirmingOrder) return;
    confirmSanitarySlaughterExecution({
      ordenId: confirmingOrder.id,
      observacionesEjecucion: observacionesEjecucion.trim()
    });
    setConfirmingOrder(null);
  };

  const confirmingBarn = confirmingOrder
    ? vetBarns.find((b) => b.id === confirmingOrder.galponId)
    : null;
  const remanenteVivoHoy =
    confirmingBarn && confirmingBarn.poblacionActual > 0
      ? confirmingBarn.poblacionActual
      : confirmingOrder?.poblacionAfectadaMomento || 0;

  return (
    <VetShell activeNav="ordenes">
      <main
        className="flex-1 px-8 py-5 flex flex-col gap-4"
        style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}
      >
        {/* ENCABEZADO ALINEADO EN UNA SOLA LÍNEA */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">
              Órdenes de Sacrificio Sanitario Total
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5 m-0">
              Emisión y confirmación de ejecución física de erradicación biológica total ante
              diagnósticos de enfermedades mortales
            </p>
          </div>

          <button
            type="button"
            onClick={openEmitModal}
            className="bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 whitespace-nowrap shrink-0 border-0 cursor-pointer"
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
            <span>Emitir Orden de Sacrificio Sanitario</span>
          </button>
        </div>

        {/* TARJETA PRINCIPAL DE ANCHO COMPLETO */}
        <section
          className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-stone-200/80 flex flex-col justify-between"
          style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
              <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3.5 py-1.5 rounded-lg transition border-0 cursor-pointer ${
                    statusFilter === 'ALL'
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'bg-transparent text-slate-600 hover:bg-white/60'
                  }`}
                >
                  Todas las órdenes ({countAll})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('PENDIENTE_EJECUCION')}
                  className={`px-3.5 py-1.5 rounded-lg transition border-0 cursor-pointer ${
                    statusFilter === 'PENDIENTE_EJECUCION'
                      ? 'bg-white text-amber-900 shadow-sm font-bold'
                      : 'bg-transparent text-amber-900 hover:bg-white/60'
                  }`}
                >
                  Pendientes de Ejecución ({countPending})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('EJECUTADA')}
                  className={`px-3.5 py-1.5 rounded-lg transition border-0 cursor-pointer ${
                    statusFilter === 'EJECUTADA'
                      ? 'bg-white text-slate-800 shadow-sm font-bold'
                      : 'bg-transparent text-slate-700 hover:bg-white/60'
                  }`}
                >
                  Ejecutadas · Vaciado Sanitario ({countExecuted})
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                  Filtrar por galpón:
                </label>
                <select
                  value={galponFilter}
                  onChange={(e) => setGalponFilter(e.target.value)}
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

            {/* Tabla de Órdenes de Sacrificio Sanitario */}
            <div className="flex-1 overflow-hidden rounded-xl border border-stone-200/90">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-stone-100/90 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-stone-200">
                    <th className="py-3 px-4 w-[14%]">Galpón / Lote</th>
                    <th className="py-3 px-3 w-[16%]">Enfermedad Mortal</th>
                    <th className="py-3 px-3 text-center w-[15%]">Población (100% Lote)</th>
                    <th className="py-3 px-3 w-[21%]">Motivo Clínico / Observaciones</th>
                    <th className="py-3 px-2.5 text-center w-[12%]">Estado Galpón</th>
                    <th className="py-3 px-2.5 text-center w-[10%]">Estado Orden</th>
                    <th className="py-3 px-4 text-right w-[12%]">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/70 text-xs">
                  {filteredOrders.map((order) => {
                    const isPending = order.estado === 'PENDIENTE_EJECUCION';
                    return (
                      <tr
                        key={order.id}
                        className={
                          isPending
                            ? 'bg-red-50/35 hover:bg-red-50/60 transition'
                            : 'hover:bg-stone-50 transition'
                        }
                      >
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900 m-0">{order.galponNombre}</p>
                          <span
                            className={`text-[11px] font-semibold ${
                              isPending ? 'text-red-800' : 'text-slate-500'
                            }`}
                          >
                            {order.loteNombre}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <p
                            className={`font-bold m-0 ${
                              isPending ? 'text-red-900' : 'text-slate-800'
                            }`}
                          >
                            {order.enfermedadNombre}
                          </p>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {isPending
                              ? `Emitida: ${order.emitidaEnTexto}`
                              : `Ejecutada: ${order.ejecutadaEnTexto}`}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          {isPending ? (
                            <>
                              <span className="inline-block bg-amber-100 text-amber-950 border border-amber-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg">
                                {Number(order.poblacionAfectadaMomento).toLocaleString('es-CO')}{' '}
                                aves vivas
                              </span>
                              <span className="block text-[10px] text-slate-500 mt-0.5">
                                Afectadas al emitir
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="inline-block bg-stone-200 text-slate-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg">
                                0 aves vivas
                              </span>
                              <span className="block text-[10px] text-red-700 font-semibold mt-0.5">
                                {Number(order.poblacionSacrificada).toLocaleString('es-CO')}{' '}
                                sacrificadas
                              </span>
                            </>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          <p className="font-semibold text-slate-800 truncate m-0">
                            {order.motivoClinico}
                          </p>
                          <p
                            className={`text-[11px] truncate m-0 ${
                              isPending ? 'text-slate-500' : 'text-emerald-800 font-medium'
                            }`}
                          >
                            {order.subMotivo}
                          </p>
                        </td>
                        <td className="py-3.5 px-2.5 text-center">
                          {isPending ? (
                            <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-900 border border-sky-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                              AISLAMIENTO
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                              VACIADO SANITARIO
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-2.5 text-center">
                          {isPending ? (
                            <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              Pendiente
                            </span>
                          ) : (
                            <span className="inline-block bg-stone-200 text-stone-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                              Ejecutada
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isPending ? (
                            <button
                              type="button"
                              onClick={() => openConfirmModal(order)}
                              className="bg-[#DC2626] hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition whitespace-nowrap border-0 cursor-pointer"
                            >
                              Confirmar Ejecución
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-semibold">
                              Inmutable
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
              La emisión en estado <strong>Pendiente de Ejecución</strong> conserva intactos el lote
              y el galpón; solo al <strong>Confirmar Ejecución</strong> la población pasa a 0 y el
              galpón a <strong>Vaciado Sanitario</strong>.
            </p>
            <span className="font-semibold text-slate-700">
              Mostrando {filteredOrders.length} órdenes registradas
            </span>
          </div>
        </section>
      </main>

      {/* MODAL EMITIR ORDEN DE SACRIFICIO SANITARIO TOTAL */}
      {emitModalOpen && (
        <div className="fixed inset-0 bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white w-[620px] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 m-0">
                    Emitir Orden de Sacrificio Sanitario Total
                  </h3>
                  <span className="bg-red-100 text-red-800 border border-red-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    CONTENCIÓN BIOLÓGICA 100%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 m-0">
                  Ordene la erradicación sanitaria de toda la población del lote ante un diagnóstico
                  mortal confirmado
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEmitModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 bg-transparent border-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEmitOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Diagnóstico mortal confirmado en galpón aislado{' '}
                  <span className="text-red-600">*</span>
                </label>
                <select
                  value={selectedDiagnosticoId}
                  onChange={(e) => {
                    setSelectedDiagnosticoId(e.target.value);
                    setEmitError('');
                  }}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#185C2B]"
                >
                  {mortalActiveDiagnoses.length === 0 ? (
                    <option value="">No hay diagnósticos mortales activos</option>
                  ) : (
                    mortalActiveDiagnoses.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.galponNombreHistorico} ({d.loteNombreHistorico}) — Diagnóstico:{' '}
                        {d.nombreEnfermedadHistorico} [Requiere Sacrificio Sanitario: SÍ]
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="p-4 rounded-xl bg-red-50/50 border border-red-200/90 space-y-2.5">
                <div className="flex items-center justify-between border-b border-red-200/70 pb-2">
                  <span className="text-[11px] font-extrabold text-red-950 uppercase tracking-wider">
                    Alcance Total Obligatorio del Lote
                  </span>
                  <span className="text-[10px] font-bold text-sky-900 bg-sky-100 border border-sky-200 px-2 py-0.5 rounded-full">
                    Estado Actual: AISLAMIENTO
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-red-100">
                    <span className="text-[10px] text-slate-400 block">Galpón y Lote Activo</span>
                    <span className="font-extrabold text-slate-900">
                      {selectedDiagObj?.galponNombreHistorico || '—'} ·{' '}
                      {selectedDiagObj?.loteNombreHistorico?.replace('Lote ', '') || '—'}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-red-100">
                    <span className="text-[10px] text-slate-400 block">
                      Población viva afectada
                    </span>
                    <span className="font-extrabold text-[#DC2626]">
                      {Number(
                        selectedDiagBarn?.poblacionActual ||
                          selectedDiagObj?.poblacionMomento ||
                          0
                      ).toLocaleString('es-CO')}{' '}
                      aves (100%)
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-red-100">
                    <span className="text-[10px] text-slate-400 block">
                      Estado inicial de orden
                    </span>
                    <span className="font-extrabold text-amber-800">Pendiente de Ejecución</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-snug m-0">
                  La orden abarca el <strong>100 % de la población alojada</strong> sin cantidades
                  parciales ni pesajes comerciales. Emitir esta orden mantiene el galpón en{' '}
                  <strong>Aislamiento</strong> hasta que se confirme su ejecución física.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Motivo clínico de la orden sanitaria <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={motivoClinico}
                  onChange={(e) => {
                    setMotivoClinico(e.target.value);
                    setEmitError('');
                  }}
                  placeholder="Indique la justificación epidemiológica y sanitaria para emitir la orden..."
                  className="w-full rounded-xl border border-stone-300 p-3 text-xs text-slate-800 focus:outline-none focus:border-[#185C2B] resize-none"
                />
              </div>

              {emitError && (
                <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 m-0">
                  {emitError}
                </p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold shadow-sm transition border-0 cursor-pointer"
                >
                  Emitir Orden Sanitaria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR EJECUCIÓN FÍSICA DE SACRIFICIO SANITARIO */}
      {confirmingOrder && (
        <div className="fixed inset-0 bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white w-[640px] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 bg-red-50/80 border-b border-red-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 m-0">
                    Confirmar Ejecución Física de Sacrificio Sanitario
                  </h3>
                  <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    ACCIÓN ATÓMICA IRREVERSIBLE
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 m-0">
                  Certifique que la orden pendiente fue ejecutada físicamente en campo
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmingOrder(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 bg-transparent border-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmExecution} className="p-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/90 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Galpón y Lote Activo</span>
                  <span className="font-extrabold text-slate-900">
                    {confirmingOrder.galponNombre} · {confirmingOrder.loteNombre}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Patología Mortal</span>
                  <span className="font-extrabold text-red-800">
                    {confirmingOrder.enfermedadNombre}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">
                    Saldo vivo remanente hoy
                  </span>
                  <span className="font-extrabold text-slate-900">
                    {Number(remanenteVivoHoy).toLocaleString('es-CO')} aves vivas → Pasar a 0
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-50/60 border border-red-200 space-y-2">
                <span className="text-[11px] font-extrabold text-red-950 uppercase tracking-wider block">
                  Al confirmar esta ejecución, el sistema aplicará de forma inmediata:
                </span>
                <ul className="text-xs text-slate-800 space-y-1.5 list-disc list-inside m-0 p-0">
                  <li>
                    <strong>Extinción de inventario vivo:</strong> Fija la población viva del{' '}
                    <strong>{confirmingOrder.loteNombre}</strong> en exactamente{' '}
                    <strong>0 aves</strong> (registrando{' '}
                    {Number(remanenteVivoHoy).toLocaleString('es-CO')} aves sacrificadas).
                  </li>
                  <li>
                    <strong>Transición de galpón:</strong> Cambia el estado del{' '}
                    <strong>{confirmingOrder.galponNombre}</strong> de{' '}
                    <strong>Aislamiento</strong> a{' '}
                    <strong className="text-purple-900">Vaciado Sanitario</strong>.
                  </li>
                  <li>
                    <strong>Cierre de diagnóstico:</strong> Marca el diagnóstico clínico activo como{' '}
                    <strong>Cerrado por Sacrificio</strong>.
                  </li>
                  <li>
                    <strong>Registro de ejecución:</strong> Marca la orden como{' '}
                    <strong>Ejecutada</strong> de forma permanente.
                  </li>
                </ul>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observaciones de ejecución en campo{' '}
                  <span className="text-slate-400 font-normal">(Opcional)</span>
                </label>
                <textarea
                  rows={2}
                  value={observacionesEjecucion}
                  onChange={(e) => setObservacionesEjecucion(e.target.value)}
                  placeholder="Registre detalles del protocolo de bioseguridad aplicado o sellado del galpón..."
                  className="w-full rounded-xl border border-stone-300 p-3 text-xs text-slate-800 focus:outline-none focus:border-[#185C2B] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setConfirmingOrder(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold shadow-sm transition border-0 cursor-pointer"
                >
                  Confirmar Ejecución y Vaciar Lote a 0
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </VetShell>
  );
}

export default VetSlaughterOrdersPage;
