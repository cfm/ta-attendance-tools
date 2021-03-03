const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const params = JSON.parse(event.body);
    const memberList = params.memberList;
    const presentList = params.presentList;

    console.debug(`Received memberList of size=${memberList.length}`);
    console.debug(`Received presentList of size=${presentList.length}`);

    return {
      statusCode: 200,
    }
  }
  catch (error) {
    return {
      statusCode: 500,
      body: error.toString(),
    }
  }
}

module.exports = { handler }
