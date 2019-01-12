const puppeteer = require("puppeteer");
const sessionFactory = require("../factory/sessionFactory");
const userFactory = require("../factory/userFactory");

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto("http://localhost:3000");
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function(target, property) {
        return customPage[property] || browser[property] || page[property];
      }
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await userFactory();

    const { session, sig } = sessionFactory(user);

    await this.page.setCookie({ name: "session", value: session });
    await this.page.setCookie({ name: "session.sig", value: sig });
    await this.page.goto("http://localhost:3000/blogs");
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContent(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }
}

module.exports = CustomPage;
