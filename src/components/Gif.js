import React from 'react';
import Skeleton from 'react-loading-skeleton';

class Gif extends React.Component {
    constructor(props) {
        super(props);
        this.url = this.props.gif.url;
        this.title = this.props.gif.title;
        this.state = {
            loaded: false
        }
    }
    handleImageLoaded(){
        this.setState({
            loaded: true
        });
        console.log('imageLoaded');
    }

    handleImageErrored() {
        this.setState({ imageStatus: "failed to load" });
    }
    
    render() {
        return <React.Fragment>
            <img className={(this.state.loaded ? '' : 'hide') + 'item'} src={this.url} alt={this.title} onLoad={() => { this.handleImageLoaded() }} />
            {
                !this.state.loaded ? <Skeleton height={150} /> : ''
            }
        </React.Fragment>

    }
}
export default Gif;