import React from 'react';
import './inputimage.css';
const InputImage = (props) => {
    return(
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id ='inputimage' src={props.imageUrl} alt='' width='500px' height='500px' />
                <div className='bounding_box' style={{top:props.box.topRow, left:props.box.leftCol, bottom:props.box.bottomRow,right:props.box.rightCol}}>
                </div>     
            </div>           
        </div>    
    );
}

export default InputImage;