import React, {PropTypes, Fragment, useState} from 'react';
import '../App.css';
// import {Typeahead} from 'react-bootstrap-typeahead';
import {InputGroup, Button, FormControl} from 'react-bootstrap'
import {db} from './Firestore'
import {
	withRouter
} from 'react-router-dom';

function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  // Directly return the joined string
  return splitStr.join(' '); 
}

export class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      selected: [],
    };
  }

  _renderMenuItemChildren = (option,props,index) => {
      return (
        <div>
          <div class="row">
            <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
              {/* <img style={{"width":"20px"}} src={logo} alt="logo"/> */}
            </div>
            <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
              <div>{option.name}</div>
            </div>
            <div class="col-xs-10 col-sm-10 col-md-10 col-lg-10">
            </div>
          </div>
        </div>
      )
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({[name]: value});
  }

  searchBox(){
    return(
      <input onChange={this.handleChange} value={this.state.postal} type="number" class="form-control" name="postal" placeholder="Enter Your Postal Code"></input>
      )
  }

  async getPostal () {
    let data = await this.callPostal()
    this.setState({street:data['ADDRESS'],
                  longitude:data['LONGITUDE'],
                  latitude:data['LATITUDE']
                })
  }

  callPostal = async () =>{
    return await fetch('https://developers.onemap.sg/commonapi/search?searchVal='+this.state.postal+'&returnGeom=Y&getAddrDetails=Y').then(function(response) {
      return response.json();
    }).then(function(jsonResponse) {
      // console.log(jsonResponse['results'])
      return jsonResponse['results'][0]
      //Success message
    },(error)=>{
      console.log(error)
    })
  }

  handleClick = async (event) => {
    event.preventDefault();
    await this.getPostal()
    this.props.history.push({
      pathname: '/nearby',
      search: '?postal='+this.state.postal
      +'&lng='+this.state.longitude
      +'&lat='+this.state.latitude
      +'&street='+this.state.street
      +'&distance=3'
      // state: { detail: response.data }
    })
    // this.props.history.push('/listing')
  }

  handleSubmit = (event) => {
    event.preventDefault();
    alert("You selected: "+this.state.selected[0].name)
  }

  render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <div class="row">
            <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
            </div>
            <div class="col-xs-10 col-sm-10 col-md-10 col-lg-10">
              <InputGroup className="">
                <div class="shadow-lg" style={{"width":"80%"}}>
                  {this.searchBox()}
                </div>
                <InputGroup.Append style={{"width":"20%"}}>
                  <Button class="shadow-sm" type="submit" variant="outline-secondary" onClick={this.handleClick}>Search</Button>
                </InputGroup.Append>
              </InputGroup>
            </div>
            <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                      {/* {this.state.selected.length > 0?this.state.selected[0].name:null} */}
            </div>
          </div>
        </form>
      )
  }
}

  export default withRouter(Search)