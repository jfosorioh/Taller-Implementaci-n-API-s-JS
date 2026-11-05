// Integración general: navegación, tablas, eventos, reporte y mensajes.
let estudiantes = [], cursos = [];
const modalEstudiante = new bootstrap.Modal(document.getElementById('modalEstudiante'));
const modalCurso = new bootstrap.Modal(document.getElementById('modalCurso'));
const $ = id => document.getElementById(id);

function aviso(icon, title, text = '') { return Swal.fire({ icon, title, text, confirmButtonColor: '#0d6efd' }); }
function cursoNombre(id) { return cursos.find(c => String(c.id) === String(id))?.cnombre || 'Curso no encontrado'; }
function escapeHTML(value = '') { return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

async function cargarTodo() {
  try {
    [cursos, estudiantes] = await Promise.all([getCursos(), getEstudiantes()]);
    renderCursos(); renderEstudiantes(); renderReporte(); cargarSelectCursos();
  } catch (error) { aviso('error', 'Error de conexión', error.message + ' Revisa la API y la conexión a internet.'); }
}
function cargarSelectCursos(selected = '') {
  $('idCurso').innerHTML = '<option value="">Seleccione un curso</option>' + cursos.map(c => `<option value="${escapeHTML(c.id)}">${escapeHTML(c.cnombre)} (${escapeHTML(c.codigo)})</option>`).join('');
  if (selected) $('idCurso').value = selected;
}
function renderEstudiantes() {
  const q = $('buscarEstudiante').value.toLowerCase();
  const filtrados = estudiantes.filter(e => `${e.nombres || ''} ${e.apellidos || ''} ${e.email || ''}`.toLowerCase().includes(q));
  $('tablaEstudiantes').innerHTML = filtrados.map(e => `<tr>
    <td>${escapeHTML(e.id)}</td><td>${escapeHTML(e.nombres)}</td><td>${escapeHTML(e.apellidos)}</td><td>${escapeHTML(e.email)}</td>
    <td>${escapeHTML(e.edad)}</td><td>${escapeHTML(e.programa)}</td><td>${e.creado_a ? new Date(e.creado_a).toLocaleDateString('es-CO') : '—'}</td><td>${escapeHTML(cursoNombre(e.idCurso))}</td>
    <td class="action-buttons"><button class="btn btn-sm btn-warning me-1" onclick="editarEstudiante('${e.id}')">Editar</button><button class="btn btn-sm btn-danger" onclick="borrarEstudiante('${e.id}')">Eliminar</button></td></tr>`).join('') || '<tr><td colspan="9" class="text-center">No hay estudiantes para mostrar.</td></tr>';
}
function renderCursos() {
  const q = $('buscarCurso').value.toLowerCase();
  const filtrados = cursos.filter(c => `${c.cnombre || ''} ${c.codigo || ''} ${c.docente || ''}`.toLowerCase().includes(q));
  $('tablaCursos').innerHTML = filtrados.map(c => `<tr><td>${escapeHTML(c.id)}</td><td>${escapeHTML(c.cnombre)}</td><td>${escapeHTML(c.codigo)}</td><td>${escapeHTML(c.creditos)}</td><td>${escapeHTML(c.docente)}</td><td>${escapeHTML(c.descripcion)}</td>
  <td class="action-buttons"><button class="btn btn-sm btn-warning me-1" onclick="editarCurso('${c.id}')">Editar</button><button class="btn btn-sm btn-danger" onclick="borrarCurso('${c.id}')">Eliminar</button></td></tr>`).join('') || '<tr><td colspan="7" class="text-center">No hay cursos para mostrar.</td></tr>';
}
function renderReporte() {
  let total = 0, sumaEdades = 0;
  $('tablaReporte').innerHTML = cursos.map(c => {
    const lista = estudiantes.filter(e => String(e.idCurso) === String(c.id));
    const edades = lista.map(e => Number(e.edad)).filter(n => Number.isFinite(n) && n > 0);
    total += lista.length; sumaEdades += edades.reduce((a, b) => a + b, 0);
    const promedio = edades.length ? (edades.reduce((a, b) => a + b, 0) / edades.length).toFixed(1) : '—';
    return `<tr><td>${escapeHTML(c.cnombre)}</td><td>${escapeHTML(c.codigo)}</td><td>${lista.length}</td><td>${promedio}</td></tr>`;
  }).join('');
  const edadesGlobales = estudiantes.map(e => Number(e.edad)).filter(n => Number.isFinite(n) && n > 0);
  const promGlobal = edadesGlobales.length ? (edadesGlobales.reduce((a, b) => a + b, 0) / edadesGlobales.length).toFixed(1) : '—';
  $('pieReporte').innerHTML = `<tr class="table-primary fw-bold"><td colspan="2">Consolidado global</td><td>${estudiantes.length} estudiantes</td><td>Edad promedio: ${promGlobal}</td></tr>`;
}
function nuevoEstudiante() {
  $('formEstudiante').reset(); $('estudianteId').value = ''; $('tituloEstudiante').textContent = 'Nuevo estudiante';
  cargarSelectCursos(); modalEstudiante.show();
}
async function editarEstudiante(id) {
  const e = estudiantes.find(x => String(x.id) === String(id)); if (!e) return;
  $('formEstudiante').reset(); $('estudianteId').value = e.id;
  ['nombres', 'apellidos', 'email', 'edad', 'programa'].forEach(k => $(k).value = e[k] ?? '');
  cargarSelectCursos(e.idCurso); $('tituloEstudiante').textContent = 'Editar estudiante'; modalEstudiante.show();
}
async function borrarEstudiante(id) {
  const r = await Swal.fire({ title: '¿Eliminar estudiante?', text: 'Esta acción no se puede deshacer.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar' });
  if (!r.isConfirmed) return;
  try { await deleteEstudiante(id); await cargarTodo(); aviso('success', 'Estudiante eliminado'); }
  catch (e) { aviso('error', 'Error', e.message); }
}
function nuevoCurso() { $('formCurso').reset(); $('cursoId').value = ''; $('tituloCurso').textContent = 'Nuevo curso'; modalCurso.show(); }
function editarCurso(id) {
  const c = cursos.find(x => String(x.id) === String(id)); if (!c) return;
  $('cursoId').value = c.id;['cnombre', 'codigo', 'creditos', 'docente', 'descripcion'].forEach(k => $(k).value = c[k] ?? '');
  $('tituloCurso').textContent = 'Editar curso'; modalCurso.show();
}
async function borrarCurso(id) {
  if (estudiantes.some(e => String(e.idCurso) === String(id))) { aviso('warning', 'No se puede eliminar', 'Este curso tiene estudiantes asociados. Primero reasigna o elimina esos estudiantes.'); return; }
  const r = await Swal.fire({ title: '¿Eliminar curso?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar' });
  if (!r.isConfirmed) return;
  try { await deleteCurso(id); await cargarTodo(); aviso('success', 'Curso eliminado'); }
  catch (e) { aviso('error', 'Error', e.message); }
}
document.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active')); btn.classList.add('active');
  ['estudiantes', 'cursos', 'reporte'].forEach(v => $('vista-' + v).hidden = v !== btn.dataset.view);
}));
$('btnNuevoEstudiante').addEventListener('click', nuevoEstudiante);
$('btnNuevoCurso').addEventListener('click', nuevoCurso);
$('buscarEstudiante').addEventListener('input', renderEstudiantes);
$('buscarCurso').addEventListener('input', renderCursos);

$('formEstudiante').addEventListener('submit', async ev => {
  ev.preventDefault();
  const edad = Number($('edad').value);
  if (!Number.isInteger(edad) || edad < 1 || edad > 120) { aviso('warning', 'Edad inválida', 'Ingrese una edad entera entre 1 y 120.'); return; }
  if (!$('idCurso').value) { aviso('warning', 'Seleccione un curso'); return; }
  const datos = { nombres: $('nombres').value.trim(), apellidos: $('apellidos').value.trim(), email: $('email').value.trim(), edad, programa: $('programa').value.trim(), idCurso: $('idCurso').value };
  const id = $('estudianteId').value;
  try {
    if (id) await updateEstudiante(id, datos); else await createEstudiante({ ...datos, creado_a: new Date().toISOString() });
    modalEstudiante.hide(); await cargarTodo(); aviso('success', id ? 'Estudiante actualizado' : 'Estudiante creado');
  } catch (e) { aviso('error', 'Error', e.message); }
});
$('formCurso').addEventListener('submit', async ev => {
  ev.preventDefault(); const creditos = Number($('creditos').value);
  if (!Number.isInteger(creditos) || creditos < 1) { aviso('warning', 'Créditos inválidos', 'Los créditos deben ser un número entero positivo.'); return; }
  const datos = { cnombre: $('cnombre').value.trim(), codigo: $('codigo').value.trim(), creditos, docente: $('docente').value.trim(), descripcion: $('descripcion').value.trim() };
  if (Object.values(datos).some(v => v === '' || v === null)) { aviso('warning', 'Complete todos los campos'); return; }
  const id = $('cursoId').value;
  try {
    if (id) await updateCurso(id, datos); else await createCurso(datos);
    modalCurso.hide(); await cargarTodo(); aviso('success', id ? 'Curso actualizado' : 'Curso creado');
  } catch (e) { aviso('error', 'Error', e.message); }
});
cargarTodo();
