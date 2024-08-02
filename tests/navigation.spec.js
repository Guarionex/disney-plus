import {navigation} from '../navigation'
import {fireEvent} from '@testing-library/dom'
import '@testing-library/jest-dom'

describe('Navigation', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="container">
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
      </div>
      <div class="container">
        <div class="item">Item 3</div>
        <div class="item">Item 4</div>
      </div>
      <div class="container">
        <div class="item">Item 5</div>
        <div class="item">Item 6</div>
      </div>
    `
  })

  it('Should navigate left and right within a row', () => {
    navigation()

    const items = document.querySelectorAll('.item')

    expect(items[0]).toHaveClass('focused')

    fireEvent.keyDown(document, {key: 'ArrowRight'})
    expect(items[1]).toHaveClass('focused')

    fireEvent.keyDown(document, {key: 'ArrowLeft'})
    expect(items[0]).toHaveClass('focused')

    fireEvent.keyDown(document, {key: 'ArrowRight'})
    fireEvent.keyDown(document, {key: 'ArrowRight'})
    expect(items[0]).toHaveClass('focused')
  })

  it('Should navigate up and down between rows', () => {
    navigation()

    const items = document.querySelectorAll('.item')

    expect(items[0]).toHaveClass('focused')

    fireEvent.keyDown(document, {key: 'ArrowDown'})
    expect(items[2]).toHaveClass('focused')

    fireEvent.keyDown(document, {key: 'ArrowDown'})
    expect(items[4]).toHaveClass('focused')

    fireEvent.keyDown(document, {key: 'ArrowUp'})
    expect(items[2]).toHaveClass('focused')

    fireEvent.keyDown(document, {key: 'ArrowUp'})
    expect(items[0]).toHaveClass('focused')
  })
})
