import React, { Component } from 'react';
import './App.css';

class PokeListItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onPokemonSelected(this.props.value.url);
  }

  render() {
    return (
      <li key={this.props.value.name}> 
        <a href="#" onClick={this.handleClick} >{this.props.value.name}</a> 
      </li>
    )
  }
}

class PokePaginator extends Component {
  constructor(props) {
    super(props)
    this.handleNext = this.handleNext.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
  }

  handlePrevious(e) {
    this.props.onPaginator(this.props.previous);
  }

  handleNext(e) {
    this.props.onPaginator(this.props.next);
  }

  render() {
    return (
      <div className="PokePaginator">
        {this.props.previous && this.props.clickable ? <a href="#" onClick={this.handlePrevious}> &lt;&lt; </a> : <a> &lt;&lt; </a>}
        {this.props.next && this.props.clickable ? <a href="#" onClick={this.handleNext}> &gt;&gt; </a> : <a> &gt;&gt; </a>}
      </div>
    )
  }
}

class PokeList extends Component {
  constructor(props) {
    super(props);
    this.handlePaginator = this.handlePaginator.bind(this);
    this.onPokemonSelected = this.onPokemonSelected.bind(this);
    this.state = { data: [], url: 'http://pokeapi.co/api/v2/pokemon/', paginatorEnabled: false };
  }

  componentDidUpdate(prevProps, prevState){
    if (prevState.url !== this.state.url) {
      this.fetchData();  
    }
  }

  fetchData() {
    this.setState({paginatorEnabled: false})
    fetch(this.state.url)
      .then( response => response.json())
      .then( json => {
        this.setState({data: json.results, previous: json.previous, next: json.next, paginatorEnabled: true})
      })
  }

  componentDidMount() {
    this.fetchData();
  }

  handlePaginator(url) {
    this.setState({url: url});
  }

  onPokemonSelected(url) {
    this.props.onPokemonSelected(url);
  }
 
  render() {
    const pokelist = this.state.data.map(p => 
      <PokeListItem key={p.name} value={p} onPokemonSelected={this.props.onPokemonSelected} />
    );

    return (
      <div className="PokeList">
        <div className="PokeListItems">
          <ul>
            {pokelist}
          </ul>
        </div>
        <PokePaginator clickable={this.state.paginatorEnabled} offset={this.state.offset} next={this.state.next} previous={this.state.previous} onPaginator={this.handlePaginator} />
      </div>
        
    )
  }
}

class PokeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {img: 'qm.png'};
  }

  componentDidUpdate(prevProps, prevState){
    if (prevProps.url !== this.props.url) {
      this.fetchData();  
    }
  }

  fetchData() {
    fetch(this.props.url)
      .then( response => response.json())
      .then( json => {
        this.setState({img: json.sprites.front_default, name: json.name, baseExperience: json.base_experience, height: json.height, weight: json.weight})
      })
  }

  render() {
    return (
      <div className="PokeDetails">
        <img src={this.state.img} alt="Choose your pokemon" />
        <h2>{this.state.name}</h2>
        <div className="PokeDetailsTable">
          <div className="PokeDetailsRow">
            <div className="PokeDetailsCell">Base Experience:</div>
            <div className="PokeDetailsCell">{this.state.baseExperience}</div>
          </div>
          <div className="PokeDetailsRow">
            <div className="PokeDetailsCell">Height: </div>
            <div className="PokeDetailsCell">{this.state.height}</div>
          </div>
          <div className="PokeDetailsRow">
            <div className="PokeDetailsCell">Weight:</div>
            <div className="PokeDetailsCell">{this.state.weight}</div>
          </div>
        </div>
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.onPokemonSelected = this.onPokemonSelected.bind(this);
    this.state = { pokeUrl: null }
  }

  onPokemonSelected(url) {
    console.log(">>> " + url);
    this.setState({pokeUrl: url});
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src="poke.png" className="App-logo" alt="logo" />
          <h2>Pokepedia</h2>
        </div>
        <div className="Content">
          <PokeList onPokemonSelected={this.onPokemonSelected} />
          <PokeDetails url={this.state.pokeUrl} />
        </div>
      </div>
    );
  }
}

export default App;
