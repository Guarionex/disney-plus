import {fetchHomePageData} from "./api.js"

document.addEventListener('DOMContentLoaded', () => {
  fetchHomePageData()
    .then(({homeData, refDataMap}) => renderHomePage(homeData, refDataMap))
})

const isHomeDataPopulated = homeData => !!homeData.data && !!homeData.data.StandardCollection && !!homeData.data.StandardCollection.containers
const isRefDataPopulated = refData => !!refData.data && !!refData.data.CuratedSet && !!refData.data.CuratedSet.items

export const renderHomePage = (homeData, refDataMap) => {
  const appContainer = document.getElementById('app-container')

  if (isHomeDataPopulated(homeData)) {
    homeData.data.StandardCollection.containers.forEach(container => {
      const containerElement = document.createElement('div')
      containerElement.className = 'container'

      const titleElement = document.createElement('h2')
      titleElement.textContent = container.set.text.title.full.set.default.content
      containerElement.appendChild(titleElement)

      const itemsContainer = document.createElement('div')
      itemsContainer.classList.add('items-container')

      if (!!container.set.refId) {
        const refData = refDataMap[container.set.refId]
        if (refData.error) {
          renderErrorTile(itemsContainer)
        } else if (isRefDataPopulated(refData)) {
          renderDataTile(refData.data.CuratedSet.items, itemsContainer)
        }
      } else if (container.set.items) {
        renderDataTile(container.set.items, itemsContainer)
      }

      containerElement.appendChild(itemsContainer)
      appContainer.appendChild(containerElement)
    })
  }
}

const getItemContent = (item) => {
  if (item.seriesId) {
    return {
      type: 'series',
      title: item.text.title.full.series.default.content,
      imageUrl: item.image.tile['1.78'].series.default.url,
      video: item.videoArt?.[0]?.mediaMetadata.urls[0].url
    }
  } else if (item.programId) {
    return {
      type: 'program',
      title: item.text.title.full.program.default.content,
      imageUrl: item.image.tile['1.78'].program.default.url,
      video: item.videoArt?.[0]?.mediaMetadata.urls[0].url
    }
  } else if (item.collectionId) {
    return {
      type: 'collection',
      title: item.text.title.full.collection.default.content,
      imageUrl: item.image.tile['1.78'].default.default.url,
      video: item.videoArt?.[0]?.mediaMetadata.urls[0].url
    }
  }
  return null
}

const renderDataTile = (items, itemContainer) => {
  items.forEach(item => {
    const itemContent = getItemContent(item)
    const itemElement = document.createElement('div')
    itemElement.className = 'item'

    const itemTitleElement = document.createElement('p')
    itemTitleElement.textContent = itemContent.title
    itemElement.appendChild(itemTitleElement)

    const imageUrl = itemContent.imageUrl
    const imageElement = document.createElement('img')
    imageElement.src = imageUrl
    imageElement.alt = itemContent.title
    itemElement.appendChild(imageElement)

    imageElement.onerror = () => {
      if (!!itemContent.video) {
        const videoElement = document.createElement('video')
        videoElement.src = itemContent.video
        videoElement.alt = itemContent.title
        videoElement.autoplay = true
        videoElement.muted = true
        videoElement.loop = true
        itemElement.replaceChild(videoElement, imageElement)
      }
    }

    itemContainer.appendChild(itemElement)
  })
}

const renderErrorTile = (itemContainer) => {
  const errorElement = document.createElement('div')
  errorElement.textContent = 'Error loading data'

  itemContainer.appendChild(errorElement)
}
