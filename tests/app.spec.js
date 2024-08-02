import {renderHomePage} from '../app'
import {fireEvent, screen, waitFor} from '@testing-library/dom'
import '@testing-library/jest-dom'

jest.mock('../api')

describe('App', () => {
  const homeData = {
    data: {
      StandardCollection: {
        containers: [
          {set: {refId: 'example-ref-id-1', text: {title: {full: {set: {default: {content: 'Container 1'}}}}}}},
          {set: {refId: 'example-ref-id-2', text: {title: {full: {set: {default: {content: 'Container 2'}}}}}}},
          {
            set: {
              items: [
                {
                  collectionId: 'example-collection-id',
                  text: {title: {full: {collection: {default: {content: 'Example collection Title'}}}}},
                  image: {tile: {'1.78': {default: {default: {url: 'https://example.com/image3.jpg'}}}}}
                }
              ],
              text: {title: {full: {set: {default: {content: 'Container without refId'}}}}}
            }
          }
        ]
      }
    }
  }
  const refDataMap = {
    'example-ref-id-1': {
      data: {
        CuratedSet: {
          items: [
            {
              seriesId: 'example-series-id',
              text: {title: {full: {series: {default: {content: 'Example Item Title 1'}}}}},
              image: {tile: {'1.78': {series: {default: {url: 'https://example.com/image1.jpg'}}}}}
            },
            {
              programId: 'example-program-id',
              text: {title: {full: {program: {default: {content: 'Example Item Title 2'}}}}},
              image: {tile: {'1.78': {program: {default: {url: 'https://example.com/image2.jpg'}}}}}
            }
          ]
        }
      }
    },
    'example-ref-id-2': {error: true}
  }
  const homeDataWithVideoFallback = {
    data: {
      StandardCollection: {
        containers: [
          {
            set: {
              items: [
                {
                  seriesId: 'example-series-id',
                  text: {title: {full: {series: {default: {content: 'Item with Video Fallback'}}}}},
                  image: {tile: {'1.78': {series: {default: {url: 'https://example.com/invalid-image.jpg'}}}}},
                  videoArt: [{mediaMetadata: {urls: [{url: 'https://example.com/video-fallback.mp4'}]}}]
                }
              ],
              text: {title: {full: {set: {default: {content: 'Container with Video Fallback'}}}}}
            }
          }
        ]
      }
    }
  }
  const homeDataImagesSizes = {
    data: {
      StandardCollection: {
        containers: [{
          set: {
            items: [
              {
                seriesId: 'example-series-id',
                text: {title: {full: {series: {default: {content: 'Series Title'}}}}},
                image: {
                  tile: {
                    '2.29': {series: {default: {url: 'https://example.com/image2.29.jpg'}}},
                    '1.78': {series: {default: {url: 'https://example.com/image1.78.jpg'}}}
                  }
                }
              },
              {
                programId: 'example-program-id',
                text: {title: {full: {program: {default: {content: 'Program Title'}}}}},
                image: {
                  tile: {
                    '1.78': {program: {default: {url: 'https://example.com/image1.78.jpg'}}},
                    '1.33': {program: {default: {url: 'https://example.com/image1.33.jpg'}}}
                  }
                }
              },
              {
                collectionId: 'example-collection-id',
                text: {title: {full: {collection: {default: {content: 'Collection Title'}}}}},
                image: {
                  tile: {
                    '1.00': {default: {default: {url: 'https://example.com/image1.00.jpg'}}},
                    '0.75': {default: {default: {url: 'https://example.com/image0.75.jpg'}}}
                  }
                }
              }
            ],
            text: {title: {full: {set: {default: {content: 'Container without refId'}}}}}
          }
        }]
      }
    }
  }

  beforeEach(() => {
    document.body.innerHTML = '<div id="app-container"></div>'
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should render home and ref data', () => {
    renderHomePage(homeData, refDataMap)

    const container1 = screen.getByText('Container 1')
    const container2 = screen.getByText('Container 2')
    const title1 = screen.getByText('Example Item Title 1')
    const title2 = screen.getByText('Example Item Title 2')
    const errorTile = screen.getByText('Error loading data')
    const containerWithoutRefId = screen.getByText('Container without refId')
    const itemWithoutRefId = screen.getByText('Example collection Title')


    expect(container1).toBeInTheDocument()
    expect(container2).toBeInTheDocument()
    expect(title1).toBeInTheDocument()
    expect(title2).toBeInTheDocument()
    expect(errorTile).toBeInTheDocument()
    expect(containerWithoutRefId).toBeInTheDocument()
    expect(itemWithoutRefId).toBeInTheDocument()
  })

  it('Should use video URL as fallback when image URL is not available', async () => {
    renderHomePage(homeDataWithVideoFallback, {})

    const container = screen.getByText('Container with Video Fallback')
    const itemTitle = screen.getByText('Item with Video Fallback')
    const imageElement = screen.getByRole('img', {name: 'Item with Video Fallback'})
    expect(imageElement).toHaveAttribute('src', 'https://example.com/invalid-image.jpg')

    fireEvent.error(imageElement)

    await waitFor(() => {
      const videoElement = document.querySelector('video')
      expect(videoElement).toHaveAttribute('src', 'https://example.com/video-fallback.mp4')
      expect(videoElement).toHaveAttribute('autoplay')
      expect(videoElement).toHaveAttribute('loop')
    })

    expect(container).toBeInTheDocument()
    expect(itemTitle).toBeInTheDocument()
  })

  it('Should prioritize 1.78 image size if available, else fall back to other sizes', () => {
    renderHomePage(homeDataImagesSizes, {})

    const seriesImage = screen.getByAltText('Series Title')
    const programImage = screen.getByAltText('Program Title')
    const collectionImage = screen.getByAltText('Collection Title')

    expect(seriesImage.src).toBe('https://example.com/image1.78.jpg')
    expect(programImage.src).toBe('https://example.com/image1.78.jpg')
    expect(collectionImage.src).toBe('https://example.com/image1.00.jpg')
  })
})
