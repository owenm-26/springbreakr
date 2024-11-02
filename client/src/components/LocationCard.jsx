import { Card, CardHeader, CardMedia, CardContent } from '@mui/material';
import { List, ListItem, ListItemText} from '@mui/material'

import PropTypes from 'prop-types'

// import { useDrag } from 'react-dnd'

function generateDescriptionList(description) {
    return description.map((value) =>
      <ListItem key={value}>
        <ListItemText>{value}</ListItemText>
      </ListItem>
    )
  }

function LocationCard(props) {
    // Some of the code from the drag and drop library. Please see documentation
    // const [{ opacity } , dragRef] = useDrag(
    //     () => ({
    //       type: ItemTypes.CARD,
    //       item: { text },
    //       collect: (monitor) => ({
    //         opacity: monitor.isDragging() ? 0.5 : 1
    //       })
    //     }),
    //     []
    //   )
    
    return (
        <div>
            <Card>
                <CardHeader>{props.location}</CardHeader>
                <CardMedia component="img" image={props.img}/>
                <CardContent>
                    <List>
                        {generateDescriptionList(props.description)}
                    </List>
                </CardContent>
            </Card>
        </div>
  )
}

LocationCard.propTypes = {
    location: PropTypes.string,
    img: PropTypes.string,
    description: PropTypes.array
};

export default LocationCard
