import axios from 'axios';

const axiosFetch = (url, options = {}) => {
  let axiosOpt = Object.assign({}, { 'url': url }, options);
  if (axiosOpt.method !== 'GET') {
    axiosOpt.data = axiosOpt.body;
  }
  return axios(axiosOpt)
    .then(res => {
      if (!res) return
      res.headers.get = (key) => {
        return res.headers[key.toLowerCase()];
      };
      res.json = () => {
        return new Promise((resolve, reject) => {
          resolve(res.data);
        });
      };
      res.ok = true;
      return res;
    }).catch(err => {
      console.log(err);
    })
};

export default axiosFetch;
