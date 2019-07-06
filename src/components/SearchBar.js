import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'


const SearchBar = ({ searchGif }) => {
    return(
    <div className="search">
        <input type="text" className="search-input" onChange={evt => {searchGif(evt)} }/>
        <FontAwesomeIcon icon={faSearch} className="search-icon"/>
    </div>
  );
}
export default SearchBar;