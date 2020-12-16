const nodemailer = require("nodemailer");
const express = require("express");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//fazer de dia a dia
const timer = 3000; //fazer de semana a semana

const aUrl = "http://localhost:5000/dividas/all_dividas_para_o_email"; //url para fazer o request de todas as dividas.

//Função client que me dá o GET request
var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest(); //crio uma nova instancia da class para fazer um request 
        anHttpRequest.onreadystatechange = function() {  //quando a API estiver pronta
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) //e se estiver tudo bem
                aCallback(anHttpRequest.responseText); // é como se fosse um return ao minha resposta atraves do callBack
        }

        anHttpRequest.open("GET", aUrl, true );//faço um GET request ao Url
        //mando um post com um header a dizer server e com esta server key

        //para provar que sou o server vou as headers e se o header server tiver a localserverkey e porque sou eu.
        anHttpRequest.setRequestHeader("Server",process.env.LOCAL_SERVERKEY);
        anHttpRequest.send( null ); //Como e um GET não mando nada
    }
}

function timepassed(date){
  //transformo-a em "tipo Date":
  let dataDivida = new Date(date);
  //console.log(dataDivida);

  let today = new Date();
  let dateNOW =
    today.getFullYear() + "-" + ("0"+(today.getMonth() + 1)).slice(-2) + "-" + ("0"+today.getDate()).slice(-2); //formating Date to a recognizable format, adiciono um zero antes para se no caso do mes for 1 ficar 01 e depois dar slice às ultimas duas chars
    //se for por exemplo 12 ele vai adicionar um zero - 012 mas corto depois as ultimas chars e fica outra vez 12
  let dateNOWCorrectformat = new Date(dateNOW);

  //conta para a diferença:
  let diferencadias =  (dateNOWCorrectformat.getTime()- dataDivida.getTime())/(1000 * 3600 * 24); //faço a conta para me dar a diferença em dias
  //console.log(diferencadias);
  
  if (diferencadias > 21){
    return 3; //o warning sera 3
  }
  else if (diferencadias >14){
    return 2; //o warning sera 2
  }
  else if(diferencadias >7){
    return 1; //o warning sera 1
  }
  else{
    return 0; //se nao houver warnings ainda passo 0
  }
}

function checkDates(){ //função que recebe as datas
  var client = new HttpClient(); //crio uma nova instancia da função acima
  //preciso de me autenticar se nao não me deixa fazer o GET request
  client.get(aUrl,function(response){ //e simplesmente faço um get que vai fazer uma função que vai ter como parametro a resposta da API

    //passo para JSON visto que a resposta veio em pleno texto
    var responseJSON = JSON.parse(response);
    for(let dividaskeys in Object.keys(responseJSON.Dividas)){
      //para me dar todas as datas de todas as dividas:
      let userdivida = responseJSON.Dividas[dividaskeys].devedor; //email do devedor
      let quantiadivida = responseJSON.Dividas[dividaskeys].quantia;
      let datadivida = responseJSON.Dividas[dividaskeys].date;
      let levelwarning = timepassed(datadivida); //função que calcula qual e o tipo de warning que devo tomar consoante o tempo passado.
      
      //console.log(userdivida);
      //console.log(datadivida);
      //console.log(levelwarning);
      
      
      // O level of warning pode ser:
      // 1: >7 dias sem ser pago
      // 2: >14 dias sem ser pago
      // 3: >21 dias sem ser pago
      let message = "";
      switch(levelwarning){
        case 0:
          //não faço nada, em vez de dar break saio só do loop for porque esta divida não me interessa
          continue;

        case 1:
          //passou + de 7 dias
          message = "Olá "+ userdivida +" deves uma divida de "+ quantiadivida + " à Jek há mais de 7 dias!";
          break;

        case 2:
          message = "Olá "+ userdivida +" deves uma divida de "+ quantiadivida + " à Jek há mais de 14 dias!";
          break;

        case 3:
          message = "Olá "+ userdivida +" deves uma divida de "+ quantiadivida + " à Jek há mais de 21 dias!!!";
          break;
      }

      //Ultima coisa a fazer:

      //ATENÇÃO ELE AGORA ESTA CONSTANTEMENTE A MANDAR EMAILS!!! Fazer uma cena de datas again para ver se ja passou:
      

      //Se o levelwarning = 1, mandar so uma vez.
      //Se o levelwarning = 2, mandar de 3 EM 3 DIAS.
      //se o level warning = 3, mandar de dia a dia.

      sendEmail(message,userdivida); //o nome desta função é um bocado missleading porque por vezes não é mandado um email se o tempo for menor que 7 dias, ou seja, quando o levelwarning é 0.
    };
  });
}

async function sendEmail(message,usermail){ //esta função pede um "levelofwaning" para indicar o quanto a divida já passou de ser paga.
  
  // Ethereal e uma coisa que me vai ajudar a simular mandar emails:
  const transporter = nodemailer.createTransport({
    // host do ethreal que e quem me esta a mandar fake emails
    host: "smtp.ethereal.email", //substituir depois pelo host do email que vamos usar
    // true for 465, false for other ports
    port: 587,
    secure: false,
    auth: {
      //conta dada para testar:
      user: "frederic.rolfson@ethereal.email", // ----- SUBSTITUIR POR O EMAIL QUE DEPOIS VAMOS USER
      pass: "yVFQXmEZ9mNuunP1Qd" // ------ SUBSTITUIR PALA PASS DO EMAIL QUE VAMOS USAR
    },
  });

  let info = await transporter.sendMail({
      from: '"Yo" <JeknowledgeFIXE@example.com>', // sender address
      to: usermail, // subsituir para o email do user em causa
      subject: "Dividas Jeknowledge.", // Subject line
      text: message, // plain text body: dizer estas a dever uma certa quantia por agora so
      //html: "<b>Hello world?</b>", // html body para depois fazer isto bonito
    });
  
  //DEBUGGING EMAILS:
  console.log("Message sent: %s", info.messageId); 
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
}

setInterval(() => {
  //codigo que vai correr de X em X tempo (X=timer)
  console.log("Checking..."); //para avisar que a função vai correr
  
    (function(){

      //funcao que vai correr e ver se as datas ja passaram ou nao
      checkDates()
      
  })();

}, timer);