const Page = require("./helpers/page.js");
let page;

beforeEach(async () => {
  page = await Page.build();
});

afterEach(async () => {
  await page.close();
});

test("correct logo text", async () => {
  const text = await page.getContent("a.brand-logo");
  expect(text).toEqual("Blogster");
});

test("clicking login starts OAuth flow", async () => {
  await page.click(".right a");
  const currentUrl = page.url();
  expect(currentUrl).toContain("accounts.google.com");
});

test("When signed in, shows logout button", async () => {
  await page.login();
  const text = await page.getContent('a[href="/auth/logout"]');

  expect(text).toEqual("Logout");
});
