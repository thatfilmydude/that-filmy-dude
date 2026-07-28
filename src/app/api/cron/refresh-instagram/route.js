export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== "Bearer " + process.env.CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const settingRes = await fetch(process.env.STRAPI_URL + "/api/site-setting", {
      headers: { Authorization: "Bearer " + process.env.STRAPI_API_TOKEN },
      cache: "no-store",
    });

    if (!settingRes.ok) {
      return Response.json({ success: false, step: "fetch-setting", error: "Could not read Site Setting" });
    }

    const settingJson = await settingRes.json();
    const currentToken = settingJson.data.instagram_token;

    if (!currentToken) {
      return Response.json({ success: false, step: "no-token", error: "No token found in Strapi" });
    }

    const refreshUrl = "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=" + currentToken;
    const refreshRes = await fetch(refreshUrl);

    if (!refreshRes.ok) {
      const errorText = await refreshRes.text();
      return Response.json({ success: false, step: "instagram-refresh", error: errorText });
    }

    const refreshJson = await refreshRes.json();
    const newToken = refreshJson.access_token;

    if (!newToken) {
      return Response.json({ success: false, step: "no-new-token", error: "Instagram did not return a new token" });
    }

    const updateRes = await fetch(process.env.STRAPI_URL + "/api/site-setting", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + process.env.STRAPI_WRITE_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { instagram_token: newToken } }),
    });

    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      return Response.json({ success: false, step: "strapi-update", error: errorText });
    }

    return Response.json({ success: true, message: "Instagram token refreshed successfully" });
  } catch (e) {
    return Response.json({ success: false, step: "unexpected", error: e.message });
  }
}
