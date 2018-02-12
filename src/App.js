import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import JobList from "./components/jobList"
import LocationView from "./components/locationView"

class App extends Component {
  state = {
    page: "initial",
    latitude: null,
    longitude: null,
    signedIn: false,
    displaySearchCategory: false,
    category: "",
  }

  setPageTo = (page, callback) =>{
    if(this.state.signedIn){
      return (
        (...args) => (
          (e) => {
            this.setState({page: page})
            if (callback){
              callback(...args)
            }
          }
        )
      )
    } else {
      return ()=> {}
    }
  }

  setLatLng = (lat,long) => {
    this.setState({latitude: lat, longitude: long})
  }

  signOut = () => {
    this.setState({signedIn: false, user: null, page: "initial"})
  }

  signIn = () => {
    this.setState({signedIn: true, user: {name: "Drive Name Placeholder", profileImg:"https://www.slikouronlife.co.za/themes/slikourapp/assets/images/xartist-placeholder.png.pagespeed.ic.Fr7-YW7Gll.png", jobNumber: null}})
  }

  selectJob = (jobNumber) => (
    (e)=> {
      this.setState({user:{...this.state.user, jobNumber: jobNumber }})
    }
  )

  onFocusSearchBar = (e) => {
    this.setState({displaySearchCategory: true})
  }

  setCategory = (category) => (
    (e) => {
      this.setState({category: category, displaySearchCategory: false})
    }
  )

  renderSearchCategory(){
    const categories = ["Food", "Cafes", "Car Repair", "Parking", "Gas Station"]
    return (
      <div className="search-categories">
        <div>Suggested Categories</div>
        <div className="selection">
          {
            categories.map(function(category){
              return (
                <div key={`category-${category}`} className="search-category" onClick={this.setCategory(category)}>{category}</div>
              )
            }, this)
          }
        </div>
      </div>
    )
  }

  renderContent(){
    const {page, latitude, longitude, signedIn, user, displaySearchCategory, category} = this.state
    if (page == "jobList"){
      return (
      <div className="job-lists-wrapper">
        <div className="section-title">Jobs Available</div>
        <JobList goToLocationView={this.setPageTo("locationView", this.setLatLng )} selectJob={this.selectJob} />
      </div>)
    } else if (page == "locationView"){
      return (
        <div>
          <input type="text" id="search-bar" onFocus={this.onFocusSearchBar} value={category}></input>
          {
            !displaySearchCategory 
            ? null
            : this.renderSearchCategory()
          }
          <LocationView latitude={latitude} longitude={longitude} category={category}/>
          <div id="user-profile">
            <img src={user.profileImg}></img>
            <div className="user-details">
              <div>{user.name}</div>
              <div>Job Number: &nbsp; {user.jobNumber}</div>
            </div>
          </div>
        </div>
      )
    }else {
      return (
        <div>
          <img id="logo" src="http://startupjobs.asia/images/company/400/138691-Haulio-Logo.png" onClick={this.setPageTo("jobList")()}/>
          {
            !signedIn 
            ? <div 
              id="google-sign-in-btn"
              onClick={this.signIn}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Google-favicon-2015.png/150px-Google-favicon-2015.png"></img> 
              &nbsp;&nbsp;
              Sign in With Google
            </div>
            : null
          }
        </div>
      )
    }
  }

  render() {
    return (
      <div className="App">
        <header>
          {!this.state.signedIn ? null:<div id="signout-btn" onClick={this.signOut}>Logout</div>   }
        </header>
          <div className="content-wrapper">
            {this.renderContent()}
          </div>
        <footer/>
      </div>
    );
  }
}

export default App;
