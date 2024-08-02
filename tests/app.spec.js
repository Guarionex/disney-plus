import {renderHomePage} from '../app'
import {screen} from '@testing-library/dom'
import '@testing-library/jest-dom'

jest.mock('../api')

describe('App', () => {
  const homeData = {
    data: {
      StandardCollection: {
        containers: [
          {set: {refId: 'example-ref-id-1', text: {title: {full: {set: {default: {content: 'Container 1'}}}}}}},
          {set: {refId: 'example-ref-id-2', text: {title: {full: {set: {default: {content: 'Container 2'}}}}}}}
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
              text: { title: { full: { program: { default: { content: 'Example Item Title 2' } } } } },
              image: { tile: { '1.78': { program: { default: { url: 'https://example.com/image2.jpg' } } } } }
            }
          ]
        }
      }
    },
    'example-ref-id-2': {error: true}
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


    expect(container1).toBeInTheDocument()
    expect(container2).toBeInTheDocument()
    expect(title1).toBeInTheDocument()
    expect(title2).toBeInTheDocument()
    expect(errorTile).toBeInTheDocument()
  })
})
