const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose');
const validator = require('validator')
const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password : {type: String, required: true}
});

const LoginModel = mongoose.model('Login', LoginSchema); // base de dados

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }
    async register() {
        this.valida();
        if(this.errors.length > 0) return; //Aqui ele verifica se tem algum conteudo no array "ERRORS" acima
       
        await this.userExists();

        if(this.errors.length > 0) return; //Aqui ele verifica se tem algum conteudo no array "ERRORS" acima


        try{
            const salt = bcryptjs.genSaltSync()
            this.body.password = bcryptjs.hashSync(this.body.password, salt)
            this.user = await LoginModel.create(this.body)
        } catch(e) {
            console.log(e)
        }
        
    }

    async userExists(){
        const user = await LoginModel.findOne({email: this.body.email})
        if(user) this.errors.push('Usuario ja cadastrado!')
    }

    valida() {  
        this.cleanUp()
        
        if(!validator.isEmail(this.body.email)) this.errors.push('Email Inválido!')
       
        if(this.body.password.length < 3 || this.body.password.length > 7 ) {
        this.errors.push('A password deve conter de 3 a 7 caracteres!')
       }
    }

    cleanUp() {
        for(const key in this.body){
           if(typeof this.body[key] !== 'string') {
            this.body[key] = ''
           }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        };

    }
}


module.exports = Login;
