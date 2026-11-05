// INTEGRANTE 2: gestión de cursos (CRUD, búsqueda e integridad referencial)
const API_CURSOS = 'https://69f225e3b15130b973529e63.mockapi.io/v1/cursos';

async function getCursos() {
  const response = await fetch(API_CURSOS);
  if (!response.ok) throw new Error('No fue posible cargar cursos.');
  return await response.json();
}
async function createCurso(datos) {
  const response = await fetch(API_CURSOS, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)});
  if (!response.ok) throw new Error('No fue posible crear el curso.');
  return await response.json();
}
async function updateCurso(id, datos) {
  const response = await fetch(`${API_CURSOS}/${id}`, {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)});
  if (!response.ok) throw new Error('No fue posible actualizar el curso.');
  return await response.json();
}
async function deleteCurso(id) {
  const response = await fetch(`${API_CURSOS}/${id}`, {method:'DELETE'});
  if (!response.ok) throw new Error('No fue posible eliminar el curso.');
}
