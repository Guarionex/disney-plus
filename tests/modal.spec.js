import {loadModalHTML, openModal} from '../modal'
import {fireEvent, screen} from '@testing-library/dom'
import '@testing-library/jest-dom'
import fs from 'fs'
import path from 'path'

describe('Modal functionality', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="modal-container"></div>'

    const modalHTMLContent = fs.readFileSync(
      path.resolve(__dirname, '../modal.html'),
      'utf8'
    )

    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(modalHTMLContent)
      })
    )

    return loadModalHTML()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should open the modal with video', () => {
    openModal('Example Title', 'https://example.com/video.mp4', null)
    const modal = screen.getByRole('dialog')
    const modalTitle = screen.getByText('Example Title')
    const videoElement = document.querySelector('video')

    expect(modal).toBeVisible()
    expect(modalTitle).toBeInTheDocument()
    expect(videoElement).toBeInTheDocument()
    expect(videoElement).toHaveAttribute('src', 'https://example.com/video.mp4')
  })

  it('Should open the modal with image if no video', () => {
    openModal('Example Title', null, 'https://example.com/image.jpg')
    const modal = screen.getByRole('dialog')
    const modalTitle = screen.getByText('Example Title')
    const imageElement = screen.getByRole('img')

    expect(modal).toBeVisible()
    expect(modalTitle).toBeInTheDocument()
    expect(imageElement).toBeInTheDocument()
    expect(imageElement).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('Should close the modal on close button click', () => {
    openModal('Example Title', 'https://example.com/video.mp4', null)
    const closeButton = screen.getByText('×')
    const modal = screen.getByRole('dialog')

    fireEvent.click(closeButton)
    expect(modal).not.toBeVisible()
  })

  it('Should close the modal on escape key press', () => {
    openModal('Example Title', 'https://example.com/video.mp4', null)
    const modal = screen.getByRole('dialog')

    fireEvent.keyDown(document, {key: 'Escape', code: 'Escape'})
    expect(modal).not.toBeVisible()
  })
})
