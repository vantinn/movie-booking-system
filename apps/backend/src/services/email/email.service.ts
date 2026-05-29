import nodemailer from 'nodemailer';

let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
    if (!_transporter) {
        _transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
    }
    return _transporter;
}

function buildOtpEmailHtml(otpCode: string, fullName: string): string {
    const digits = otpCode.split('');
    const digitBoxes = digits
        .map(
            (d) =>
                `<td style="padding:0 6px;">
                    <div style="
                        display:inline-block;
                        width:52px; height:60px;
                        background:#1c1c1e;
                        border:2px solid #dc2626;
                        border-radius:12px;
                        font-size:28px;
                        font-weight:900;
                        color:#ffffff;
                        line-height:60px;
                        text-align:center;
                        letter-spacing:0;
                        font-family:'Courier New',monospace;
                    ">${d}</div>
                </td>`
        )
        .join('');

    return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Xác nhận email – VT Cinema</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <tr>
            <td align="center" style="padding-bottom:32px;">
              <div style="
                display:inline-flex;align-items:center;gap:10px;
                background:#18181b;
                border:1px solid rgba(255,255,255,0.08);
                border-radius:16px;
                padding:12px 24px;
              ">
                <div style="
                  width:36px;height:36px;
                  background:linear-gradient(135deg,#dc2626,#b91c1c);
                  border-radius:8px;
                  display:inline-block;
                "></div>
                <span style="color:#fff;font-size:18px;font-weight:900;letter-spacing:0.5px;">VT Cinema</span>
              </div>
            </td>
          </tr>

          <tr>
            <td style="
              background:#18181b;
              border:1px solid rgba(255,255,255,0.08);
              border-radius:20px;
              overflow:hidden;
            ">
              <div style="height:4px;background:linear-gradient(90deg,#dc2626,#ef4444);"></div>

              <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 40px 36px;">

                <tr>
                  <td style="padding-bottom:8px;">
                    <p style="margin:0;font-size:13px;font-weight:600;color:#dc2626;text-transform:uppercase;letter-spacing:1.5px;">
                      Xác minh tài khoản
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:20px;">
                    <h1 style="margin:0;font-size:26px;font-weight:900;color:#ffffff;line-height:1.2;">
                      Xin chào, ${fullName}!
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:32px;">
                    <p style="margin:0;font-size:15px;color:#a1a1aa;line-height:1.7;">
                      Cảm ơn bạn đã đăng ký tài khoản tại <strong style="color:#ffffff;">VT Cinema</strong>.<br/>
                      Vui lòng nhập mã OTP bên dưới để xác minh địa chỉ email và hoàn tất đăng ký.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>${digitBoxes}</tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom:24px;">
                    <div style="height:1px;background:rgba(255,255,255,0.07);"></div>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom:24px;">
                    <table cellpadding="0" cellspacing="0" style="
                      background:rgba(220,38,38,0.08);
                      border:1px solid rgba(220,38,38,0.2);
                      border-radius:12px;
                      padding:14px 18px;
                      width:100%;
                    ">
                      <tr>
                        <td>
                          <p style="margin:0;font-size:13px;color:#fca5a5;font-weight:600;">
                            Mã OTP có hiệu lực trong <strong>10 phút</strong>
                          </p>
                          <p style="margin:6px 0 0;font-size:12px;color:#71717a;">
                            Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td>
                    <p style="margin:0;font-size:12px;color:#52525b;line-height:1.6;">
                      VT Cinema sẽ <strong style="color:#71717a;">không bao giờ</strong> yêu cầu bạn chia sẻ mã OTP này qua điện thoại hoặc chat. Hãy giữ bí mật mã này.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0;font-size:12px;color:#3f3f46;">
                &copy; 2025 VT Cinema · Đà Nẵng, Việt Nam
              </p>
              <p style="margin:6px 0 0;font-size:12px;color:#3f3f46;">
                Email này được gửi tự động, vui lòng không trả lời.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOtpEmail(
    to: string,
    otpCode: string,
    fullName: string = 'there'
): Promise<void> {
    const transporter = getTransporter();

    await transporter.sendMail({
        from: `"VT Cinema" <${process.env.GMAIL_USER}>`,
        to,
        subject: `[VT Cinema] Mã xác minh OTP: ${otpCode}`,
        html: buildOtpEmailHtml(otpCode, fullName),
        text: `Mã OTP của bạn là: ${otpCode}\nMã có hiệu lực trong 10 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.`,
    });
}
