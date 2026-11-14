import { createContext, useEffect, useReducer } from 'react';
import {
  combinedInitialFarmState,
  VET_PROTO_STORAGE_KEY,
  vetModuleReducer
} from '../reducers/vetModuleReducer';

export const FarmContext = createContext();

const NUTRI_STORAGE_KEY = 'avicontrol_nutri_state_v2';

function initFarmState(defaultState) {
  let hydrated = { ...defaultState };
  try {
    const rawNutri = localStorage.getItem(NUTRI_STORAGE_KEY);
    if (rawNutri) {
      const parsed = JSON.parse(rawNutri);
      if (parsed && typeof parsed === 'object') {
        hydrated = {
          ...hydrated,
          sackWeightKg: Number(parsed.sackWeightKg) || hydrated.sackWeightKg,
          nutriPlans: Array.isArray(parsed.nutriPlans) ? parsed.nutriPlans : hydrated.nutriPlans,
          assignedBarnPlans: Array.isArray(parsed.assignedBarnPlans)
            ? parsed.assignedBarnPlans
            : hydrated.assignedBarnPlans
        };
      }
    }
  } catch {
    // Usar estado base en caso de error
  }

  try {
    const rawVet = localStorage.getItem(VET_PROTO_STORAGE_KEY);
    if (rawVet) {
      const parsedVet = JSON.parse(rawVet);
      if (parsedVet && typeof parsedVet === 'object') {
        hydrated = {
          ...hydrated,
          vetBarns: Array.isArray(parsedVet.vetBarns) ? parsedVet.vetBarns : hydrated.vetBarns,
          vetSanitaryAlerts: Array.isArray(parsedVet.vetSanitaryAlerts)
            ? parsedVet.vetSanitaryAlerts
            : hydrated.vetSanitaryAlerts,
          vetCatalogDiseases: Array.isArray(parsedVet.vetCatalogDiseases)
            ? parsedVet.vetCatalogDiseases
            : hydrated.vetCatalogDiseases,
          vetInventoryMedicines: Array.isArray(parsedVet.vetInventoryMedicines)
            ? parsedVet.vetInventoryMedicines
            : hydrated.vetInventoryMedicines,
          vetFefoReceptions: Array.isArray(parsedVet.vetFefoReceptions)
            ? parsedVet.vetFefoReceptions
            : hydrated.vetFefoReceptions,
          vetCatalogMedications: Array.isArray(parsedVet.vetCatalogMedications)
            ? parsedVet.vetCatalogMedications
            : hydrated.vetCatalogMedications,
          vetIsolationRequests: Array.isArray(parsedVet.vetIsolationRequests)
            ? parsedVet.vetIsolationRequests
            : hydrated.vetIsolationRequests,
          vetActiveDiagnoses: Array.isArray(parsedVet.vetActiveDiagnoses)
            ? parsedVet.vetActiveDiagnoses
            : hydrated.vetActiveDiagnoses,
          vetMedConsumptions: Array.isArray(parsedVet.vetMedConsumptions)
            ? parsedVet.vetMedConsumptions
            : hydrated.vetMedConsumptions,
          vetSanitarySlaughterOrders: Array.isArray(parsedVet.vetSanitarySlaughterOrders)
            ? parsedVet.vetSanitarySlaughterOrders
            : hydrated.vetSanitarySlaughterOrders
        };
      }
    }
  } catch {
    // Usar estado veterinario inicial en caso de error
  }

  return hydrated;
}

export function FarmProvider({ children }) {
  const [state, dispatch] = useReducer(
    vetModuleReducer,
    combinedInitialFarmState,
    initFarmState
  );

  useEffect(() => {
    try {
      const payload = {
        sackWeightKg: state.sackWeightKg,
        nutriPlans: state.nutriPlans,
        assignedBarnPlans: state.assignedBarnPlans,
        vetDiseases: state.vetDiseases,
        vetMedicines: state.vetMedicines,
        vetDiagnoses: state.vetDiagnoses,
        vetSlaughterOrders: state.vetSlaughterOrders,
        vetReviewRequests: state.vetReviewRequests,
        vetDiagnosedBarns: state.vetDiagnosedBarns
      };
      localStorage.setItem(NUTRI_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignorar errores de cuota de almacenamiento local
    }
  }, [
    state.sackWeightKg,
    state.nutriPlans,
    state.assignedBarnPlans,
    state.vetDiseases,
    state.vetMedicines,
    state.vetDiagnoses,
    state.vetSlaughterOrders,
    state.vetReviewRequests,
    state.vetDiagnosedBarns
  ]);

  useEffect(() => {
    try {
      const vetPayload = {
        vetBarns: state.vetBarns,
        vetSanitaryAlerts: state.vetSanitaryAlerts,
        vetCatalogDiseases: state.vetCatalogDiseases,
        vetInventoryMedicines: state.vetInventoryMedicines,
        vetFefoReceptions: state.vetFefoReceptions,
        vetCatalogMedications: state.vetCatalogMedications,
        vetIsolationRequests: state.vetIsolationRequests,
        vetActiveDiagnoses: state.vetActiveDiagnoses,
        vetMedConsumptions: state.vetMedConsumptions,
        vetSanitarySlaughterOrders: state.vetSanitarySlaughterOrders
      };
      localStorage.setItem(VET_PROTO_STORAGE_KEY, JSON.stringify(vetPayload));
    } catch {
      // Ignorar errores de cuota de almacenamiento local
    }
  }, [
    state.vetBarns,
    state.vetSanitaryAlerts,
    state.vetCatalogDiseases,
    state.vetInventoryMedicines,
    state.vetFefoReceptions,
    state.vetCatalogMedications,
    state.vetIsolationRequests,
    state.vetActiveDiagnoses,
    state.vetMedConsumptions,
    state.vetSanitarySlaughterOrders
  ]);

  // Acciones originales del proyecto (Admin, Nutricionista, Trabajador)
  const addFeedReception = (reception) =>
    dispatch({ type: 'ADD_FEED_RECEPTION', payload: reception });
  const updateFeedReception = (reception) =>
    dispatch({ type: 'UPDATE_FEED_RECEPTION', payload: reception });
  const addMedReception = (reception) =>
    dispatch({ type: 'ADD_MED_RECEPTION', payload: reception });
  const updateMedReception = (reception) =>
    dispatch({ type: 'UPDATE_MED_RECEPTION', payload: reception });
  const validateBarnForSlaughter = (barn) =>
    dispatch({ type: 'VALIDATE_BARN_FOR_SLAUGHTER', payload: barn });
  const scheduleSlaughterOrder = (orderData) =>
    dispatch({ type: 'SCHEDULE_SLAUGHTER_ORDER', payload: orderData });
  const cancelSlaughterOrder = (galpon) =>
    dispatch({ type: 'CANCEL_SLAUGHTER_ORDER', payload: galpon });
  const saveSlaughterResults = (results) =>
    dispatch({ type: 'SAVE_SLAUGHTER_RESULTS', payload: results });
  const registerWorkerMortality = (data) =>
    dispatch({ type: 'REGISTER_WORKER_MORTALITY', payload: data });
  const requestBarnIsolation = (data) =>
    dispatch({ type: 'REQUEST_BARN_ISOLATION', payload: data });
  const saveNutriPlan = (payload) =>
    dispatch({ type: 'SAVE_NUTRI_PLAN', payload });
  const setNutriPlanStatus = (planId, status) =>
    dispatch({ type: 'SET_NUTRI_PLAN_STATUS', payload: { planId, status } });
  const assignNutriPlan = (assignment) =>
    dispatch({ type: 'ASSIGN_NUTRI_PLAN', payload: assignment });
  const adjustNutriStage = (adjustment) =>
    dispatch({ type: 'ADJUST_NUTRI_STAGE', payload: adjustment });
  const registerBarnFeedConsumption = (galpon, registeredConsumptionKg) =>
    dispatch({
      type: 'REGISTER_BARN_FEED_CONSUMPTION',
      payload: { galpon, registeredConsumptionKg }
    });
  const setSackWeightKg = (weightKg) =>
    dispatch({ type: 'SET_SACK_WEIGHT_KG', payload: weightKg });
  const resetNutriDemoData = () => {
    try {
      localStorage.removeItem(NUTRI_STORAGE_KEY);
    } catch {
      // ignore
    }
    dispatch({ type: 'RESET_NUTRI_DEMO_DATA' });
  };

  // Compatibilidad con funciones previas de veterinario
  const saveVetDisease = (disease) =>
    dispatch({ type: 'SAVE_VET_DISEASE', payload: disease });
  const saveVetMedicine = (medicine) =>
    dispatch({ type: 'SAVE_VET_MEDICINE', payload: medicine });
  const saveVetDiagnosis = (diagnosis) =>
    dispatch({ type: 'SAVE_VET_DIAGNOSIS', payload: diagnosis });
  const updateVetRequestStatus = (id, estado) =>
    dispatch({ type: 'UPDATE_VET_REQUEST_STATUS', payload: { id, estado } });
  const saveVetSlaughterOrder = (order) =>
    dispatch({ type: 'SAVE_VET_SLAUGHTER_ORDER', payload: order });
  const updateVetSlaughterStatus = (id, estado) =>
    dispatch({ type: 'UPDATE_VET_SLAUGHTER_STATUS', payload: { id, estado } });

  // Nuevas acciones en memoria del Módulo Veterinario (Prototipos P-02 a P-07 y Modales M-01 a M-07B)
  const saveCatalogDisease = (payload) =>
    dispatch({ type: 'VET_SAVE_CATALOG_DISEASE', payload });
  const saveCatalogMedication = (payload) =>
    dispatch({ type: 'VET_SAVE_CATALOG_MEDICATION', payload });
  const createIsolationRequest = (payload) =>
    dispatch({ type: 'VET_CREATE_ISOLATION_REQUEST', payload });
  const validateIsolationRequest = (payload) =>
    dispatch({ type: 'VET_VALIDATE_ISOLATION_REQUEST', payload });
  const registerBarnDiagnosis = (payload) =>
    dispatch({ type: 'VET_REGISTER_DIAGNOSIS', payload });
  const processDiagnosisReintegration = (diagnosticoId) =>
    dispatch({ type: 'VET_PROCESS_REINTEGRATION', payload: { diagnosticoId } });
  const registerMedConsumptionFefo = (payload) =>
    dispatch({ type: 'VET_REGISTER_MED_CONSUMPTION_FEFO', payload });
  const emitSanitarySlaughterOrder = (payload) =>
    dispatch({ type: 'VET_EMIT_SANITARY_SLAUGHTER_ORDER', payload });
  const confirmSanitarySlaughterExecution = (payload) =>
    dispatch({ type: 'VET_CONFIRM_SANITARY_SLAUGHTER_EXECUTION', payload });
  const simulateAbnormalMortalityAlert = (payload) =>
    dispatch({ type: 'VET_SIMULATE_ABNORMAL_MORTALITY_ALERT', payload });
  const resetVetProtoData = () => {
    try {
      localStorage.removeItem(VET_PROTO_STORAGE_KEY);
    } catch {
      // ignore
    }
    dispatch({ type: 'VET_RESET_PROTO_DATA' });
  };

  return (
    <FarmContext.Provider
      value={{
        ...state,
        addFeedReception,
        updateFeedReception,
        addMedReception,
        updateMedReception,
        validateBarnForSlaughter,
        scheduleSlaughterOrder,
        cancelSlaughterOrder,
        saveSlaughterResults,
        registerWorkerMortality,
        requestBarnIsolation,
        saveNutriPlan,
        setNutriPlanStatus,
        assignNutriPlan,
        adjustNutriStage,
        registerBarnFeedConsumption,
        setSackWeightKg,
        resetNutriDemoData,
        saveVetDisease,
        saveVetMedicine,
        saveVetDiagnosis,
        updateVetRequestStatus,
        saveVetSlaughterOrder,
        updateVetSlaughterStatus,
        saveCatalogDisease,
        saveCatalogMedication,
        createIsolationRequest,
        validateIsolationRequest,
        registerBarnDiagnosis,
        processDiagnosisReintegration,
        registerMedConsumptionFefo,
        emitSanitarySlaughterOrder,
        confirmSanitarySlaughterExecution,
        simulateAbnormalMortalityAlert,
        resetVetProtoData
      }}
    >
      {children}
    </FarmContext.Provider>
  );
}
