import axios from "axios";
import { useEffect } from "react";

function Header(props) {

  function pingSession() {

    axios({
        method: "GET",
        url:"/ping",
        headers: {
            Authorization: 'Bearer ' + props.token
        }
    }).then((response)=>{
        response.access_token && props.setToken(response.access_token)
    }).catch((error) => {
        props.removeToken()
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
          }
          //window.location.replace('/login');
      })

    setTimeout(()=>{pingSession()},10000)

}

  function logMeOut() {
    axios({
      method: "POST",
      url:"/logout",
    })
    .then((response) => {
       props.removeToken()
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}

    // useEffect(()=>pingSession,[])

    return(
      <header className="App-header">
        <nav className="navbar navbar-expand-lg navbar-darg}k bg-dark">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item active">
                  <a className="nav-link" href="./">Profile <span className="sr-only">(current)</span></a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="./calculator">Calculator</a>
                </li>
                <li>
                {props.token ? <a className="nav-link"   onClick={logMeOut}> 
                    Logout
                </a> : <a className="nav-link">Iniciar sesión</a>}
                </li>
              </ul>
            </div>
          </nav>
      </header>
  )
}

export default Header;
