export async function onRequest(context) {
  const request = context.request;
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase();

  // 1. Facebook bot ko specifically block / disallow karein
  if (userAgent.includes("facebookexternalhit") || userAgent.includes("facebot")) {
    return new Response("Access Denied", { status: 403 });
  }

  // Baaki social crawlers ke liye
  const isSocialCrawler = userAgent.includes("twitterbot") || 
                         userAgent.includes("linkedinbot");

  if (isSocialCrawler) {
    return context.next();
  }

  // 2. Normal users ke liye mobile/desktop detection
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isMobileDevice = isMobile || context.request.cf?.deviceType === "mobile";

  // 3. Agar mobile device HAI, toh index.html load hone dein
  if (isMobileDevice) {
    return context.next();
  }

  // 4. Sirf Desktop users ko redirect karein
  return Response.redirect("https://google.com", 302);
}
