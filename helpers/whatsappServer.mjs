import qrcode from 'qrcode-terminal'
import whatsapp from 'whatsapp-web.js'
import * as colors from 'colors'
import { excelRead } from './excelRead.mjs'
import 'dotenv/config'
import ora from 'ora'

export const initWhatsapp = ({type}) => {

    const { messageTemplate, numberPhone } = excelRead({filename: process.env.TEMPLATE_EXCEL})
    
    const spinner = ora('Cargando usuario...').start()
    const client = new whatsapp.Client({ puppeteer: { args: ['--no-sandbox'] }, authStrategy: new whatsapp.LocalAuth({clientId: 'bot', dataPath: 'data'})})
    client.on('qr', qr => {
        spinner.stop()
        qrcode.generate(qr, {small: true} )
    } )
    
    client.on('ready', (msg) => { 
        const sendPhoto = whatsapp.MessageMedia.fromFilePath('./media/photo.png')

        spinner.stop()
        console.log('Login realizado con éxito!'.green) 
        if( type === 'message' || type ==='photoAndMessage') {
            for (const i in numberPhone) {
                const number = `${process.env.CODE_POSTAL}${numberPhone[i]}`  
                client.sendMessage(`${number}@c.us`, `${decodeURI(messageTemplate[i])}`) 
                console.log(`Mensaje enviado con éxito a ${number}`.green )
            } 
        }
        if( type === 'photo' || type ==='photoAndMessage') {
            for (const i in numberPhone) { 
                const number = `${process.env.CODE_POSTAL}${numberPhone[i]}`  
                client.sendMessage(`${number}@c.us`, sendPhoto )
                console.log(`Foto enviada con éxito a ${number}`.yellow )
            } 
        }
    })
    
    client.initialize()
}
