import React, { Component } from 'react';
import { Security } from '../../service/Security';

class Register extends Component {

  componentWillMount() {
    var _this = this;
    Security.getRegData(this.props.match.params.r)
      .then(data => {
        _this.setState({
          regData: data
        })
      })
  }
  parms = {
  };

  registerUser(event) {
    event.preventDefault();
    Security.register(this.state.regData).then(data => {
      Security.relate(this.state.regData.userId, data._id, this.state.regData.relation)
        .then(data => {
          this.props.history.push('/');
        }).catch(err => {
        alert(err);
        this.props.history.push('/');
      })
    }).catch(error => {
      alert(error);
    });
  // $("#registerBtn").attr("disabled", "disabled");
  // if ($('form').valid()) {
  //   var str = $('form').serialize();
  //   $.ajax({
  //     url: '/users/create',
  //     method: 'POST',
  //     data: str,
  //     success: function(x, h, r) {
  //       if (x) {
  //         //we need to join these together.
  //         var userId = $("#userId").val();
  //         var newUserId = x._id;
  //         var relation = $("#relation").val();
  //       }
  //       $.ajax({
  //         url: '/users/relate',
  //         method: 'POST',
  //         data: {
  //           userId: userId,
  //           newUserId: newUserId,
  //           relation: relation
  //         },
  //         success: function(res) {
  //           document.location = "/";
  //         },
  //         error: function(err) {}
  //       })
  //       debugger;
  //     },
  //     error: function(x, h, r) {
  //       debugger;
  //     }
  //   });
  // } else {
  //   $("#registerBtn").removeAttr("disabled");
  // }
  }

  onFieldChange(event) {
    this.state.regData[event.target.name] = event.target.value;
  }


  render() {
    if (!this.state || !this.state.regData) return null;
    return (
      <form name="registerform" className="container" onChange={(event) => this.onFieldChange(event)}>
        <div className="form-group">
            <div>
                <label> Name</label>
                <input type="text" className="form-control" id="name" name="name" defaultValue={this.state.regData.name} required="required" />
            </div>
            <div>
                <label>Lastname</label>
                <input type="text" className="form-control" id="lastName" name="lastName" defaultValue={this.state.regData.lastName} required="required" />
            </div>
            <div>
                <label>Username</label>
                <input type="text" className="form-control" id="userName" name="userName" defaultValue={this.state.regData.userName} required="required" />
            </div>
            <div>
                <label>Date of birth</label>
                <input type="date" className="form-control" id="dateofBirth" name="dateofBirth" defaultValue={this.state.regData.dateofBirth} required="required" />
            </div>
            <div>
                <label>Password</label>
                <input type="password" className="form-control" id="password" name="password" defaultValue={this.state.regData.password} required="required" />
            </div>
            <div>
                <label>Retype password</label>
                <input type="password" className="form-control" id="retypepassword" name="retypepassword" defaultValue={this.state.regData.retypepassword} required="required" />
            </div>
            <div>
                <label>Type</label>
                <input type="text" className="form-control" defaultValue={this.state.regData.type} name="type" disabled="disabled" />
            </div>
            <input type="text" className="invisible"  defaultValue={this.state.regData.userId} name="userId" id="userId" />
            <input type="text" className="invisible" defaultValue={this.state.regData.relation} name="relation" id="relation" />
            <input type="text" className="invisible" name="newUserId" id="newUserId" />
          <div>
              <button className="btn btn-primary" id="registerBtn" onClick={(event) => this.registerUser(event)}>Submit</button>
          </div>
        </div>
      </form>
    )
  }
}

export default Register;