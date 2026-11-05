// INTEGRANTE 1: gestión de estudiantes (CRUD, búsqueda y relación con cursos)
const API_ESTUDIANTES = 'https://69f225e3b15130b973529e63.mockapi.io/v1/estudiantes';

async function getEstudiantes() {
  const response = await fetch(API_ESTUDIANTES);
  if (!response.ok) throw new Error('No fue posible cargar estudiantes.');
  return await response.json();
}
async function createEstudiante(datos) {
  const response = await fetch(API_ESTUDIANTES, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
  if (!response.ok) throw new Error('No fue posible crear el estudiante.');
  return await response.json();
}
async function updateEstudiante(id, datos) {
  const response = await fetch(`${API_ESTUDIANTES}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
  if (!response.ok) throw new Error('No fue posible actualizar el estudiante.');
  return await response.json();
}
async function deleteEstudiante(id) {
  const response = await fetch(`${API_ESTUDIANTES}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('No fue posible eliminar el estudiante.');
}
