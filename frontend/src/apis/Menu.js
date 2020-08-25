// TODO: implement functions to interface with your api here
// You can either use the standard fetch API, or install axios or any other 3rd party library.

// You can also feel free to just do the API request in your component

// Also feel free to either use .then(response => ...).catch(e => ...) or async/await and try/catch syntax

// To interface correctly with CORS, make sure to use the base URL of http://localhost:5000

import axios from 'axios';

const URL = "http://localhost:5000/api";

export const getMenuItems = async () => {
  return new Promise(async (resolve, reject) => { 
    try {
      const res = await axios.get(URL + '/menu');
      resolve(res.data.items);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

export const getTags = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(URL + '/tags');
      resolve(res.data.tags);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

export const addMenuItem = async (name, tag_id=null) => {
  return new Promise(async (resolve, reject) => {
    try {
      let req_body = { 'name': name }
      if (tag_id) req_body = Object.assign(req_body, { tag_id: tag_id })
      const res = await axios.post(URL + '/menu/add', req_body);
      resolve(res.data);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

export const deleteMenuItem = async (_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.delete(URL + '/menu/delete', {
        params: { '_id': _id }
      });
      resolve(res.data);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

export const addTag = async (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.post(URL + '/tags/add', { 'name': name });
      resolve(res.data);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};