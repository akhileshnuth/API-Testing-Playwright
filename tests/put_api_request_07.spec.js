const { test, expect } = require("@playwright/test");
const postRequest = require("../test-data/post_request_body.json");
const tokenRequest = require("../test-data/token_request_body.json");
const putRequest = require("../test-data/put_request_body.json");

test("PUT api request with auth token", async ({ request }) => {

  // Step 1: Create a booking 
  const postAPIResponse = await request.post("/booking", {
    data: postRequest,
  }); 
  // validate POST before using its data
  expect(postAPIResponse.ok()).toBeTruthy();
  expect(postAPIResponse.status()).toBe(200);

  const postAPIResponseBody = await postAPIResponse.json();
  const bId = postAPIResponseBody.bookingid;
  console.log("Created booking ID:", bId);

  //Step 2: Search booking by name
  const getAPIResponse = await request.get("/booking", { 
    params: {
      firstname: postRequest.firstname, 
      lastname: postRequest.lastname,
    },
  });

  // parse .json() once into variable then log
  const getAPIResponseBody = await getAPIResponse.json();
  console.log("Search results:", getAPIResponseBody);

  expect(getAPIResponse.ok()).toBeTruthy();
  expect(getAPIResponse.status()).toBe(200);

  // assert search results contain our booking ID
  expect(Array.isArray(getAPIResponseBody)).toBeTruthy();
  const allIds = getAPIResponseBody.map((b) => b.bookingid);
  expect(allIds).toContain(bId);

  // Step 3: Generate auth token 
  const tokenAPIResponse = await request.post("/auth", {
    data: tokenRequest,
  });
  expect(tokenAPIResponse.ok()).toBeTruthy();
  expect(tokenAPIResponse.status()).toBe(200);

  // parse .json() ONCE — removed duplicate console.log before it
  const tokenResponseBody = await tokenAPIResponse.json();
  console.log("Token response:", tokenResponseBody);
  const tokenNo = tokenResponseBody.token;

  // Step 4: Update the booking 
  const putAPIResponse = await request.put(`/booking/${bId}`, {
    headers: {
      "Content-Type": "application/json",
      "Cookie": `token=${tokenNo}`,
    },
    data: putRequest,
  });

  const putAPIResponseBody = await putAPIResponse.json();
  console.log("PUT response:", putAPIResponseBody);

  expect(putAPIResponse.ok()).toBeTruthy();
  expect(putAPIResponse.status()).toBe(200);

  // assert the updated fields actually changed
  expect(putAPIResponseBody).toHaveProperty("firstname", putRequest.firstname);
  expect(putAPIResponseBody).toHaveProperty("lastname", putRequest.lastname);
  expect(putAPIResponseBody).toHaveProperty("totalprice", putRequest.totalprice);
  expect(putAPIResponseBody.bookingdates).toHaveProperty("checkin", putRequest.bookingdates.checkin);
  expect(putAPIResponseBody.bookingdates).toHaveProperty("checkout", putRequest.bookingdates.checkout);
});