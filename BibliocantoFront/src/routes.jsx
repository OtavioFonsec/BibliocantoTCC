import React from "react";
import { BrowserRouter, Router, Switch } from "react-router-dom";
import Login from "./Paginas/Cadastrar Livros/Login";

export default function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Router path="/" exact component={Login}/>
            </Switch>
        </BrowserRouter>
    )
}