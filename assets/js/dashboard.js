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

function totalClients(){
    fetch(`${CONFIG.API_URL}/api/clients/count`, {
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalClients').innerHTML = data.count;
        })
        .catch(() => {
            localStorage.clear();
            window.location.href = `${CONFIG.BASE_URL}/pages/403.html`;
        });
}

function totalVeterinarians(){
    fetch(`${CONFIG.API_URL}/api/veterinarians/count`, {
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalVeterinarians').innerHTML = data.count;
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
            document.getElementById('totalAppointmentsToday').innerHTML = data.count;
        })
        .catch(() => {
            localStorage.clear();
            window.location.href = `${CONFIG.BASE_URL}/pages/403.html`;
        });
}

//onLoad
document.addEventListener('DOMContentLoaded', function() {
    if(document.getElementById('totalPets')){
        totalPets();
    }
    if(document.getElementById('tableHome')){
        loadNextAppointmentsHome();
    }
    if(document.getElementById('totalVeterinarians')){
        totalVeterinarians();
    }
    if(document.getElementById('totalAppointmentsToday')){
        totalAppointmentsToday();
    }
    if(document.getElementById('totalClients')) {
        totalClients();
    }
    if(document.getElementById('clientsTable')) {
        loadClients();
    }
    if (document.getElementById('petsTable')) {
        loadPets();
    }
});

function loadNextAppointmentsHome() {
    fetch(`${CONFIG.API_URL}/api/appointment/upcoming`, {
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            updateAppointmentsHomeTable(data);
        })
        .catch(error => {
            console.error('Erro ao carregar agendamentos:', error);
        });
}

function loadPets() {
    fetch(`${CONFIG.API_URL}/api/pets/`, {
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            updatePetsTable(data);
        })
        .catch(error => {
            console.error('Erro ao carregar agendamentos:', error);
        });
}

function loadClients() {
    fetch(`${CONFIG.API_URL}/api/clients/home`, {
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            updateClientsTable(data);
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

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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

function updateAppointmentsHomeTable(appointments) {
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
                    <button id="editAppointmentHome" class="btn-edit" data-id="${appointment.id}" onclick="openEditModal(${appointment.id})">Editar</button>
                    <button id="cancelAppointmentHome" class="btn-cancel" data-id="${appointment.id}" onclick="openCancelModal(${appointment.id})">Cancelar</button>
                </div>
            </div>
        `;
        mobileTable.appendChild(card);
    });
}

function updateClientsTable(clients) {
    const tableBody = document.querySelector('.table tbody');
    const mobileTable = document.querySelector('.table-mobile');

    tableBody.innerHTML = '';
    mobileTable.innerHTML = '';

    clients.forEach(client => {
        let formattedDate = formatDate(client.last_appointment);
        //Desktop
        const row = tableBody.insertRow();
        /*
                        <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Pets</th>
                <th>Última Visita</th>
                <th>Ações</th>
         */
        row.innerHTML = `
            <td>${client.client_name}</td>
            <td>${client.client_mail}</td>
            <td>${client.client_phone}</td>
            <td>${client.client_pets}</td>
            <td>${formattedDate }</td>
            <td>
                <button id="editAppointmentHome" class="btn-edit me-2" data-id="${client.client_id}">Editar</button>
                <button class="btn-view" data-id="${client.client_id}">Ver Detalhes</button>
            </td>
        `;

        //Mobile
        const card = document.createElement('div');
        card.className = 'table-card';
        card.innerHTML = `
            <div class="table-card-header">
                <strong>${pet.name}</strong> - ${pet.species}
            </div>
            <div class="table-card-content">
                <p><strong>Dono:</strong> ${pet.name}</p>
                <p><strong>Raça:</strong> ${pet.breed}</p>
                <div class="table-card-actions">
                    <button id="editAppointmentHome" class="btn-edit" data-id="${pet.id}" onclick="openEditModal(${pet.id})">Editar</button>
                    <button id="cancelAppointmentHome" class="btn-cancel" data-id="${pet.id}" onclick="openCancelModal(${pet.id})">Cancelar</button>
                </div>
            </div>
        `;
        mobileTable.appendChild(card);
    });
}

function updatePetsTable(pets) {
    const tableBody = document.querySelector('.table tbody');
    const mobileTable = document.querySelector('.table-mobile');

    tableBody.innerHTML = '';
    mobileTable.innerHTML = '';

    pets.forEach(pet => {
        let formattedTime = formatTime(pet.birth_date);
        //Desktop
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${pet.name}</td>
            <td>${pet.species}</td>
            <td>${pet.breed}</td>
            <td>${formattedTime}</td>
            <td>${pet.name}</td>
            <td>${formattedTime }</td>
            <td>
                <button id="editAppointmentHome" class="btn-edit me-2" data-id="${pet.id}">Editar</button>
                <button id="cancelAppointmentHome" class="btn-cancel" data-id="${pet.id}">Cancelar</button>
            </td>
        `;

        //Mobile
        const card = document.createElement('div');
        card.className = 'table-card';
        card.innerHTML = `
            <div class="table-card-header">
                <strong>${pet.name}</strong> - ${pet.species}
            </div>
            <div class="table-card-content">
                <p><strong>Dono:</strong> ${pet.name}</p>
                <p><strong>Raça:</strong> ${pet.breed}</p>
                <div class="table-card-actions">
                    <button id="editAppointmentHome" class="btn-edit" data-id="${pet.id}" onclick="openEditModal(${pet.id})">Editar</button>
                    <button id="cancelAppointmentHome" class="btn-cancel" data-id="${pet.id}" onclick="openCancelModal(${pet.id})">Cancelar</button>
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


function addOptionsToSelect(selectId, options, selectedId = null) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) {
        console.error(`Elemento select com ID "${selectId}" não encontrado.`);
        return;
    }
    selectElement.innerHTML = '';
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.id;
        optionElement.textContent = option.name;
        if (selectedId !== null && option.id === selectedId) {
            optionElement.selected = true;
        }
        selectElement.appendChild(optionElement);
    });
}


async function loadPetsByClient(clientId) {
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/pets/client/${clientId}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar pets:', error);
        throw error;
    }
}


async function openEditModal(id) {
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/appointment/home/${id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        const data = await response.json();

        document.getElementById('editId').value = data.id;
        document.getElementById('editData').value = utcToLocal(data.appointment_time);
        document.getElementById('editCliente').value = data.client_name;

        const Allpets = await loadPetsByClient(data.client_id);
        addOptionsToSelect('editPet', Allpets, data.pet_id);
        document.getElementById('editServico').value = data.service;

        new bootstrap.Modal(document.getElementById('editModal')).show();
    } catch (error) {
        console.error('Erro ao carregar dados do agendamento:', error);
    }
}
function utcToLocal(utcDateString) {
    const date = new Date(utcDateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
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

    fetch(`${CONFIG.API_URL}/api/appointment/${id}`, {
        method: 'PATCH',
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            bootstrap.Modal.getInstance(document.getElementById('cancelModal')).hide();
            loadAppointments();
        })
        .catch(error => {
            console.error('Erro ao cancelar agendamento:', error);
        });
});


