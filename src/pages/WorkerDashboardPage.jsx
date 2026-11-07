import { useContext, useState } from 'react';
import { FarmContext } from '../context/FarmContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import BaseModal from '../components/BaseModal';
import ApiMessage from '../components/ApiMessage';

function WorkerDashboardPage() {
  const {
    workerBarns,
    sackWeightKg = 40,
    registerWorkerMortality,
    requestBarnIsolation
  } = useContext(FarmContext);

  const [toast, setToast] = useState('');

  // Modal 1: Registrar Bajas / Mortalidad (Admin 720px modal style)
  const [isMortalityOpen, setIsMortalityOpen] = useState(false);
  const [mortalityForm, setMortalityForm] = useState({
    barnId: 'galpon-1',
    fecha: '2026-09-19',
    hora: '07:15',
    cantidadBajas: '18',
    causa: 'Problemas digestivos / entéricos',
    observaciones:
      'Retiradas en el recorrido matutino de inspección. Temperatura ambiente elevada en la madrugada (29°C).'
  });

  // Modal 2: Solicitar Aislamiento Preventivo (Admin 720px modal style)
  const [isIsolationOpen, setIsIsolationOpen] = useState(false);
  const [isolationForm, setIsolationForm] = useState({
    barnId: 'galpon-1',
    motivo: 'Incremento repentino de aves decaídas y diarrea en sector norte',
    signosClinicos:
      'Aves postradas cerca de los comederos, plumaje erizado, consumo reducido de alimento en las últimas 12 horas y heces sanguinolentas.'
  });

  const totalLiveBirds = workerBarns.reduce(
    (sum, b) => sum + (b.poblacionNum || 0),
    0
  );

  const selectedMortalityBarn =
    workerBarns.find((b) => b.id === mortalityForm.barnId) || workerBarns[0];

  const availableBarnsForIsolation = workerBarns.filter(
    (b) => !b.pendingValidation
  );

  const selectedIsolationBarn =
    workerBarns.find((b) => b.id === isolationForm.barnId) ||
    availableBarnsForIsolation[0] ||
    workerBarns[0];

  const bajasCount = Math.max(0, parseInt(mortalityForm.cantidadBajas, 10) || 0);
  const isAbnormalMortality = bajasCount > 5;
  const lotePercentage = selectedMortalityBarn?.poblacionNum
    ? ((bajasCount / selectedMortalityBarn.poblacionNum) * 100).toFixed(2)
    : '0.00';

  const handleOpenMortalityModal = (barnId = 'galpon-1') => {
    setMortalityForm((prev) => ({
      ...prev,
      barnId: barnId || workerBarns[0]?.id || 'galpon-1'
    }));
    setIsMortalityOpen(true);
  };

  const handleOpenIsolationModal = (barnId) => {
    const defaultBarnId =
      barnId ||
      availableBarnsForIsolation[0]?.id ||
      workerBarns[0]?.id ||
      'galpon-1';
    setIsolationForm((prev) => ({
      ...prev,
      barnId: defaultBarnId
    }));
    setIsIsolationOpen(true);
  };

  const handleSaveMortality = (e) => {
    e.preventDefault();
    if (!selectedMortalityBarn || bajasCount <= 0) return;

    registerWorkerMortality({
      barnId: mortalityForm.barnId,
      cantidadBajas: bajasCount,
      fecha: mortalityForm.fecha,
      hora: mortalityForm.hora,
      causa: mortalityForm.causa,
      observaciones: mortalityForm.observaciones
    });

    setIsMortalityOpen(false);
    if (isAbnormalMortality) {
      setToast(
        `Se registraron ${bajasCount} bajas en ${selectedMortalityBarn.name}. Notificación prioritaria enviada al veterinario.`
      );
    } else {
      setToast(
        `Mortalidad diaria (${bajasCount} aves) registrada en ${selectedMortalityBarn.name}.`
      );
    }
  };

  const handleSaveIsolationRequest = (e) => {
    e.preventDefault();
    if (!selectedIsolationBarn) return;

    requestBarnIsolation({
      barnId: isolationForm.barnId,
      motivo: isolationForm.motivo,
      signosClinicos: isolationForm.signosClinicos
    });

    setIsIsolationOpen(false);
    setToast(
      `Solicitud de aislamiento preventivo enviada para ${selectedIsolationBarn.name}.`
    );
  };

  return (
    <div className="avi-role-layout">
      <Sidebar role="trabajador" />

      <div
        className="avi-main-frame"
        data-node-id="238:5822"
        data-name="Trabajador Inicio"
      >
        <Topbar roleLabel="Trabajador" avatarSrc="/assets/admin-avatar.svg" />
        <ApiMessage message={toast} type="success" onClose={() => setToast('')} />

        <div className="avi-dashboard-content" data-node-id="238:5842">
          {/* Encabezado de Página */}
          <div className="avi-page-heading" data-node-id="238:5843">
            <div className="avi-heading-copy">
              <p className="avi-page-subtitle" data-node-id="238:5848">
                Control y registro diario de galpones asignados a su cargo
              </p>
            </div>

            <div className="avi-worker-header-actions" data-node-id="238:5849">
              <button
                type="button"
                className="avi-btn-orange-cta"
                onClick={() => handleOpenMortalityModal('galpon-1')}
                data-node-id="238:5850"
              >
                <span>＋  Registrar bajas</span>
              </button>
              <button
                type="button"
                className="avi-btn-green-cta"
                onClick={() => handleOpenIsolationModal()}
                data-node-id="238:5855"
              >
                <span>＋  Solicitar aislamiento</span>
              </button>
            </div>
          </div>

          {/* 3 Tarjetas KPI usando el componente StatCard y logos de Administrador */}
          <div className="avi-metrics-row" data-node-id="238:5861">
            <StatCard
              label="Galpones asignados"
              value={workerBarns.length}
              status={`${totalLiveBirds.toLocaleString('es-CO')} aves vivas`}
              statusColor="#2d743b"
              icon="/assets/admin-galpon.svg"
              tileBg="#f4eee3"
              width="437px"
            />
            <StatCard
              label="Alimento diario"
              value="1.250 kg"
              status={`${Number((1250 / sackWeightKg).toFixed(1))} bultos (${sackWeightKg} kg/bulto)`}
              statusColor="#2d743b"
              icon="/assets/admin-inventario.svg"
              tileBg="#e6f7e4"
              width="437px"
            />
            <StatCard
              label="Tratamientos activos"
              value="1"
              status="Amprolio 20% · Galpón 5"
              statusColor="#9e4a0f"
              icon="/assets/admin-orden.svg"
              tileBg="#f4eee3"
              width="444px"
            />
          </div>

          {/* Panel: Galpones a su cargo con el logo y diseño de Administrador */}
          <div className="avi-recent-orders-panel" data-node-id="238:5892">
            <div className="avi-panel-header avi-panel-header-full" data-node-id="238:5893">
              <div className="avi-panel-icon-28">
                <img alt="" src="/assets/admin-home-icon.svg" />
              </div>
              <h2 className="avi-panel-title">Galpones a su cargo</h2>
              <div className="avi-panel-spacer" />
              <span className="avi-worker-operator-tag">
                Operario: Carlos Pérez · Zona A
              </span>
            </div>

            <div className="avi-worker-barns-grid" data-node-id="238:5898">
              {workerBarns.map((barn) => (
                <div
                  key={barn.id}
                  className={`avi-worker-barn-card ${
                    barn.pendingValidation ? 'avi-worker-barn-card-pending' : ''
                  }`}
                >
                  <div className="avi-worker-barn-top">
                    <div className="avi-crit-item-left">
                      <div
                        className="avi-crit-icon-tile"
                        style={{
                          backgroundColor: barn.pendingValidation ? '#fff1d6' : '#e6f7e4'
                        }}
                      >
                        <div className="avi-crit-icon-26">
                          <img alt="" src="/assets/admin-galpon.svg" />
                        </div>
                      </div>
                      <div className="avi-worker-barn-titles">
                        <h3>{barn.name}</h3>
                        <span>{barn.lote}</span>
                      </div>
                    </div>

                    <span
                      className="avi-barn-status-pill"
                      style={{
                        backgroundColor: barn.pendingValidation ? '#ffe8ba' : '#d6f0d1',
                        color: barn.pendingValidation ? '#bf5400' : '#1f5929'
                      }}
                    >
                      <span
                        className="avi-barn-status-dot"
                        style={{
                          backgroundColor: barn.pendingValidation ? '#f59e0b' : '#2d9f42'
                        }}
                      />
                      {barn.status}
                    </span>
                  </div>

                  <div className="avi-worker-barn-metrics">
                    <div className="avi-worker-barn-metric-box">
                      <span>Población viva</span>
                      <strong>{barn.poblacion}</strong>
                    </div>
                    <div className="avi-worker-barn-metric-box">
                      <span>Edad del lote</span>
                      <strong>{barn.edad}</strong>
                    </div>
                  </div>

                  {barn.pendingValidation ? (
                    <div className="avi-worker-barn-notice">
                      <div className="avi-crit-dot">
                        <img alt="" src="/assets/dot-orange.svg" />
                      </div>
                      <p>
                        <strong>Solicitud {barn.alertCode || '#SOL-004'}:</strong> Esperando
                        evaluación del veterinario para aislamiento.
                      </p>
                    </div>
                  ) : (
                    <div className="avi-worker-barn-details">
                      <div className="avi-worker-barn-detail-row">
                        <span>Dieta asignada hoy</span>
                        <strong>{barn.dieta}</strong>
                      </div>
                      <div className="avi-worker-barn-detail-row">
                        <span>Ración diaria</span>
                        <strong>{barn.racion}</strong>
                      </div>
                    </div>
                  )}

                  <div className="avi-worker-barn-actions">
                    <button
                      type="button"
                      className="avi-admin-table-btn avi-admin-table-btn-orange"
                      style={{ flex: 1 }}
                      onClick={() => handleOpenMortalityModal(barn.id)}
                    >
                      Registrar bajas
                    </button>
                    {barn.pendingValidation ? (
                      <button
                        type="button"
                        className="avi-admin-table-btn avi-worker-btn-disabled"
                        style={{ flex: 1 }}
                        disabled
                      >
                        Solicitud enviada
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="avi-admin-table-btn avi-admin-table-btn-green"
                        style={{ flex: 1 }}
                        onClick={() => handleOpenIsolationModal(barn.id)}
                      >
                        Solicitar aislamiento
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Paneles Inferiores con el mismo estilo y logos de Administrador */}
          <div className="avi-worker-bottom-panels" data-node-id="238:5995">
            {/* Panel Izquierdo: Consulta de Alimento Diario */}
            <div className="avi-recent-orders-panel" data-node-id="238:5996">
              <div className="avi-panel-header avi-panel-header-full">
                <div className="avi-panel-icon-28">
                  <img alt="" src="/assets/admin-inv-panel.svg" />
                </div>
                <h2 className="avi-panel-title">Consulta de alimento diario</h2>
                <div className="avi-panel-spacer" />
                <span
                  className="avi-barn-status-pill"
                  style={{ backgroundColor: '#d6f0d1', color: '#1f5929' }}
                >
                  <span
                    className="avi-barn-status-dot"
                    style={{ backgroundColor: '#2d9f42' }}
                  />
                  Bodega disponible
                </span>
              </div>

              <div className="avi-orders-table">
                <div className="avi-orders-thead">
                  <span style={{ flex: '1.1' }}>Galpón</span>
                  <span style={{ flex: '1.5' }}>Tipo de alimento</span>
                  <span style={{ flex: '1.1' }}>Cuota (kg)</span>
                  <span style={{ flex: '1.2' }}>Bultos ({sackWeightKg} kg)</span>
                  <span style={{ flex: '1.2' }}>Estado bodega</span>
                </div>

                {workerBarns.map((b) => {
                  const cuotaNum = parseFloat(String(b.cuotaKg).replace(/[^0-9.]/g, '')) || 450;
                  const computedBultos = `${Number((cuotaNum / sackWeightKg).toFixed(1))} bultos`;
                  return (
                  <div key={b.id} className="avi-orders-trow">
                    <span className="avi-col-dark" style={{ flex: '1.1' }}>
                      {b.name}
                    </span>
                    <span className="avi-col-dark" style={{ flex: '1.5' }}>
                      {b.dieta}
                    </span>
                    <span className="avi-col-dark" style={{ flex: '1.1' }}>
                      {b.cuotaKg}
                    </span>
                    <span className="avi-col-muted" style={{ flex: '1.2' }}>
                      {computedBultos}
                    </span>
                    <div style={{ flex: '1.2', display: 'flex', alignItems: 'center' }}>
                      <span
                        className="avi-barn-status-pill"
                        style={{ backgroundColor: '#d6f0d1', color: '#1f5929' }}
                      >
                        <span
                          className="avi-barn-status-dot"
                          style={{ backgroundColor: '#2d9f42' }}
                        />
                        {b.estadoBodega}
                      </span>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Panel Derecho: Medicación Diaria */}
            <div className="avi-recent-orders-panel" data-node-id="238:6051">
              <div className="avi-panel-header avi-panel-header-full">
                <div className="avi-panel-icon-28">
                  <img alt="" src="/assets/admin-medicine-bottle.svg" />
                </div>
                <h2 className="avi-panel-title">Medicación diaria</h2>
                <div className="avi-panel-spacer" />
                <span
                  className="avi-barn-status-pill"
                  style={{ backgroundColor: '#ffe8ba', color: '#bf5400' }}
                >
                  <span
                    className="avi-barn-status-dot"
                    style={{ backgroundColor: '#f59e0b' }}
                  />
                  1 tratamiento
                </span>
              </div>

              <div className="avi-worker-med-panel-card" data-node-id="238:6059">
                <div className="avi-worker-med-card-top">
                  <div className="avi-crit-item-left">
                    <div
                      className="avi-crit-icon-tile"
                      style={{ backgroundColor: '#f4eee3' }}
                    >
                      <div className="avi-crit-icon-26">
                        <img alt="" src="/assets/admin-vaccine.svg" />
                      </div>
                    </div>
                    <div className="avi-worker-barn-titles">
                      <h3>Galpón 5 · Lote #LDP-005</h3>
                      <span>Amprolio 20% Solución</span>
                    </div>
                  </div>

                  <span
                    className="avi-barn-status-pill"
                    style={{ backgroundColor: '#fff1d6', color: '#eb6b00' }}
                  >
                    Día 2 de 5
                  </span>
                </div>

                <div className="avi-worker-barn-details">
                  <div className="avi-worker-barn-detail-row">
                    <span>Diagnóstico veterinario</span>
                    <strong>Coccidiosis Aviar</strong>
                  </div>
                  <div className="avi-worker-barn-detail-row">
                    <span>Dosis programada hoy</span>
                    <strong>200 g diluidos en 100 L de agua</strong>
                  </div>
                  <div className="avi-worker-barn-detail-row">
                    <span>Vía de administración</span>
                    <strong>Agua de bebida en bebederos automáticos</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL 1: REGISTRAR BAJAS / MORTALIDAD (Diseño unificado 720px de Administrador) ── */}
      <BaseModal
        isOpen={isMortalityOpen}
        onClose={() => setIsMortalityOpen(false)}
        maxWidth="720px"
      >
        <form
          className="avi-figma-modal-720"
          data-node-id="238:6261"
          onSubmit={handleSaveMortality}
        >
          <div className="avi-figma-modal-header" data-node-id="238:6262">
            <div className="avi-figma-modal-titles">
              <h2 className="avi-figma-modal-title">Registrar bajas / mortalidad</h2>
              <p className="avi-figma-modal-subtitle">
                Control diario de mortalidad por galpón asignado
              </p>
            </div>
            <button
              type="button"
              className="avi-figma-modal-close"
              onClick={() => setIsMortalityOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="avi-figma-modal-grid" data-node-id="238:6273">
            <div className="avi-figma-field">
              <label className="avi-figma-label">Galpón asignado</label>
              <div className="avi-figma-select-wrap">
                <select
                  className="avi-figma-input avi-figma-select"
                  value={mortalityForm.barnId}
                  onChange={(e) =>
                    setMortalityForm({ ...mortalityForm, barnId: e.target.value })
                  }
                >
                  {workerBarns.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} — {b.lote} ({b.poblacion})
                    </option>
                  ))}
                </select>
                <img
                  alt=""
                  src="/assets/admin-select-chevron.svg"
                  className="avi-figma-select-chevron"
                />
              </div>
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Población actual viva</label>
              <div className="avi-figma-valid-box">
                {selectedMortalityBarn?.poblacion} ({selectedMortalityBarn?.lote})
              </div>
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Fecha del evento</label>
              <input
                type="date"
                className="avi-figma-input"
                value={mortalityForm.fecha}
                onChange={(e) =>
                  setMortalityForm({ ...mortalityForm, fecha: e.target.value })
                }
                required
              />
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Hora del hallazgo</label>
              <input
                type="time"
                className="avi-figma-input"
                value={mortalityForm.hora}
                onChange={(e) =>
                  setMortalityForm({ ...mortalityForm, hora: e.target.value })
                }
                required
              />
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Cantidad de bajas</label>
              <input
                type="number"
                min="1"
                max={selectedMortalityBarn?.poblacionNum || 5000}
                className="avi-figma-input"
                value={mortalityForm.cantidadBajas}
                onChange={(e) =>
                  setMortalityForm({
                    ...mortalityForm,
                    cantidadBajas: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Causa probable / clasificación</label>
              <div className="avi-figma-select-wrap">
                <select
                  className="avi-figma-input avi-figma-select"
                  value={mortalityForm.causa}
                  onChange={(e) =>
                    setMortalityForm({ ...mortalityForm, causa: e.target.value })
                  }
                >
                  <option value="Problemas digestivos / entéricos">
                    Problemas digestivos / entéricos
                  </option>
                  <option value="Estrés térmico / ambiental">
                    Estrés térmico / ambiental
                  </option>
                  <option value="Problemas respiratorios">
                    Problemas respiratorios
                  </option>
                  <option value="Causas naturales / aplastamiento">
                    Causas naturales / aplastamiento
                  </option>
                  <option value="Otra causa en observación">
                    Otra causa en observación
                  </option>
                </select>
                <img
                  alt=""
                  src="/assets/admin-select-chevron.svg"
                  className="avi-figma-select-chevron"
                />
              </div>
            </div>

            <div className="avi-figma-field" style={{ gridColumn: '1 / -1' }}>
              <label className="avi-figma-label">Evaluación del umbral diario (máx. 5 aves)</label>
              {isAbnormalMortality ? (
                <div className="avi-figma-invalid-box" data-node-id="238:6340">
                  Alerta de mortalidad anormal ({bajasCount} bajas · {lotePercentage}% del lote):
                  supera el umbral normal y notificará automáticamente al veterinario.
                </div>
              ) : (
                <div className="avi-figma-valid-box">
                  Mortalidad dentro del rango normal diario ({bajasCount} bajas · {lotePercentage}%
                  del lote).
                </div>
              )}
            </div>

            <div className="avi-figma-field" style={{ gridColumn: '1 / -1' }}>
              <label className="avi-figma-label">Observaciones adicionales</label>
              <input
                type="text"
                className="avi-figma-input"
                value={mortalityForm.observaciones}
                onChange={(e) =>
                  setMortalityForm({
                    ...mortalityForm,
                    observaciones: e.target.value
                  })
                }
              />
            </div>
          </div>

          <div className="avi-figma-modal-footer" data-node-id="238:6356">
            <button
              type="button"
              className="avi-figma-btn-cancel"
              onClick={() => setIsMortalityOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="avi-figma-btn-orange">
              Guardar mortalidad
            </button>
          </div>
        </form>
      </BaseModal>

      {/* ── MODAL 2: SOLICITAR AISLAMIENTO PREVENTIVO (Diseño unificado 720px de Administrador) ── */}
      <BaseModal
        isOpen={isIsolationOpen}
        onClose={() => setIsIsolationOpen(false)}
        maxWidth="720px"
      >
        <form
          className="avi-figma-modal-720"
          data-node-id="238:6365"
          onSubmit={handleSaveIsolationRequest}
        >
          <div className="avi-figma-modal-header" data-node-id="238:6366">
            <div className="avi-figma-modal-titles">
              <h2 className="avi-figma-modal-title">Solicitar aislamiento preventivo</h2>
              <p className="avi-figma-modal-subtitle">
                Emisión de alerta sanitaria para revisión del veterinario
              </p>
            </div>
            <button
              type="button"
              className="avi-figma-modal-close"
              onClick={() => setIsIsolationOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="avi-figma-modal-grid" data-node-id="238:6377">
            <div className="avi-figma-field">
              <label className="avi-figma-label">Trabajador responsable</label>
              <div className="avi-figma-readonly-box">Carlos Pérez (ID: #TR-882)</div>
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Galpón asignado en producción</label>
              <div className="avi-figma-select-wrap">
                <select
                  className="avi-figma-input avi-figma-select"
                  value={isolationForm.barnId}
                  onChange={(e) =>
                    setIsolationForm({ ...isolationForm, barnId: e.target.value })
                  }
                >
                  {workerBarns.map((b) => (
                    <option
                      key={b.id}
                      value={b.id}
                      disabled={b.pendingValidation}
                    >
                      {b.name} — {b.lote} ({b.poblacion})
                      {b.pendingValidation ? ' [Pendiente]' : ''}
                    </option>
                  ))}
                </select>
                <img
                  alt=""
                  src="/assets/admin-select-chevron.svg"
                  className="avi-figma-select-chevron"
                />
              </div>
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Población en riesgo</label>
              <div className="avi-figma-readonly-box">{selectedIsolationBarn?.poblacion}</div>
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Edad y estado del lote</label>
              <div className="avi-figma-valid-box">
                {selectedIsolationBarn?.edad} · En producción
              </div>
            </div>

            <div className="avi-figma-field" style={{ gridColumn: '1 / -1' }}>
              <label className="avi-figma-label">Motivo / justificación sanitaria</label>
              <input
                type="text"
                className="avi-figma-input"
                value={isolationForm.motivo}
                onChange={(e) =>
                  setIsolationForm({ ...isolationForm, motivo: e.target.value })
                }
                required
              />
            </div>

            <div className="avi-figma-field" style={{ gridColumn: '1 / -1' }}>
              <label className="avi-figma-label">Signos clínicos observados</label>
              <input
                type="text"
                className="avi-figma-input"
                value={isolationForm.signosClinicos}
                onChange={(e) =>
                  setIsolationForm({
                    ...isolationForm,
                    signosClinicos: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="avi-figma-field" style={{ gridColumn: '1 / -1' }}>
              <label className="avi-figma-label">Estado de la solicitud</label>
              <div className="avi-figma-demand-box">
                Se registrará como Pendiente de validación y notificará al veterinario.
              </div>
            </div>
          </div>

          <div className="avi-figma-modal-footer" data-node-id="238:6423">
            <button
              type="button"
              className="avi-figma-btn-cancel"
              onClick={() => setIsIsolationOpen(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="avi-figma-btn-green"
              disabled={selectedIsolationBarn?.pendingValidation}
            >
              Enviar solicitud
            </button>
          </div>
        </form>
      </BaseModal>
    </div>
  );
}

export default WorkerDashboardPage;
