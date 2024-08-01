import {fetchHomePageData} from '../api'

const mockFetch = (requestResponseSet) => {
  global.fetch = jest.fn((url) => {
    const response = requestResponseSet.find(rrs => rrs.url === url && !!rrs.data)
    if (!!response) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(response.data)
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
  const validHomeUrl = 'https://cd-static.bamgrid.com/dp-117731241344/home.json'
  const validRefUrl1 = 'https://cd-static.bamgrid.com/dp-117731241344/sets/example-ref-id-1.json'
  const validRefUrl2 = 'https://cd-static.bamgrid.com/dp-117731241344/sets/example-ref-id-2.json'
  const homeResponse = {
    data: {
      StandardCollection: {
        containers: [
          {set: {refId: "example-ref-id-1"}},
          {set: {refId: "example-ref-id-2"}}
        ]
      }
    }
  }
  const refResponse1 = {
    data: {
      CuratedSet: {
        items: [
          {
            text: {title: {full: {series: {default: {content: 'Example Item Title 1'}}}}},
            image: {tile: {'1.78': {series: {default: {url: 'https://example.com/image1.jpg'}}}}}
          },
        ],
      },
    },
  }
  const refResponse2 = {
    data: {
      CuratedSet: {
        items: [
          {
            text: {title: {full: {series: {default: {content: 'Example Item Title 2'}}}}},
            image: {tile: {'1.78': {series: {default: {url: 'https://example.com/image2.jpg'}}}}}
          },
        ],
      },
    },
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Should fetch home page data with ref data', () => {
    mockFetch([
      {url: validHomeUrl, data: homeResponse},
      {url: validRefUrl1, data: refResponse1},
      {url: validRefUrl2, data: refResponse2}
    ])

    fetchHomePageData().then(({homeData, refDataMap}) => {
      expect(homeData.data.StandardCollection.containers).toHaveLength(2)
      expect(Object.keys(refDataMap)).toMatchObject(['example-ref-id-1', 'example-ref-id-2'])
      expect(refDataMap['example-ref-id-1'].data.CuratedSet.items).toHaveLength(1)
      expect(refDataMap['example-ref-id-2'].data.CuratedSet.items).toHaveLength(1)
    })
  })

  it('Should handle errors when fetching ref data', () => {
    mockFetch([
      {url: validHomeUrl, data: homeResponse},
      {url: validRefUrl1, data: null},
      {url: validRefUrl2, data: refResponse2}
    ])

    fetchHomePageData().then(({refDataMap}) => {
      expect(Object.keys(refDataMap)).toMatchObject(['example-ref-id-1', 'example-ref-id-2'])
      expect(refDataMap['example-ref-id-1']).toMatchObject({error: true})
      expect(refDataMap['example-ref-id-2'].data.CuratedSet.items).toHaveLength(1)
    })
  })

  it('Should handle errors when fetching home page data', () => {
    mockFetch([{url: "not a valid url"}])

    return expect(fetchHomePageData()).rejects.toThrow('Could not fetch home data')
  })
})
