let isAuthenticated = false;

function openGif() {
  const gifIdInput = document.getElementById('gifIdInput');
  const gifId = gifIdInput.value;
  const gifImage = document.getElementById('gifImage');
  currentScale = 1; 
  applyScale();
  
  fetch(`/gif/${gifId}`)
    .then(response => {
      if (response.status === 404) {
        console.error('GIF not found');
      } else if (!response.ok) {
        console.error('Error fetching GIF:', response.status);
      } else {
        return response.blob();
      }
    })
    .then(blob => {
      if (blob) {
        const gifUrl = URL.createObjectURL(blob);
        gifImage.src = gifUrl;
        gifImage.style.display = 'block';
        currentScale = 1;
        console.log(blob);
      }
    })
    .catch(error => {
      console.error('Error fetching GIF:', error);
    }); 
  fetch(`/gif-attributes/${gifId}`) // Отримання атрибутів
      .then(response => response.json())
      .then(attributes => {
        document.getElementById('gifAttributes').textContent = `Attributes: ${attributes.join(', ')}`;
      })
      .catch(error => {
        console.error('Error fetching attributes:', error);
      });
  fetch(`/gif-name/${gifId}`) // Отримання назви
      .then(response => response.json())
      .then(filename => {
        document.getElementById('gifName').textContent = `GIF Name: ${filename}`;
      })
      .catch(error => {
        console.error('Error fetching GIF name:', error);
      });
}
function downloadGif() {
  const gifIdInput = document.getElementById('gifIdInput');
  const gifId = gifIdInput.value;
  const downloadFileNameInput = document.getElementById('downloadFileNameInput');
  const downloadFileName = downloadFileNameInput.value || 'downloaded.gif';
  fetch(`/download-gif/${gifId}?fileName=${downloadFileName}`)
    .then(response => {
      if (response.status === 404) {
        console.error('GIF not found');
      } else if (!response.ok) {
        console.error('Error fetching GIF:', response.status);
      } else {
        return response.blob();
      }
    })
    .then(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadFileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    })
    .catch(error => {
      console.error('Error fetching GIF:', error);
    });
}
function zoomIn() {
  currentScale += 0.1; // Збільшення масштабу на 10%
  applyScale();
}

function zoomOut() {
  currentScale -= 0.1; // Зменшення масштабу на 10%
  applyScale();
}

function resetZoom() {
  currentScale = 1; // Повернення до звичайного масштабу
  applyScale();
}

function applyScale() {
  gifImage.style.transform = `scale(${currentScale})`;// Застосування масштабу до зображення
}
function showGif(gifId) {
  const gifIdInput = document.getElementById('gifIdInput');
  gifIdInput.value = gifId;
  openGif();
}

function authenticateAndShowTab(tabName) {
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
      if (response.ok) {
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


function showTab(tabName) {
  const savedAuthStatus = sessionStorage.getItem('isAuthenticated');
  isAuthenticated = savedAuthStatus === 'true';

  // Перемикання вкладок
  if (tabName === 'main') {
    window.location.href = '/'; 
  } else if (tabName === 'comaruFamily') {
    window.location.href = '/Comaru'; 
  } else if (tabName === 'pig') {
    window.location.href = '/pig'; 
  } else if (tabName === 'others') {
    window.location.href = '/others'; 
  } else if (tabName === 'arctic_vixen') {
    window.location.href = '/arctic-vixen'; 
  } else if (tabName === 'searchByName') {
    window.location.href = '/search-by-name'; 
  }
  else if (tabName === 'searchByAttributes') {
    window.location.href = '/search-by-attributes'; 
  }
  else if (tabName === 'modGif') {
    if (!isAuthenticated){
      authenticateAndShowTab('modGif');
      return;
    }
    window.location.href = '/Modify-Gifs'; 
  }
}