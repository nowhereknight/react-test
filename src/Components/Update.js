import axios from "axios";
import React, { useEffect, useState } from "react";
import Alert from '@mui/material/Alert';

import { Link, useNavigate, useLocation } from "react-router-dom";

const Update = () => {
  const [company_uuid, setcompanyUuid] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [symbol, setSymbol] = useState("");

  const navigate = useNavigate();
  const { error } = useLocation();

  const renderAler = () => {
    if(error)
      return <Alert severity="error">{error}</Alert>;
    return null;
  }

  useEffect(() => {
    setcompanyUuid(localStorage.getItem("company_uuid"));
    setName(localStorage.getItem("name"));
    setDescription(localStorage.getItem("description"));
    setSymbol(localStorage.getItem("symbol"));

  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("company_uuid...", company_uuid);
    var data = JSON.stringify({
      name: name,
      description: description,
      symbol: symbol
    });

  var config = {
    method: 'put',
    url: `http://ec2-54-201-29-40.us-west-2.compute.amazonaws.com:5000/api/v1/companies/${company_uuid}`,
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };

  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    navigate("/read");
  })
  .catch(function (error) {
    console.log(error);
    if (error.response.status === 409) {
      navigate("/update", { error: "Company with the same symbol and/or name already exists" })
    }else if(error.response.status === 400){
      navigate("/update", { error: "Invalid input" })
    }else{
      navigate("/update", { error: "Internal error. Please try again later" })
    }
  });

    // axios
    //   .put(`https://62a59821b9b74f766a3c09a4.mockapi.io/crud-youtube/${id}`, {
    //     name: name,
    //     email: email,
    //   })
    //   .then(() => {
    //     navigate("/read");
    //   });
  };

  return (
    <>
      <h2>Update Company</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Symbol</label>
          <input
            type="text"
            className="form-control"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary mx-2" onClick={handleUpdate} >
          Update
        </button>
        { renderAler() }

        <Link to="/read">
          <button className="btn btn-secondary mx-2"> Back </button>
        </Link>
      </form>
    </>
  );
};

export default Update;