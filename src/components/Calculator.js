import { useState, useEffect } from 'react'
import axios from "axios";

function Calculator(props) {

const [ini, setIni] = useState(1)
const [profileData, setProfileData] = useState(null)
const [userCredit, setUserCredit] = useState(0)
const [operations, setOperations] = useState([])


const [values, setValues] = useState('')
const [outputCalc, setOutputCalc] = useState(null)
const [outputWord, setOutputWord] = useState(null)

const [messages, setMessages] = useState(undefined)

    function handleField(e) {
        //const name = e.target.name;
        //const value = e.target.value;
        //this.setState({[name]: value});
        setValues(e.target.value)
    }

    function getUserData() {
        axios.get("/profile",
            {headers: {
                Authorization: 'Bearer ' + props.token
        }})
        .then((response) => {
          const res =response.data
          res.access_token && props.setToken(res.access_token)
          setProfileData(({
            profile_name: res.profile_name,
            about_me: res.about_me
        }))
            setUserCredit(res.user_credit)
        }).catch((error) => {
          if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
            }
        })}

    function getOperations() {
    axios.get("/api/v1/operations")
    .then((response) => {
      setOperations(response.data.data)
    }).catch((error) => {
        setOperations('we have an error',null)

      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}

    function calculate(operation) {
    
    let payload = {'operation': operation}

    if (operation === 'rand') {
        payload = {
            "ops": {},
            "operation": operation
        }
    } else {

        payload = {
            "nums": values,
            "operation": operation
        }
    }
    
    axios.post(
      "/api/v1/service/calc",
      payload
      ,{headers: {Authorization: 'Bearer ' + props.token}}
      ).then((response) => {

      setMessages(undefined)
    
      const res =response.data
    
      
      res.access_token && props.setToken(res.access_token)
      setUserCredit(response.data['user_credit'])

      if (operation === 'rand') {
        setOutputWord(response.data['output'])        
      } else {
        setOutputCalc(response.data['output'])
      }
      
    }).catch((error) => {
      if (error.response) {
        setMessages(error.response.data.messages)
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
    }})}

    useEffect(() => {

        if (ini) {
            getOperations()
            getUserData()
            setIni(0)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    
    return (<div className="Calculator">
        <h3 className='m-5'>Your credits {userCredit}</h3>

        <h3>Let's calculate </h3>

        <div className="container fluid">
            <div className="row">
            {messages ?
                <div className="col-12 alert alert-danger">
                        {messages}
                </div>
                :
                <></>
            }

            <div className="col-md-6 col-sm-12 calmod mb-3">
                <div className="m-1">

                <h5>Math Operations</h5>
                    <div className="form-floating">
                        <input value={values} id="commavalues"  className="form-control mb-2"  placeholder="Comma separated values for estimation" onChange={(event) => handleField(event)}></input>
                    </div>
                    <div>
                        <button onClick={()=> calculate('add')}>Add</button>
                        <button onClick={()=> calculate('sub')}>sub</button>
                        <button onClick={()=> calculate('mul')}>Mul</button>
                        <button onClick={()=> calculate('div')}>Div</button>
                        <button onClick={()=> calculate('sqr')}>Square Root</button>
                    </div>

                {outputCalc ?

                    <div className="mt-3">
                        <p>Our estimation is:</p>
                    
                        <h3 id="outputCalc-math">{outputCalc}</h3>

                        
                    </div>
                    

                    :

                    <></>
                }

                </div>
            </div>

            <div className="col-md-6 col-sm-12 calmod mb-3">
                <div className="m-1">
                <h5>Random String Generator</h5>
                
                <div style={{
                    display:'none'
                }}>
                    <h3>Options</h3>
                    <ul>
                        <li>o1:</li>
                        <li>o2:</li>
                    </ul>
                </div>
        
                <input  className="form-control disabled mb-2"  placeholder="click once to generate word"></input>

                <button data-testid="generaterandomword" onClick={()=> calculate('rand')}>Generate a random word</button>

                {outputWord ?
                    
                    <div className="mt-3">
                        <p>Our generated string is:</p>
                    
                        <h3 data-testid="word">{outputWord}</h3>

                    </div>

                    :
                    <></>

                }
                </div>
            </div>
            
            <div className="col-12 mt-5"><h5>FAQs</h5>
                
                <ul className="faqs">
                    <li><b>Random Generator</b> just requires a click to make an api call to random.org that will return a value. Several options can be made on that API call but on this version only preset options are defined</li>
                    <li><b>Math operations</b> reqiires comma separeted values. i.e. sum: "123,12,1" will do 123+12+1. string does not accept double commas, spaces will be ignored </li>
                    <li>if a list of numbers is use with <b>square root</b> square root will be estimated for each value if is a positive number.</li>
                    <li>eachb<b> operation have a cost</b>:                         {
                            operations && operations.map(
                                t => (<span key={t.id}><u className="pl-2">{t.type}</u>:{t.cost}

                                </span>)
                            )
                        }


                    </li>
                </ul>
            
            </div>
            
            </div>
        </div>

    </div>)

}

export default Calculator;