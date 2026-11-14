import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VetShell from '../components/VetShell';
import { FarmContext } from '../context/FarmContext';

function VetMedicinesPage() {
  const navigate = useNavigate();
  const {
    vetCatalogDiseases = [],
    vetInventoryMedicines = [],
    vetCatalogMedications = [],
    saveCatalogMedication
  } = useContext(FarmContext);

  const [filterEnfermedadId, setFilterEnfermedadId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [enfermedadId, setEnfermedadId] = useState('');
  const [medicamentoId, setMedicamentoId] = useState('');
  const [dosis, setDosis] = useState('');
  const [diasTotales, setDiasTotales] = useState('5');
  const [descripcion, setDescripcion] = useState('');
  const [formError, setFormError] = useState('');

  const treatableDiseases = vetCatalogDiseases
    .filter((d) => !d.requiereSacrificioSanitario)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  const filteredMedications = vetCatalogMedications.filter((m) => {
    if (!filterEnfermedadId) return true;
    return m.enfermedadId === filterEnfermedadId;
  });

  const openNewModal = () => {
    setEditingId(null);
    setEnfermedadId(treatableDiseases[0]?.id || '');
    setMedicamentoId(vetInventoryMedicines[0]?.id || '');
    setDosis('200 g diluidos en 100 L de agua potable');
    setDiasTotales('5');
    setDescripcion(
      'Agua de bebida en bebederos automáticos, renovando la preparación cada 24 horas.'
    );
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (med) => {
    setEditingId(med.id);
    setEnfermedadId(med.enfermedadId);
    setMedicamentoId(med.medicamentoId);
    setDosis(med.dosis);
    setDiasTotales(String(med.diasTotales));
    setDescripcion(med.descripcion);
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const cleanDosis = dosis.trim();
    const cleanDesc = descripcion.trim();
    const parsedDays = Number(diasTotales);

    if (!enfermedadId || !medicamentoId || !cleanDosis || !cleanDesc) {
      setFormError(
        'Todos los campos (enfermedad tratable, medicamento, dosis, días totales y descripción) son obligatorios.'
      );
      return;
    }

    if (!Number.isInteger(parsedDays) || parsedDays <= 0) {
      setFormError('La duración debe ser un número entero de días mayor que cero.');
      return;
    }

    const selectedDisease = vetCatalogDiseases.find((d) => d.id === enfermedadId);
    if (!selectedDisease || selectedDisease.requiereSacrificioSanitario) {
      setFormError(
        'La enfermedad seleccionada requiere sacrificio sanitario y no admite medicación.'
      );
      return;
    }

    saveCatalogMedication({
      id: editingId,
      enfermedadId,
      medicamentoId,
      dosis: cleanDosis,
      diasTotales: parsedDays,
      descripcion: cleanDesc
    });

    setModalOpen(false);
  };

  const headerSubNav = (
    <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl border border-stone-200">
      <button
        type="button"
        onClick={() => navigate('/veterinario/enfermedades')}
        className="px-4 py-1.5 rounded-lg text-slate-600 hover:bg-white/70 text-xs font-semibold transition flex items-center gap-2 bg-transparent border-0 cursor-pointer"
      >
        <span>1. Catálogo de Enfermedades</span>
        <span className="bg-stone-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
          {vetCatalogDiseases.length}
        </span>
      </button>
      <button
        type="button"
        onClick={() => navigate('/veterinario/medicinas')}
        className="px-4 py-1.5 rounded-lg bg-[#185C2B] text-white text-xs font-bold shadow-sm flex items-center gap-2 border-0 cursor-pointer"
      >
        <span>2. Catálogo de Medicaciones</span>
        <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
          {vetCatalogMedications.length}
        </span>
      </button>
    </div>
  );

  return (
    <VetShell activeNav="gestion-sanitaria" headerLeft={headerSubNav}>
      <main
        className="flex-1 px-8 py-5 flex flex-col gap-4"
        style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}
      >
        {/* ENCABEZADO + BOTÓN PRINCIPAL */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">
              Catálogo de Medicaciones
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5 m-0">
              Protocolos terapéuticos estandarizados vinculados a enfermedades tratables y
              medicamentos del inventario
            </p>
          </div>

          <button
            type="button"
            onClick={openNewModal}
            className="bg-[#185C2B] hover:bg-[#134821] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 border-0 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Registrar Medicación
          </button>
        </div>

        {/* TARJETA PRINCIPAL DE ANCHO COMPLETO */}
        <section
          className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-stone-200/80 flex flex-col justify-between"
          style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                  Filtrar por enfermedad tratable:
                </label>
                <select
                  value={filterEnfermedadId}
                  onChange={(e) => setFilterEnfermedadId(e.target.value)}
                  className="w-[320px] rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#185C2B]"
                >
                  <option value="">
                    Todas las enfermedades tratables ({vetCatalogMedications.length})
                  </option>
                  {treatableDiseases.map((enf) => {
                    const count = vetCatalogMedications.filter(
                      (m) => m.enfermedadId === enf.id
                    ).length;
                    return (
                      <option key={enf.id} value={enf.id}>
                        {enf.nombre} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Tabla del Catálogo de Medicaciones */}
            <div className="flex-1 overflow-hidden rounded-xl border border-stone-200/90">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-stone-100/90 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-stone-200">
                    <th className="py-3 px-4 w-[20%]">Enfermedad Tratable</th>
                    <th className="py-3 px-4 w-[20%]">Medicamento (Inventario)</th>
                    <th className="py-3 px-3 w-[20%]">Dosis</th>
                    <th className="py-3 px-3 text-center w-[11%]">Días Totales</th>
                    <th className="py-3 px-4 w-[19%]">Descripción de Administración</th>
                    <th className="py-3 px-4 text-right w-[10%]">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/70 text-xs">
                  {filteredMedications.map((med) => (
                    <tr key={med.id} className="hover:bg-stone-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {med.enfermedadNombre}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {med.medicamentoNombre}
                      </td>
                      <td className="py-3.5 px-3 text-[#185C2B] font-bold">{med.dosis}</td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          {med.diasTotales} días
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 truncate">{med.descripcion}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => openEditModal(med)}
                          className="px-3 py-1 rounded-lg border border-stone-300 hover:border-[#185C2B] hover:text-[#185C2B] text-slate-700 font-semibold text-xs transition bg-white cursor-pointer"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-stone-200/80 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <p className="m-0">
              Editar una medicación aplica únicamente a diagnósticos futuros; los diagnósticos
              existentes conservan su duración y fecha de reintegro originales.
            </p>
            <span className="font-semibold text-slate-700">
              Mostrando {filteredMedications.length} medicaciones registradas
            </span>
          </div>
        </section>
      </main>

      {/* MODAL EMERGENTE: REGISTRAR / EDITAR MEDICACIÓN */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white w-[560px] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 m-0">
                  {editingId ? 'Editar Medicación' : 'Registrar Medicación'}
                </h3>
                <p className="text-xs text-slate-500 m-0 mt-0.5">
                  Defina el protocolo terapéutico para una enfermedad tratable
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-200/60 flex items-center justify-center transition bg-transparent border-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enfermedad tratable <span className="text-red-600">*</span>
                </label>
                <select
                  value={enfermedadId}
                  onChange={(e) => {
                    setEnfermedadId(e.target.value);
                    setFormError('');
                  }}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#185C2B]"
                >
                  <option value="">Seleccione una enfermedad tratable del catálogo...</option>
                  {treatableDiseases.map((enf) => (
                    <option key={enf.id} value={enf.id}>
                      {enf.nombre} (Tratable)
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1 m-0">
                  Las enfermedades que requieren sacrificio sanitario no admiten medicación.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Medicamento (Inventario central) <span className="text-red-600">*</span>
                </label>
                <select
                  value={medicamentoId}
                  onChange={(e) => {
                    setMedicamentoId(e.target.value);
                    setFormError('');
                  }}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#185C2B]"
                >
                  <option value="">Seleccione un medicamento registrado en inventario...</option>
                  {vetInventoryMedicines.map((med) => (
                    <option key={med.id} value={med.id}>
                      {med.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dosis <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={dosis}
                    onChange={(e) => {
                      setDosis(e.target.value);
                      setFormError('');
                    }}
                    placeholder="Ej. 200 g diluidos en 100 L de agua"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#185C2B]"
                  />
                </div>

                <div className="col-span-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Número total de días <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={diasTotales}
                    onChange={(e) => {
                      setDiasTotales(e.target.value);
                      setFormError('');
                    }}
                    placeholder="Ej. 5"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#185C2B]"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Entero mayor a 0
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descripción de administración <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={descripcion}
                  onChange={(e) => {
                    setDescripcion(e.target.value);
                    setFormError('');
                  }}
                  placeholder="Indique la vía e instrucciones de administración en el galpón..."
                  className="w-full rounded-xl border border-stone-300 p-3 text-xs text-slate-800 focus:outline-none focus:border-[#185C2B] resize-none"
                />
              </div>

              {formError && (
                <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 m-0">
                  {formError}
                </p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#185C2B] hover:bg-[#134821] text-white text-xs font-bold shadow-sm transition border-0 cursor-pointer"
                >
                  Guardar Medicación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </VetShell>
  );
}

export default VetMedicinesPage;
