import React from 'react';


function Headline(props) {
  return (
        <div className='d-flex admin-headline'>
          <h4>{props.name} {props.area ? props.area : ''}</h4>
        </div>
  )
} 

export default Headline;
