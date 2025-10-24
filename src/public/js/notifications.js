const tilde = `
              <svg aria-hidden="true" focusable="false" class="octicon octicon-check" 
                  viewBox="0 0 16 16" width="16" height="16"
                  fill="currentColor" display="inline-block" overflow="visible" 
                  style="vertical-align: text-bottom;">
                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 
                    7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 
                    .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 
                    0 0 1 1.06 0Z">
                </path>
              </svg>
              `;

async function cargarNotificaciones() {
  const res = await fetch('/api/users/notificaciones', {
    headers: { Authorization: 'Bearer ' + localStorage.token }
  });
  const data = await res.json();
  const ul = document.getElementById('listaNotificaciones');
  ul.innerHTML = '';

  data.forEach(n => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${n.message} - <small>${new Date(n.createdAt).toLocaleString()}</small>
      ${n.read ? '' : `<button onclick="marcarLeida('${n._id}')">${tilde}</button>`}
    `;
    if(!n.read) ul.appendChild(li);
  });
}

async function marcarLeida(id) {
  await fetch(`/api/users/notificaciones/${id}/leida`, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + localStorage.token }
  });
  cargarNotificaciones();
}

cargarNotificaciones();