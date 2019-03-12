import fetch from 'dva/fetch';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 * mode:'cors',  跨域设置
 */
export default function request(url, options) {
  const _opts={credentials:'include',mode:'cors',headers:{'Content-Type': 'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE'},...options}
  return fetch(url, _opts)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => ({ data }))
    .catch((err) => ({ err }));
}
