export const fetchHomePageData = () => {
  return fetch('https://cd-static.bamgrid.com/dp-117731241344/home.json')
    .then(response => {
      if(response.ok) {
        return response.json()
      } else {
        throw new Error('Could not fetch home data')
      }
    })
    .then(homeData => {
      return fetchRefData(homeData)
        .then(refDataMap => ({homeData, refDataMap}))
    })
}

const fetchRefData = (homeData) => {
  const refDataMap = {}
  const refSetPromises = homeData.data.StandardCollection.containers.map(container => {
    if(!!container.set.refId) {
      const refId = container.set.refId

      return fetch(`https://cd-static.bamgrid.com/dp-117731241344/sets/${refId}.json`)
        .then(response => {
          if(response.ok) {
            return response.json()
          } else {
            throw new Error(`Could not fetch ref data for ${refId}`)
          }
        })
        .then(refSetData => {
          refDataMap[refId] = refSetData
        })
        .catch(() => {
          refDataMap[refId] = {error: true}
        })
    }

    return Promise.resolve()
  })

  return Promise.all(refSetPromises).then(() => refDataMap)
}
