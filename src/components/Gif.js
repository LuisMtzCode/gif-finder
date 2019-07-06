import React from 'react';

const Gif = ({ gif, handleImageLoaded, index }) => {
    // console.log(index);
    return  <img className="item" src={gif.url} alt={gif.title}  onLoad={()=>{ handleImageLoaded(index) }}/>
    // gif.loaded ? 
    //  (
    //     <img className="item" src={gif.url} alt={gif.title}  onLoad={()=>{ handleImageLoaded(index) }}/>
    //  )
    //  :
    //  (<h4>No carga todavía</h4>)
}
export default Gif;