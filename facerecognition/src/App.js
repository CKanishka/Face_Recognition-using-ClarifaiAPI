import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/navigation';
import Logo from './components/logo/logo';
import Rank from './components/rank/rank';
import ImageLink from './components/imagelink/imagelink';
import InputImage from './components/inputimage/inputimage';
import SignIn from './components/signin/signin';
import Register from './components/register/register';

const app = new Clarifai.App({
  apiKey: 'c1c1930198f84b5fbf8527d38e6a17db'
 });

const initialState = {
  input:'',
  imageUrl:'',
  box:{},
  route:'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email:'',
    entries:'',
    joined:''
  }
}
class App extends Component {

  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
      this.setState({user: 
        {
        id:data.id,
        name:data.name,
        email:data.email,
        entries:data.entries,
        joined:data.joined
      }
    }) 
  }

  calculateFaceLocation= (resp) => {
    console.log(resp);
    const faceCoordinates = resp.outputs[0].data.regions[0].region_info.bounding_box ;
    const image=document.getElementById('inputimage');
    const width=Number(image.width);
    const height=Number(image.height);
    return {
      topRow: faceCoordinates.top_row * height,
      leftCol: faceCoordinates.left_col * width,
      bottomRow: height - (faceCoordinates.bottom_row * height),
      rightCol: width - (faceCoordinates.right_col * width),
    }
  }

  setFaceLocation = (data) => {
    this.setState({box:data});
  }   
  
  onInputChange = (event) => {
    this.setState({input:event.target.value});  
  }
  
  onSubmit = () => {
    this.setState({imageUrl:this.state.input});

    app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input) //sending the image url to clarifai api
    
    .then(response => {
        if(response){
          fetch('http://localhost:3001/image',{      //sending a request to the local server on getting a successful response from clarifai api
            method: 'put',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
              id:this.state.user.id
            })
          })
        .then(response2 => response2.json())        //server responds back and the response is converted to json
        .then(count => {                            // the converted response is the count which is set to the number of entries
          this.setState(Object.assign(this.state.user,{entries:count})) //
        })
      }  console.log(response)
        this.setFaceLocation(this.calculateFaceLocation(response)) 
    })  
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState);
    }
    else if (route === 'home') {
      this.setState({isSignedIn:true});
    }
    this.setState({route:route});
    
  }

    render() {
    return (
      <div className="App">
        <Particles className='particle' 
              params={{
            		particles: {
            			number: {
                    value:80,
            				density: {
            					enable: true,
            					value_area:800
            				}
            			}
            		}
              }} 
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        {
        this.state.route==='home' ?
        <div>
        <Logo />
        <Rank name={this.state.user.name} entries={this.state.user.entries}/>
        <ImageLink onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
        <InputImage box={this.state.box} imageUrl={this.state.imageUrl} />
        </div>
        : (
        this.state.route==='signin' ?
        <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
        )
        }
      </div>
    );
  }
}

export default App;
