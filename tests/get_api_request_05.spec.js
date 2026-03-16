const { test, expect } = require("@playwright/test");

test("Create GET api request in playwright", async ({ request }) => {

  const getAPIResponse = await request.get("/booking/1"); 

  const getAPIResponseBody = await getAPIResponse.json();
  console.log(getAPIResponseBody);                        

  expect(getAPIResponse.ok()).toBeTruthy();
  expect(getAPIResponse.status()).toBe(200);

  expect(getAPIResponseBody).toHaveProperty("firstname");
  expect(getAPIResponseBody).toHaveProperty("lastname");
  expect(getAPIResponseBody).toHaveProperty("totalprice");
  expect(getAPIResponseBody).toHaveProperty("bookingdates");
  expect(getAPIResponseBody.bookingdates).toHaveProperty("checkin");
  expect(getAPIResponseBody.bookingdates).toHaveProperty("checkout");
});