import { CONFIG } from './config.js';
function verifyToken(){
    if(!localStorage.getItem('token')) {
        localStorage.clear();
        window.location.href = `${CONFIG.BASE_URL}/pages/403.html`;
    }
    fetch(`${CONFIG.API_URL}/api/auth/verify`, {
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Token inválido');
            }
        })
        .catch(() => {
            localStorage.clear();
            window.location.href = `${CONFIG.BASE_URL}/pages/403.html`;
        });
}