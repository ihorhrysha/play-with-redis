const Page = require("./helpers/page.js");
let page;

describe("When logged in", async () => {
  beforeEach(async () => {
    page = await Page.build();
    await page.login();
    await page.click('a[href="/blogs/new"]');
  });

  afterEach(async () => {
    await page.close();
  });

  test("can see blog create form", async () => {
    const label = await page.getContent("form label");
    expect(label).toEqual("Blog Title");
  });

  describe("And using invalid inputs", async () => {
    beforeEach(async () => {
      await page.click("form button");
    });

    test("the form shows error message", async () => {
      const errorTitle = await page.getContent(".title .red-text");
      const errorContent = await page.getContent(".content .red-text");

      expect(errorTitle).toEqual("You must provide a value");
      expect(errorContent).toEqual("You must provide a value");
    });
  });

  describe("And using valid inputs", async () => {
    beforeEach(async () => {
      await page.type(".title input", "My Title");
      await page.type(".content input", "My Content");
      await page.click("form button");
    });

    test("Submitting takes to review screen", async () => {
      const header = await page.getContent("h5");
      expect(header).toEqual("Please confirm your entries");
    });

    test("After submeeting lead to index page", async () => {
      await page.click("button.green");
      await page.waitFor(".card");
      const firstCardTitle = await page.getContent(".card-title");
      const firstCardContent = await page.getContent("p");
      expect(firstCardTitle).toEqual("My Title");
      expect(firstCardContent).toEqual("My Content");
    });
  });
});
