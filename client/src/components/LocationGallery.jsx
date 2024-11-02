import Carousel from 'react-material-ui-carousel'
import LocationCard from './LocationCard';
import PropTypes from 'prop-types'

import testImg from '../assets/backrooms.png';

function generateCards(cards) {
    return cards.map((value) => 
        // replace by value.location, value.img, ..., where value is a card
        <LocationCard
                key={value}
                location="US"
                img={testImg}
                description={["Brightly lit", "Spacious", "Funny roommate"]}
        ></LocationCard>
    )
}

function LocationGallery(props) {
  return (
    <Carousel cycleNavigation="false">{ generateCards(props.cards) }</Carousel>
  )
}

LocationGallery.propTypes = {
    cards: PropTypes.array
}

LocationCard.propTypes = {
    location: PropTypes.string,
    img: PropTypes.string,
    description: PropTypes.array
};

export default LocationGallery