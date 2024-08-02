export const navigation = () => {
  let currentRow = 0
  let currentCol = 0

  const rows = document.querySelectorAll('.container')

  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  const updateFocus = (row, col) => {
    rows.forEach((rowElement, rowIndex) => {
      const items = rowElement.querySelectorAll('.item')
      items.forEach((item, itemIndex) => {
        if (rowIndex === row && itemIndex === col) {
          item.classList.add('focus')
          const container = rowElement.querySelector('.items-container');
          const itemRect = item.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          if (!isInViewport(item)) {
            rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

            if (itemRect.right > containerRect.right || itemRect.left < containerRect.left) {
              const offset = itemRect.left - containerRect.left;
              container.scrollBy({ left: offset, behavior: 'smooth' });
            }
          }
        } else {
          item.classList.remove('focus')
        }
      })
    })
    if (!isInViewport(rows[row])) {
      rows[row].scrollIntoView({behavior: 'smooth', block: 'center'})
    }
  }

  const moveFocusUp = (currentRow, currentCol, rows) => {
    const currentItems = rows[currentRow].querySelectorAll('.item')
    const currentRect = currentItems[currentCol].getBoundingClientRect()

    currentRow -= 1
    const aboveItems = rows[currentRow].querySelectorAll('.item')
    let closestCol = 0
    let minDistance = Infinity

    aboveItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect()
      const distance = Math.abs(rect.left - currentRect.left)
      if (distance < minDistance) {
        minDistance = distance
        closestCol = index
      }
    })

    return { newRow: currentRow, newCol: closestCol }
  }

  const moveFocusDown = (currentRow, currentCol, rows) => {
    const currentItems = rows[currentRow].querySelectorAll('.item')
    const currentRect = currentItems[currentCol].getBoundingClientRect()

    currentRow += 1
    const belowItems = rows[currentRow].querySelectorAll('.item')
    let closestCol = 0
    let minDistance = Infinity

    belowItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect()
      const distance = Math.abs(rect.left - currentRect.left)
      if (distance < minDistance) {
        minDistance = distance
        closestCol = index
      }
    })

    return { newRow: currentRow, newCol: closestCol }
  }

  const moveFocus = (direction) => {
    const totalRows = rows.length
    const currentItems = rows[currentRow].querySelectorAll('.item')
    const totalCols = currentItems.length

    switch (direction) {
      case 'left':
        currentCol = (currentCol - 1 + totalCols) % totalCols
        break
      case 'right':
        currentCol = (currentCol + 1) % totalCols
        break
      case 'up':
        if (currentRow > 0) {
          const { newRow, newCol } = moveFocusUp(currentRow, currentCol, rows)
          currentRow = newRow
          currentCol = newCol
        }
        break
      case 'down':
        if (currentRow < totalRows - 1) {
          const { newRow, newCol } = moveFocusDown(currentRow, currentCol, rows)
          currentRow = newRow
          currentCol = newCol
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
        event.preventDefault()
        moveFocus('left')
        break
      case 'ArrowRight':
        event.preventDefault()
        moveFocus('right')
        break
      case 'ArrowUp':
        event.preventDefault()
        moveFocus('up')
        break
      case 'ArrowDown':
        event.preventDefault()
        moveFocus('down')
        break
      default:
        break
    }
  })

  updateFocus(currentRow, currentCol)
}
