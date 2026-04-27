/**
 * Vercel Function: POST /api/contact
 * Handles form submissions from the Contact page.
 *
 * Environment variables:
 * - CONTACT_EMAIL_TO: Recipient email address (defaults to contact@musifer.studio)
 * - CONTACT_SENDER_EMAIL: Sender mailbox in M365 (defaults to contact@musifer.studio)
 * - GRAPH_CLIENT_ID: Entra app client ID
 * - GRAPH_TENANT_ID: Entra tenant ID
 * - GRAPH_CERT_THUMBPRINT: SHA-1 thumbprint for certificate auth
 * - GRAPH_CERT_PRIVATE_KEY_PEM: Certificate private key PEM
 * - CONTACT_RATE_LIMIT: Max requests per minute per IP (default: 5)
 *
 * Request body (application/json):
 * {
 *   "name": string (required, 1-200 chars),
 *   "email": string (required, valid email),
 *   "message": string (required, 1-5000 chars),
 *   "subject": string (optional, 0-200 chars),
 *   "_honeypot": string (must be empty)
 * }
 *
 * Response:
 * {
 *   "status": "success" | "error" | "throttled",
 *   "message": string (optional, user-facing error detail)
 * }
 */

import crypto from "node:crypto";

const DEFAULT_CONTACT_MAILBOX = "contact@musifer.studio";
const DEFAULT_GRAPH_CLIENT_ID = "c70a07da-501a-471e-9b9c-5f7091e97d1b";
const DEFAULT_GRAPH_TENANT_ID = "c02e40f9-9673-46a4-8bfc-b371b1a44438";

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function normalizePem(value) {
  return String(value || "").replace(/\\n/g, "\n").trim();
}

function normalizeThumbprint(value) {
  return String(value || "").replace(/:/g, "").trim().toUpperCase();
}

function thumbprintToX5t(thumbprintHex) {
  const normalized = normalizeThumbprint(thumbprintHex);
  if (!/^[A-F0-9]{40}$/.test(normalized)) {
    throw new Error("Invalid GRAPH_CERT_THUMBPRINT format");
  }
  return base64UrlEncode(Buffer.from(normalized, "hex"));
}

function createClientAssertion(options) {
  const now = Math.floor(Date.now() / 1000);
  const tokenUrl = `https://login.microsoftonline.com/${options.tenantId}/oauth2/v2.0/token`;

  const header = {
    alg: "RS256",
    typ: "JWT",
    x5t: thumbprintToX5t(options.thumbprint)
  };

  const payload = {
    aud: tokenUrl,
    exp: now + 600,
    iss: options.clientId,
    jti: crypto.randomUUID(),
    nbf: now - 30,
    sub: options.clientId
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(options.privateKeyPem);

  return `${unsignedToken}.${base64UrlEncode(signature)}`;
}

async function getGraphAccessToken() {
  const clientId = process.env.GRAPH_CLIENT_ID || DEFAULT_GRAPH_CLIENT_ID;
  const tenantId = process.env.GRAPH_TENANT_ID || DEFAULT_GRAPH_TENANT_ID;
  const thumbprint = process.env.GRAPH_CERT_THUMBPRINT;
  const privateKeyPem = normalizePem(process.env.GRAPH_CERT_PRIVATE_KEY_PEM);

  if (!thumbprint || !privateKeyPem) {
    return {
      success: false,
      error: "Graph auth not configured"
    };
  }

  let assertion;
  try {
    assertion = createClientAssertion({
      clientId,
      tenantId,
      thumbprint,
      privateKeyPem
    });
  } catch (error) {
    console.error("Graph assertion error:", error && error.message ? error.message : error);
    return {
      success: false,
      error: "Graph assertion failed"
    };
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const tokenBody = new URLSearchParams({
    client_assertion: assertion,
    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_id: clientId,
    grant_type: "client_credentials",
    scope: "https://graph.microsoft.com/.default"
  });

  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: tokenBody.toString()
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error("Graph token request failed:", tokenResponse.status, errorText);
    return {
      success: false,
      error: "Graph token request failed"
    };
  }

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    console.error("Graph token response missing access_token");
    return {
      success: false,
      error: "Graph token missing"
    };
  }

  return {
    success: true,
    accessToken: tokenData.access_token
  };
}

// Simple in-memory rate limiter (per IP, per endpoint)
// In production, use Redis or similar for persistence across serverless instances
const RATE_LIMIT_STORE = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const RATE_LIMIT_MAX = parseInt(process.env.CONTACT_RATE_LIMIT || "5", 10);

/**
 * Check rate limit for client IP
 * @param {string} clientIp - Client IP address from request headers
 * @returns {boolean} - true if request is allowed, false if throttled
 */
function checkRateLimit(clientIp) {
  const now = Date.now();
  const key = `contact-form:${clientIp}`;
  const record = RATE_LIMIT_STORE.get(key) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

  // Reset window if expired
  if (now >= record.resetTime) {
    record.count = 0;
    record.resetTime = now + RATE_LIMIT_WINDOW;
  }

  record.count += 1;
  RATE_LIMIT_STORE.set(key, record);

  // Cleanup old entries periodically
  if (RATE_LIMIT_STORE.size > 1000) {
    for (const [k, v] of RATE_LIMIT_STORE.entries()) {
      if (now >= v.resetTime) {
        RATE_LIMIT_STORE.delete(k);
      }
    }
  }

  return record.count <= RATE_LIMIT_MAX;
}

/**
 * Validate form submission data
 * @param {object} body - Request body
 * @returns {object} - { valid: boolean, errors: string[], data: object }
 */
function validateFormData(body) {
  const errors = [];
  const data = {};

  // Check honeypot (bot prevention)
  if (body._honeypot && String(body._honeypot).trim() !== "") {
    return {
      valid: false,
      errors: ["Invalid submission"],
      data: null
    };
  }

  // Validate name
  const name = String(body.name || "").trim();
  if (!name || name.length < 1 || name.length > 200) {
    errors.push("Name is required and must be 1-200 characters");
  } else {
    data.name = name;
  }

  // Validate email
  const email = String(body.email || "").trim();
  const emailRegex = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Email is required and must be a valid email address");
  } else {
    data.email = email;
  }

  // Validate message
  const message = String(body.message || "").trim();
  if (!message || message.length < 1 || message.length > 5000) {
    errors.push("Message is required and must be 1-5000 characters");
  } else {
    data.message = message;
  }

  // Validate subject (optional)
  const subject = String(body.subject || "").trim();
  if (subject && subject.length > 200) {
    errors.push("Subject must be 200 characters or less");
  } else if (subject) {
    data.subject = subject;
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : null
  };
}

/**
 * Send email via Microsoft Graph
 * @param {object} formData - Validated form data
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function sendEmail(formData) {
  const senderEmail = process.env.CONTACT_SENDER_EMAIL || DEFAULT_CONTACT_MAILBOX;
  const recipientEmail = process.env.CONTACT_EMAIL_TO || DEFAULT_CONTACT_MAILBOX;

  const tokenResult = await getGraphAccessToken();
  if (!tokenResult.success) {
    return {
      success: false,
      error: "Email service not configured. Please try again later."
    };
  }

  const sendMailResponse = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(senderEmail)}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenResult.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: {
          subject: formData.subject || "New contact form submission",
          body: {
            contentType: "Text",
            content: [
              "New contact submission",
              "",
              `Name: ${formData.name}`,
              `Email: ${formData.email}`,
              `Subject: ${formData.subject || "(none)"}`,
              "",
              "Message:",
              formData.message,
              "",
              `Received: ${new Date().toISOString()}`
            ].join("\n")
          },
          replyTo: [
            {
              emailAddress: {
                address: formData.email,
                name: formData.name
              }
            }
          ],
          toRecipients: [
            {
              emailAddress: {
                address: recipientEmail
              }
            }
          ]
        },
        saveToSentItems: true
      })
    }
  );

  if (!sendMailResponse.ok) {
    const errorText = await sendMailResponse.text();
    console.error("Graph sendMail failed:", sendMailResponse.status, errorText);
    return {
      success: false,
      error: "Email delivery failed"
    };
  }

  return { success: true };
}

/**
 * Get client IP from request headers (Vercel proxy)
 * @param {object} req - Vercel request object
 * @returns {string} - Client IP address
 */
function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

/**
 * Main handler
 */
export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      message: "Method not allowed"
    });
  }

  // Set CORS headers (adjust origin as needed)
  res.setHeader("Access-Control-Allow-Origin", process.env.VERCEL_ENV === "production" ? "https://musifer.studio" : "*");
  res.setHeader("Content-Type", "application/json");

  // Get client IP for rate limiting
  const clientIp = getClientIp(req);

  // Check rate limit
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      status: "throttled",
      message: "Too many requests. Please try again later."
    });
  }

  // Validate form data
  const validation = validateFormData(req.body || {});
  if (!validation.valid) {
    return res.status(400).json({
      status: "error",
      message: "Invalid submission. Please check your input and try again."
    });
  }

  const sendResult = await sendEmail(validation.data);
  if (!sendResult.success) {
    return res.status(500).json({
      status: "error",
      message: "Your message couldn't be sent right now. Please try again shortly."
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Thank you for your message. We'll be in touch soon."
  });
}
