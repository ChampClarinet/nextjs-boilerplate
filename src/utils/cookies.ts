import CookiesClient from "universal-cookie";

class CookieUtilsClass {
  getClient(name: string) {
    const client = new CookiesClient();
    return client.get(name);
  }

  setClient(name: string, value: string) {
    return new CookiesClient().set(name, value, { path: "/" });
  }

  removeClient(name: string) {
    return new CookiesClient().set(name, "", { expires: new Date(0) });
  }

  getAll() {
    return new CookiesClient().getAll();
  }
}

const CookiesUtils = new CookieUtilsClass();

export default CookiesUtils;
