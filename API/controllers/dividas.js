const mongoose = require("mongoose");
const Divida = require("../models/divida");
const User = require("../models/users");
const jwt = require('jsonwebtoken');

const localStorage = require('local-storage');

//! CRIAR NA DATABASE UMA CONTA JEK DEFAULT PARA DAR AS DIVIDAS CRIADAS POR UM JEKER
const idcontaJEK = "5fdeac8c53a6f54594acee7b"; //! ID DA CONTA PRINCIPAL DA JEK depois mudar para o defenitivo


//controler para criar uma divida de um User daí o nome "criar_divida_jeK"


exports.criar_divida_jeK = (req,res,next)=>{
  //Quando uma divida é criada preciso de a data, hora e minutos de hoje.
  let today = new Date(); //com a class Date consigo pedir a data e a hora a que foi criada a divida

 //adicionei os zeros à direita tambem porque assim fica melhor para exportar e fazer contas com as datas
  let date =
    today.getFullYear() + "-" + ("0"+(today.getMonth() + 1)).slice(-2) + "-" + ("0"+today.getDate()).slice(-2); //a string que diz a data atual
  //faço slice(-2) porque slice(-2) da me sempre os ultimos dois characteres da string, e assim se adicionar um zero a mais fico sempre com os ultimos dois characteres e portanto apaga-o
  
  let time =

    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(); //a string que diz o tempo atual

  // Para ir buscar o id do user logado
  const token = localStorage.get('Authorization'); 
  const decoded = jwt.verify(token,"secret");
  const id = decoded.userId;
  console.log("a");


    User.findOne({email:req.body.credor}).exec().then(user_credor => {
          
            User.findOne({email:req.body.devedor}).select().exec().then(user_devedor =>{
              
             let divida = new Divida({
                _id: new mongoose.Types.ObjectId(), //crio um novo id para a divida.

                //Estamos no request de um User:
                credor: user_credor._id, //todo MUDAR PARA O ID DA CONTA DA JEKNOWLEDGE!
                devedor: user_devedor._id, // * ID do devedor acima referido
                quantia: req.body.quantia, //vai buscar a quantia ao body do json
                descricao: req.body.descricao, //se existir a descrição vou buscar tambem.
                paga: false, // se vamos criar uma dívida não faz sentido ela estar inativa. Por isso o seu paga inicial será sempre ativa
                userCriador: id, // Mudei isto, aqui o user que vai criar a divida vai corresponder ao userID
                date: date + "T" + time, //e a data de hoje ver quanto tempo passou desde a sua criação
                timesemailsent: 0 //para conseguir ver o limite da divida mandada e quanto ja passou o tempo
              });
            
              //salvo a divida
              divida
                .save()
                .then((result) => {
                  console.log(result);
                  //req.flash('success_msg','Divida Criada');
                  res.redirect('/home');
                })
                .catch((err) => {
                  console.log(err);
                });
        })
        .catch(err =>{
        console.log(err);
        req.flash('error_msg','Divida Invalida');
        res.redirect('create');
        });
  }).catch(err =>{
    req.flash('error_msg','Divida Invalida');
    res.redirect('create');
    console.log(err);
  });
};



//chamei à logica deste controller "criar_divida_Tesoureiro" visto que
//e este request que o tesoureiro vai chamar quando criar uma divida
exports.criar_divida_Tesoureiro = (req, res, next) => {
  //Quando uma divida é criada preciso de a data, hora e minutos de hoje.
  let today = new Date(); //com a class Date consigo pedir a data e a hora a que foi criada a divida

  //adicionei os zeros à direita tambem porque assim fica melhor para exportar e fazer contas com as datas
  let date =
    today.getFullYear() + "-" + ("0"+(today.getMonth() + 1)).slice(-2) + "-" + ("0"+today.getDate()).slice(-2); //a string que diz a data atual
  //faço slice(-2) porque slice(-2) da me sempre os ultimos dois characteres da string, e assim se adicionar um zero a mais fico sempre com os ultimos dois characteres e portanto apaga-o

  let time =
    ("0"+today.getHours()).slice(-2) + ":" +  ("0"+today.getMinutes()).slice(-2) + ":" +  ("0"+today.getSeconds()).slice(-2); //a string que diz o tempo atual


  // Para ir buscar o id do user logado
  const token = req.headers.authorization.split(" ")[1]; 
  const decoded = jwt.verify(token,"secret");
  const id = decoded.userId

  let divida = new Divida({
    _id: new mongoose.Types.ObjectId(), //crio um novo id para a divida.
    credor: req.body.credor, //Vou buscar o user a que deve, O EMAIL!
    devedor: req.body.devedor, //vou buscar o user a Dever atenção meter um email, O EMAIL!
    quantia: req.body.quantia, //vou buscar a quantia
    descricao: req.body.descricao, //vou buscar a descrição
    paga: false, // se vamos criar uma dívida não faz sentido ela estar inativa. Por isso o seu paga inicial será sempre ativa
    userCriador: id, // User que cria a divida
    date: date + "T" + time, //e a data de hoje ver quanto tempo passou desde a sua criação
    timesemailsent: 0
  });

  //salvo a divida
  divida
    .save()
    .then((result) => {
      res.status(201).json({
        //codigo 201 para indicar que foi tudo feito com sucesso
        //para confirmar passo um json com a messagem, eventuais warnings e a divida criada
        message: "Divida criada!",
        DividaCriada: {
          //passo o credor, o devedor, a quantia, uma eventual descrição o id criados da divida e o request que apresenta alguma informação
          credor: result.credor,
          devedor: result.devedor,
          quantia: result.quantia,
          descricao: result.descricao,
          paga: result.paga,
          userCriador: result.userCriador,
          date: result.date,
          _id: result._id,
          timesemailsent: result.timesemailsent,
          request: {
            type: "POST", //o tipo e um POST
            url:
              req.protocol +
              "://" +
              req.get("host") +
              req.originalUrl +
              result._id,
            //formatei uma string para dar o URL atual
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });

};



// GET REQUEST DE TODAS AS DIVIDAS
exports.get_all_dividas = (req, res, next) => {
  // find() sem argumentos devolve todos as dívidas
   Divida.find()
    .exec()
    .then( (dividas) => {
        return res.render('dividastotais',{dividas : dividas.map(divida =>{
          return divida;
        })});
      })
    .catch((err) => {
      console.log(err);
    });
};




exports.get_all_dividas_user = (req, res, next) => {
  
  const token = localStorage.get('Authorization'); 
  const decoded = jwt.verify(token,"secret");
  const id = decoded.userId;


  Divida.find({$or: [{credor: {$in: id}},{devedor: {$in: id}} ]})
    .exec()
    .then((dividas) => {
      return res.render('dividasUsers',{dividas : dividas.map(divida =>{
        return divida;
      })});
    })
    .catch((err) => {
      console.log(err);
    });

};





// GET DIVIDAS ATIVAS E INATIVAS
exports.dividas_ativas_inativas = (req, res, next) => {
  let url = req.originalUrl.split("/")  // vamos buscar o dividas/ativas ou dividas/inativas e criamos uma lista com cada valor separado por /
  let estado


  if(url[2] == "ativas?"){ // se for /dividas/ativas
    estado = false
  } else if(url[2] == "inativas?"){ // se for /dividas/inativas
    estado = true
  } else console.log("algo de errado não está certo")

  const token = localStorage.get('Authorization'); 
  const decoded = jwt.verify(token,"secret");
  const admin = decoded.admin;

  
  Divida.find({paga: estado}) // vai buscar as dividas com flag especificada no estadp
    .select("quantia devedor credor descricao userCriador paga")
    .exec()
    .then((dividas) => {
      
      if(!estado){
            if(admin){
              return res.render('dividastotaisadmin',{dividas : dividas.map(divida =>{
              return divida;
              })}); 
            }
            else{
              return res.render('dividastotais',{dividas : dividas.map(divida =>{
                return divida;
              })}); 
            }        
      }
      else{
        return res.render('historico',{dividas : dividas.map(divida =>{
        return divida;
      })}); 
      }
      
      })
      .catch((err) => {
        console.log(err);
      });
};

// GET DIVIDAS POR DEPARTAMENTO

exports.dividas_departamento = (req, res, next) => {
  const dep = req.params.departement;
  // find() devolve todos os users do departamento indicado na route
  User.find({department: dep})
  .select("_id name department")
  .exec()
  .then((users) => {
    // users - array com todos os users do departamento
      Divida.find({$or: [ // or para considerar os dois "pedidos"
                        {credor: {$in: users}},
                        {devedor: {$in: users}} 
                        ]}) // encontra todas as dividas com credores ou devedores que estão no array users
      .select("quantia devedor credor descricao userCriador")
      .exec()
      .then((dividas) => {
            if(dep === "Tech"){
              return res.render('dividasTech',{dividas : dividas.map(divida =>{
              return divida;
            })});
            }
            if(dep === "Innovation"){
              return res.render('dividasInnovation',{dividas : dividas.map(divida =>{
            return divida;
          })});
          }
          if(dep === "Intern"){
            return res.render('dividasIntern',{dividas : dividas.map(divida =>{
          return divida;
          })});
          }
        })
        .catch((err) => {
          console.log(err);
        });

    })
    .catch((err) => {
      console.log(err);
    });
};



// Opção para dar uma divida como paga
exports.altera_divida = (req, res, next) => {

  const id_divida = req.params.dividaID // id da divida introduizdo no url
  
  // Isto é feito para se so quisermos mudar campos especificos e não ter de mudar tudo
  const updateOps = {"paga":true};

  
  /* JSON - tem de ser desta forma para podermos usar o que temos em cima
  [
    { "propName": "paga", "value": true}
  ]
*/

// Vamos procurar a divida com o id dado no url, e atualizamos as informações que foram disponibilix«zadas no JSON
  Divida.update({_id: id_divida}, {$set: updateOps}).exec()
  .then(result => {
    

    console.log({id: id_divida})
    req.flash('success_msg','Divida Apagada');
    res.redirect('/home');
  })
  .catch(err => {
      console.log(err);
    });
};

exports.get_all_dividasMail = (req, res, next) => {
    // find() sem argumentos devolve todos as dívidas
  Divida.find()
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
            timesemailsent: divida.timesemailsent
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      // se a promise der erro
      res.status(500).json({
        error: err,
      });
    });
};




