export const navigation = () => {
  let currentRow = 0
  let currentCol = 0

  const rows = document.querySelectorAll('.container')

  const updateFocus = (row, col) => {
    const currentItems = rows[row].querySelectorAll('.item')
    currentItems.forEach(item => item.classList.remove('focused'))
    currentItems[col].classList.add('focused')
  }

  const moveFocus = (direction) => {
    const totalRows = rows.length
    const totalCols = rows[currentRow].querySelectorAll('.item').length

    switch (direction) {
      case 'left':
        currentCol = (currentCol - 1 + totalCols) % totalCols
        break
      case 'right':
        currentCol = (currentCol + 1) % totalCols
        break
      case 'up':
        currentRow = (currentRow - 1 + totalRows) % totalRows
        const itemsInRowAbove = rows[currentRow].querySelectorAll('.item').length
        if (currentCol >= itemsInRowAbove) {
          currentCol = itemsInRowAbove - 1
        }
        break
      case 'down':
        currentRow = (currentRow + 1) % totalRows
        const itemsInRowBelow = rows[currentRow].querySelectorAll('.item').length
        if (currentCol >= itemsInRowBelow) {
          currentCol = itemsInRowBelow - 1
        }
        break
      default:
        break
    }

    updateFocus(currentRow, currentCol)
  }

  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        moveFocus('left')
        break
      case 'ArrowRight':
        moveFocus('right')
        break
      case 'ArrowUp':
        moveFocus('up')
        break
      case 'ArrowDown':
        moveFocus('down')
        break
      default:
        break
    }
  })

  updateFocus(currentRow, currentCol)
}
