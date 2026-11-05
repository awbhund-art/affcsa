export async function onRequest(context) {
  const request = context.request;
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase();

  // 1. Social Crawlers aur Facebook Bots ko allow karein taake OG tags load ho sakein
  const isSocialCrawler = 
    userAgent.includes("facebookexternalhit") || 
    userAgent.includes("facebot") || 
    userAgent.includes("twitterbot") || 
    userAgent.includes("linkedinbot");

  if (isSocialCrawler) {
    return context.next(); // Yeh OG tags read karne ke liye zarori hai
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
