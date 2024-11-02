import LocationGallery from '../components/LocationGallery'

function GalleryPage() {
  return (
    <div>
        {/* Currently 1,2,3 to stand for id for testing cards
        Should be changed some other unique ids, the cards should also be replaced with actual card objects (see LocationCard for fields) */}
       <LocationGallery cards={["1","2","3"]}></LocationGallery>
    </div>
  )
}

export default GalleryPage