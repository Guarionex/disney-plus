import {fetchHomePageData} from "./api"

document.addEventListener('DOMContentLoaded', () => {
  fetchHomePageData()
    .then(({homeData, refDataMap}) => renderHomePage(homeData, refDataMap))
})

const isHomeDataPopulated = homeData => !!homeData.data && !!homeData.data.StandardCollection && !!homeData.data.StandardCollection.containers

export const renderHomePage = (homeData, refDataMap) => {
  const appContainer = document.getElementById('app-container')

  if (isHomeDataPopulated(homeData)) {
    homeData.data.StandardCollection.containers.forEach(container => {
      const containerElement = document.createElement('div')

      const titleElement = document.createElement('h2')
      titleElement.textContent = container.set.text.title.full.set.default.content
      containerElement.appendChild(titleElement)

      if (container.set.refId) {
        const refData = refDataMap[container.set.refId]
        if (refData.error) {
          renderErrorTile(containerElement)
        } else {
          renderRefDataTile(refData, containerElement)
        }
      }

      appContainer.appendChild(containerElement)
    })
  }
}

const isRefDataPopulated = refData => !!refData.data && !!refData.data.CuratedSet && !!refData.data.CuratedSet.items

const renderRefDataTile = (refData, containerElement) => {
  if(isRefDataPopulated(refData)) {
    refData.data.CuratedSet.items.forEach(item => {
      const itemElement = document.createElement('div')

      const itemTitleElement = document.createElement('p')
      itemTitleElement.textContent = item.text.title.full.series.default.content
      itemElement.appendChild(itemTitleElement)

      const imageUrl = item.image.tile['1.78'].series.default.url
      const imageElement = document.createElement('img')
      imageElement.src = imageUrl
      itemElement.appendChild(imageElement)

      containerElement.appendChild(itemElement)
    })
  }
}

const renderErrorTile = (containerElement) => {
  const errorElement = document.createElement('div')
  errorElement.textContent = 'Error loading data'

  containerElement.appendChild(errorElement)
}
