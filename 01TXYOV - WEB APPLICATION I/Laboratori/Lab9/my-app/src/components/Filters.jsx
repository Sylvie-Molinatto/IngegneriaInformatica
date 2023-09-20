import {ListGroup} from 'react-bootstrap/';
import { NavLink } from 'react-router-dom';

/**
 * This components requires:
 * - the list of filters labels to show, 
 * - the filter that is currenctly selected 
 * - the handler to notify a new selection
 */ 
const RouteFilters = (props) => {
  const { items, selected } = props;

  // Converting the object into an array to use map method
  const filterArray = Object.entries(items);

  return (
    <ListGroup as="ul" variant="flush">
      {
        filterArray.map(([filterName, { label, url }]) => {
          return (
            <NavLink className="list-group-item" key={filterName} to={url} style={{ textDecoration: 'none' }}>
                {label}
            </NavLink>
          );
        })
      }
    </ListGroup>
  )
}

export { RouteFilters };
