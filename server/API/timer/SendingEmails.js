const nodemailer = require("nodemailer");
const express = require("express");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Divida = require("../models/divida");
//? Se quiserem mudar para testar e recomendado mudar esta variavel
const timer = 1; //! MAS No final mudar para ser algo diario const timer = 86400;

console.log("Started.");

//*url para fazer o request de todas as dividas.
//! No final mudar para os defenitivos!!
const GETdividasServerURL = "https://jekash.herokuapp.com/dividas/all_dividas_para_o_email";
const GETuserServerURL = "https://jekash.herokuapp.com/users/getall";

//Função client que me dá o GET request
var HttpClient = function () {
  this.get = function (aUrl, aCallback) {
    var anHttpRequest = new XMLHttpRequest(); //crio uma nova instancia da class para fazer um request
    console.log(aCallback)
    anHttpRequest.onreadystatechange = function () {
      //quando a API estiver pronta
      if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
        //e se estiver tudo bem
        console.log(anHttpRequest.responseText)
      aCallback(anHttpRequest.responseText); //* é como se fosse um return ao minha resposta atraves do callBack
    };

    anHttpRequest.open("GET", aUrl, true); //faço um GET request ao Url
    //mando um post com um header a dizer server e com esta server key
    //* para provar que sou o server vou as headers e se o header server tiver a localserverkey e porque sou eu.
    anHttpRequest.setRequestHeader("Server", process.env.LOCAL_SERVERKEY);
    anHttpRequest.send(null); //Como e um GET não mando nada
  };
};

function timepassed(date) {
  //! em dias
  let dataDivida = new Date(date);

  let today = new Date();
  let dateNOW =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2); //formating Date to a recognizable format, adiciono um zero antes para se no caso do mes for 1 ficar 01 e depois dar slice às ultimas duas chars
  //se for por exemplo 12 ele vai adicionar um zero - 012 mas corto depois as ultimas chars e fica outra vez 12
  let dateNOWCorrectformat = new Date(dateNOW);

  //conta para a diferença:
  let diferencadias =
    (dateNOWCorrectformat.getTime() - dataDivida.getTime()) /
    (1000 * 3600 * 24); //faço a conta para me dar a diferença em dias

  return diferencadias;
}

function checkDates() {
  //função que recebe as datas
  var client = new HttpClient(); //crio uma nova instancia da função acima


  //*preciso de me autenticar se nao não me deixa fazer o GET request as dividas
  client.get(GETdividasServerURL, function (responseDivida) {
    //e simplesmente faço um get que vai fazer uma função que vai ter como parametro a resposta da API
    console.log(responseDivida)
    //*preciso de me autenticar se nao não me deixa fazer o GET request aos users!
    client.get(GETuserServerURL, function (responseUser) {
      //passo para JSON visto que a resposta veio em pleno texto
      var responseJSONDIVIDAS = JSON.parse(responseDivida);
      var responseJSONUSER = JSON.parse(responseUser);

      for (let dividaskeys in Object.keys(responseJSONDIVIDAS.Dividas)) {
        //dou assign a values que sa calhar tenho de trabalhar com
        let dividaID = responseJSONDIVIDAS.Dividas[dividaskeys].id; //Id da divida
        let paga = responseJSONDIVIDAS.Dividas[dividaskeys].paga; //situação de pagamento
        let userdivida = responseJSONDIVIDAS.Dividas[dividaskeys].devedor; //id do devedor
        let quantiadivida = responseJSONDIVIDAS.Dividas[dividaskeys].quantia; //quantia
        let datadivida = responseJSONDIVIDAS.Dividas[dividaskeys].date; //importante para calcular o levelwarning
        let emailmandado =
          responseJSONDIVIDAS.Dividas[dividaskeys].timesemailsent;
        let tempopassadodias = timepassed(datadivida); //função que calcula qual e o tipo de warning que devo tomar consoante o tempo passado.

        //looping through all users to find the respective one
        for (let userinDB in Object.keys(responseJSONUSER.list)) {
          if (responseJSONUSER.list[userinDB]._id === userdivida) {
            //encontrei o user que corresponde à divida
            var useremail = responseJSONUSER.list[userinDB].email; //guardo numa variavel o email dela.
          }
        }
        //*   dividaupdatestatus = 0  --> Não estão a ser mandados warnings
        //*   dividaupdatestatus = 1  --> Ao 7º dia foi mandado um warning
        //*   dividaupdatestatus = 2  --> Ao 14º dia foi mandado outro warning (+7)
        //*   dividaupdatestatus = 3  --> Ao 18º dia foi mandado outro warning (+3) e apartir de agora e diariamente ate cancelar o job.

        console.log(dividaID)
        if (paga === false) {
          //default msg depois podemos mudar:
          let msg =
            "Hey, deves " +
            quantiadivida +
            "€ há mais de " +
            Math.floor(tempopassadodias) +
            " dias!";

          if (tempopassadodias >= 21 && emailmandado === 3) {
            //* Vai correr diariamente porque a função corrediaramente
            sendEmail(msg, useremail);
            return;
          } else if (tempopassadodias >= 18 && emailmandado === 2) {
            sendEmail(msg, useremail);
            dividaupdatestatus(dividaID, 3); //para dizer que agora vai ser de 3 em 3 dias e ja estamos no nivel 4
            return;
          } else if (tempopassadodias >= 14 && emailmandado === 1) {
            sendEmail(msg, useremail);
            dividaupdatestatus(dividaID, 2); //para dizer que agora vai ser de 3 em 3 dias e ja estamos no nivel 2
            return;
          } else if (tempopassadodias >= 7 && emailmandado === 0) {
            sendEmail(msg, useremail);
            dividaupdatestatus(dividaID, 1); //para dizer que ja foi mandado um email e ja estamos no nivel 1
            return;
          }
        }
      }
    });
  });
}

function dividaupdatestatus(id_divida, emailstatus) {
  const updateOps = {};
  updateOps["timesemailsent"] = emailstatus;
  Divida.update({
      _id: id_divida,
    }, {
      $set: updateOps,
    })
    .exec()
    .then((result) => {})
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
}

async function sendEmail(message, user) {
  //esta função pede um "levelofwaning" para indicar o quanto a divida já passou de ser paga.

  // * Ethereal e uma coisa que me vai ajudar a simular mandar emails:
  const transporter = nodemailer.createTransport({
    // host do ethreal que e quem me esta a mandar fake emails
    service: "gmail",
    // ? host: "smtp.ethereal.email", //! substituir depois pelo host do email que vamos usar
    // true for 465, false for other ports

    //port: 587,
    //secure: false,
    auth: {
      //conta dada para testar:
      user: "eutestocoisas24@gmail.com", //! --- SUBSTITUIR POR O EMAIL QUE DEPOIS VAMOS USER
      pass: "eutestocoisasJek", //! --- SUBSTITUIR PALA PASS DO EMAIL QUE VAMOS USAR
    },
  });
  var mailOptions = {
    from: "eutestocoisas24@gmail.com", // ! sender address MUDAR para o defenitivo
    to: user, //* parametro do email do user que fui buscar
    subject: "Dividas Jeknowledge.", // Subject line
    text: message, // plain text body: dizer estas a dever uma certa quantia por agora so
    //html: "<b>Hello world?</b>", // html body para depois fazer isto bonito
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  // ? DEBUGGING EMAILS:
  console.log("Message sent: %s", info.messageId);
  // ? console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

setInterval(() => {
  //codigo que vai correr de X em X tempo (X=timer)
  (function () {
    //funcao que vai correr e ver se as datas ja passaram ou nao
    checkDates();
  })();
}, timer * 1000); //? um dia