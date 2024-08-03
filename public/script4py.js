let isAuthenticated = false;

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
    window.location.href = '/comaru'; 
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
    // if (!isAuthenticated){
    //   authenticateAndShowTab('modGif');
    //   return;
    // }
    window.location.href = '/modify-gifs'; 
  }
}

function applyScale() {
  gifImage.style.transform = `scale(${currentScale})`;// Застосування масштабу до зображення
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
      .then(data => {
        document.getElementById('gifName').textContent = `GIF Name: ${data.filename}`;
      })
      .catch(error => {
        console.error('Error fetching GIF name:', error);
      });
}

function showGif(gifId) {
  const gifIdInput = document.getElementById('gifIdInput');
  gifIdInput.value = gifId;
  openGif();
}
function downloadGif() {
  const gifIdInput = document.getElementById('gifIdInput');
  const gifId = gifIdInput.value;
  const downloadFileNameInput = document.getElementById('downloadFileNameInput');
  const downloadFileName = downloadFileNameInput.value;

  let url = `/download-gif/${gifId}`;
  if (downloadFileName) {
    url += `?fileName=${encodeURIComponent(downloadFileName)}`;
  }

  console.log(`Fetching URL: ${url}`);

  fetch(url)
    .then(response => {
      console.log(`Response status: ${response.status}`);
      if (response.status === 404) {
        console.error('GIF not found');
      } else if (!response.ok) {
        console.error('Error fetching GIF:', response.status);
      } else {
        const contentDisposition = response.headers.get('Content-Disposition');
        console.log(`Content-Disposition header: ${contentDisposition}`);
        let filename = 'downloaded.gif';
        if (contentDisposition && contentDisposition.includes('filename=')) {
          const encodedFilename = contentDisposition.split('filename*=')[1] || contentDisposition.split('filename=')[1];
          if (encodedFilename) {
            filename = decodeURIComponent(encodedFilename.replace(/UTF-8''/, '').replace(/"/g, ''));
          }
        }
        console.log(`Content-Disposition filename: ${filename}`);
        return response.blob().then(blob => ({ blob, filename }));
      }
    })
    .then(({ blob, filename }) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadFileName || filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        console.log(`GIF downloaded as: ${a.download}`);
      }
    })
    .catch(error => {
      console.error('Error fetching GIF:', error);
    });
}

function displayGifList() {
  const gifList = document.getElementById('gifList');

  fetch('/gif-list')
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        data.forEach(gif => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `<a href="#" onclick="showGif('${gif.id}')">${gif.filename}</a>`;
          gifList.appendChild(listItem);
        });
      } else {
        gifList.innerHTML = '<li>No GIFs available.</li>';
      }
    })
    .catch(error => {
      console.error('Error fetching GIF list:', error);
    });
}
function displayGifListByAttribute(attribute) {
  const gifList = document.getElementById(`${attribute}GifList`);

  fetch(`/gif-list-by-attribute/${attribute}`)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        data.forEach(gif => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `<a href="#" onclick="showGif('${gif.id}')">${gif.filename}</a>`;
          gifList.appendChild(listItem);
        });
      } else {
        gifList.innerHTML = `<li>No ${attribute} GIFs available.</li>`;
      }
    })
    .catch(error => {
      console.error(`Error fetching ${attribute} GIF list:`, error);
    });
}