const { test, expect } = require("@playwright/test");
const postRequest = require("../test-data/post_request_body.json");

test("Query parameter in playwright api testing", async ({ request }) => {
  // create post api request
  const postAPIResponse = await request.post("/booking", {
    data: postRequest,
  });

  // create GET api request 
  const getAPIResponse = await request.get("/booking/", {
    params: {
      firstname: "akhilesh",
      lastname: "nuth",
    },
  });

  // validate status code
  console.log(await getAPIResponse.json());
  expect(getAPIResponse.ok()).toBeTruthy();
  expect(getAPIResponse.status()).toBe(200);
});
