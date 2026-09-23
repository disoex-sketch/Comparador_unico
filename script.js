document.addEventListener('DOMContentLoaded', () => {
  // 1. LISTA DE PAREJAS DE IMÁGENES
  // Añade o quita parejas aquí según las fotos que subas a la carpeta /img
  const galeria = [
    { foto1: 'foto1_antes.jpg', foto2: 'foto1_despues.jpg' },
    { foto1: 'foto2_antes.jpg', foto2: 'foto2_despues.jpg' },
    { foto1: 'foto3_antes.jpg', foto2: 'foto3_despues.jpg' }
  ];

  let indiceActual = 0;

  // Comprobar si se pasa un parámetro opcional en la URL (?pareja=1)
  const urlParams = new URLSearchParams(window.location.search);
  const parejaParam = parseInt(urlParams.get('pareja'));
  if (!isNaN(parejaParam) && parejaParam >= 1 && parejaParam <= galeria.length) {
    indiceActual = parejaParam - 1;
  }

  const imgOverlay = document.getElementById('imgOverlay');
  const imgBase = document.getElementById('imgBase');
  const slider = document.getElementById('slider');
  const overlay = document.getElementById('overlay');
  const line = document.getElementById('line');
  const comparisonContainer = document.getElementById('comparison');

  function syncImageWidth() {
    if (imgOverlay && comparisonContainer) {
      imgOverlay.style.width = `${comparisonContainer.offsetWidth}px`;
      imgOverlay.style.height = `${comparisonContainer.offsetHeight}px`;
    }
  }

  function cargarPareja(index) {
    const pareja = galeria[index];
    imgOverlay.src = `img/${pareja.foto1}`;
    imgBase.src = `img/${pareja.foto2}`;
    
    // Resetear el deslizador al centro (50%)
    if (slider) slider.value = 50;
    if (overlay) overlay.style.width = '50%';
    if (line) line.style.left = '50%';
    
    // Actualizar indicador visual
    const contador = document.getElementById('nav-counter');
    if (contador) {
      contador.innerText = `${index + 1} / ${galeria.length}`;
    }
  }

  window.addEventListener('resize', syncImageWidth);
  window.addEventListener('orientationchange', syncImageWidth);
  if (imgOverlay) imgOverlay.onload = syncImageWidth;

  if (slider) {
    slider.addEventListener('input', (e) => {
      const value = e.target.value;
      if (overlay) overlay.style.width = `${value}%`;
      if (line) line.style.left = `${value}%`;
    });
  }

  // 2. CREAR BOTONES DE NAVEGACIÓN (FLECHAS) Y CONTADOR
  const navContainer = document.createElement('div');
  navContainer.id = 'nav-container';
  navContainer.innerHTML = `
    <button id="btn-prev" class="nav-btn">◀</button>
    <span id="nav-counter" class="nav-counter">1 / ${galeria.length}</span>
    <button id="btn-next" class="nav-btn">▶</button>
  `;

  Object.assign(navContainer.style, {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '20',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    padding: '8px 16px',
    borderRadius: '30px',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  });

  document.body.appendChild(navContainer);

  // Estilos rápidos para los botones
  const btnStyle = `
    background: #ffffff;
    color: #000000;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  `;

  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const counterStyle = document.getElementById('nav-counter');

  btnPrev.style.cssText = btnStyle;
  btnNext.style.cssText = btnStyle;
  counterStyle.style.cssText = "color: #ffffff; font-family: system-ui, sans-serif; font-weight: bold; font-size: 14px;";

  // Eventos para cambiar de foto con las flechas
  btnPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    indiceActual = (indiceActual - 1 + galeria.length) % galeria.length;
    cargarPareja(indiceActual);
  });

  btnNext.addEventListener('click', (e) => {
    e.stopPropagation();
    indiceActual = (indiceActual + 1) % galeria.length;
    cargarPareja(indiceActual);
  });

  // Cargar la primera pareja por defecto
  cargarPareja(indiceActual);

  // 3. CAPA DE PANTALLA COMPLETA INICIAL
  const overlayStart = document.createElement('div');
  overlayStart.id = 'start-overlay';
  overlayStart.innerHTML = `
    <div style="text-align: center; color: #ffffff; padding: 20px; font-family: system-ui, sans-serif;">
      <p style="font-size: 1.2rem; margin-bottom: 20px;">Pulsa la pantalla para ver en pantalla completa</p>
      <button style="padding: 14px 28px; font-size: 1rem; border-radius: 30px; border: none; background: #ffffff; color: #000000; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
        Ver Comparativas 🔄
      </button>
    </div>
  `;
  
  Object.assign(overlayStart.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100dvh',
    backgroundColor: 'rgba(0,0,0,0.95)',
    zIndex: '9999',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  });

  document.body.appendChild(overlayStart);

  overlayStart.addEventListener('click', async () => {
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      }

      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock('landscape');
      }
    } catch (err) {
      console.log('Aviso:', err);
    } finally {
      overlayStart.style.display = 'none';
      syncImageWidth();
    }
  });
});
