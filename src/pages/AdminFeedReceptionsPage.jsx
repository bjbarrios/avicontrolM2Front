import { useContext, useState } from 'react';
import { FarmContext } from '../context/FarmContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import BaseModal from '../components/BaseModal';
import ApiMessage from '../components/ApiMessage';

function AdminFeedReceptionsPage() {
  const { feedReceptions, addFeedReception, updateFeedReception } = useContext(FarmContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [dateFilter, setDateFilter] = useState('30d');

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [editingReception, setEditingReception] = useState(null);
  const [detailReception, setDetailReception] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Form state for Registrar recepción de alimento (Node 232:4255)
  const [regForm, setRegForm] = useState({
    alimento: 'Alimento F',
    codigoLote: 'LDA-0004',
    fechaIngreso: '24-09-2026',
    fechaVencimiento: '26-10-2006',
    bultos: '50',
    pesoPorBulto: '50 kg',
    precioNeto: '$ 50.000',
    impuesto: '5%',
    precioNetoSegundo: '$ 50.000',
    tipoAlimento: 'Alimento iniciador'
  });

  // Form state for Editar recepción de alimento (Node 379:66)
  const [editForm, setEditForm] = useState({
    id: '',
    alimento: '',
    fechaVencimiento: '',
    bultos: '',
    pesoPorBulto: '',
    precioNeto: '',
    impuesto: ''
  });

  const filteredReceptions = feedReceptions.filter((row) => {
    const matchesSearch =
      !searchTerm.trim() ||
      row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.alimento.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleOpenEdit = (row) => {
    setEditForm({
      id: row.id,
      alimento: row.alimento,
      fechaVencimiento: row.fechaVencimiento || '26-10-2006',
      bultos: String(row.bultos),
      pesoPorBulto: row.pesoPorBulto,
      precioNeto: row.precioNeto,
      impuesto: row.impuesto || '5%'
    });
    setEditingReception(row);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const cleanCode = regForm.codigoLote.startsWith('#')
      ? regForm.codigoLote
      : `#${regForm.codigoLote}`;
    const numBultos = parseInt(regForm.bultos, 10) || 50;
    const numPeso = parseInt(regForm.pesoPorBulto, 10) || 50;

    addFeedReception({
      id: cleanCode,
      codigoLote: regForm.codigoLote.replace('#', ''),
      alimento: regForm.alimento,
      bultos: numBultos,
      precioNeto: regForm.precioNeto,
      pesoPorBulto: regForm.pesoPorBulto.replace(/\s+/g, ''),
      fechaIngreso: regForm.fechaIngreso,
      fechaVencimiento: regForm.fechaVencimiento,
      impuesto: regForm.impuesto,
      pesoTotal: `${(numBultos * numPeso).toLocaleString('es-CO')} kg`,
      tipoAlimento: regForm.tipoAlimento,
      valorImpuesto: '$ 125.000',
      totalCompra: '$ 2.625.000',
      estado: 'Activo'
    });
    setIsRegisterOpen(false);
    setToastMsg(`Recepción ${cleanCode} (${regForm.alimento}) registrada correctamente.`);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateFeedReception({
      id: editForm.id,
      alimento: editForm.alimento,
      fechaVencimiento: editForm.fechaVencimiento,
      bultos: parseInt(editForm.bultos, 10) || 0,
      pesoPorBulto: editForm.pesoPorBulto,
      precioNeto: editForm.precioNeto,
      impuesto: editForm.impuesto
    });
    setEditingReception(null);
    setToastMsg(`Recepción ${editForm.id} actualizada correctamente.`);
  };

  return (
    <div className="avi-role-layout">
      <Sidebar role="administrador" />

      <div className="avi-main-frame" data-node-id="216:2923" data-name="Administrador Recepciones Alimento">
        <Topbar roleLabel="Administrador" avatarSrc="/assets/admin-avatar.svg" />
        <ApiMessage message={toastMsg} type="success" onClose={() => setToastMsg('')} />

        <div className="avi-dashboard-content" data-node-id="216:2931">
          {/* Page heading with "+ Registrar recepción" button */}
          <div className="avi-page-heading" data-node-id="216:2932">
            <div className="avi-heading-copy" data-node-id="216:2933">
              <h1 className="avi-page-title avi-title-lg" data-node-id="216:2934">
                Recepciones de alimentos
              </h1>
              <p className="avi-page-subtitle" data-node-id="216:2935">
                Registro, consulta y trazabilidad de entradas a bodega
              </p>
            </div>

            <button
              type="button"
              className="avi-btn-orange-cta"
              data-node-id="216:2936"
              onClick={() => setIsRegisterOpen(true)}
            >
              <span>＋  Registrar recepción</span>
            </button>
          </div>

          {/* 2 Metric cards (352x96) */}
          <div className="avi-receptions-metrics-row" data-node-id="216:2938">
            <div className="avi-reception-kpi-card" data-node-id="216:2939">
              <span className="avi-reception-kpi-label">Recepciones del mes</span>
              <strong className="avi-reception-kpi-value" style={{ color: '#2d743b' }}>
                {feedReceptions.length}
              </strong>
            </div>

            <div className="avi-reception-kpi-card" data-node-id="216:2942">
              <span className="avi-reception-kpi-label">Kilogramos ingresados</span>
              <strong className="avi-reception-kpi-value" style={{ color: '#407db8' }}>
                3,225 kg
              </strong>
            </div>
          </div>

          {/* Search & Filter Bar (Node 216:2945) */}
          <div className="avi-receptions-filter-bar" data-node-id="216:2945">
            <input
              type="text"
              className="avi-receptions-search-input"
              placeholder="Buscar por recepción o lote"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-node-id="216:2946"
            />

            <select
              className="avi-receptions-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              data-node-id="216:2948"
            >
              <option value="Todos">Todos los estados  ▾</option>
              <option value="Activo">Activos</option>
              <option value="Cerrado">Cerrados</option>
            </select>

            <select
              className="avi-receptions-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              data-node-id="216:2950"
            >
              <option value="30d">Últimos 30 días  ▾</option>
              <option value="7d">Últimos 7 días</option>
              <option value="90d">Últimos 90 días</option>
            </select>

            <button
              type="button"
              className="avi-receptions-filter-btn"
              data-node-id="216:2952"
              onClick={() => setToastMsg('Filtros aplicados al listado de recepciones.')}
            >
              Filtrar
            </button>
          </div>

          {/* Table: Recepciones de Alimentos Registradas (Node 216:2954) */}
          <div className="avi-recent-orders-panel" data-node-id="216:2954">
            <div className="avi-panel-header avi-panel-header-full" data-node-id="216:2955">
              <div className="avi-panel-icon-28" data-node-id="216:2956">
                <img alt="" src="/assets/admin-orders-icon.svg" />
              </div>
              <h2 className="avi-panel-title" data-node-id="216:2959">
                Recepciones de Alimentos Registradas
              </h2>
            </div>

            <div className="avi-orders-table" data-node-id="216:2963">
              <div className="avi-orders-thead" data-node-id="216:2964">
                <span style={{ flex: '1.1' }}>Lote</span>
                <span style={{ flex: '1.3' }}>Alimento</span>
                <span style={{ flex: '1.3', textAlign: 'center' }}>Cantidad de bultos</span>
                <span style={{ flex: '1.3', textAlign: 'center' }}>Precio neto x Bulto</span>
                <span style={{ flex: '1.1', textAlign: 'center' }}>Peso x bulto</span>
                <span style={{ flex: '0.8', textAlign: 'center' }}>Detalles</span>
                <span style={{ flex: '0.7', textAlign: 'center' }}>Editar</span>
              </div>

              {filteredReceptions.map((row) => (
                <div key={row.id} className="avi-orders-trow">
                  <span className="avi-col-dark" style={{ flex: '1.1' }}>
                    {row.id}
                  </span>
                  <span className="avi-col-dark" style={{ flex: '1.3' }}>
                    {row.alimento}
                  </span>
                  <span className="avi-col-dark" style={{ flex: '1.3', textAlign: 'center' }}>
                    {row.bultos}
                  </span>
                  <span className="avi-col-muted" style={{ flex: '1.3', textAlign: 'center' }}>
                    {row.precioNeto}
                  </span>
                  <span className="avi-col-muted" style={{ flex: '1.1', textAlign: 'center' }}>
                    {row.pesoPorBulto}
                  </span>
                  <div style={{ flex: '0.8', display: 'flex', justifyContent: 'center' }}>
                    <button
                      type="button"
                      className="avi-table-icon-btn"
                      title="Ver detalles de recepción"
                      onClick={() => setDetailReception(row)}
                    >
                      <img alt="Detalles" src="/assets/admin-file-doc.svg" />
                    </button>
                  </div>
                  <div style={{ flex: '0.7', display: 'flex', justifyContent: 'center' }}>
                    <button
                      type="button"
                      className="avi-table-icon-btn"
                      title="Editar recepción"
                      onClick={() => handleOpenEdit(row)}
                    >
                      <img alt="Editar" src="/assets/admin-file-add.svg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Registrar recepción de alimento (Node 232:4255) */}
      <BaseModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        maxWidth="720px"
      >
        <form className="avi-figma-modal-720" onSubmit={handleRegisterSubmit} data-node-id="232:4255">
          <div className="avi-figma-modal-header">
            <div className="avi-figma-modal-titles">
              <h2 className="avi-figma-modal-title">Registrar recepción de alimento</h2>
              <p className="avi-figma-modal-subtitle">Nueva entrada a inventario</p>
            </div>
            <button
              type="button"
              className="avi-figma-modal-close"
              onClick={() => setIsRegisterOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="avi-figma-modal-grid">
            <div className="avi-figma-field">
              <label className="avi-figma-label">Alimento</label>
              <input
                type="text"
                className="avi-figma-input"
                value={regForm.alimento}
                onChange={(e) => setRegForm({ ...regForm, alimento: e.target.value })}
                required
              />
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Codigo del lote</label>
              <input
                type="text"
                className="avi-figma-input"
                value={regForm.codigoLote}
                onChange={(e) => setRegForm({ ...regForm, codigoLote: e.target.value })}
                required
              />
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Fecha de ingreso</label>
              <input
                type="text"
                className="avi-figma-input"
                value={regForm.fechaIngreso}
                onChange={(e) => setRegForm({ ...regForm, fechaIngreso: e.target.value })}
                required
              />
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Fecha de vencimiento</label>
              <input
                type="text"
                className="avi-figma-input"
                value={regForm.fechaVencimiento}
                onChange={(e) => setRegForm({ ...regForm, fechaVencimiento: e.target.value })}
                required
              />
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Cantidad de bultos</label>
              <input
                type="text"
                className="avi-figma-input"
                value={regForm.bultos}
                onChange={(e) => setRegForm({ ...regForm, bultos: e.target.value })}
                required
              />
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Peso por bulto</label>
              <input
                type="text"
                className="avi-figma-input"
                value={regForm.pesoPorBulto}
                onChange={(e) => setRegForm({ ...regForm, pesoPorBulto: e.target.value })}
                required
              />
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Precio neto x bulto</label>
              <input
                type="text"
                className="avi-figma-input"
                value={regForm.precioNeto}
                onChange={(e) => setRegForm({ ...regForm, precioNeto: e.target.value })}
                required
              />
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Impuesto</label>
              <input
                type="text"
                className="avi-figma-input"
                value={regForm.impuesto}
                onChange={(e) => setRegForm({ ...regForm, impuesto: e.target.value })}
                required
              />
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Precio neto x bulto</label>
              <input
                type="text"
                className="avi-figma-input"
                value={regForm.precioNetoSegundo}
                onChange={(e) => setRegForm({ ...regForm, precioNetoSegundo: e.target.value })}
              />
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Tipo de aliemento</label>
              <input
                type="text"
                className="avi-figma-input"
                value={regForm.tipoAlimento}
                onChange={(e) => setRegForm({ ...regForm, tipoAlimento: e.target.value })}
              />
            </div>
          </div>

          <div className="avi-figma-modal-footer">
            <button
              type="button"
              className="avi-figma-btn-cancel"
              onClick={() => setIsRegisterOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="avi-figma-btn-orange">
              Registrar recepción
            </button>
          </div>
        </form>
      </BaseModal>

      {/* Modal 2: Editar recepción de alimento (Node 379:66) */}
      <BaseModal
        isOpen={Boolean(editingReception)}
        onClose={() => setEditingReception(null)}
        maxWidth="720px"
      >
        {editingReception && (
          <form className="avi-figma-modal-720" onSubmit={handleEditSubmit} data-node-id="379:66">
            <div className="avi-figma-modal-header">
              <div className="avi-figma-modal-titles">
                <h2 className="avi-figma-modal-title">Editar recepción de alimento</h2>
                <p className="avi-figma-modal-subtitle">edición de entrada a inventario</p>
              </div>
              <button
                type="button"
                className="avi-figma-modal-close"
                onClick={() => setEditingReception(null)}
              >
                ×
              </button>
            </div>

            <div className="avi-figma-modal-grid">
              <div className="avi-figma-field">
                <label className="avi-figma-label">Alimento</label>
                <input
                  type="text"
                  className="avi-figma-input"
                  value={editForm.alimento}
                  onChange={(e) => setEditForm({ ...editForm, alimento: e.target.value })}
                  required
                />
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Fecha de vencimiento</label>
                <input
                  type="text"
                  className="avi-figma-input"
                  value={editForm.fechaVencimiento}
                  onChange={(e) => setEditForm({ ...editForm, fechaVencimiento: e.target.value })}
                  required
                />
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Cantidad de bultos</label>
                <input
                  type="text"
                  className="avi-figma-input"
                  value={editForm.bultos}
                  onChange={(e) => setEditForm({ ...editForm, bultos: e.target.value })}
                  required
                />
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Peso por bulto</label>
                <input
                  type="text"
                  className="avi-figma-input"
                  value={editForm.pesoPorBulto}
                  onChange={(e) => setEditForm({ ...editForm, pesoPorBulto: e.target.value })}
                  required
                />
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Precio neto x bulto</label>
                <input
                  type="text"
                  className="avi-figma-input"
                  value={editForm.precioNeto}
                  onChange={(e) => setEditForm({ ...editForm, precioNeto: e.target.value })}
                  required
                />
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Impuesto</label>
                <input
                  type="text"
                  className="avi-figma-input"
                  value={editForm.impuesto}
                  onChange={(e) => setEditForm({ ...editForm, impuesto: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="avi-figma-modal-footer avi-figma-modal-footer-spaced">
              <button
                type="button"
                className="avi-figma-btn-cancel"
                onClick={() => setEditingReception(null)}
              >
                Cancelar
              </button>
              <button type="submit" className="avi-figma-btn-green">
                Editar recepción
              </button>
            </div>
          </form>
        )}
      </BaseModal>

      {/* Modal 3: Detalles recepción de alimento (Node 379:147) */}
      <BaseModal
        isOpen={Boolean(detailReception)}
        onClose={() => setDetailReception(null)}
        maxWidth="720px"
      >
        {detailReception && (
          <div className="avi-figma-modal-720" data-node-id="379:147">
            <div className="avi-figma-modal-header">
              <div className="avi-figma-modal-titles">
                <h2 className="avi-figma-modal-title">Detalles recepción de alimento</h2>
                <p className="avi-figma-modal-subtitle">detalles de entrada a inventario</p>
              </div>
              <button
                type="button"
                className="avi-figma-modal-close"
                onClick={() => setDetailReception(null)}
              >
                ×
              </button>
            </div>

            <div className="avi-figma-modal-grid">
              <div className="avi-figma-field">
                <label className="avi-figma-label">Alimento</label>
                <div className="avi-figma-readonly-box">{detailReception.alimento}</div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Codigo del lote</label>
                <div className="avi-figma-readonly-box">
                  {detailReception.codigoLote || detailReception.id.replace('#', '')}
                </div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Fecha de ingreso</label>
                <div className="avi-figma-readonly-box">{detailReception.fechaIngreso}</div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Fecha de vencimiento</label>
                <div className="avi-figma-readonly-box">
                  {detailReception.fechaVencimiento || '26-10-2006'}
                </div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Cantidad de bultos</label>
                <div className="avi-figma-readonly-box">{detailReception.bultos}</div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Peso por bulto</label>
                <div className="avi-figma-readonly-box">{detailReception.pesoPorBulto}</div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Precio neto x bulto</label>
                <div className="avi-figma-readonly-box">{detailReception.precioNeto}</div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Impuesto</label>
                <div className="avi-figma-readonly-box">{detailReception.impuesto || '5%'}</div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Peso total</label>
                <div className="avi-figma-readonly-box">
                  {detailReception.pesoTotal || '$ 50.000'}
                </div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Tipo de alimento</label>
                <div className="avi-figma-readonly-box">
                  {detailReception.tipoAlimento || 'Alimento iniciador'}
                </div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Valor del impuesto</label>
                <div className="avi-figma-readonly-box">
                  {detailReception.valorImpuesto || '$ 125.000'}
                </div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Total de la compra</label>
                <div className="avi-figma-readonly-box">
                  {detailReception.totalCompra || '$ 2.625.000'}
                </div>
              </div>
            </div>

            <div className="avi-figma-modal-footer">
              <button
                type="button"
                className="avi-figma-btn-cancel"
                onClick={() => setDetailReception(null)}
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

export default AdminFeedReceptionsPage;
