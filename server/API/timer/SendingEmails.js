const nodemailer = require("nodemailer");
const express = require("express");
const Divida = require("../models/divida");
const User = require("../models/users");
require("dotenv").config(); //! IMPORTANTE PARA LER VALORES

//? Se quiserem mudar para testar e recomendado mudar esta variavel
const timer = 86400;

// ? console.log("Started.");

//*url para fazer o request de todas as dividas.
//! No final mudar para os defenitivos!!

//anHttpRequest.setRequestHeader("Server", process.env.LOCAL_SERVERKEY);
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

async function checkDates() {
  var responseJSONDIVIDAS = await get_all_dividasMail();
  var responseJSONUSER = await get_all_users();


  for (let dividaskeys in Object.keys(responseJSONDIVIDAS.Dividas)) {
    //dou assign a values que sa calhar tenho de trabalhar com
    let dividaID = responseJSONDIVIDAS.Dividas[dividaskeys].id; //Id da divida
    let paga = responseJSONDIVIDAS.Dividas[dividaskeys].paga; //situação de pagamento
    let userdivida = responseJSONDIVIDAS.Dividas[dividaskeys].devedor; //id do devedor
    let quantiadivida = responseJSONDIVIDAS.Dividas[dividaskeys].quantia; //quantia
    let datadivida = responseJSONDIVIDAS.Dividas[dividaskeys].date; //importante para
    let credor = responseJSONDIVIDAS.Dividas[dividaskeys].credor;
    let desc = responseJSONDIVIDAS.Dividas[dividaskeys].descricao;
    // calcular o levelwarning
    let emailmandado =
      responseJSONDIVIDAS.Dividas[dividaskeys].timesemailsent;
    let tempopassadodias = timepassed(datadivida); //função que calcula qual e o tipo de warning que devo tomar consoante o tempo passado.

    //? console.log(responseJSONDIVIDAS.Dividas);

    //looping through all users to find the respective one
    for (let userinDB in Object.keys(responseJSONUSER.list)) {
      // ? console.log(responseJSONUSER.list[userinDB]._id + " : " + userdivida);
      if (responseJSONUSER.list[userinDB]._id.toString(8) === userdivida.toString(8)) {
        //encontrei o user que corresponde à divida
        var useremail = responseJSONUSER.list[userinDB].email; //guardo numa variavel o email dela.
        //! NÃO ESTOU A CONSEGUIR FAZER O GET DOS EMAILS AQUI DEPOIS DA FIX A ISTO
        // ? console.log(useremail)
      }
    }
    //*   dividaupdatestatus = 0  --> Não estão a ser mandados warnings
    //*   dividaupdatestatus = 1  --> Ao 7º dia foi mandado um warning
    //*   dividaupdatestatus = 2  --> Ao 14º dia foi mandado outro warning (+7)
    //*   dividaupdatestatus = 3  --> Ao 18º dia foi mandado outro warning (+3) e apartir de agora e diariamente ate cancelar o job.

    // console.log(dividaID)
    if (paga === false) {
      //default msg depois podemos mudar:
      let msg =
        "Olá " + useremail + "\n" + "Foi criada uma dívida na plataforma jeKash que te tem como devedor.\nDivida:\n" +
        desc + "\nPreço a pagar: " + quantiadivida + "€" + "\nTempo passado: " + Math.floor(tempopassadodias) + " dias.";

      if (tempopassadodias >= 21 && emailmandado === 3) {
        //? console.log(useremail);
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

}

function dividaupdatestatus(id_divida, emailstatus) {
  const updateOps = {};
  // ? console.log("Yup");
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

async function sendEmail(message, user, desc) {
  //esta função pede um "levelofwaning" para indicar o quanto a divida já passou de ser paga.
  //console.log("HELLO")
  // * Ethereal e uma coisa que me vai ajudar a simular mandar emails:
  const transporter = nodemailer.createTransport({
    // host do ethreal que e quem me esta a mandar fake emails
    service: "gmail",
    // ? host: "smtp.ethereal.email", //! substituir depois pelo host do email que vamos usar
    // true for 465, false for other ports

    port: 587,
    secure: false,
    auth: {
      //conta dada para testar:
      user: "noreply.jeknowledge@gmail.com", //! --- SUBSTITUIR POR O EMAIL QUE DEPOIS VAMOS USER
      pass: "jeKash!2021!", //! --- SUBSTITUIR PALA PASS DO EMAIL QUE VAMOS USAR
    },
  });


  var mailOptions = {
    from: "noreply@jeknowledge.com", // ! sender address MUDAR para o defenitivo
    to: user, //* parametro do email do user que fui buscar
    subject: "Dividas Jeknowledge", // Subject line
    text: message, // plain text body: dizer estas a dever uma certa quantia por agora so
    //html: "<b>Hello world?</b>", // html body para depois fazer isto bonito
  };

  transporter.sendMail(mailOptions, function (error, data) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + data.response);
    }
    // ? DEBUGGING EMAILS:
    // ? console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
}

setInterval(() => {
  //codigo que vai correr de X em X tempo (X=timer)
  (function () {
    //funcao que vai correr e ver se as datas ja passaram ou nao
    checkDates();
    console.log("[MSGTESTE] Hey neste momento atualizei os emails.\n O tempo de intervalo para mandar emails neste momento está a: "+ timer+ " segundos.");
  })();
}, timer * 1000); //? um segundo


//* EM VEZ DE PARECER UM ESTUPIDO E LITERLAMENTE FAZER UM GET REQUEST PARA O PROPRIO SERVER
//* VAMOS ENCONTRAR AQUI AS DIVIDAS MAILS E CHAMAR AQUI A FUNÇÃO FIND DO MONGOOSE para o email!

async function get_all_dividasMail() {
  // find() sem argumentos devolve todos as dívidas
  const resdiv = await Divida.find()
    .exec()
    .then((dividas) => {
      // array dividas com todos os objetos
      // OUTPUT
      const response = {
        count: dividas.length, // Numero total de dividas
        Dividas: dividas.map((divida) => {
          // map cria um array com as informações seguintes de cada divida
          return {
            // Return da informação das dividas
            id: divida._id, //adicionei id porque ajuda a testar
            paga: divida.paga,
            credor: divida.credor,
            devedor: divida.devedor,
            quantia: divida.quantia,
            descricao: divida.descricao,
            userCriador: divida.userCriador,
            date: divida.date,
            timesemailsent: divida.timesemailsent,
          };
        }),
      };
      return response;
    })
    .catch((err) => {
      // se a promise der erro
      console.log(err);
    });
  // ? console.log(resdiv);
  return resdiv;
};

async function get_all_users() {
  const resuser = await User.find()
    .select()
    .exec() //array de users
    .then((list_users) => {
      const response = {
        // o que vai ser prinztado no ecrã
        count: list_users.length,
        list: list_users.map((doc) => {
          return {
            email: doc.email,
            department: doc.department,
            admin: doc.admin,
            _id: doc._id,
          };
        }),
      };
      return response;
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
  // ? console.log(resuser);
  return resuser;
};