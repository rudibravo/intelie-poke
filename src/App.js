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
    this.handleClick = this.handleClick.bind(this);
  }

  handlePrevious(e) {
    this.props.onPaginator(this.props.currentPage - 1);
  }

  handleNext(e) {
    this.props.onPaginator(this.props.currentPage + 1);
  }

  handleClick(number, e) {
    this.props.onPaginator(number);
  }

  shouldRender(number, current, max) {
    var result = number < 4 || number > max - 3 || Math.abs(number - current) < 2 || (number < 7 && current < 6) || (number > max - 6 && current > max - 5);
    return result;
  }

  render() {

    const pageNumbers = [];
    for (let i = 1; i <= this.props.count; i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.filter(number => {
      return this.shouldRender(number, this.props.currentPage, this.props.count);
    }).map(number => {
      let itemClick = this.handleClick.bind(this, number);
      return (
        <li key={number} 
          className={ this.props.currentPage === number ? 'active': '' }>
          {(this.props.currentPage !== number) && this.props.clickable ? <a href="#" onClick={itemClick}>{number}</a> : <a>{number}</a>}
        </li>
      );
    });

    return (
      <div className="PokePaginator">
        <nav>
          <ul>
            {(this.props.currentPage > 0) && this.props.clickable ? <li><a href="#" onClick={this.handlePrevious}>«</a></li>: <li><a>«</a></li>}
            {renderPageNumbers}
            {(this.props.currentPage < this.props.count) && this.props.clickable ? <li><a href="#" onClick={this.handleNext}>»</a></li> : <li><a>»</a></li>}
          </ul>
        </nav>
        
      </div>
    )
  }
}

class PokeList extends Component {
  constructor(props) {
    super(props);
    
    this.onPokemonSelected = this.onPokemonSelected.bind(this);
    
  }

  onPokemonSelected(url) {
    this.props.onPokemonSelected(url);
  }
 
  render() {
    const pokelist = this.props.data.map(p => 
      <PokeListItem key={p.name} value={p} onPokemonSelected={this.props.onPokemonSelected} />
    );

    return (
      <div className="PokeList">
        <div className="PokeListItems">
          <ul>
            {pokelist}
          </ul>
        </div>
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
    this.handlePaginator = this.handlePaginator.bind(this);
    this.state = { pokeUrl: null, data: [], url: 'http://pokeapi.co/api/v2/pokemon/?offset=', currentPage: 1, paginatorEnabled: false };
  }

  fetchData() {
    this.setState({paginatorEnabled: false})
    fetch(this.state.url + ((this.state.currentPage-1)*20))
      .then( response => response.json())
      .then( json => {
        this.setState({data: json.results, count: json.count, paginatorEnabled: true})
      })
  }

   componentDidUpdate(prevProps, prevState){
    if (prevState.currentPage !== this.state.currentPage) {
      this.fetchData();  
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  handlePaginator(offset) {
    this.setState({currentPage: offset});
  }

  onPokemonSelected(url) {
    this.setState({pokeUrl: url});
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src="poke.png" className="App-logo" alt="logo" />
          <h2>Pokepedia</h2>
        </div>
        <PokePaginator count='40' currentPage={this.state.currentPage} onPaginator={this.handlePaginator} clickable={this.state.paginatorEnabled}/>
        <div className="Content">
          <PokeList onPokemonSelected={this.onPokemonSelected} data={this.state.data} />
          <PokeDetails url={this.state.pokeUrl} />
        </div>
      </div>
    );
  }
}

export default App;
