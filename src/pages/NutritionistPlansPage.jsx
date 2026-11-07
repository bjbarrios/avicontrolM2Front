import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FarmContext } from '../context/FarmContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import ApiMessage from '../components/ApiMessage';
import PlanFormModal from '../components/nutritionist/PlanFormModal';
import PlanDetailModal from '../components/nutritionist/PlanDetailModal';
import AssignPlanModal from '../components/nutritionist/AssignPlanModal';
import AdjustStageModal from '../components/nutritionist/AdjustStageModal';
import {
  computePlanSummary,
  formatKg,
  formatRation,
  formatStageDays
} from '../utils/nutritionUtils';

function NutritionistPlansPage() {
  const {
    nutriPlans,
    assignedBarnPlans,
    sackWeightKg,
    saveNutriPlan,
    setNutriPlanStatus,
    assignNutriPlan,
    adjustNutriStage
  } = useContext(FarmContext);

  const location = useLocation();
  const navigate = useNavigate();

  const [toast, setToast] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [badgeFilter, setBadgeFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');

  // Estados de modales modulares
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [detailPlan, setDetailPlan] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignModalDefaults, setAssignModalDefaults] = useState({
    galpon: 'Galpón 1',
    planId: 'plan-1'
  });

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustModalGalpon, setAdjustModalGalpon] = useState('Galpón 2');

  // Detectar si llegamos desde Inicio (/nutricionista) al pulsar Editar, Asignar, Nuevo o Prórroga
  useEffect(() => {
    const navState = location.state;
    if (!navState?.action) return;

    if (navState.action === 'edit') {
      const target =
        nutriPlans.find((p) => p.id === navState.planId) || nutriPlans[0];
      setEditingPlan(target || null);
      setIsPlanModalOpen(true);
    } else if (navState.action === 'new') {
      setEditingPlan(null);
      setIsPlanModalOpen(true);
    } else if (navState.action === 'assign') {
      setAssignModalDefaults({
        galpon: navState.galpon || 'Galpón 1',
        planId: navState.planId || nutriPlans[0]?.id || 'plan-1'
      });
      setIsAssignModalOpen(true);
    } else if (navState.action === 'adjust') {
      setAdjustModalGalpon(navState.galpon || 'Galpón 2');
      setIsAdjustModalOpen(true);
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate, nutriPlans]);

  const handleOpenNewPlan = () => {
    setEditingPlan(null);
    setIsPlanModalOpen(true);
  };

  const handleOpenEditPlan = (plan) => {
    setEditingPlan(plan);
    setIsPlanModalOpen(true);
  };

  const handleOpenDetail = (plan) => {
    setDetailPlan(plan);
    setIsDetailModalOpen(true);
  };

  const handleOpenAssign = (galpon = 'Galpón 1', planId = 'plan-1') => {
    setAssignModalDefaults({ galpon, planId });
    setIsAssignModalOpen(true);
  };

  const handleOpenAdjust = (galpon = 'Galpón 2') => {
    setAdjustModalGalpon(galpon);
    setIsAdjustModalOpen(true);
  };

  const handleSavePlan = ({ plan, createVersion, applyToBarns }) => {
    saveNutriPlan({ plan, createVersion, applyToBarns });
    setIsPlanModalOpen(false);
    if (editingPlan && createVersion) {
      const nextVer = (Number(editingPlan.version) || 1) + 1;
      setToast(
        `Nueva versión "${plan.name} v${nextVer}" creada y aplicada a ${applyToBarns.length} galpón(es).`
      );
    } else if (editingPlan) {
      setToast(`Plan "${plan.name}" actualizado correctamente.`);
    } else {
      setToast(`Nuevo plan "${plan.name}" creado y guardado en el catálogo.`);
    }
  };

  const handleToggleArchive = (planId, nextStatus) => {
    const target = nutriPlans.find((p) => p.id === planId);
    setNutriPlanStatus(planId, nextStatus);
    setToast(
      `Estado del plan "${target?.name || ''}" cambiado a "${nextStatus.toUpperCase()}".`
    );
  };

  const handleAssignSubmit = (assignmentData) => {
    const targetPlan = nutriPlans.find((p) => p.id === assignmentData.planId);
    assignNutriPlan(assignmentData);
    setToast(
      `Plan "${targetPlan?.name || ''}" asignado a ${assignmentData.galpon} (Lote ${assignmentData.loteId}).`
    );
  };

  const handleAdjustSubmit = (adjustData) => {
    adjustNutriStage(adjustData);
    setToast(
      `Prórroga aplicada en ${adjustData.galpon} hasta el día ${adjustData.nuevoDiaFin} con desplazamiento automático.`
    );
  };

  const filteredPlans = nutriPlans.filter((plan) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      plan.name.toLowerCase().includes(q) ||
      plan.description.toLowerCase().includes(q) ||
      plan.stages.some((st) =>
        String(st.feedType || '').toLowerCase().includes(q)
      );
    const matchesBadge =
      badgeFilter === 'Todos' || plan.badge === badgeFilter;
    const planStatus = plan.status || 'activo';
    const matchesStatus =
      statusFilter === 'Todos' || planStatus === statusFilter;
    return matchesSearch && matchesBadge && matchesStatus;
  });

  const activeCount = nutriPlans.filter((p) => (p.status || 'activo') === 'activo').length;
  const draftCount = nutriPlans.filter((p) => p.status === 'borrador').length;
  const archivedCount = nutriPlans.filter((p) => p.status === 'archivado').length;
  const archivedOrDraftCount = draftCount + archivedCount;

  const avgCycleDays =
    activeCount > 0
      ? Math.round(
          nutriPlans
            .filter((p) => (p.status || 'activo') === 'activo')
            .reduce(
              (acc, p) => acc + computePlanSummary(p.stages).totalCycleDays,
              0
            ) / activeCount
        )
      : 45;

  const getBadgeColors = (badge) => {
    if (badge === 'Contingencia') {
      return { bg: '#ffe8ba', color: '#bf5400', dot: '#f59e0b' };
    }
    if (badge === 'Alto Rendimiento') {
      return { bg: '#d1ebf0', color: '#1f3659', dot: '#2c5282' };
    }
    return { bg: '#d6f0d1', color: '#1f5929', dot: '#2d9f42' };
  };

  const getStatusChip = (status = 'activo') => {
    if (status === 'archivado') {
      return { bg: '#e5e7eb', color: '#4b5563', label: 'Archivado' };
    }
    if (status === 'borrador') {
      return { bg: '#fff1d6', color: '#b45309', label: 'Borrador' };
    }
    return { bg: '#e6f7e4', color: '#1b562a', label: 'Activo' };
  };

  return (
    <div className="avi-role-layout">
      <Sidebar role="nutricionista" />

      <div
        className="avi-main-frame"
        data-node-id="216:1723"
        data-name="Nutricionista Planes"
      >
        <Topbar roleLabel="Nutricionista" avatarSrc="/assets/admin-avatar.svg" />
        <ApiMessage message={toast} type="success" onClose={() => setToast('')} />

        <div className="avi-dashboard-content" data-node-id="216:1729">
          {/* Subtítulo superior y botón de acción */}
          <div className="avi-page-heading" data-node-id="216:1742">
            <div className="avi-heading-copy">
              <p className="avi-page-subtitle" data-node-id="216:1747">
                Crear, consultar, editar, versionar y archivar planes por etapa con validaciones de ciclo
              </p>
            </div>

            <div className="avi-worker-header-actions" data-node-id="216:1748">
              <button
                type="button"
                className="avi-btn-orange-cta"
                onClick={handleOpenNewPlan}
                data-node-id="216:1749"
              >
                <span>＋  Nuevo plan nutricional</span>
              </button>
            </div>
          </div>

          {/* 2 Tarjetas KPI Exclusivas de Planes Nutricionales */}
          <div className="avi-metrics-row" data-node-id="216:1760">
            <StatCard
              label="Planes activos"
              value={`${activeCount} Planes`}
              status={`${archivedOrDraftCount} en borrador / archivados`}
              statusColor="#2d743b"
              icon="/assets/admin-orden.svg"
              tileBg="#f4eee3"
              width="437px"
            />
            <StatCard
              label="Duración media de ciclo"
              value={`${avgCycleDays} Días`}
              status="Secuencia validada sin solapamientos"
              statusColor="#9e4a0f"
              icon="/assets/admin-inventario.svg"
              tileBg="#f4eee3"
              width="444px"
            />
          </div>

          {/* Barra de Filtrado y Búsqueda con el mismo diseño de Recepciones */}
          <div className="avi-receptions-filter-bar" data-node-id="216:2945">
            <input
              type="text"
              className="avi-receptions-search-input"
              placeholder="Buscar por plan, descripción o alimento"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="avi-receptions-select"
              value={badgeFilter}
              onChange={(e) => setBadgeFilter(e.target.value)}
            >
              <option value="Todos">Todas las clasificaciones  ▾</option>
              <option value="Recomendado">Recomendado</option>
              <option value="Alto Rendimiento">Alto Rendimiento</option>
              <option value="Contingencia">Contingencia</option>
            </select>

            <select
              className="avi-receptions-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Todos">Todos los estados  ▾</option>
              <option value="activo">Activos</option>
              <option value="borrador">Borradores</option>
              <option value="archivado">Archivados</option>
            </select>

            <button
              type="button"
              className="avi-receptions-filter-btn"
              onClick={() =>
                setToast('Filtros aplicados al catálogo de planes nutricionales.')
              }
            >
              Filtrar
            </button>
          </div>

          {/* CATÁLOGO DE PLANES NUTRICIONALES */}
          <div className="avi-recent-orders-panel" data-node-id="216:1785">
            <div className="avi-panel-header avi-panel-header-full" data-node-id="216:1786">
              <div className="avi-panel-icon-28">
                <img alt="" src="/assets/admin-orders-icon.svg" />
              </div>
              <h2 className="avi-panel-title">Catálogo de planes nutricionales</h2>
              <div className="avi-panel-spacer" />
              <span className="avi-worker-operator-tag">
                Mostrando {filteredPlans.length} de {nutriPlans.length} planes
              </span>
            </div>

            <div className="avi-worker-barns-grid" data-node-id="216:1790">
              {filteredPlans.map((plan) => {
                const badgeStyle = getBadgeColors(plan.badge);
                const statusChip = getStatusChip(plan.status);
                const summary = computePlanSummary(plan.stages);
                const assignedBarnsForThisPlan = assignedBarnPlans.filter(
                  (b) => b.planId === plan.id
                );

                return (
                  <div
                    key={plan.id}
                    className={`avi-worker-barn-card ${
                      plan.type === 'contingency' ? 'avi-worker-barn-card-pending' : ''
                    }`}
                    style={{
                      opacity: plan.status === 'archivado' ? 0.78 : 1
                    }}
                  >
                    <div className="avi-worker-barn-top">
                      <div className="avi-crit-item-left">
                        <div
                          className="avi-crit-icon-tile"
                          style={{
                            backgroundColor:
                              plan.type === 'contingency' ? '#fff1d6' : '#e6f7e4'
                          }}
                        >
                          <div className="avi-crit-icon-26">
                            <img alt="" src="/assets/admin-feed.svg" />
                          </div>
                        </div>
                        <div className="avi-worker-barn-titles">
                          <h3>
                            {plan.name} {plan.version > 1 ? `v${plan.version}` : ''}
                          </h3>
                          <span>
                            Ciclo de {summary.totalCycleDays} días · {plan.stages.length} etapas
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <span
                          className="avi-barn-status-pill"
                          style={{
                            backgroundColor: badgeStyle.bg,
                            color: badgeStyle.color
                          }}
                        >
                          <span
                            className="avi-barn-status-dot"
                            style={{ backgroundColor: badgeStyle.dot }}
                          />
                          {plan.badge}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            backgroundColor: statusChip.bg,
                            color: statusChip.color
                          }}
                        >
                          {statusChip.label}
                        </span>
                      </div>
                    </div>

                    <p className="avi-nutri-plan-desc">{plan.description}</p>

                    <div className="avi-nutri-stages-stack">
                      {plan.stages.map((st, idx) => (
                        <div key={st.id || idx} className="avi-nutri-stage-box">
                          <div className="avi-nutri-stage-meta">
                            <strong>{st.name}</strong>
                            <span>
                              {formatStageDays(st)} · {st.feedType || 'Alimento Balanceado'}
                            </span>
                          </div>
                          <span className="avi-nutri-stage-ration">
                            {formatRation(st.rationKg)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Resumen rápido del plan en tarjeta */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        color: '#5d4037',
                        backgroundColor: '#faf6ee',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #ece5d5'
                      }}
                    >
                      <span>
                        Acumulado ciclo: <strong>{formatKg(summary.totalFeedPerBirdKg, 2)}/ave</strong>
                      </span>
                      <span>
                        Media: <strong>{formatRation(summary.avgRationKg)}</strong>
                      </span>
                    </div>

                    <div className="avi-worker-barn-actions" style={{ flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="avi-admin-table-btn avi-admin-table-btn-outline"
                        onClick={() => handleOpenDetail(plan)}
                      >
                        Detalle
                      </button>
                      <button
                        type="button"
                        className="avi-admin-table-btn avi-admin-table-btn-orange"
                        style={{ flex: 1 }}
                        onClick={() => handleOpenEditPlan(plan)}
                      >
                        Editar plan
                      </button>
                      {plan.status !== 'archivado' && (
                        <button
                          type="button"
                          className="avi-admin-table-btn avi-admin-table-btn-green"
                          style={{ flex: 1 }}
                          onClick={() => handleOpenAssign('Galpón 1', plan.id)}
                        >
                          Asignar
                        </button>
                      )}
                      <button
                        type="button"
                        className="avi-admin-table-btn avi-admin-table-btn-outline"
                        onClick={() =>
                          handleToggleArchive(
                            plan.id,
                            plan.status === 'archivado' ? 'activo' : 'archivado'
                          )
                        }
                      >
                        {plan.status === 'archivado' ? 'Activar' : 'Archivar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Componentes modulares de modales */}
      <PlanFormModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        editingPlan={editingPlan}
        assignedBarnsForPlan={
          editingPlan
            ? assignedBarnPlans.filter((b) => b.planId === editingPlan.id)
            : []
        }
        onSave={handleSavePlan}
      />

      <PlanDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        plan={detailPlan}
        assignedBarns={assignedBarnPlans}
        onEdit={handleOpenEditPlan}
        onAssign={(planId) => handleOpenAssign('Galpón 1', planId)}
        onToggleArchive={handleToggleArchive}
      />

      <AssignPlanModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        nutriPlans={nutriPlans}
        assignedBarnPlans={assignedBarnPlans}
        sackWeightKg={sackWeightKg}
        initialGalpon={assignModalDefaults.galpon}
        initialPlanId={assignModalDefaults.planId}
        onAssign={handleAssignSubmit}
      />

      <AdjustStageModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        nutriPlans={nutriPlans}
        assignedBarnPlans={assignedBarnPlans}
        initialGalpon={adjustModalGalpon}
        onAdjust={handleAdjustSubmit}
      />
    </div>
  );
}

export default NutritionistPlansPage;
