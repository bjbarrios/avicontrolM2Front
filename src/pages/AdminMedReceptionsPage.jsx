import { useContext, useState } from 'react';
import { FarmContext } from '../context/FarmContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import BaseModal from '../components/BaseModal';
import ApiMessage from '../components/ApiMessage';

function AdminMedReceptionsPage() {
  const { medReceptions, addMedReception, updateMedReception } = useContext(FarmContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [presentationFilter, setPresentationFilter] = useState('Todas');
  const [dateFilter, setDateFilter] = useState('30d');

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [detailMed, setDetailMed] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Form state for Registrar recepción de medicamento (Node 232:3539)
  const [regForm, setRegForm] = useState({
    medicamento: 'Amoxicilina',
    codigoLote: 'LDM-0004',
    presentacion: 'Frasco',
    cantidad: '50',
    contenidoValor: '100',
    unidadMedida: 'ml',
    precioNeto: '$ 20.000',
    impuesto: '5%',
    fechaIngreso: '24-09-2026',
    fechaVencimiento: '26-10-2026'
  });

  // Form state for Editar recepción de medicamento (Node 383:60)
  const [editForm, setEditForm] = useState({
    id: '',
    medicamento: '',
    fechaVencimiento: '',
    cantidad: '',
    contenidoValor: '',
    unidadMedida: '',
    impuesto: '',
    precioNeto: ''
  });

  const filteredMeds = medReceptions.filter((row) => {
    const matchesSearch =
      !searchTerm.trim() ||
      row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.medicamento.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPres =
      presentationFilter === 'Todas' || row.presentacion === presentationFilter;
    return matchesSearch && matchesPres;
  });

  const handleOpenEdit = (row) => {
    setEditForm({
      id: row.id,
      medicamento: row.medicamento,
      fechaVencimiento: row.fechaVencimiento || '26-10-2026',
      cantidad: String(row.cantidad),
      contenidoValor: row.contenidoValor || '100',
      unidadMedida: row.unidadMedida || 'ml',
      impuesto: row.impuesto || '5%',
      precioNeto: row.precioNeto
    });
    setEditingMed(row);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const cleanCode = regForm.codigoLote.startsWith('#')
      ? regForm.codigoLote
      : `#${regForm.codigoLote}`;

    addMedReception({
      id: cleanCode,
      codigoLote: regForm.codigoLote.replace('#', ''),
      medicamento: regForm.medicamento,
      presentacion: regForm.presentacion,
      cantidad: parseInt(regForm.cantidad, 10) || 50,
      precioNeto: regForm.precioNeto,
      contenido: `${regForm.contenidoValor}${regForm.unidadMedida}`,
      contenidoValor: regForm.contenidoValor,
      unidadMedida: regForm.unidadMedida,
      impuesto: regForm.impuesto,
      fechaIngreso: regForm.fechaIngreso,
      fechaVencimiento: regForm.fechaVencimiento,
      subtotalNeto: '$ 1.000.000',
      precioTotal: '$ 1.050.000'
    });
    setIsRegisterOpen(false);
    setToastMsg(`Recepción de medicamento ${cleanCode} (${regForm.medicamento}) registrada.`);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateMedReception({
      id: editForm.id,
      medicamento: editForm.medicamento,
      fechaVencimiento: editForm.fechaVencimiento,
      cantidad: parseInt(editForm.cantidad, 10) || 0,
      contenidoValor: editForm.contenidoValor,
      unidadMedida: editForm.unidadMedida,
      contenido: `${editForm.contenidoValor}${editForm.unidadMedida}`,
      impuesto: editForm.impuesto,
      precioNeto: editForm.precioNeto
    });
    setEditingMed(null);
    setToastMsg(`Recepción ${editForm.id} actualizada correctamente.`);
  };

  return (
    <div className="avi-role-layout">
      <Sidebar role="administrador" />

      <div className="avi-main-frame" data-node-id="216:3119" data-name="Administrador Recepciones Medicamento">
        <Topbar roleLabel="Administrador" avatarSrc="/assets/admin-avatar.svg" />
        <ApiMessage message={toastMsg} type="success" onClose={() => setToastMsg('')} />

        <div className="avi-dashboard-content" data-node-id="216:3127">
          {/* Page heading */}
          <div className="avi-page-heading" data-node-id="216:3128">
            <div className="avi-heading-copy" data-node-id="216:3129">
              <h1 className="avi-page-title avi-title-lg" data-node-id="216:3130">
                Recepciones de medicamentos
              </h1>
              <p className="avi-page-subtitle" data-node-id="216:3131">
                Registro, consulta y trazabilidad de entradas de medicamentos a bodega
              </p>
            </div>

            <button
              type="button"
              className="avi-btn-orange-cta"
              data-node-id="216:3132"
              onClick={() => setIsRegisterOpen(true)}
            >
              <span>＋  Registrar recepción</span>
            </button>
          </div>

          {/* 1 Metric card (352x96) */}
          <div className="avi-receptions-metrics-row" data-node-id="216:3134">
            <div className="avi-reception-kpi-card" data-node-id="216:3135">
              <span className="avi-reception-kpi-label">Recepciones del mes</span>
              <strong className="avi-reception-kpi-value" style={{ color: '#2d743b' }}>
                {medReceptions.length}
              </strong>
            </div>
          </div>

          {/* Search & Filter Bar (Node 216:3138) */}
          <div className="avi-receptions-filter-bar" data-node-id="216:3138">
            <input
              type="text"
              className="avi-receptions-search-input"
              placeholder="Buscar por lote o medicamento"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-node-id="216:3139"
            />

            <select
              className="avi-receptions-select"
              value={presentationFilter}
              onChange={(e) => setPresentationFilter(e.target.value)}
              data-node-id="216:3141"
            >
              <option value="Todas">Todos las presentaciones  ▾</option>
              <option value="Frasco">Frasco</option>
              <option value="Bolsa">Bolsa</option>
              <option value="Caja">Caja</option>
            </select>

            <select
              className="avi-receptions-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              data-node-id="216:3143"
            >
              <option value="30d">Últimos 30 días  ▾</option>
              <option value="7d">Últimos 7 días</option>
              <option value="90d">Últimos 90 días</option>
            </select>

            <button
              type="button"
              className="avi-receptions-filter-btn"
              data-node-id="216:3145"
              onClick={() => setToastMsg('Filtros aplicados al listado de medicamentos.')}
            >
              Filtrar
            </button>
          </div>

          {/* Table: Recepciones de Medicamentos Registradas (Node 216:3147) */}
          <div className="avi-recent-orders-panel" data-node-id="216:3147">
            <div className="avi-panel-header avi-panel-header-full" data-node-id="216:3148">
              <div className="avi-panel-icon-28" data-node-id="216:3149">
                <img alt="" src="/assets/admin-orders-icon.svg" />
              </div>
              <h2 className="avi-panel-title" data-node-id="216:3152">
                Recepciones de Medicamentos Registradas
              </h2>
            </div>

            <div className="avi-orders-table" data-node-id="216:3156">
              <div className="avi-orders-thead" data-node-id="216:3157">
                <span style={{ flex: '1.1' }}>Lote</span>
                <span style={{ flex: '1.2' }}>Medicamento</span>
                <span style={{ flex: '1' }}>Presentación</span>
                <span style={{ flex: '0.9', textAlign: 'center' }}>Cantidad</span>
                <span style={{ flex: '1.3', textAlign: 'center' }}>Precio x Presentación</span>
                <span style={{ flex: '1.4', textAlign: 'center' }}>Contenido x Presentación</span>
                <span style={{ flex: '0.7', textAlign: 'center' }}>Detalles</span>
                <span style={{ flex: '0.6', textAlign: 'center' }}>Editar</span>
              </div>

              {filteredMeds.map((row) => (
                <div key={row.id} className="avi-orders-trow">
                  <span className="avi-col-dark" style={{ flex: '1.1' }}>
                    {row.id}
                  </span>
                  <span className="avi-col-dark" style={{ flex: '1.2' }}>
                    {row.medicamento}
                  </span>
                  <span className="avi-col-dark" style={{ flex: '1' }}>
                    {row.presentacion}
                  </span>
                  <span className="avi-col-dark" style={{ flex: '0.9', textAlign: 'center' }}>
                    {row.cantidad}
                  </span>
                  <span className="avi-col-muted" style={{ flex: '1.3', textAlign: 'center' }}>
                    {row.precioNeto}
                  </span>
                  <span className="avi-col-muted" style={{ flex: '1.4', textAlign: 'center' }}>
                    {row.contenido}
                  </span>
                  <div style={{ flex: '0.7', display: 'flex', justifyContent: 'center' }}>
                    <button
                      type="button"
                      className="avi-table-icon-btn"
                      title="Ver detalles de recepción"
                      onClick={() => setDetailMed(row)}
                    >
                      <img alt="Detalles" src="/assets/admin-file-doc.svg" />
                    </button>
                  </div>
                  <div style={{ flex: '0.6', display: 'flex', justifyContent: 'center' }}>
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

      {/* Modal 1: Registrar recepción de medicamento (Node 232:3539) */}
      <BaseModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        maxWidth="720px"
      >
        <form className="avi-figma-modal-720" onSubmit={handleRegisterSubmit} data-node-id="232:3539">
          <div className="avi-figma-modal-header">
            <div className="avi-figma-modal-titles">
              <h2 className="avi-figma-modal-title">Registrar recepción de medicamento</h2>
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
              <label className="avi-figma-label">Medicamento</label>
              <input
                type="text"
                className="avi-figma-input"
                value={regForm.medicamento}
                onChange={(e) => setRegForm({ ...regForm, medicamento: e.target.value })}
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
              <label className="avi-figma-label">Presentación</label>
              <select
                className="avi-figma-input"
                value={regForm.presentacion}
                onChange={(e) => setRegForm({ ...regForm, presentacion: e.target.value })}
              >
                <option value="Frasco">Frasco</option>
                <option value="Bolsa">Bolsa</option>
                <option value="Caja">Caja</option>
              </select>
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Cantidad</label>
              <input
                type="text"
                className="avi-figma-input"
                value={regForm.cantidad}
                onChange={(e) => setRegForm({ ...regForm, cantidad: e.target.value })}
                required
              />
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Contenido por presentación</label>
              <input
                type="text"
                className="avi-figma-input"
                value={regForm.contenidoValor}
                onChange={(e) => setRegForm({ ...regForm, contenidoValor: e.target.value })}
                required
              />
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Unidad de medida</label>
              <select
                className="avi-figma-input"
                value={regForm.unidadMedida}
                onChange={(e) => setRegForm({ ...regForm, unidadMedida: e.target.value })}
              >
                <option value="ml">ml</option>
                <option value="gr">gr</option>
                <option value="uni">uni</option>
              </select>
            </div>

            <div className="avi-figma-field">
              <label className="avi-figma-label">Precio neto por presentación</label>
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

      {/* Modal 2: Editar recepción de medicamento (Node 383:60) */}
      <BaseModal
        isOpen={Boolean(editingMed)}
        onClose={() => setEditingMed(null)}
        maxWidth="720px"
      >
        {editingMed && (
          <form className="avi-figma-modal-720" onSubmit={handleEditSubmit} data-node-id="383:60">
            <div className="avi-figma-modal-header">
              <div className="avi-figma-modal-titles">
                <h2 className="avi-figma-modal-title">Editar recepción de medicamento</h2>
                <p className="avi-figma-modal-subtitle">Editar entrada a inventario</p>
              </div>
              <button
                type="button"
                className="avi-figma-modal-close"
                onClick={() => setEditingMed(null)}
              >
                ×
              </button>
            </div>

            <div className="avi-figma-modal-grid">
              <div className="avi-figma-field">
                <label className="avi-figma-label">Medicamento</label>
                <input
                  type="text"
                  className="avi-figma-input"
                  value={editForm.medicamento}
                  onChange={(e) => setEditForm({ ...editForm, medicamento: e.target.value })}
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
                <label className="avi-figma-label">Cantidad</label>
                <input
                  type="text"
                  className="avi-figma-input"
                  value={editForm.cantidad}
                  onChange={(e) => setEditForm({ ...editForm, cantidad: e.target.value })}
                  required
                />
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Contenido por presentación</label>
                <input
                  type="text"
                  className="avi-figma-input"
                  value={editForm.contenidoValor}
                  onChange={(e) => setEditForm({ ...editForm, contenidoValor: e.target.value })}
                  required
                />
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Unidad de medida</label>
                <input
                  type="text"
                  className="avi-figma-input"
                  value={editForm.unidadMedida}
                  onChange={(e) => setEditForm({ ...editForm, unidadMedida: e.target.value })}
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

              <div className="avi-figma-field">
                <label className="avi-figma-label">Precio neto por presentación</label>
                <input
                  type="text"
                  className="avi-figma-input"
                  value={editForm.precioNeto}
                  onChange={(e) => setEditForm({ ...editForm, precioNeto: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="avi-figma-modal-footer avi-figma-modal-footer-spaced">
              <button
                type="button"
                className="avi-figma-btn-cancel"
                onClick={() => setEditingMed(null)}
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

      {/* Modal 3: Detalles recepción de medicamento (Node 383:199) */}
      <BaseModal
        isOpen={Boolean(detailMed)}
        onClose={() => setDetailMed(null)}
        maxWidth="720px"
      >
        {detailMed && (
          <div className="avi-figma-modal-720" data-node-id="383:199">
            <div className="avi-figma-modal-header">
              <div className="avi-figma-modal-titles">
                <h2 className="avi-figma-modal-title">Detalles recepción de medicamento</h2>
                <p className="avi-figma-modal-subtitle">Detalle entrada a inventario</p>
              </div>
              <button
                type="button"
                className="avi-figma-modal-close"
                onClick={() => setDetailMed(null)}
              >
                ×
              </button>
            </div>

            <div className="avi-figma-modal-grid">
              <div className="avi-figma-field">
                <label className="avi-figma-label">Medicamento</label>
                <div className="avi-figma-readonly-box">{detailMed.medicamento}</div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Codigo del lote</label>
                <div className="avi-figma-readonly-box">
                  {detailMed.codigoLote || detailMed.id.replace('#', '')}
                </div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Presentación</label>
                <div className="avi-figma-readonly-box">{detailMed.presentacion}</div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Cantidad</label>
                <div className="avi-figma-readonly-box">{detailMed.cantidad}</div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Contenido por presentación</label>
                <div className="avi-figma-readonly-box">{detailMed.contenidoValor || '100'}</div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Unidad de medida</label>
                <div className="avi-figma-readonly-box">{detailMed.unidadMedida || 'ml'}</div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Precio neto por presentación</label>
                <div className="avi-figma-readonly-box">{detailMed.precioNeto}</div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Impuesto</label>
                <div className="avi-figma-readonly-box">{detailMed.impuesto || '5%'}</div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Fecha de ingreso</label>
                <div className="avi-figma-readonly-box">{detailMed.fechaIngreso}</div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Fecha de vencimiento</label>
                <div className="avi-figma-readonly-box">
                  {detailMed.fechaVencimiento || '26-10-2026'}
                </div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Subtotal Neto</label>
                <div className="avi-figma-readonly-box">
                  {detailMed.subtotalNeto || '$ 1.000.000'}
                </div>
              </div>

              <div className="avi-figma-field">
                <label className="avi-figma-label">Precio total</label>
                <div className="avi-figma-readonly-box">
                  {detailMed.precioTotal || '$ 1.050.000'}
                </div>
              </div>
            </div>

            <div className="avi-figma-modal-footer">
              <button
                type="button"
                className="avi-figma-btn-cancel"
                onClick={() => setDetailMed(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </BaseModal>
    </div>
  );
}

export default AdminMedReceptionsPage;
