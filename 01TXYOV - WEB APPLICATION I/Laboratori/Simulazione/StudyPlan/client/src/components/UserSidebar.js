import React from "react";
import "./Sidebar.css";


function Sidebar(props) {

  return (
    <div className={ props.showSidebar? 'col-xs-12 col-sm-12 col-md-3 col-lg-3 d-lg-block position-sm-fixed position-md-relative position-lg-relative':'col-xs-12 col-sm-3 col-lg-3 d-lg-block collapse hidden position-lg-relative'} id="left-container">
      <center><img src={require(`./images/${props.loggedUser.id}.png`)} alt={'./images/man.png'} /></center>
      <center><div className="col" width="30%">
        <button className="button rounded-corners disabled"><strong>Name: </strong>{props.loggedUser.name}</button>
      </div></center>
      <center><div className="col" width="30%">
        <button className="button rounded-corners disabled"><strong>Surname: </strong>{props.loggedUser.surname}</button>
      </div></center>
      <center><div className="col" width="30%">
        <button className="button rounded-corners disabled"><strong>mail: </strong>{props.loggedUser.mail}</button>
      </div></center>
      {props.studyPlan && <center><div className="col" width="30%">
          <button className="button rounded-corners disabled"><strong>Type of Study Plan: </strong>{props.studyPlan}</button>
        </div></center>}
      {props.studyPlan && <center><div className="col" width="30%">
          <button className="button rounded-corners disabled"><strong>Credits: </strong>{props.credits}</button>
        </div></center>}    
    </div>
  );
}


export {Sidebar}