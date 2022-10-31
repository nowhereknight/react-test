import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';

const Read = () => {
  const [data, setData] = useState([]);
  const [tabledark, setTableDark] = useState("");
  const { error } = useLocation();
  const history = useNavigate();

  const renderAler = () => {
    if(error)
      return <Alert severity="error">{error}</Alert>;
    return null;
  }


  function getData() {

    var config = {
      method: 'get',
      url: 'http://ec2-54-201-29-40.us-west-2.compute.amazonaws.com:5000/api/v1/companies',
      headers: { }
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify("yei",response.data));
      setData(response.data.result.companies);
    })
    .catch(function (error) {
      //console.log("error",error.response.data);
      console.log("error",error);
      history("/read", { error: "Internal error. Please try again later" })
    });


    // axios
    //   .get("https://62a59821b9b74f766a3c09a4.mockapi.io/crud-youtube")
    //   .then((res) => {
    //     setData(res.data);
    //   });
  }

  function handleDelete(company_uuid) {

    var config = {
      method: 'delete',
      url: `http://ec2-54-201-29-40.us-west-2.compute.amazonaws.com:5000/api/v1/companies/${company_uuid}`,
      headers: { }
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      getData();
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const setToLocalStorage = (company_uuid, name, description, symbol) => {
    localStorage.setItem("company_uuid", company_uuid);
    localStorage.setItem("name", name);
    localStorage.setItem("description", description);
    localStorage.setItem("symbol", symbol);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          onClick={() => {
            if (tabledark === "table-dark") setTableDark("");
            else setTableDark("table-dark");
          }}
        />
      </div>
      <div className="d-flex justify-content-between m-2">
        <h2>Read Operation</h2>
        <Link to="/">
          <button className="btn btn-secondary">Create</button>
        </Link>
      </div>
      <table className={`table ${tabledark}`}>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Symbol</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        {data.map((eachData) => {
          return (
            <>
              <tbody>
                <tr>
                  <th scope="row">{eachData.company_uuid}</th>
                  <td>{eachData.company_name}</td>
                  <td>{eachData.description}</td>
                  <td>{eachData.symbol}</td>

                  <td>
                    <Link to="/update">
                      <button className="btn-success" onClick={
                        () => setToLocalStorage(
                            eachData.company_uuid,
                            eachData.company_name,
                            eachData.description,
                            eachData.symbol
                          )
                      }>
                        Edit{" "}
                      </button>
                    </Link>
                  </td>
                  <td>
                    <button className="btn-danger" onClick={() => handleDelete(eachData.company_uuid)}>
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </>
          );
        })}
      </table>
      { renderAler() }

    </>
  );
};

export default Read;