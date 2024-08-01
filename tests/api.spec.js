import {fetchHomePageData} from '../api'

const mockFetch = (requestUrl) => {
  global.fetch = jest.fn((url) => {
    if (url === requestUrl) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: {
            StandardCollection: {
              containers: [
                {set: {}},
                {set: {}}
              ]
            }
          }
        })
      })
    } else {
      return Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({})
      })
    }
  })
}

describe('API', () => {
  const validUrl = 'https://cd-static.bamgrid.com/dp-117731241344/home.json'

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Should fetch home page data', () => {
    mockFetch(validUrl)

    fetchHomePageData().then((data) => {
      expect(data.data.StandardCollection.containers).toBeInstanceOf(Array)
      expect(data.data.StandardCollection.containers).toHaveLength(2)
    })
  })

  it('Should handle errors when fetching home page data', () => {
    mockFetch("not a valid url")

    return expect(fetchHomePageData()).rejects.toThrow('Could not fetch home data')
  })
})
