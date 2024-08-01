import {fetchHomePageData} from '../api'

describe('API', () => {
  it('Should fetch home page data', () => {
    fetchHomePageData().then((data) => {
      expect(data).toBeDefined()
    })
  })
})
