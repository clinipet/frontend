function verifyToken(){
    if(!localStorage.getItem('token')) {
        localStorage.clear();
        window.location.href = 'https://clinipet.sytes.net/403.html';
    }
    fetch('https://clinipet.sytes.net/api/auth/verify', {
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
            window.location.href = 'https://clinipet.sytes.net/403.html';
        });
}