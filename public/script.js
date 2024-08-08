console.log('script.js loaded');
let csrfToken = '';
document.addEventListener('DOMContentLoaded', function () {
    csrfToken = getCsrfToken();
    function getCsrfToken() {
        const tokenElement = document.querySelector('meta[name="csrf-token"]');
        if (tokenElement) {
            return tokenElement.getAttribute('content');
        } else {
            console.error('CSRF token not found');
            return '';
        }
    }
});

function showTab(tabName) {
  const savedAuthStatus = sessionStorage.getItem('isAuthenticated');
  isAuthenticated = savedAuthStatus === 'true';

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
    if (!isAuthenticated){
      authenticateAndShowTab();
      return;
    }
    window.location.href = '/modify-gifs';
  }
}

function applyScale() {
  gifImage.style.transform = `scale(${currentScale})`;
}

function zoomIn() {
  currentScale += 0.1;
  applyScale();
}

function zoomOut() {
  currentScale -= 0.1;
  applyScale();
}

function resetZoom() {
  currentScale = 1;
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
  fetch(`/gif-attributes/${gifId}`)
      .then(response => response.json())
      .then(attributes => {
        document.getElementById('gifAttributes').textContent = `Attributes: ${attributes.join(', ')}`;
      })
      .catch(error => {
        console.error('Error fetching attributes:', error);
      });
  fetch(`/gif-name/${gifId}`)
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

function downloadGif() {//TODO: fix if name is not found
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