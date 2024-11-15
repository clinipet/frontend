import { CONFIG } from './config.js';

function totalPets(){
    fetch(`${CONFIG.API_URL}api/pets/count`, {
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalPets').innerHTML = data.count;
        })
        .catch(() => {
            localStorage.clear();
            window.location.href = `${CONFIG.BASE_URL}/pages/403.html`;
        });
}

document.addEventListener('DOMContentLoaded', function() {
    totalPets();
});

function openEditModal(id) {
    // fetch(`${CONFIG.API_URL}/api/appointments/${id}`, {
    //     headers: {
    //         'x-access-token': localStorage.getItem('token')
    //     }
    // })
    //     .then(response => response.json())
    //     .then(data => {
    //         document.getElementById('editId').value = data.id;
    //         document.getElementById('editHora').value = data.hora;
    //         document.getElementById('editCliente').value = data.cliente;
    //         document.getElementById('editPet').value = data.pet;
    //         document.getElementById('editServico').value = data.servico;

            new bootstrap.Modal(document.getElementById('editModal')).show();
        // })
        // .catch(error => {
        //     console.error('Erro ao carregar dados do agendamento:', error);
        // });
}

function openCancelModal(id) {
    document.getElementById('cancelId').value = id;
    new bootstrap.Modal(document.getElementById('cancelModal')).show();
}

document.getElementById('saveEdit').addEventListener('click', function() {
    const id = document.getElementById('editId').value;
    const formData = new FormData(document.getElementById('editForm'));

    fetch(`${CONFIG.API_URL}/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
            'x-access-token': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
    })
        .then(response => response.json())
        .then(data => {
            bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
            loadAppointments();
        })
        .catch(error => {
            console.error('Erro ao salvar edição:', error);
        });
});

document.getElementById('confirmCancel').addEventListener('click', function() {
    const id = document.getElementById('cancelId').value;

    // fetch(`${CONFIG.API_URL}/api/appointments/${id}`, {
    //     method: 'DELETE',
    //     headers: {
    //         'x-access-token': localStorage.getItem('token')
    //     }
    // })
    //     .then(response => response.json())
    //     .then(data => {
    //         bootstrap.Modal.getInstance(document.getElementById('cancelModal')).hide();
    //         loadAppointments();
    //     })
    //     .catch(error => {
    //         console.error('Erro ao cancelar agendamento:', error);
    //     });
});