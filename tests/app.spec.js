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
              text: {title: {full: {series: {default: {content: 'Example Item Title 1'}}}}},
              image: {tile: {'1.78': {series: {default: {url: 'https://example.com/image1.jpg'}}}}}
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
    const title = screen.getByText('Example Item Title 1')
    const errorTile = screen.getByText('Error loading data')


    expect(container1).toBeInTheDocument()
    expect(container2).toBeInTheDocument()
    expect(title).toBeInTheDocument()
    expect(errorTile).toBeInTheDocument()
  })
})
