const $divEliminar = document.querySelectorAll('.eliminar');

$divEliminar.forEach((elemento) => elemento.addEventListener('click', (e) => {
  if (confirm('Confirmar borrado')) {
    borrar(e.target.className);
  }
}));

function borrar(url) {
  return fetch(url, {
    method: 'DELETE',
  });
}
