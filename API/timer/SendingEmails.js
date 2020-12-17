const nodemailer = require("nodemailer");
const cron = require('node-cron');
const express = require("express");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//fazer de dia a dia
const timer = 2500; //! No final mudar para ser algo diario const timer = 86400;

//url para fazer o request de todas as dividas.
const GETdividasServerURL = "http://localhost:5000/dividas/all_dividas_para_o_email"; //! No final mudar
const GETuserServerURL = "http://localhost:5000/users/getall";

//Função client que me dá o GET request
var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest(); //crio uma nova instancia da class para fazer um request 
        anHttpRequest.onreadystatechange = function() {  //quando a API estiver pronta
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) //e se estiver tudo bem
                aCallback(anHttpRequest.responseText); //* é como se fosse um return ao minha resposta atraves do callBack
        }

        anHttpRequest.open("GET", aUrl, true );//faço um GET request ao Url
        //mando um post com um header a dizer server e com esta server key

        // !para provar que sou o server vou as headers e se o header server tiver a localserverkey e porque sou eu.
        anHttpRequest.setRequestHeader("Server",process.env.LOCAL_SERVERKEY);
        anHttpRequest.send( null ); //Como e um GET não mando nada
    }
}

function timepassed(date){
  //! em dias
  let dataDivida = new Date(date);
  //console.log(dataDivida);

  let today = new Date();
  let dateNOW =
    today.getFullYear() + "-" + ("0"+(today.getMonth() + 1)).slice(-2) + "-" + ("0"+today.getDate()).slice(-2); //formating Date to a recognizable format, adiciono um zero antes para se no caso do mes for 1 ficar 01 e depois dar slice às ultimas duas chars
    //se for por exemplo 12 ele vai adicionar um zero - 012 mas corto depois as ultimas chars e fica outra vez 12
  let dateNOWCorrectformat = new Date(dateNOW);

  //conta para a diferença:
  let diferencadias =  (dateNOWCorrectformat.getTime()- dataDivida.getTime())/(1000 * 3600 * 24); //faço a conta para me dar a diferença em dias

  return diferencadias
}

function checkDates(){ //função que recebe as datas
  var client = new HttpClient(); //crio uma nova instancia da função acima
  
  //*preciso de me autenticar se nao não me deixa fazer o GET request as dividas
  client.get(GETdividasServerURL,function(responseDivida){ //e simplesmente faço um get que vai fazer uma função que vai ter como parametro a resposta da API
    //*preciso de me autenticar se nao não me deixa fazer o GET request aos users!
    client.get(GETuserServerURL,function(responseUser){
      //passo para JSON visto que a resposta veio em pleno texto
      var responseJSONDIVIDAS = JSON.parse(responseDivida);
      var responseJSONUSER = JSON.parse(responseUser);

      for(let dividaskeys in Object.keys(responseJSONDIVIDAS.Dividas)){
        //dou assign a values que sa calhar tenho de trabalhar com
        let dividaID = responseJSONDIVIDAS.Dividas[dividaskeys]._id; //Id da divida
        let paga = responseJSONDIVIDAS.Dividas[dividaskeys].paga; //situação de pagamento
        let userdivida = responseJSONDIVIDAS.Dividas[dividaskeys].devedor; //id do devedor
        let quantiadivida = responseJSONDIVIDAS.Dividas[dividaskeys].quantia; //quantia
        let datadivida = responseJSONDIVIDAS.Dividas[dividaskeys].date; //importante para calcular o levelwarning
        let emailmandado = responseJSONDIVIDAS.Dividas[dividaskeys].timesemailsent;
        let tempopassadodias = timepassed(datadivida); //função que calcula qual e o tipo de warning que devo tomar consoante o tempo passado.
        
        console.log(emailmandado);
        //looping through all users to find the respective one
        for (let userinDB in Object.keys(responseJSONUSER.list)){
          if(responseJSONUSER.list[userinDB]._id=== userdivida){ //encontrei o user que corresponde à divida
            var useremail = responseJSONUSER.list[userinDB].email; //guardo numa variavel o email dela.
          } 
        }

        //todo send emails correctly
        if (paga===false){
          if (tempopassadodias>21 && emailmandado ===2){
            //! E necessário dar loop diario TODOS OS DIAS À MEIA NOITE
            let myjob = cron.schedule[lvl3]; //para o job anterior
            myjob.stop();
            var j3=cron.schedule(lvl3,'0 0 0 * * *', () => { 
              sendEmail("3 sem, agora vai ser diariamente",useremail);
            });
            
            dividaupdate(dividaID,3);//para dizer que agora vai ser de diariamente, estamos no nivel 3
            return;
          }
          else if(emailmandado>14 && emailmandado ===1){
            //! E necessário dar loop de 3 em 3 dias, vejo só se e divisivel por 3
            var j2 = cron.schedule(lvl2,'0 0 */3 * *', () => {
              sendEmail("2 sem, agora vai ser de 3 em 3",useremail);
            });

            dividaupdate(dividaID,2)//para dizer que agora vai ser de 3 em 3 dias e ja estamos no nivel 2
            return;
          }
          else if(emailmandado>7 && emailmandado ===0){
            //! Não e necessário dar loops porque daqui a uma semana ja vou ver se pagou ou n
            sendEmail("1 sem",useremail); 
            //dar update à divida
            dividaupdate(dividaID,1) //para dizer que ja foi mandado um email e ja estamos no nivel 1
            return;
          }
        }
        else{
          //para todos os jobs
        }
      };
    });
  }); 
}

function dividaupdate(id_divida,emailstatus){
  const updateOps = {};
  updateOps[timesemailsent] = emailstatus;
  Divida.update({_id: id_divida}, {$set: updateOps}).exec()
  .then(result => {
    console.log({id: id_divida})
    res.status(200).json({
      message: "Divida atualizada com o estatus novo!",
      request: {
        type: "GET",
        url: "http://localhost:3000/dividas/inativas"
      }
    })
  })
  .catch(err => {
      res.status(500).json({
          errors: err
      })
    });
}

async function sendEmail(message,user){
  //esta função pede um "levelofwaning" para indicar o quanto a divida já passou de ser paga.
  
  // * Ethereal e uma coisa que me vai ajudar a simular mandar emails:
  const transporter = nodemailer.createTransport({
    // host do ethreal que e quem me esta a mandar fake emails
    host: "smtp.ethereal.email", //! substituir depois pelo host do email que vamos usar
    // true for 465, false for other ports
    port: 587,
    secure: false,
    auth: {
      //conta dada para testar:
      user: "frederic.rolfson@ethereal.email", //! --- SUBSTITUIR POR O EMAIL QUE DEPOIS VAMOS USER
      pass: "yVFQXmEZ9mNuunP1Qd" //! --- SUBSTITUIR PALA PASS DO EMAIL QUE VAMOS USAR
    },
  });

  let info = await transporter.sendMail({
      from: '"Yo" <JeknowledgeFIXE@example.com>', // ? sender address
      to: user, //todo Buscar o user email em causa como ?
      subject: "Dividas Jeknowledge.", // Subject line
      text: message, // plain text body: dizer estas a dever uma certa quantia por agora so
      //html: "<b>Hello world?</b>", // html body para depois fazer isto bonito
    });
  
  // ? DEBUGGING EMAILS:
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