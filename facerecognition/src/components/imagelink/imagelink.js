import React from 'react';
import './imagelink.css';

const ImageLink = (props) => {
    return(
        <div>
            <p className='f3'>
                {'This magic brain will detect faces in your picture.Give it a try.'}
            </p>
            <div className='form w-50 center pa4 br3 shadow-5'>
                <input className='f4 pa2 w-60 center' type='text' onChange={props.onInputChange} />
                <button className='w-40 center grow f4 link ph3 pv2 dib white bg-light-purple'
                        onClick={props.onSubmit}>
                Detect
                </button>
            </div>        
        </div>    
    );
}

export default ImageLink;