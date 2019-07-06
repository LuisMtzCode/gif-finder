import React from 'react';
import axios from 'axios';

// Components
import SearchBar from './components/SearchBar';
import Gif from './components/Gif';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gifs: [],
      pagination: 0,
      loading: false,
      value: '',
      tab: 1
    }
    this.API_KEY = 'h1yNE9XMwAdDAMPvU53Ohm85ieuai9OB';
    this.LIMIT = 10;
    this.timeout = null;
    this.isLoading = false;

    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
  }

  componentWillMount() {
    window.onscroll = ev => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && this.state.gifs.length && !this.state.loading) {
        if (!this.loading) {
          this.isLoading = true;
          var end = setInterval(() => {
            this.requestApi(this.state.value, true);
            console.log("Bottom of the page");
            this.loading = false;
            clearInterval(end);
          }, 1000);
        }
      }
    };
  }

  requestApi(value, scroll = false) {
    const offset = (scroll ? this.state.pagination * this.LIMIT : 0);
    var url = '';
    switch (this.state.tab) {
      case 1: //Search
        url = `search?api_key=${this.API_KEY}&q=${value}`;
        break;
      case 2: //Trending
        url = `trending?api_key=${this.API_KEY}`;
        break;
      default:
        break;
    }
    axios({
      cancelToken: this.source.token,
      method: 'GET',
      url: `https://api.giphy.com/v1/gifs/${url}&offset=${offset}&limit=${this.LIMIT}`,
    })
      .then(response => {
        const gifs = response.data.data.map(gif => {
          return {
            id: gif.id,
            title: gif.title,
            url: gif.images.fixed_width.url,
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
    this.setState({ loading: true });
    clearTimeout(this.timeout);
    var value = evt.target.value;
    this.timeout = setTimeout(() => {
      this.requestApi(value)
    }, 500);
  };

  active = evt => {
    const buttons = document.querySelectorAll('.tabs .tab');
    buttons.forEach(button => {
      button.classList.remove('active');
    });
    evt.target.className = 'tab active';
    const tab = parseInt(evt.target.getAttribute('tab'));
    this.setState({
      tab,
      gifs: [],
    }, () => {
      if (this.state.tab === 2) {
        this.requestApi('', false);
      }
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <h1>Gif Finder</h1>
          <div className="tabs">
            <button className="tab active" tab="1" onClick={evt => { this.active(evt) }}>Search</button>
            <button className="tab" tab="2" onClick={evt => { this.active(evt) }}>Trending</button>
          </div>
          {
            this.state.tab === 1 ?
              <SearchBar searchGif={this.searchGif} />
              :
              ''
          }
        </div>
        {
          this.state.loading ? (<div className="loading"><FontAwesomeIcon icon={faCircleNotch} className="fa-2x fa-spin" /></div>)
            :
            (
              <div className="masonry">{
                this.state.gifs.map(gif => {
                  return (<Gif key={gif.id} gif={gif} />)
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
