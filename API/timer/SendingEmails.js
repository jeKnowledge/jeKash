const nodemailer = require("nodemailer");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const timer = 3000; //tempo de espera que o codigo vai atualizar

const aUrl = "http://localhost:5000/dividas";

var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}

async function sendEmail(){
  let responseJSON =HttpClient();
  console.log(responseJSON)

  // Ethereal e uma coisa que me vai ajudar a simular mandar emails:
  const transporter = nodemailer.createTransport({
    // host do ethreal que e quem me esta a mandar fake emails
    host: "smtp.ethereal.email",
    // true for 465, false for other ports
    port: 587,
    secure: false,
    auth: {
      //conta dada para testar:
      user: "	frederic.rolfson@ethereal.email", // generated ethereal user
      pass: "yVFQXmEZ9mNuunP1Qd" // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
      from: '"Yo" <JeknowledgeFIXE@example.com>', // sender address
      to: "frederic.rolfson@ethereal.email", // e a minha test account
      subject: "SOMEONE RECIVED MAIL1!!!11!1!!1!", // Subject line
      text: "Hello world?", // plain text body: dizer estas a dever uma certa quantia por agora so
      html: "<b>Hello world?</b>", // html body
    });

    //info do que mandei e do Url da mensagem
  console.log("Message sent: %s", info.messageId); 
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
}

setInterval(() => {
  //codigo que vai correr de X em X tempo (X=timer)
  console.log("Checking..."); //para avisar que a função vai correr
  
    (function(){
      sendEmail()
  })();

}, timer);