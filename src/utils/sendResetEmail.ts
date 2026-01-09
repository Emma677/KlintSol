// import resend from "../config/resend";

// export async function sendResetEmail(
//   email: string,
//   resetToken: string
// ) {
//   const resetUrl =  `https://klintSocials.com/reset-password?resetToken=${resetToken}`;

//   await resend.emails.send({
//     from: "e04acheampong@gmail.com", // works without domain
//     to: email,
//     subject: "Reset your password",
//     html: `
//       <div style="font-family: sans-serif;">
//         <h2>Password Reset</h2>
//         <p>You requested a password reset.</p>
//         <p>
//           <a href="${resetUrl}" style="
//             background:#f59e0b;
//             color:#000;
//             padding:12px 18px;
//             text-decoration:none;
//             border-radius:6px;
//             display:inline-block;
//           ">
//             Reset Password
//           </a>
//         </p>
//         <p>This link expires in 1 hour.</p>
//       </div>
//     `,
//   });
// }


import resend from "../config/resend";

export async function sendResetEmail(
  email: string,
  resetToken: string
) {
  const resetUrl = `https://klintSocials.com/reset-password?resetToken=${resetToken}`;

  return resend.emails.send({
    from: "KlintSol <onboarding@resend.dev>", 
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: sans-serif;">
        <h2>Password Reset</h2>
        <p>You requested a password reset.</p>
        <p>
          <a href="${resetUrl}" style="
            background:#f59e0b;
            color:#000;
            padding:12px 18px;
            text-decoration:none;
            border-radius:6px;
            display:inline-block;
          ">
            Reset Password
          </a>
        </p>
        <p>This link expires in 1 hour.</p>
      </div>
    `,
  });
}
