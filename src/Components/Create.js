import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Link, useLocation } from "react-router-dom";
import Alert from '@mui/material/Alert';

const Create = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [symbol, setSymbol] = useState("");

  //const [email, setEmail] = useState("");
  const history = useNavigate();
  const { error } = useLocation();


  const renderAler = () => {
    if(error)
      return <Alert severity="error">{error}</Alert>;
    return null;
  }


  const handleSubmit = (e) => {
      e.preventDefault();
      console.log("clicked");

      var data = JSON.stringify({
          name: name,
          description: description,
          symbol: symbol
      });
  
      var config = {
        method: 'post',
        url: 'http://ec2-54-201-29-40.us-west-2.compute.amazonaws.com:5000/api/v1/companies',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
      };
  
      axios(config)
      .then(function(response) {
          console.log(JSON.stringify(response.data));
          history("/read");
      })
      .catch(function(error) {
          console.log(error.response);
          if (error.response.status === 409) {
            history("/", { error: "Company with the same symbol and/or name already exists" })
          }else if(error.response.status === 400){
            history("/", { error: "Invalid input" })
          }else{
            history("/", { error: "Internal error. Please try again later" })
          }
      });
  };

  return (
    <>
      <div className="d-flex justify-content-between m-2">
        <h2>Create</h2>
        <Link to="/read">
          <button className="btn btn-primary">Show Data</button>
        </Link>
      </div>
      <form>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Symbol</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>
        { renderAler() }

      </form>
    </>
  );
};

export default Create;