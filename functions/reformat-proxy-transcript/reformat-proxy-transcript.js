const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const params = JSON.parse(event.body);
    const transcript = params.transcript;
    return {
      statusCode: 200,
      body: JSON.stringify({transcript: transcript}),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
