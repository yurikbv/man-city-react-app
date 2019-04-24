import React from 'react';
import { Link } from "react-router-dom";

export const Tag = (props) => {

  const template = <div
    style={{
      background: props.bck,
      fontSize: props.size,
      color: props.color,
      padding: '5px 10px',
      display: 'inline-block',
      fontFamily: 'Righteous',
      ...props.add
    }}
  >{props.children}</div>;

  return props.link ? <Link to={props.linkTo}>{template}</Link> : template;
};

export const firebaseLooper = (snapshot,reverse = false) => {
  let data = [];
  snapshot.forEach((childSnapshot) => {
    data = [...data, {
      ...childSnapshot.val(),
      id: childSnapshot.key
    }]
  });
  return reverse ? data.reverse() : data;
};

export const validate = (element) => {
  let error = [true, ''];

  if(element.validation.email){
    const valid = /\S+@\S+\.\S+/.test(element.value);
    const message = `${!valid ? 'Must be a valid email' : ''}`;
    error = !valid ? [valid,message] : error;
  }

  if(element.validation.required){
    const valid = element.value.trim() !== '';
    const message = `${!valid ? 'This field is required' : ''}`;
    error = !valid ? [valid,message] : error;
  }

  return error;

};