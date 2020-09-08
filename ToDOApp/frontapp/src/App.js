import './App.css';

import React, { Component } from 'react';

 class App extends Component {
   constructor(props) {
     super(props)
   
     this.state = {
        todolist :[],
        activeItem :{
          id:'',
          title:'',
          completed:false
        },
        editing:false
     }
     this.fetchtasks = this.fetchtasks.bind(this)
    this.getToken = this.getToken.bind(this)
    
   }

    componentDidMount()
    {
        this.fetchtasks()
    } 

    fetchtasks()
    {
      fetch('http://127.0.0.1:8000/app/task-list/')
      .then(response => response.json())
      .then(data => this.setState({
        todolist:data
      }));
    }

    getToken(name) 
		{
			let cookieValue = null;
			if (document.cookie && document.cookie !== '') {
				const cookies = document.cookie.split(';');
				for (let i = 0; i < cookies.length; i++) {
					const cookie = cookies[i].trim();
					// Does this cookie string begin with the name we want?
					if (cookie.substring(0, name.length + 1) === (name + '=')) {
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}
			return cookieValue;
		}



    handleChange =(e)=>{
        var name = e.target.name
        var value = e.target.value
        console.log("name:",name);
        console.log("Value:",value);
        this.setState({
          activeItem:{
            ...this.state.activeItem, //done since we have to set state of child attributes
            title:value     
           
          }
        })
    }

    handleSubmit =(e)=>{
     e.preventDefault()
     var csrftoken = this.getToken('csrftoken');
     
     var url = 'http://127.0.0.1:8000/app/task-create/'

     if (this.state.editing == true)
     {
      
       url = `http://127.0.0.1:8000/app/task-update/${this.state.activeItem.id}/`
       this.setState({
         editing:false
       })
     }

     fetch(url,{
       method:'POST',
       headers:{
         'content-type':'application/json',
         'X-CSRFToken':csrftoken,
       },
       body:JSON.stringify(this.state.activeItem)
     }).then((response) => {
       this.fetchtasks()
       this.setState({
         activeItem:{
           id:null,
           title:'',
           completed:false
         }
       })
     }).catch(function(error){
       console.log("Error",error)
     })
    }

    startEdit(task){
      this.setState({
        activeItem:task,
        editing:true,
      })//,
      // () => {console.log("After set staaate:",this.state.activeItem,"Editing:",this.state.editing)})
    } 

    DeleteItem(task)
    {
       var url = `http://127.0.0.1:8000/app/task-delete/${task.id}/`
       var csrftoken = this.getToken('csrftoken')
       fetch(url,{
         method:'DELETE',
         headers:{
         'content-type':'application/json',
         'X-CSRFToken': csrftoken,
       },
      }).then((request)=>{
          this.fetchtasks()
      })
      
    }

    strikeunstrike(task)
    {
        task.completed = !task.completed
        var url =`http://127.0.0.1:8000/app/task-update/${task.id}/`
        var csrftoken = this.getToken('csrftoken')
        // console.log(task.completed);
        fetch(url,{
          method:'POST',
          headers:{
          'content-type':'application/json',
          'X-CSRFToken': csrftoken,
        },
        body:JSON.stringify({'completed':task.completed,'title':task.title})
       }).then((request)=>{
           this.fetchtasks()
       })
    }
  render() {
    var tasks = this.state.todolist
    var self = this
    return (
      <div className="container">

          <div id="task-container">
              <div  id="form-wrapper">
                 <form onSubmit={this.handleSubmit}  id="form">
                    <div className="flex-wrapper">
                        <div style={{flex: 6}}>
                            <input  onChange={this.handleChange}  value={this.state.activeItem.title}  className="form-control" id="title"  type="text" name="title" placeholder="Add task.." />
                         </div>

                         <div style={{flex: 1}}>
                            <input id="submit" className="btn btn-warning" type="submit" name="Add" />
                          </div>
                      </div>
                </form>
             
              </div>

              <div  id="list-wrapper">         
                    {tasks.map(function(task, index){
                      return(
                          <div key={index} className="task-wrapper flex-wrapper">

                            <div onClick={()=>self.strikeunstrike(task)}style={{flex:7}}>
                                  {task.completed==false ?
                                    (<span>{task.title}</span>) :
                                    (<strike>{task.title}</strike>)}
                            </div>

                            <div style={{flex:1}}>
                                <button className="btn btn-sm btn-outline-info" onClick={() => self.startEdit(task)}>Edit</button>
                            </div>

                            <div style={{flex:1}}>
                                <button  className="btn btn-sm btn-outline-dark delete" onClick={() => self.DeleteItem(task)}>Delete</button>
                            </div>

                          </div>
                        )
                    })}
              </div>
          </div>
          </div>

    );
  }
}

export default App;

