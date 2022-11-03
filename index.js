const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '5734831079:AAFB480eoh_PZzlygAITeo9IIWBD5wKCGIs';
const webAppUrl= 'https://jocular-tulumba-eef92b.netlify.app/';
const bot = new TelegramBot(token, {polling: true});
const app = express();
app.use(express.json());
app.use(cors());

bot.on('message',async (msg) => {
    const chatId = msg.chat.id;
    chatID = chatId;
    const text = msg.text;
    if(text ==='/start'){
        var options = {
            reply_markup: ({
                inline_keyboard: [
                    [{text: 'Заполните форму', web_app:{url: webAppUrl}}], // Clicking will send "1"
              ]
        //       keyboard: [
        //         [{text: 'Заполните форму', web_app:{url: webAppUrl}}], // Clicking will send "1"
        //   ]
            })
        };
        await bot.sendMessage(chatId,'Ниже появится кнопка, заполните форму',options)

    }
    if(msg?.web_app_data?.data){
        try{
            const data = JSON.parse(msg?.web_app_data?.data);
            console.log(data);
            bot.sendMessage(chatId, 'FIO: ' + data?.FIO);
            bot.sendMessage(chatId,'Завяка отправлена на одобрение. Ожидайте ответа.');

            setTimeout( async ()=>{

            }, 3000)

        }catch(e){
            console.log(e);
        }
        
    }
  
});
app.get('', async (req,res) =>{
    bot.sendMessage(chatID, 'FIO: ');
    
    return res.status(200).json(
        "Hello"
    );
})

app.post('/web-data',async (req,res) =>{
   const {
        queryId,
        chatId
    } = req.body;

    console.log("Getting post req");
    console.log("qID " +queryId);
    console.log("cID "+ chatId);
    // bot.sendMessage(chatID, 'NO: ');
    // try{
    //     await bot.answerWebAppQuery(queryId,{
    //         type:'article',
    //         id:queryId,
    //         title:'Успешно отправлена заявка',
    //         input_message_content:{message_text: "message text test"}
    //     })
    //     return res.status(200).json({});
    // }catch(e){
    //     await bot.answerWebAppQuery(queryId,{
    //         type:'article',
    //         id:queryId,
    //         title:'Не удалось отправить заявку',
    //         input_message_content:{message_text: "Не удалось отправить заявку message text test"}
    //     })
    //     return res.status(500).json({});
    // }

    
    
    return res.status(200).json({}); 

})

const PORT = 3000;

app.listen (PORT, () => console.log('server started on PORT ' + PORT))