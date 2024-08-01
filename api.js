export const fetchHomePageData = () => {
  return fetch('https://cd-static.bamgrid.com/dp-117731241344/home.json')
    .then(response => response.json())
}
