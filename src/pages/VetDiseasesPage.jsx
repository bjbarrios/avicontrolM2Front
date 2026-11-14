import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VetShell from '../components/VetShell';
import { FarmContext } from '../context/FarmContext';

function VetDiseasesPage() {
  const navigate = useNavigate();
  const {
    vetCatalogDiseases = [],
    vetCatalogMedications = [],
    saveCatalogDisease
  } = useContext(FarmContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [sacrificioFilter, setSacrificioFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [nivelRiesgo, setNivelRiesgo] = useState('');
  const [requiereSacrificio, setRequiereSacrificio] = useState(null);
  const [descripcionClinica, setDescripcionClinica] = useState('');
  const [formError, setFormError] = useState('');

  const totalCount = vetCatalogDiseases.length;
  const tratablesCount = vetCatalogDiseases.filter(
    (d) => !d.requiereSacrificioSanitario
  ).length;
  const sacrificioCount = vetCatalogDiseases.filter(
    (d) => d.requiereSacrificioSanitario
  ).length;

  const filteredDiseases = vetCatalogDiseases
    .filter((d) => {
      if (sacrificioFilter === 'TRATABLES' && d.requiereSacrificioSanitario) return false;
      if (sacrificioFilter === 'SACRIFICIO' && !d.requiereSacrificioSanitario) return false;
      if (searchTerm.trim()) {
        return d.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase());
      }
      return true;
    })
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  const openNewModal = () => {
    setEditingId(null);
    setNombre('');
    setTipo('');
    setNivelRiesgo('');
    setRequiereSacrificio(null);
    setDescripcionClinica('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (disease) => {
    setEditingId(disease.id);
    setNombre(disease.nombre);
    setTipo(disease.tipo);
    setNivelRiesgo(disease.nivelRiesgo);
    setRequiereSacrificio(Boolean(disease.requiereSacrificioSanitario));
    setDescripcionClinica(disease.descripcionClinica);
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const cleanNombre = nombre.trim();
    const cleanDesc = descripcionClinica.trim();

    if (!cleanNombre || !tipo || !nivelRiesgo || !cleanDesc || requiereSacrificio === null) {
      setFormError(
        'Todos los campos son obligatorios, incluyendo indicar si requiere sacrificio sanitario.'
      );
      return;
    }

    const duplicate = vetCatalogDiseases.some(
      (d) =>
        d.id !== editingId && d.nombre.trim().toLowerCase() === cleanNombre.toLowerCase()
    );
    if (duplicate) {
      setFormError(`Ya existe una enfermedad registrada con el nombre "${cleanNombre}".`);
      return;
    }

    saveCatalogDisease({
      id: editingId,
      nombre: cleanNombre,
      tipo,
      nivelRiesgo,
      requiereSacrificioSanitario: Boolean(requiereSacrificio),
      descripcionClinica: cleanDesc
    });

    setModalOpen(false);
  };

  const renderTipoBadge = (tipoVal) => {
    const map = {
      FUNGICA: 'bg-purple-50 text-purple-800 border-purple-200',
      VIRAL: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      PARASITARIA: 'bg-teal-50 text-teal-800 border-teal-200',
      BACTERIANA: 'bg-sky-50 text-sky-800 border-sky-200'
    };
    const labelMap = {
      FUNGICA: 'FÚNGICA',
      VIRAL: 'VIRAL',
      PARASITARIA: 'PARASITARIA',
      BACTERIANA: 'BACTERIANA'
    };
    return (
      <span
        className={`inline-block border text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
          map[tipoVal] || map.VIRAL
        }`}
      >
        {labelMap[tipoVal] || tipoVal}
      </span>
    );
  };

  const renderRiesgoBadge = (riesgoVal) => {
    if (riesgoVal === 'CRITICO') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 border border-red-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
          CRÍTICO
        </span>
      );
    }
    if (riesgoVal === 'ALTO') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-800 border border-orange-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          ALTO
        </span>
      );
    }
    if (riesgoVal === 'MEDIO') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          MEDIO
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        BAJO
      </span>
    );
  };

  const headerSubNav = (
    <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl border border-stone-200">
      <button
        type="button"
        onClick={() => navigate('/veterinario/enfermedades')}
        className="px-4 py-1.5 rounded-lg bg-[#185C2B] text-white text-xs font-bold shadow-sm flex items-center gap-2 border-0 cursor-pointer"
      >
        <span>1. Catálogo de Enfermedades</span>
        <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
          {vetCatalogDiseases.length}
        </span>
      </button>
      <button
        type="button"
        onClick={() => navigate('/veterinario/medicinas')}
        className="px-4 py-1.5 rounded-lg text-slate-600 hover:bg-white/70 text-xs font-semibold transition flex items-center gap-2 bg-transparent border-0 cursor-pointer"
      >
        <span>2. Catálogo de Medicaciones</span>
        <span className="bg-stone-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
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
              Catálogo de Enfermedades
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5 m-0">
              Registro y consulta de patologías avícolas, clasificación clínica y manejo sanitario
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
            Registrar Nueva Enfermedad
          </button>
        </div>

        {/* TARJETA PRINCIPAL DE ANCHO COMPLETO */}
        <section
          className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-stone-200/80 flex flex-col justify-between"
          style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
              <div className="relative w-[380px]">
                <svg
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar enfermedad por nombre..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-slate-800 focus:outline-none focus:border-[#185C2B]"
                />
              </div>

              <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSacrificioFilter('ALL')}
                  className={`px-3.5 py-1.5 rounded-lg transition border-0 cursor-pointer ${
                    sacrificioFilter === 'ALL'
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'bg-transparent text-slate-600 hover:bg-white/60'
                  }`}
                >
                  Todas ({totalCount})
                </button>
                <button
                  type="button"
                  onClick={() => setSacrificioFilter('TRATABLES')}
                  className={`px-3.5 py-1.5 rounded-lg transition border-0 cursor-pointer ${
                    sacrificioFilter === 'TRATABLES'
                      ? 'bg-white text-emerald-800 shadow-sm font-bold'
                      : 'bg-transparent text-emerald-800 hover:bg-white/60'
                  }`}
                >
                  Tratables · Admite medicación ({tratablesCount})
                </button>
                <button
                  type="button"
                  onClick={() => setSacrificioFilter('SACRIFICIO')}
                  className={`px-3.5 py-1.5 rounded-lg transition border-0 cursor-pointer ${
                    sacrificioFilter === 'SACRIFICIO'
                      ? 'bg-white text-red-700 shadow-sm font-bold'
                      : 'bg-transparent text-red-700 hover:bg-white/60'
                  }`}
                >
                  Requieren Sacrificio Sanitario ({sacrificioCount})
                </button>
              </div>
            </div>

            {/* Tabla del Catálogo */}
            <div className="flex-1 overflow-hidden rounded-xl border border-stone-200/90">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-stone-100/90 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-stone-200">
                    <th className="py-3 px-4 w-[22%]">Nombre de la Enfermedad</th>
                    <th className="py-3 px-3 w-[13%]">Tipo</th>
                    <th className="py-3 px-3 w-[13%]">Nivel de Riesgo</th>
                    <th className="py-3 px-4 w-[30%]">Descripción Clínica</th>
                    <th className="py-3 px-3 text-center w-[12%]">¿Requiere Sacrificio?</th>
                    <th className="py-3 px-4 text-right w-[10%]">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/70 text-xs">
                  {filteredDiseases.map((disease) => (
                    <tr
                      key={disease.id}
                      className={`hover:bg-stone-50/80 transition ${
                        disease.requiereSacrificioSanitario ? 'bg-red-50/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {disease.nombre}
                      </td>
                      <td className="py-3.5 px-3">{renderTipoBadge(disease.tipo)}</td>
                      <td className="py-3.5 px-3">{renderRiesgoBadge(disease.nivelRiesgo)}</td>
                      <td className="py-3.5 px-4 text-slate-600 truncate">
                        {disease.descripcionClinica}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {disease.requiereSacrificioSanitario ? (
                          <span className="inline-block bg-red-100 text-red-800 border border-red-200 text-[11px] font-bold px-3 py-0.5 rounded-full">
                            Sí (Sacrificio)
                          </span>
                        ) : (
                          <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-0.5 rounded-full">
                            No (Tratable)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => openEditModal(disease)}
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
              Las ediciones sobre una enfermedad se aplicarán únicamente a diagnósticos futuros sin
              alterar el historial clínico previo.
            </p>
            <span className="font-semibold text-slate-700">
              Mostrando {filteredDiseases.length} enfermedades registradas (ordenadas A-Z)
            </span>
          </div>
        </section>
      </main>

      {/* MODAL EMERGENTE: REGISTRAR / EDITAR ENFERMEDAD */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white w-[560px] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 m-0">
                  {editingId ? 'Editar Enfermedad' : 'Registrar Enfermedad'}
                </h3>
                <p className="text-xs text-slate-500 m-0 mt-0.5">
                  Complete todos los datos obligatorios para{' '}
                  {editingId
                    ? 'actualizar la patología para diagnósticos futuros'
                    : 'agregar la patología al catálogo'}
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
                  Nombre de la enfermedad <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    setFormError('');
                  }}
                  placeholder="Ej. Bronquitis Infecciosa Aviar"
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#185C2B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipo de enfermedad <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={tipo}
                    onChange={(e) => {
                      setTipo(e.target.value);
                      setFormError('');
                    }}
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#185C2B]"
                  >
                    <option value="">Seleccione un tipo...</option>
                    <option value="VIRAL">Viral</option>
                    <option value="BACTERIANA">Bacteriana</option>
                    <option value="PARASITARIA">Parasitaria</option>
                    <option value="FUNGICA">Fúngica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nivel de riesgo <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={nivelRiesgo}
                    onChange={(e) => {
                      setNivelRiesgo(e.target.value);
                      setFormError('');
                    }}
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#185C2B]"
                  >
                    <option value="">Seleccione el nivel...</option>
                    <option value="BAJO">Bajo</option>
                    <option value="MEDIO">Medio</option>
                    <option value="ALTO">Alto</option>
                    <option value="CRITICO">Crítico</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ¿Requiere sacrificio sanitario? <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    onClick={() => {
                      setRequiereSacrificio(false);
                      setFormError('');
                    }}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                      requiereSacrificio === false
                        ? 'border-2 border-[#185C2B] bg-emerald-50/50'
                        : 'border-stone-300 hover:border-[#185C2B] bg-stone-50/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sacrificioModal"
                      checked={requiereSacrificio === false}
                      onChange={() => setRequiereSacrificio(false)}
                      className="mt-0.5 accent-[#185C2B]"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-900">
                        No (Enfermedad tratable)
                      </span>
                      <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                        Permite asociar medicaciones y calcular fecha de reintegro.
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => {
                      setRequiereSacrificio(true);
                      setFormError('');
                    }}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                      requiereSacrificio === true
                        ? 'border-2 border-red-600 bg-red-50/50'
                        : 'border-stone-300 hover:border-red-600 bg-stone-50/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sacrificioModal"
                      checked={requiereSacrificio === true}
                      onChange={() => setRequiereSacrificio(true)}
                      className="mt-0.5 accent-red-600"
                    />
                    <div>
                      <span className="block text-xs font-bold text-red-800">
                        Sí (Enfermedad mortal)
                      </span>
                      <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                        Exige sacrificio sanitario total del lote sin medicación.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descripción clínica <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={descripcionClinica}
                  onChange={(e) => {
                    setDescripcionClinica(e.target.value);
                    setFormError('');
                  }}
                  placeholder="Describa los signos clínicos y lesiones características de la patología..."
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
                  Guardar Enfermedad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </VetShell>
  );
}

export default VetDiseasesPage;
