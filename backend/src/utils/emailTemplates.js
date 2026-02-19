/**
 * Generates the HTML email template for password reset
 * @param {string} resetLink
 * @returns {string}
 */
const getPasswordResetTemplate = (resetLink) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6fb; font-family:Arial, Helvetica, sans-serif;">

  <!-- Outer Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); border:1px solid #e5e9f2;">

          <!-- Gradient Header -->
          <tr>
            <td align="center" style="padding:32px 20px; background:linear-gradient(135deg, #2563eb, #06b6d4); border-radius:16px 16px 0 0;">

              <!-- Logo -->
              <div style="width:80px; height:80px; border-radius:50%; box-shadow:0 6px 16px rgba(0,0,0,0.15);">
                <img
                  src="https://res.cloudinary.com/delgicpkb/image/upload/v1767769234/logo_euem4b.png"
                  alt="InfravisionAI"
                  width="68"
                  height="68"
                  style="border-radius:50%; display:block;"
                />
              </div>

              <!-- Brand -->
              <div style="margin-top:14px; color:#ffffff; font-size:20px; font-weight:700; letter-spacing:0.5px;">
                InfravisionAI
              </div>

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td align="center" style="padding:40px 32px 24px;">

              <h1 style="margin:0 0 16px; font-size:26px; color:#111827;">
                Reset Your Password
              </h1>

              <p style="margin:0 0 28px; font-size:16px; color:#4b5563; line-height:1.6;">
                You requested to reset your password. Click the button below to securely set a new password for your account.
              </p>

              <!-- CTA Button -->
              <a
                href="${resetLink}"
                style="
                  display:inline-block;
                  background:linear-gradient(135deg, #2563eb, #3b82f6);
                  color:#ffffff;
                  padding:14px 36px;
                  font-size:16px;
                  font-weight:600;
                  border-radius:999px;
                  text-decoration:none;
                  box-shadow:0 10px 20px rgba(37,99,235,0.35);
                "
              >
                Reset Password
              </a>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <hr style="border:none; border-top:1px solid #e5e7eb;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px 32px 32px; font-size:13px; color:#6b7280; line-height:1.6;">
              If you didn’t request this password reset, you can safely ignore this email.<br />
              <strong>This link will expire in 1 hour.</strong>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};

/**
 * Generates the HTML email template for Welcome Email
 * @param {string} dashboardUrl
 * @returns {string}
 */
const getWelcomeEmailTemplate = (dashboardUrl) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Infravision AI</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6fb; font-family:Arial, Helvetica, sans-serif;">

  <!-- Outer Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); border:1px solid #e5e9f2;">

          <!-- Gradient Header -->
          <tr>
            <td align="center" style="padding:32px 20px; background:linear-gradient(135deg, #2563eb, #06b6d4); border-radius:16px 16px 0 0;">

              <!-- Logo -->
              <div style="width:80px; height:80px; border-radius:50%; box-shadow:0 6px 16px rgba(0,0,0,0.15);">
                <img
                  src="https://res.cloudinary.com/delgicpkb/image/upload/v1767769234/logo_euem4b.png"
                  alt="Infravision AI"
                  width="68"
                  height="68"
                  style="border-radius:50%; display:block;"
                />
              </div>

              <!-- Brand -->
              <div style="margin-top:14px; color:#ffffff; font-size:20px; font-weight:700; letter-spacing:0.5px;">
                Infravision AI
              </div>

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td align="center" style="padding:40px 32px 24px;">

              <h1 style="margin:0 0 16px; font-size:26px; color:#111827;">
                Welcome to InfravisionAI
              </h1>

              <p style="margin:0 0 28px; font-size:16px; color:#4b5563; line-height:1.6;">
                We are thrilled to have you on board! Your account has been successfully created using Google. Get ready to experience the future of AI.
              </p>

              <!-- CTA Button -->
              <a
                href="${dashboardUrl}"
                style="
                  display:inline-block;
                  background:linear-gradient(135deg, #2563eb, #3b82f6);
                  color:#ffffff;
                  padding:14px 36px;
                  font-size:16px;
                  font-weight:600;
                  border-radius:999px;
                  text-decoration:none;
                  box-shadow:0 10px 20px rgba(37,99,235,0.35);
                "
              >
                Get Started
              </a>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <hr style="border:none; border-top:1px solid #e5e7eb;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px 32px 32px; font-size:13px; color:#6b7280; line-height:1.6;">
              If you have any questions, feel free to reply to this email.<br />
              <strong>We're here to help!</strong>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};

/**
 * Generates the HTML email template for Email Verification
 * @param {string} verificationLink
 * @returns {string}
 */
const getVerificationEmailTemplate = (verificationLink) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6fb; font-family:Arial, Helvetica, sans-serif;">

  <!-- Outer Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); border:1px solid #e5e9f2;">

          <!-- Gradient Header -->
          <tr>
            <td align="center" style="padding:32px 20px; background:linear-gradient(135deg, #2563eb, #06b6d4); border-radius:16px 16px 0 0;">

              <!-- Logo -->
              <div style="width:80px; height:80px; border-radius:50%; box-shadow:0 6px 16px rgba(0,0,0,0.15);">
                <img
                  src="https://res.cloudinary.com/delgicpkb/image/upload/v1767769234/logo_euem4b.png"
                  alt="Infravision AI"
                  width="68"
                  height="68"
                  style="border-radius:50%; display:block;"
                />
              </div>

              <!-- Brand -->
              <div style="margin-top:14px; color:#ffffff; font-size:20px; font-weight:700; letter-spacing:0.5px;">
                InfravisionAI
              </div>

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td align="center" style="padding:40px 32px 24px;">

              <h1 style="margin:0 0 16px; font-size:26px; color:#111827;">
                Verify Your Email
              </h1>

              <p style="margin:0 0 28px; font-size:16px; color:#4b5563; line-height:1.6;">
                Thanks for signing up! We're excited to have you on board. Please confirm your email to activate your account and get started.
              </p>

              <!-- CTA Button -->
              <a
                href="${verificationLink}"
                style="
                  display:inline-block;
                  background:linear-gradient(135deg, #2563eb, #3b82f6);
                  color:#ffffff;
                  padding:14px 36px;
                  font-size:16px;
                  font-weight:600;
                  border-radius:999px;
                  text-decoration:none;
                  box-shadow:0 10px 20px rgba(37,99,235,0.35);
                "
              >
                Verify Email
              </a>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <hr style="border:none; border-top:1px solid #e5e7eb;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px 32px 32px; font-size:13px; color:#6b7280; line-height:1.6;">
              If you didn’t create this account, you can safely ignore this email.<br />
              <strong>This link will expire in 24 hours.</strong>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};

module.exports = { getPasswordResetTemplate, getWelcomeEmailTemplate, getVerificationEmailTemplate };
