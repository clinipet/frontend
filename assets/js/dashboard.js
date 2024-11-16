import { CONFIG } from './config.js';

function totalPets(){
    fetch(`${CONFIG.API_URL}/api/pets/count`, {
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

function totalAppointmentsToday(){
    fetch(`${CONFIG.API_URL}/api/appointment/count?date=${getCurrentDate()}`, {
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalAppointments').innerHTML = data.count;
        })
        .catch(() => {
            localStorage.clear();
            window.location.href = `${CONFIG.BASE_URL}/pages/403.html`;
        });
}

document.addEventListener('DOMContentLoaded', function() {
    totalPets();
    loadNextAppointments();
    totalAppointmentsToday();
});

function loadNextAppointments() {
    fetch(`${CONFIG.API_URL}/api/appointment/upcoming`, {
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            updateAppointmentsTable(data);
        })
        .catch(error => {
            console.error('Erro ao carregar agendamentos:', error);
        });
}
function formatTime(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function getCurrentDate(format = 'yyyy-mm-dd') {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    switch (format.toLowerCase()) {
        case 'yyyy-mm-dd':
            return `${year}-${month}-${day}`;
        case 'dd/mm/yyyy':
            return `${day}/${month}/${year}`;
        case 'iso':
            return now.toISOString();
        default:
            return now.toString();
    }
}

function updateAppointmentsTable(appointments) {
    const tableBody = document.querySelector('.table tbody');
    const mobileTable = document.querySelector('.table-mobile');

    tableBody.innerHTML = '';
    mobileTable.innerHTML = '';

    appointments.forEach(appointment => {
        let formattedTime = formatTime(appointment.appointment_time);
        //Desktop
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${formattedTime}</td>
            <td>${appointment.client_name}</td>
            <td>${appointment.pet_name}</td>
            <td>${appointment.service}</td>
            <td>
                <button id="editAppointmentHome" class="btn-edit me-2" data-id="${appointment.id}">Editar</button>
                <button id="cancelAppointmentHome" class="btn-cancel" data-id="${appointment.id}">Cancelar</button>
            </td>
        `;

        //Mobile
        const card = document.createElement('div');
        card.className = 'table-card';
        card.innerHTML = `
            <div class="table-card-header">
                <strong>${formattedTime}</strong> - ${appointment.client_name}
            </div>
            <div class="table-card-content">
                <p><strong>Pet:</strong> ${appointment.pet_name}</p>
                <p><strong>Serviço:</strong> ${appointment.service}</p>
                <div class="table-card-actions">
                    <button id="editAppointmentHome" class="btn-edit" onclick="openEditModal(${appointment.id})">Editar</button>
                    <button id="cancelAppointmentHome" class="btn-cancel" onclick="openCancelModal(${appointment.id})">Cancelar</button>
                </div>
            </div>
        `;
        mobileTable.appendChild(card);
    });
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-edit')) {
        if(event.target.id === 'editAppointmentHome') {
            const id = event.target.getAttribute('data-id');
            openEditModal(id);
        }
    } else if (event.target.classList.contains('btn-cancel')) {
        if(event.target.id === 'cancelAppointmentHome') {
            const id = event.target.getAttribute('data-id');
            openCancelModal(id);
        }
    }
});

function openEditModal(id) {
    fetch(`${CONFIG.API_URL}/api/appointment/home/${id}`, {
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('editId').value = data.id;
            document.getElementById('editHora').value = formatTime(data.appointment_time);
            document.getElementById('editCliente').value = data.client_name;
            document.getElementById('editPet').value = data.pet_name;
            document.getElementById('editServico').value = data.service;

            new bootstrap.Modal(document.getElementById('editModal')).show();
        })
        .catch(error => {
            console.error('Erro ao carregar dados do agendamento:', error);
        });
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