const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const urlElma = 'https://yhardd2fecpxq.elma365.ru/pub/v1/bpm/template/partner_account/processing_an_application_for_partner_registration/run';
const tokenElma = 'd49e5518-c455-4a14-aaa7-a0fc67f50ca1';
const token = '5734831079:AAFB480eoh_PZzlygAITeo9IIWBD5wKCGIs';
const webAppUrl= 'https://jocular-tulumba-eef92b.netlify.app/';
const bot = new TelegramBot(token, {polling: true});
const app = express();


app.use(express.json());
app.use(cors());

bot.on('message',async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    if(text ==='/start'){
        var options = {
            reply_markup: ({
                inline_keyboard: [
                    [{text: 'Заполните форму', web_app:{url: webAppUrl}}], // Clicking will send "1"
              ]
            })
        };
        await bot.sendMessage(chatId,'Ниже появится кнопка, заполните форму',options)
  
    }
    if(msg?.web_app_data?.data){
        try{
            const data = JSON.parse(msg?.web_app_data?.data);
            console.log(data);
            bot.sendMessage(chatId,'Завяка отправлена на одобрение. Ожидайте ответа.');

            setTimeout( async ()=>{

            }, 3000)
        }catch(e){
            console.log(e);
        }   
    }  
});
app.get('/',async (req,res) =>{
    const {queryId, url} = req.body;
    console.log("Getting GET req");
    console.log(req.body);

    await bot.answerWebAppQuery(queryId,{
                type:'article',
                id:queryId,

                title:'Успешно отправлена заявка',
                input_message_content:{message_text: url}
            })

    return res.status(200).json({});

}) 

app.post('/accepted', async (req, res)=>{
    const {queryid, inviteUrl} = req.body;

    const message = "Заявка была одобрена." +
    + " Перейдите по ссылке для завершения регистрации: " + inviteUrl; 

    try{
        await bot.answerWebAppQuery(queryId,{
            type:'article',
            id:queryid,
            title:'Заявка одобрена',
            input_message_content:{message_text: message}
        })
        return res.status(200).json({});
    }catch(e){
        return res.status(500).json({});
    }
})

app.post('/rejected', async (req, res)=>{
    const {queryid, rejectionComment} = req.body;

    const message = "Отказано в заявке :" + rejectionComment; 

    try{
        await bot.answerWebAppQuery(queryId,{
            type:'article',
            id:queryid,
            title:'Отказ в заявке',
            input_message_content:{message_text: message}
        })
        return res.status(200).json({});
    }catch(e){
        return res.status(500).json({});
    }
})

app.post('/web-data',async (req,res) =>{
    const {queryId} = req.body;
    console.log("Getting post req");
    console.log(req.body);   
    const message = "Заявка отправлена. Ожидайте решения." ;
    try{
        sendDataToElma(req.body);
        await bot.answerWebAppQuery(queryId,{
            type:'article',
            id:queryId,
            title:'Успешно отправлена заявка',
            input_message_content:{message_text: message}
        })
        return res.status(200).json({});
    }catch(e){
        await bot.answerWebAppQuery(queryId,{
            type:'article',
            id:queryId,
            title:'Не удалось отправить заявку',
            input_message_content:{message_text: "Не удалось отправить заявку."}
        })
        return res.status(500).json({});
    }
    
})

function sendDataToElma(reqBody){
    const dataFromUser = {
    queryId,
    userName,
    firstname,
    middlename,
    lastname,
    email,
    companyName,
    companyINN,
    phoneNumber,
   } = reqBody;

   const dataToElma = {
        "context": {
          "responsible_for_working_with_partners": [
            "00000000-0000-0000-0000-000000000000"
          ],
          "email": [
            {
              "type": "main",
              "email": email
            }
          ],
          "full_name": {
            "lastname": lastname,
            "middlename": middlename,
            "firstname": firstname
          },
          "company_name": companyName,
          "company_inn": companyINN,
          "phone_number": [
            {
              "type": "main",
              "tel": phoneNumber
            }
          ],
          "teg_telegram": userName,
          "vneshnii_polzovatel": [
            "00000000-0000-0000-0000-000000000000"
          ],
          "e_mail": email,
          "queryid":queryId,
          "__target": "example"
        }
   }
   fetch(urlElma, {  // Enter your IP address here
            headers:{"Content-Type":"application/json","Authorization": `Bearer ${tokenElma}`},
            method: 'POST', 
            body: JSON.stringify(dataToElma) // body data type must match "Content-Type" header
            }
        ) 
}


const PORT = 3000;

app.listen (PORT, () => console.log('server started on PORT ' + PORT))