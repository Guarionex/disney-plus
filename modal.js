export const loadModalHTML = () => {
  return fetch('./modal.html')
    .then(response => response.text())
    .then(modalHTML => {
      document.getElementById('modal-container').innerHTML = modalHTML

      document.querySelector('.close').onclick = closeModal

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeModal()
        }
      })
    })
}

export const openModal = (title, videoUrl, heroUrl) => {
  const modal = document.getElementById('modal')
  const modalTitle = document.getElementById('modal-title')
  const modalMedia = document.getElementById('modal-media')

  modalTitle.textContent = title
  modalMedia.innerHTML = ''

  if (!!videoUrl) {
    const videoElement = document.createElement('video')
    videoElement.src = videoUrl
    videoElement.autoplay = true
    videoElement.loop = true
    videoElement.muted = true
    videoElement.style.width = '100%'
    modalMedia.appendChild(videoElement)
  } else if (!!heroUrl) {
    const imageElement = document.createElement('img')
    imageElement.src = heroUrl
    imageElement.style.width = '100%'
    modalMedia.appendChild(imageElement)
  }

  modal.style.display = 'block'
}

export const closeModal = () => {
  const modal = document.getElementById('modal')
  modal.style.display = 'none'
}
