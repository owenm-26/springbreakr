import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// This component should be a field/location for dragging and dropping
// For second page
function LocationField() {
  return (
    <DndProvider backend={HTML5Backend}>...</DndProvider>
  )
}

export default LocationField