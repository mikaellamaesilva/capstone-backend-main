
const sgMail = require('@sendgrid/mail')
const jwt = require('jsonwebtoken');


async function sendEmailVerification(userDetails) {
  try {
    const token = await signToken({
      email: userDetails.email,
      id: userDetails.id,
      adminLevel: userDetails.adminLevel
    })
    const subject = 'Email Verification';
    const confirmationLink = `${process.env.CLIENT_HOSTNAME}/verify-email?token=${token}`;
    const message = `
    <p>Hello <b>${userDetails.firstName}</b>,</p>
    <p>
    Kindly click on this <a href="${confirmationLink}">link</a> to verify your email. After verification, you can log in with the following credentials.
  
    </p>
    <br/>
    <p><b>Email: </b>
    ${userDetails.email}
    </p>
    <p><b>Password (applicable for recently approved hosts only): </b>
    esee.host.2022
    </p>
    
    <br/>
    <p>Thank you.</p>
    <br/>
    <hr/>
    <br/>
    <p>Regards,<br/>E-See Management</p>
    `;
  
    const account = {
      email: "esee.management@outlook.com",
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: userDetails.email, 
      from: `E-See Management <${account.email}>`,
      subject: subject,
      text: message,
      html: message,
    }
    await sgMail.send(msg)
  } catch (err) {
    console.log(err);
  }
}

// async function sendPasswordReset(userDetails) {
//   try {
//     const token = await signToken({
//       email: userDetails.email,
//       id: userDetails.id,
//       adminLevel: userDetails.adminLevel
//     })
//     const subject = 'Email Verification';
//     const confirmationLink = `${process.env.CLIENT_HOSTNAME}/reset-password?token=${token}`;
//     const message = `
//     <p>Hello <b>${userDetails.firstName}</b>,</p>
//     <br/>
//     <p>
//     Kindly click on this <a href="${confirmationLink}">link</a> to reset your password.
  
//     </p>
//     <br/>
//     <p>Thank you.</p>
//     <br/>
//     <hr/>
//     <br/>
//     <p>Regards,<br/>E-See Management</p>
//     `;
  
//     const account = {
//       email: "esee.management@outlook.com",
//       password: "Logmein+1234"
//     }
//     const transporter = nodemailer.createTransport({
//       host: "smtp-mail.outlook.com",
//       port: 587,
//       secure: false,
//       tls: {
//         ciphers:'SSLv3'
//       },
//       auth: {
//         user: account.email, 
//         pass: account.password, 
//       },
//     });
  
//     await transporter.sendMail({
//       from: `"E-See Management" <${account.email}>`, 
//       to: userDetails.email, 
//       subject: subject,
//       html: message,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// }

async function sendGeneralEmail(userDetails, adminMessage) {
  try {
    const subject = 'Message from Administrator';
    const message = `
    <p>Hello <b>${userDetails.firstName}</b>,</p>
    <p>
    This is an email sent by an administrator from the E-See web application. Kindly read the message below.
  
    </p>

    <p><i>
    "${adminMessage}"
    </i>
    </p>
    <br/>
    <hr/>
    <br/>
    <p>Regards,<br/>E-See Management</p>
    `;
  
    const account = {
      email: "esee.management@outlook.com",
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: userDetails.email, 
      from: `E-See Management <${account.email}>`,
      subject: subject,
      text: message,
      html: message,
    }
    await sgMail.send(msg)
  } catch (err) {
    console.log(err);
  }
}

async function signToken(details) {
  try {
    const accessToken = await jwt.sign(details, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
    return accessToken
  } catch (err) {
    throw err;
  }
}

async function verifyToken(token) {
  try {
    const details = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return details ? details : null
  } catch (err) {
    throw err;
    return null;
  }
}

module.exports = { sendEmailVerification, verifyToken, sendGeneralEmail }