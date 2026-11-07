import { useContext, useState } from 'react';
import { FarmContext } from '../context/FarmContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import BaseModal from '../components/BaseModal';

function AdminInventoryPage() {
  const {
    feedInventoryKpis,
    feedInventory,
    medInventoryKpis,
    medInventory
  } = useContext(FarmContext);

  const [selectedReq, setSelectedReq] = useState(null);

  return (
    <div className="avi-role-layout">
      <Sidebar role="administrador" />

      <div className="avi-main-frame" data-node-id="216:3318" data-name="Inventario">
        <Topbar roleLabel="Administrador" avatarSrc="/assets/admin-avatar.svg" />

        <div className="avi-inv-content" data-node-id="216:3324">
          {/* Page Intro */}
          <div className="avi-inv-header" data-node-id="216:3325">
            <h1 className="avi-inv-title" data-node-id="216:3327">
              Inventario
            </h1>
            <p className="avi-inv-subtitle" data-node-id="216:3328">
              Consulta del stock disponible de alimentos por etapa y medicamentos
            </p>
          </div>

          {/* Top 4 KPI Cards (Feed Stock) */}
          <div className="avi-inv-kpi-grid" data-node-id="216:3329">
            <div className="avi-inv-kpi-card" data-node-id="216:3330">
              <span className="avi-inv-kpi-label">Pre-inicio</span>
              <strong className="avi-inv-kpi-value">{feedInventoryKpis.preInicio}</strong>
            </div>
            <div className="avi-inv-kpi-card" data-node-id="216:3333">
              <span className="avi-inv-kpi-label">Inicio</span>
              <strong className="avi-inv-kpi-value">{feedInventoryKpis.inicio}</strong>
            </div>
            <div className="avi-inv-kpi-card" data-node-id="216:3336">
              <span className="avi-inv-kpi-label">Broiler</span>
              <strong className="avi-inv-kpi-value">{feedInventoryKpis.broiler}</strong>
            </div>
            <div className="avi-inv-kpi-card avi-inv-kpi-highlight" data-node-id="216:3339">
              <span className="avi-inv-kpi-label">Total alimento disponible</span>
              <strong className="avi-inv-kpi-value">{feedInventoryKpis.totalDisponible}</strong>
            </div>
          </div>

          {/* Panel 1: Stock de alimentos */}
          <div className="avi-inv-panel" data-node-id="216:3342">
            <div className="avi-panel-header" data-node-id="216:3343">
              <div className="avi-panel-icon-28" data-node-id="216:3344">
                <img alt="" src="/assets/admin-inv-panel.svg" />
              </div>
              <h2 className="avi-panel-title" data-node-id="216:3345">
                Stock de alimentos
              </h2>
            </div>

            <div className="avi-inv-table" data-node-id="216:3348">
              <div className="avi-inv-thead" data-node-id="216:3349">
                <span style={{ flex: '1.1' }}>Etapa</span>
                <span style={{ flex: '1.2' }}>Alimento</span>
                <span style={{ flex: '1.1' }}>Cantidad</span>
                <span style={{ flex: '1.1' }}>Peso por bulto</span>
                <span style={{ flex: '1.1' }}>Stock actual</span>
                <span style={{ flex: '1.1', textAlign: 'center' }}>Demanda</span>
              </div>

              {feedInventory.map((item) => (
                <div
                  key={item.id}
                  className="avi-inv-trow"
                  onClick={() => setSelectedReq(item)}
                  style={{ cursor: 'pointer' }}
                  title="Haz clic para ver detalles del requerimiento de alimento"
                >
                  <span style={{ flex: '1.1' }}>{item.etapa}</span>
                  <span style={{ flex: '1.2' }}>{item.alimento}</span>
                  <span style={{ flex: '1.1' }}>{item.cantidad}</span>
                  <span style={{ flex: '1.1' }}>{item.pesoPorBulto}</span>
                  <span style={{ flex: '1.1' }}>{item.stockActual}</span>
                  <div style={{ flex: '1.1', display: 'flex', justifyContent: 'center' }}>
                    <button
                      type="button"
                      className="avi-inv-demand-badge"
                      style={{
                        backgroundColor: item.badgeBg,
                        color: item.badgeColor
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReq(item);
                      }}
                    >
                      <span
                        className="avi-inv-demand-dot"
                        style={{ backgroundColor: item.dotColor }}
                      />
                      {item.demandaStatus}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle 4 KPI Cards (Medicine Presentations) */}
          <div className="avi-inv-kpi-grid" data-node-id="388:66">
            <div className="avi-inv-kpi-card" data-node-id="388:67">
              <span className="avi-inv-kpi-label">Cantidad de Frascos</span>
              <strong className="avi-inv-kpi-value">{medInventoryKpis.frascos}</strong>
            </div>
            <div className="avi-inv-kpi-card" data-node-id="388:70">
              <span className="avi-inv-kpi-label">Cantidad de Bolsas</span>
              <strong className="avi-inv-kpi-value">{medInventoryKpis.bolsas}</strong>
            </div>
            <div className="avi-inv-kpi-card" data-node-id="388:73">
              <span className="avi-inv-kpi-label">Cantidad de Cajas</span>
              <strong className="avi-inv-kpi-value">{medInventoryKpis.cajas}</strong>
            </div>
            <div className="avi-inv-kpi-card avi-inv-kpi-highlight" data-node-id="388:76">
              <span className="avi-inv-kpi-label">Total de Presentaciones</span>
              <strong className="avi-inv-kpi-value">{medInventoryKpis.totalPresentaciones}</strong>
            </div>
          </div>

          {/* Panel 2: Stock de medicamentos */}
          <div className="avi-inv-panel" data-node-id="388:80">
            <div className="avi-panel-header" data-node-id="388:81">
              <div className="avi-panel-icon-28" data-node-id="388:82">
                <img alt="" src="/assets/admin-inv-panel.svg" />
              </div>
              <h2 className="avi-panel-title" data-node-id="388:85">
                Stock de medicamentos
              </h2>
            </div>

            <div className="avi-inv-table" data-node-id="388:88">
              <div className="avi-inv-thead" data-node-id="388:89">
                <span style={{ flex: '1.2' }}>Medicamento</span>
                <span style={{ flex: '1.1' }}>Presentación</span>
                <span style={{ flex: '1' }}>Cantidad</span>
                <span style={{ flex: '1.3' }}>Contenido por presentación</span>
                <span style={{ flex: '1' }}>Stock actual</span>
              </div>

              {medInventory.map((med) => (
                <div key={med.id} className="avi-inv-trow">
                  <span style={{ flex: '1.2' }}>{med.medicamento}</span>
                  <span style={{ flex: '1.1' }}>{med.presentacion}</span>
                  <span style={{ flex: '1' }}>{med.cantidad}</span>
                  <span style={{ flex: '1.3' }}>{med.contenido}</span>
                  <span style={{ flex: '1' }}>{med.stockActual}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal · Detalles Requerimiento (Node 386:302) */}
      <BaseModal
        isOpen={Boolean(selectedReq)}
        onClose={() => setSelectedReq(null)}
        maxWidth="720px"
      >
        {selectedReq && (
          <div className="avi-figma-modal-720" data-node-id="386:302">
            <div className="avi-figma-modal-header" data-node-id="386:303">
              <div className="avi-figma-modal-titles">
                <h2 className="avi-figma-modal-title">Detalles requerimiento de alimento</h2>
                <p className="avi-figma-modal-subtitle">
                  detalles del alimento requerido de lotes activos
                </p>
              </div>
              <button
                type="button"
                className="avi-figma-modal-close"
                onClick={() => setSelectedReq(null)}
              >
                ×
              </button>
            </div>

            <div className="avi-figma-modal-grid">
              <div className="avi-figma-field">
                <label className="avi-figma-label">Alimento</label>
                <div className="avi-figma-readonly-box">{selectedReq.alimento}</div>
              </div>
              <div className="avi-figma-field">
                <label className="avi-figma-label">Etapa</label>
                <div className="avi-figma-readonly-box">{selectedReq.etapa}</div>
              </div>
              <div className="avi-figma-field">
                <label className="avi-figma-label">Stock Actual</label>
                <div className="avi-figma-readonly-box">{selectedReq.stockActual}</div>
              </div>
              <div className="avi-figma-field">
                <label className="avi-figma-label">Demanda</label>
                <div className="avi-figma-demand-box">{selectedReq.demandaKg}</div>
              </div>
            </div>

            <div className="avi-figma-modal-footer">
              <button
                type="button"
                className="avi-figma-btn-cancel"
                onClick={() => setSelectedReq(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </BaseModal>
    </div>
  );
}

export default AdminInventoryPage;
