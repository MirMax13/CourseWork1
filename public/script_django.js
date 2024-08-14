console.log('script_django.js loaded');
let isAuthenticated = false;
function authenticateAndShowTab() {
        const login = prompt('Enter login:');
        const password = prompt('Enter password:');  

        fetch('/check-auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ login, password }),
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(data => {
            if (data.isAuthenticated) {
                isAuthenticated = true;
                sessionStorage.setItem('isAuthenticated', 'true');
                showTab('modGif');
            } else {
                isAuthenticated = false;
                alert('Invalid login or password. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error checking authentication:', error);
            alert('An error occurred while checking authentication. Please try again later.');
        });
    }