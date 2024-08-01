export const fetchHomePageData = () => {
  return fetch('https://cd-static.bamgrid.com/dp-117731241344/home.json')
    .then(response => {
      if(response.ok) {
        return response.json()
      } else {
        throw new Error('Could not fetch home data')
      }
    })
}
