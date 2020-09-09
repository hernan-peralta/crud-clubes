const $divEliminar = document.querySelectorAll('.eliminar');

function borrar(url) {
  return fetch(url, {
    method: 'GET',
  });
}

$divEliminar.forEach((elemento) => elemento.addEventListener('click', (e) => {
  if (confirm('Confirmar borrado')) {
    borrar(e.target.className);
  }
}));
