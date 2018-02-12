import React from "react"

export default class JobList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        jobList: []
    }
    this.getJobsList()
  }

  setJobList = (list) => {
    this.setState({jobList: list})
  }

  renderJobListItem = (job) => {
    const coords = job["geolocation"]
    return (
      <div className="job-item" key={`job-item-${job["id"]}`} onClick={this.props.goToLocationView(coords["latitude"], coords["longitude"])}>
        <div className="item-top">
          <div>Job Number: {job["job-id"]} </div>
          <button onClick={this.props.selectJob(job["job-id"])}>Accept</button>
        </div>
        <div>Company: {job["company"]} </div>
        <div>Address: {job["address"]} </div>
      </div>
    )
  }


  getJobsList(){
    const setJobList = this.setJobList
    const url ="https://api.myjson.com/bins/8d195.json"
    let req = new XMLHttpRequest()
    req.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
        setJobList(JSON.parse(this.response))
    }
    }
    req.open("GET", url)
    req.send()
  }

  render(){
    const {jobList} = this.state
    return (
      <div>
        {
          jobList.map(function(job){
            return this.renderJobListItem(job)
          }, this)
        }
      </div>
    )
  }
}