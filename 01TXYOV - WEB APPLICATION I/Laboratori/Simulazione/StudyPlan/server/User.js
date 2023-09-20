'use strict';



function User (name, surname, id, mail, password ) {
    this.name = name;
    this.surname = surname;
    this.id=id;
    this.mail=mail;
    this.password = password;
}

exports.User = User;