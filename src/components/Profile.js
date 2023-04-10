import { useState, useEffect } from 'react'
import axios from "axios";

function Profile(props) {

  const [profileData, setProfileData] = useState(null)
  const [records, setRecords] = useState(null)
  const [paginator, setPaginator] = useState({page_number:1,next_page:1,previous_page:1,prev_range:[],next_range:[]})
  const [sortCriteria, setSortCriteria] = useState({column:'id',order:'up',toogle:'down'})
  const [filterCriteria, setFilterCriteria] = useState({operationType:[]})
  const [ini, setIni] = useState(1)
  const [incr, setIncr] = useState(0)

  function getUserData() {
    axios({
      method: "GET",
      url:"/profile",
      headers: {
        Authorization: 'Bearer ' + props.token
      }
    })
    .then((response) => {
      const res =response.data
      res.access_token && props.setToken(res.access_token)
      setProfileData(({
        profile_name: res.profile_name,
        about_me: res.about_me}))
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}

  function loadParams() {

    axios({
      method: "GET",
      url:"/api/v1/operations"
    })
    .then((response) => {
      filterCriteria.operationType = response.data

      response.data.forEach(element => 
        element.status = true  
      );

      setFilterCriteria(filterCriteria)
      getRecords()

    }).catch((error) => {

      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }

  function filterByType(e) {

    let t = filterCriteria.operationType.find(x => x.alias === e.target.id)
    
    t.status = !t.status
    setFilterCriteria(filterCriteria)
    setIncr(incr+1)
    
    getRecords()
  }

    
  
  function sortBy(column, order,toogle) {

    sortCriteria.column = column
    sortCriteria.order = order
    sortCriteria.toogle = toogle

    setSortCriteria(sortCriteria)

    getRecords()
  }

  function getRecords(page = 1) {

    var payload = {page_number: page,sort_criteria:sortCriteria,filter_operation_type:filterCriteria.operationType}
    
    axios.post(
      "/api/v1/profile/records",
      payload,
      {headers:
        {Authorization: 'Bearer ' + props.token}
      })
    .then((response) => {
      console.log(response.data)
      setPaginator(response.data.paginator)
      setRecords(response.data.records)
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}

    useEffect(()=>{
      if (ini) {
        setIni(0)
        getUserData()
        loadParams()
      }
    })


  return (
    <div className="container fluid">
    <div className="Profile">

    </div>
    <div className="row">
        <div className="col-12">
        {profileData && 
          <h3 className='m-5'>Hello {profileData.profile_name}</h3>}
          <h3>Your record History</h3>
          <div className="row"><div className="mr-3 float-left">operation type: </div> {filterCriteria && filterCriteria.operationType.map(
            t => (
              <div key={t.type} className="mr-3 float-left">
                <input type="checkbox" checked={t.status} id={t.alias}
                onChange={(event)=>filterByType(event)}
                
                ></input>
                <label className="ml-1">{t.type}</label>
            </div>
            )
            )}</div>

        </div>
        
        <div className="table-responsive">
        <table className="table table-sm table-borderless mb-0">
          <thead className="thead-dark">
            <tr>
              {
                [["id","id"],["operation type","operation_id"],["operation response","operation_response->>'response'"],["date","date"],['amount','amount'],["user balance","user_balance"]].map(
                  t => (
                    <th key={t[1]}>{t[0]} {sortCriteria.column=== t[1] ?
                      <i className={"bi bi-sort-alpha-"+sortCriteria.toogle} onClick={()=>sortBy(t[1],sortCriteria.toogle,sortCriteria.order)}></i> :
                      <i className={"bi bi-sort-"+sortCriteria.toogle} onClick={()=>sortBy(t[1],sortCriteria.order,sortCriteria.toogle)}></i>
              }
            </th>
                  )
                )
              }
            </tr>
          </thead>
          <tbody>
            {records && records.map(
              record => (
                <tr key={'record' + record.id}>
                  <td>{record.id}</td>
                  <td>{record.operation_type}</td>
                  <td>{record.operation_response.response}</td>
                  <td>{record.date}</td>
                  <td>{record.amount}</td>
                  <td>{record.user_balance}</td>

                </tr>
              )
            )

            }
          </tbody>
        </table>

        <nav>
          <ul className="pagination">
            <li className="page-item"><button className="page-link" onClick={() => getRecords(paginator.previous_page)}>Previous</button></li>
            {paginator && paginator.prev_range.map(
              r => (
                <li className="page-item" key={'prev' + r}><button className="page-link" onClick={() => getRecords(r)}>{r}</button></li>

              )
            )}
            <li className="page-item disabled"><button className="page-link disabled" >{paginator.page_number}</button></li>
            {paginator && paginator.next_range.map(
              r => (
                <li className="page-item" key={'next' + r}><button className="page-link" onClick={() => getRecords(r)}>{r}</button></li>
              )
            )}
            
            <li className="page-item"><button className="page-link" onClick={() => getRecords(paginator.next_page)}>Next</button></li>
          </ul>
        </nav>
        </div>

    </div>
  </div>
  );
}

export default Profile;