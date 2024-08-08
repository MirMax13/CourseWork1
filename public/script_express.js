
console.log('script_express.js loaded');
let isAuthenticated = false;
function authenticateAndShowTab() { //TODO: fix with sessions
  const login = prompt('Enter login:');
  const password = prompt('Enter password:');

  fetch('/check-auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, password }),
  })
    .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);
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
    });
}