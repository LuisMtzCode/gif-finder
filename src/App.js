import React from 'react';
import axios from 'axios';

// Components
import SearchBar from './components/SearchBar';
import Gif from './components/Gif';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      gifs: [],
      pagination: 0,
      loading: false,
      value: ''
    }
    this.API_KEY = 'h1yNE9XMwAdDAMPvU53Ohm85ieuai9OB';
    this.LIMIT = 10;
    this.timeout = null;
    this.isLoading = false;

    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
  }

  componentWillMount(){
    window.onscroll = ev => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && this.state.gifs.length && !this.state.loading) {
        if(!this.loading){
          this.isLoading = true;
          var end = setInterval(() => {
            this.requestApi(this.state.value, true);
            console.log("Bottom of the page");
            this.loading = false;
            clearInterval(end);
          } ,1000);
        }
      }
    };
  }

  requestApi(value, scroll = false){
    const offset = (scroll ? this.state.pagination * this.LIMIT : 0);
    axios({
      cancelToken: this.source.token,
      method: 'GET',
      url: `https://api.giphy.com/v1/gifs/search?api_key=${this.API_KEY}&q=${value}&offset=${offset}&limit=${this.LIMIT}`,
    })
    .then(response => {
      const gifs = response.data.data.map(gif => {
          return {
            title: gif.title,
            url: gif.images.fixed_width.url,
            loaded: false
          }
      });
      
      const gif_state = (scroll ? [...this.state.gifs, ...gifs] : gifs);
      const pagination = this.state.pagination + 1;
      console.log(gif_state);
      
      this.setState({
        gifs: gif_state,
        loading: false,
        value: value,
        pagination: pagination
      });
    })
    .catch(e => {
      if (axios.isCancel(e)) {
        console.log('Request canceled', e.message);
      } else {
        // handle error
        console.error('Error API GIPHY', e);
      }
    }
    );
  }

  searchGif = (evt) => {
    this.setState({loading : true});
    clearTimeout(this.timeout);
    var value = evt.target.value;
    this.timeout = setTimeout(() => { 
      this.requestApi(value)
    }, 500);
  };

  handleImageLoaded = index => {
    // const gifs = this.state.gifs;
    // gifs[index].loaded = true;
    // this.setState({
    //   gifs
    // });
    // console.log('imageLoaded');
  }

  handleImageErrored() {
    this.setState({ imageStatus: "failed to load" });
  }

  render(){
    return (
      <React.Fragment>
        <div className="container">
          <h1>Gif Finder</h1>
          <SearchBar searchGif={this.searchGif} />
        </div>
        {
          this.state.loading ? (<div className="loading"><FontAwesomeIcon icon={faSpinner} className="fa-2x fa-spin"/></div>) 
          :
          (
          <div className="masonry">{
            this.state.gifs.map((gif, index) => {
              return (<Gif key={index} gif={gif} handleImageLoaded={this.handleImageLoaded} index={index}/>)
            })
          }
          </div>
          )
        }
      </React.Fragment>
    );
  }
}

export default App;
