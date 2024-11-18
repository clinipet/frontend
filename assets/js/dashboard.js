import { CONFIG } from './config.js';

function totalPets(species = null, elementId = 'totalPets') {
    let url = (species === null) ? `${CONFIG.API_URL}/api/pets/count` : `${CONFIG.API_URL}/api/pets/count?species=${species}`;
    fetch(`${url}`, {
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById(elementId).innerHTML = data.count;
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

function totalAppointmentsWeekly(){
    fetch(`${CONFIG.API_URL}/api/appointment/count/weekly`, {
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('weeklyAppointmentsTotal').innerHTML = data.count;
        })
        .catch(() => {
            localStorage.clear();
            window.location.href = `${CONFIG.BASE_URL}/pages/403.html`;
        });
}

//onLoad
document.addEventListener('DOMContentLoaded', function() {
    if(document.getElementById('totalCats')){
        totalPets(2, 'totalCats');
    }
    if(document.getElementById('totalDogs')){
        totalPets(1, 'totalDogs');
    }
    if(document.getElementById('weeklyAppointmentsTotal')){
        totalAppointmentsWeekly();
    }
    if(document.getElementById('totalPets')){
        totalPets();
    }
    if(document.getElementById('appointmentsTable')){
        loadAppointmentsTable();
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

async function newPetModal(){
    const createPetModal = new bootstrap.Modal(document.getElementById('newPetModal'));
    const allSpecies = await loadPetsSpecies();
    addOptionsToSelect('newPetSpecies', allSpecies);
    const clientList = await loadClientSimple();
    addOptionsToSelect('newPetOwner', clientList);
    createPetModal.show();
}

function petModalDetails(id){
    const petDetailsModal = new bootstrap.Modal(document.getElementById('viewPetModal'));
    fetch(`${CONFIG.API_URL}/api/pets/details/${id}`, {
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('viewPetName').textContent = data.pet_name;
            document.getElementById('viewPetSpecies').textContent = data.pet_specie;
            document.getElementById('viewPetBreed').textContent = data.pet_breed;
            document.getElementById('viewPetAge').textContent = `${data.pet_age} ${(data.pet_age != 1) ? 'anos' : 'ano'} (${formatDate(data.pet_birth)})`;
            document.getElementById('viewPetOwner').textContent = data.client_name;
            document.getElementById('viewPetLastVisit').textContent = `${(data.last_appointment === 'N/A') ? 'N/A' : formatDate(data.last_appointment) + ' ' + formatTime(data.last_appointment)}`;
            petDetailsModal.show();
        })
        .catch(error => {
            console.error('Erro ao carregar agendamentos:', error);
    });

}

async function petEditModal(id){
    const editPetModal = new bootstrap.Modal(document.getElementById('editPetModal'));
    const response = await fetch(`${CONFIG.API_URL}/api/pets/details/${id}`, {
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    });
    const data = await response.json();
    document.getElementById('editPetId').value = data.pet_id;
    document.getElementById('editPetBirth').value = utcToLocal(data.pet_birth);
    document.getElementById('editPetName').value = data.pet_name;
    document.getElementById('editPetBreed').value = data.pet_breed;
    const allSpecies = await loadPetsSpecies();
    addOptionsToSelect('editPetSpecies', allSpecies);
    const clientList = await loadClientSimple();
    addOptionsToSelect('editPetOwner', clientList);

    editPetModal.show();

}


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
function loadAppointmentsTable() {
    fetch(`${CONFIG.API_URL}/api/appointment/home`, {
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

function loadPets() {
    fetch(`${CONFIG.API_URL}/api/pets/home`, {
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
    totalPets();
    totalPets(1, 'totalDogs');
    totalPets(2, 'totalCats');
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
                <button id="editAppointmentHome" class="btn-edit me-2" data-id="${appointment.id}" data-bs-dismiss="modal">Editar</button>
                <button id="cancelAppointmentHome" class="btn-cancel" data-id="${appointment.id}" >Cancelar</button>
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
                    <button id="editAppointmentHome" class="btn-edit" data-id="${appointment.id}" onclick="openEditModal(${appointment.id})" data-bs-dismiss="modal">Editar</button>
                    <button id="cancelAppointmentHome" class="btn-cancel" data-id="${appointment.id}" onclick="openCancelModal(${appointment.id})" data-bs-dismiss="modal">Cancelar</button>
                </div>
            </div>
        `;
        mobileTable.appendChild(card);
    });
}

function updateAppointmentsTable(appointments) {
    const tableBody = document.querySelector('.table tbody');
    const mobileTable = document.querySelector('.table-mobile');

    tableBody.innerHTML = '';
    mobileTable.innerHTML = '';

    appointments.forEach(appointment => {
        let formattedTime = formatTime(appointment.appointment_date);
        let formattedDate = formatDate(appointment.appointment_date);
        //Desktop
        let statusClass = '';
        switch (appointment.status_id) {
            case 1:
                statusClass = 'badge bg-success';
                break;
            case 2:
                statusClass = 'badge bg-danger';
                break;
            case 3:
                statusClass = 'badge bg-info';
                break;
            default:
                statusClass = 'badge bg-warning text-dark';
        }
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${formattedTime}</td>
            <td>${appointment.client_name}</td>
            <td>${appointment.pet_name}</td>
            <td>${appointment.appointment_service}</td>
            <td><span class="${statusClass}">${appointment.appointment_status}</span></td>
            <td>
                <button id="editAppointmentHome" class="btn-edit me-2" data-id="${appointment.appointment_id}">Editar</button>
                <button id="cancelAppointmentHome" class="btn-cancel" data-id="${appointment.appointment_id}">Cancelar</button>
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
                <p><strong>Serviço:</strong> ${appointment.appointment_service}</p>
                <div class="table-card-actions">
                    <button id="editAppointmentHome" class="btn-edit" data-id="${appointment.appointment_id}" onclick="openEditModal(${appointment.appointment_id})">Editar</button>
                    <button id="cancelAppointmentHome" class="btn-cancel" data-id="${appointment.appointment_id}" onclick="openCancelModal(${appointment.appointment_id})">Cancelar</button>
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
        let formattedDate = (client.last_appointment === 'N/A') ? 'N/A' : formatDate(client.last_appointment);
        //Desktop
        const row = tableBody.insertRow();
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
                <strong>${client.client_name}</strong> - ${client.formattedDate}
            </div>
            <div class="table-card-content">
                <p><strong>Pets:</strong> ${client.client_pets}</p>
                <p><strong>Telefone:</strong> ${client.client_phone}</p>
                <div class="table-card-actions">
                    <button id="editAppointmentHome" class="btn-edit" data-id="${client.client_id}" onclick="openEditModal(${client.client_id})">Editar</button>
                    <button id="cancelAppointmentHome" class="btn-cancel" data-id="${client.client_id}" onclick="openCancelModal(${client.client_id})">Cancelar</button>
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
        //Desktop
        const formattedDate = (pet.last_appointment === 'N/A') ? 'N/A' : formatDate(pet.last_appointment);
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${pet.pet_name}</td>
            <td>${pet.pet_specie}</td>
            <td>${pet.pet_breed}</td>
            <td>${pet.pet_age} ${(pet.pet_age > 1) ? 'anos' : 'ano'}</td>
            <td>${pet.client_name}</td>
            <td>${formattedDate }</td>
            <td>
                <button class="btn-edit me-2" data-id="${pet.pet_id}" id="openEditPetModal">Editar</button>
                <button class="btn-view" data-id="${pet.pet_id}" id="openViewPetModal">Ver Detalhes</button>
                <button class="btn-cancel" data-id="${pet.pet_id}" id="deletePet">Remover</button>
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
                    <button id="editAppointmentHome" class="btn-edit" data-id="${pet.pet_id}" onclick="openEditModal(${pet.pet_id})">Editar</button>
                    <button id="cancelAppointmentHome" class="btn-cancel" data-id="${pet.pet_id}" onclick="openCancelModal(${pet.pet_id})">Cancelar</button>
                </div>
            </div>
        `;
        mobileTable.appendChild(card);
    });
}

document.addEventListener('click', function(event) {
    if(event.target.id === 'editAppointmentHome') {
        const id = event.target.getAttribute('data-id');
        openEditModal(id);
    }else if(event.target.id === 'cancelAppointmentHome') {
        const id = event.target.getAttribute('data-id');
        openCancelModal(id);
    } else if (event.target.id === 'openEditPetModal') {
        const id = event.target.getAttribute('data-id');
        petEditModal(id);
    } else if (event.target.id === 'openViewPetModal') {
        const id = event.target.getAttribute('data-id');
        petModalDetails(id);
    } else if (event.target.id === 'savePetChanges'){
        savePetChanges();
    } else if (event.target.id === 'deletePet'){
        const id = event.target.getAttribute('data-id');
        deletePet(id);
    } else if (event.target.id === 'confirmYes'){
        postPetDelete();
    } else if (event.target.id === 'saveNewPet'){
        postNewPet();
    } else if (event.target.id === 'openPetModal'){
        newPetModal();
    }
});

function postPetDelete(){
    const id = document.getElementById('deletePetId').value;
    fetch(`${CONFIG.API_URL}/api/pets/${id}`, {
        method: 'DELETE',
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    })
        .then(response => {
            if (response.status === 204) {
                loadPets();
                successModal('Pet excluído com sucesso!');
            } else if (response.status === 400) {
                return response.json().then(data => {
                    errorModal('Erro ao excluir pet: ' + data.message);
                    throw new Error(data.message || 'Erro ao excluir pet');
                });
            } else {
                errorContext = data.message;
                errorModal('Erro ao excluir pet: ' + data.message);
                throw new Error('Erro ao excluir pet');
            }
            return response.json();
        })
        .then(data => {
            loadPets();
            successModal('Pet excluído com sucesso!');
        })
        .catch(error => {
            errorModal('Erro ao excluir pet!');
            console.error('Erro ao excluir pet:', error);
        });
}

function deletePet(id){
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    document.getElementById('confirmationMessage').textContent = 'Deseja realmente excluir este pet?';
    document.getElementById('deletePetId').value = id;
    confirmationModal.show();
}

function savePetChanges(){
    const form = document.getElementById('editPetForm');
    const formData = {
        client_id: form.editPetOwner.value,
        name: form.editPetName.value,
        species: form.editPetSpecies.value,
        breed: form.editPetBreed.value,
        birth_date: form.editPetBirth.value
    }
    fetch(`${CONFIG.API_URL}/api/pets/${form.editPetId.value}`, {
        method: 'PUT',
        headers: {
            'x-access-token': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            loadPets();
            successModal('Pet editado com sucesso!');
        })
        .catch(error => {
            errorModal('Erro ao editar pet!');
            console.error('Erro ao salvar edição:', error);
        })
}

function postNewPet() {
    const form = document.getElementById('newPetForm');
    const formData = {
        client_id: parseInt(form.newPetOwner.value),
        name: form.newPetName.value,
        species: parseInt(form.newPetSpecies.value),
        breed: form.newPetBreed.value,
        birth_date: form.newPetBirthDate.value
    };

    fetch(`${CONFIG.API_URL}/api/pets`, {
        method: 'POST',
        headers: {
            'x-access-token': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.status === 201) {
                loadPets();
                successModal('Pet cadastrado com sucesso!');
            } else if (response.status === 400) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Erro ao cadastrar pet');
                });
            } else {
                throw new Error('Erro ao cadastrar pet');
            }
        })
        .catch(error => {
            if (error.message === 'Client cannot have more than 5 pets') {
                errorModal('Limite de 5 pets por cliente atingido!');
            } else {
                errorModal('Erro ao cadastrar pet: ' + error.message);
            }
            console.error('Erro ao cadastrar pet:', error);
        });
}

function successModal(message){
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    document.getElementById('successMessage').textContent = message;
    successModal.show();
}

function errorModal(message){
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    document.getElementById('errorMessage').textContent = message;
    errorModal.show();
}

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

async function loadPetsSpecies() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/pets/species`, {
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

async function loadClientSimple() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/clients/list`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
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


const saveEditButton = document.getElementById('saveEditAppointment');
if (saveEditButton) {
    saveEditButton.addEventListener('click', function() {
        const id = document.getElementById('editId').value;
        const form = document.getElementById('editForm');
        const formData = {
            pet_id: form.editPet.value,
            date: form.editData.value,
            notes: form.editServico.value
        }

        fetch(`${CONFIG.API_URL}/api/appointment/${id}`, {
            method: 'PUT',
            headers: {
                'x-access-token': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
                successModal('Agendamento editado com sucesso!');
                loadNextAppointmentsHome();
            })
            .catch(error => {
                errorModal('Erro ao editar agendamento!');
                console.error('Erro ao salvar edição:', error);
            });
    });
}
const confirmCancelButton = document.getElementById('confirmCancel');
if (confirmCancelButton) {
    confirmCancelButton.addEventListener('click', function() {
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
                successModal('Agendamento cancelado com sucesso!')
                loadNextAppointmentsHome();
            })
            .catch(error => {
                errorModal('Erro ao cancelar agendamento!');
                console.error('Erro ao cancelar agendamento:', error);
            });
    });
}

