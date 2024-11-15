import { CONFIG } from './config.js';
document.addEventListener('DOMContentLoaded', function() {
    verifyToken();
});
function verifyToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        redirectTo403();
        return;
    }
    const lastValidation = localStorage.getItem('lastTokenValidation');
    const now = new Date().getTime();
    if (lastValidation && now - parseInt(lastValidation) < 5 * 60 * 1000) {
        return;
    }

    fetch(`${CONFIG.API_URL}/api/auth/verify`, {
        headers: {
            'x-access-token': token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Token inválido');
            }

            localStorage.setItem('lastTokenValidation', now.toString());
        })
        .catch(() => {
            redirectTo403();
        });
}

function redirectTo403() {
    localStorage.clear();
    window.location.href = `${CONFIG.BASE_URL}/pages/403.html`;
}