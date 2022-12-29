const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const urlElma = 'https://m2z2c6oawsule.elma365.ru/pub/v1/bpm/template/partner_account/processing_an_application_for_partner_registration/run';
const tokenElma = 'bf063a82-bad5-4277-ba3e-bc1125e781bb';
// const token = '5734831079:AAFB480eoh_PZzlygAITeo9IIWBD5wKCGIs';
const token = '5846193985:AAG0UldpIDi0n853CrJUi_ejcSVtyTKGBAc';
const webAppUrl= 'https://benevolent-figolla-233e69.netlify.app';
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
                keyboard: [
                    [{text: 'Заполните форму',web_app:{url: webAppUrl}}
                ]
            ]
            })
        };
        await bot.sendMessage(chatId,`Ниже появится кнопка, заполните форму. ${chatId}`,options)

  
    }
    if(msg?.web_app_data?.data){
        try{
            const data = JSON.parse(msg?.web_app_data?.data);
            console.log(data);
            sendDataToElma(data,chatId);
            bot.sendMessage(chatId,'Завяка отправлена на одобрение. Ожидайте ответа.');
                    
        }catch(e){
            console.log(e);
        }   
    }  
});

function printMessageError(e){
  console.log(e.message);
}

app.post('/accepted', async (req, res)=>{
    const {chatid, inviteUrl} = req.body;
    const message = "Заявка была одобрена.\nПерейдите по ссылке для завершения регистрации:\n" + inviteUrl; 
    console.log('Got acception req');
    
    if(chatid === "" || inviteUrl ===""){
      return res.status(400).json({});
    }

    bot.sendMessage(chatid,message).catch( e => printMessageError(e) );
    return res.status(200).json({});

   
})

app.post('/rejected', async (req, res)=>{
    const {chatid, rejection_reason} = req.body;
    console.log('Got rejection req');

    const message = "Отказано в заявке :\n" + rejection_reason; 


    if(chatid === "" || rejection_reason ===""){
      return res.status(400).json({});
    }

    bot.sendMessage(chatid,message).catch( e => printMessageError(e) );
    return res.status(200).json({});
})

function sendDataToElma(data,chatId){
    const dataFromUser = {
    userName,
    firstname,
    middlename,
    lastname,
    email,
    companyName,
    companyINN,
    phoneNumber,
   } = data;

   const dataToElma = {
    "context": {
      "responsible_for_working_with_partners": [
        "00000000-0000-0000-0000-000000000000"
      ],
      "email": [
        {
          "type": "home",
          "email": `${email}`
        }
      ],
      "full_name": {
        "lastname": `${lastname}`,
        "middlename": `${middlename}`,
        "firstname": `${firstname}`
      },
      "company_name": `${companyName}`,
      "company_inn": `${companyINN}`,
      "nomer_telefona": `${phoneNumber}`,
      "phone_number": [
        {
          "type": "home",
          "tel": `${phoneNumber}`
        }
      ],
      "teg_telegram": "example",
      "vneshnii_polzovatel": [
        "00000000-0000-0000-0000-000000000000"
      ],
      "e_mail": `${email}`,
      "queryid": "example",
      "chatid": `${chatId}`,
      "__target": "example"
    }
  }
  try{
   fetch(urlElma, {  // Enter your IP address here
            headers:{"Content-Type":"application/json","Authorization": `Bearer ${tokenElma}`},
            method: 'POST', 
            body: JSON.stringify(dataToElma) // body data type must match "Content-Type" header
            }
        )
    }catch(e){

    } 
}


const PORT = 3000;

app.listen (PORT, () => console.log('server started on PORT ' + PORT))