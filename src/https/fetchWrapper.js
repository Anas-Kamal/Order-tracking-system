// import { CustomToast } from "../components/Toastr/Toastr";
import { StorageService } from "../config/storage";
import { BaseUrl } from "../constant/apiEndpoints";

function http(path, config, apiUrl) {
  // eslint-disable-next-line no-undef
  const request = new Request(
    apiUrl ? `${apiUrl}${path}` : `${BaseUrl}${path}`,
    config
  );
  return fetch(request);
}
async function parseResponse(path, config, apiUrl) {
  const response = await http(path, config, apiUrl);
  // if (!response.ok) {
  // }
  if (response.status === 401) {
    // CustomToast('error', 'Authorization failed!')
    StorageService.clearAll();
    window.location.reload()
  }
  return new Promise((resolve, reject) => {
    if (response.body) {
      response
        .json()
        .then((d) => {
          const responseWithHeader = {
            ok: response?.ok,
            status: response.status,
            body: d,
            headers: response.headers,
          };
          resolve(responseWithHeader);
        })
        .catch(() => {
          if (response.ok) {
            const responseWithHeader = {
              ok: response?.ok,
              status: response.status,
              body: {},
              headers: response.headers,
            };
            resolve(responseWithHeader);
          } else {
            reject(response);
          }
        });
    } else {
      const responseWithHeader = {
        ok: response?.ok,
        status: response.status,
        body: response.body,
        headers: response.headers,
      };

      resolve(responseWithHeader);
    }
  });
}
export async function get(path, config, apiUrl) {
  const init = { method: "get", ...config };
  const res = parseResponse(path, init, apiUrl || "");
  return res;
}
export async function post(path, body, config, apiUrl) {
  const init = { method: "post", body: JSON.stringify(body), ...config };
  return parseResponse(path, init, apiUrl || "");
}
export async function put(path, body, config, apiUrl) {
  const init = { method: "put", body: JSON.stringify(body), ...config };
  return parseResponse(path, init, apiUrl || "");
}

export async function patch(path, body, config, apiUrl) {
  const init = { method: "patch", body: JSON.stringify(body), ...config };
  return parseResponse(path, init, apiUrl || "");
}

export async function deleteAction(path, config, apiUrl) {
  const init = { method: "delete", ...config };
  return parseResponse(path, init, apiUrl || "");
}

export async function postLogin(path, body, config, apiUrl) {
  const init = { method: "post", body, ...config };
  return parseResponse(path, init, apiUrl || "");
}
