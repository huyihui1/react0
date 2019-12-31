import axios from 'axios';
import appConfig from '../appConfig';

axios.defaults.withCredentials = true;

const baseUrl = appConfig.rootUrl;


function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(baseUrl + url, { params })
      .then(res => {
        if (res && res.data) {
          resolve(res.data);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}


function post(url, params = {}, options = {}, isImport = false) {
  return new Promise((resolve, reject) => {
    axios.post(baseUrl + url, params, options)
      .then(res => {
        if (isImport) {
          const fileName = decodeURI(res.headers['content-disposition'].split('=')[1]);
          resolve({ fileName, data: res.data });
        } else {
          if (res && res.data) {
            resolve(res.data);
          }
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

function put(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.put(baseUrl + url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function remove(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(baseUrl + url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export default {
  baseUrl,
  get,
  post,
  put,
  remove,
};
