import { LightningElement } from 'lwc';
import banner1 from '@salesforce/resourceUrl/LogoMeuCarrinhoLWC';//importar a imagem do meu carrinho no sistema
import mp3Alarme from '@salesforce/resourceUrl/AlarmClockAssets';

export default class MeuCarrinhoPomodoro extends LightningElement {
    //pegando uma imagem dos recursos estáticos
    get imgCarrinho(){
        return banner1;
    }
//variavel para tempo atual
    tempoAtual;
//variavel para receber as horas
    horas1 = [];
//variavel para minutos
    minutos1 = [];
//meridianos AM PM
    meridianos = ['AM', 'PM'];
//valores que estão sendo selecionados para o alarme
    selecionaHoras;
    selecionaMinutos;
    selecionaMeridiano;
//variavel para o alarme
    alarme;
    setAlarme = false;//controlado do alarme 
    alarmeDisparado = false;
    toqueAlarme = new Audio(mp3Alarme+'/AlarmClockAssets/Clocksound.mp3')//pode fazer iguala imgaem depois que entendi que tem que chamar new Audio
//usar um get para pegar o valor dos campos
get isFieldNotSelected(){//aqui pega os campos que não foram selecionados automaticamente porem vamos colocar uma negação abaixo para pegar oque queremos
    return !(this.selecionaHoras && this.selecionaMinutos && this.selecionaMeridiano);
}
//obeter o a classe para fazer o efeito de shake
get shakeImagem(){//no operador ternario colocar ; no final pode gerar um erro? Verificar mais a frente pois quando tira funciona
    return this.alarmeDisparado ? 'shake' : ''//se meu alarme disparado for verdadeiro então aplica a classe senão deixa a classe vazia
}
    connectedCallback(){
        this.criarOpcaoHoras();
        this.criarOpcaoMinutos();
        this.tempoHandle();
    }
   
    tempoHandle(){
        //para fazer a lógca dos segundos colocar a logica toda dentro de um set Interval
        setInterval(()=>{
            let data = new Date();
        let horas = data.getHours();
        let minutos = data.getMinutes();
        let segundos = data.getSeconds();
        let amPm = "AM"
        //logica de de AM e PM
        if(horas == 0){
            horas = 12
        }
        else if(horas >= 12){
            horas = horas - 12;
            amPm = "PM";
        }
        //usar operador ternario para colocar o zero na frete quando a hora ou o minuto ou segundo for menor que 10
        horas = horas<10 ? "0"+horas : horas;
        minutos = minutos<10 ? "0"+minutos : minutos;
        segundos = segundos<10 ? "0"+segundos : segundos; 
        this.tempoAtual = `${horas}:${minutos}:${segundos} ${amPm}`;
        if(this.alarme === `${horas}:${minutos} ${amPm}`){
            this.alarmeDisparado = true;
            this.toqueAlarme.play()
            this.toqueAlarme.loop = true
        }
        }, 1000);//para atualizar a hora por segundos
    }

    criarOpcaoHoras(){ 
        for(let i=1 ; i <= 12 ; i++){
            let valor = i < 10 ? "0"+i : i//fazendouma operação ternária que se meu i for menor q 10 colocar o zero na frente e retorna o i
            this.horas1.push(valor);
        }
    }
    criarOpcaoMinutos(){
        for(let i = 0 ; i <= 59 ; i++){//não esquecer o bendito do let pois senão ele dá erro no callback de undifinend
            let valor = i < 10 ? "0"+i : i
            this.minutos1.push(valor);
        }
    }
    //seleciona as opções 
    optionhandler(event){
        const {label, value} = event.detail;
        if(label === "Hora(s)"){
            this.selecionaHoras = value;
        } else if(label === "Minuto(s)"){
            this.selecionaMinutos = value;
        } else if(label === "AM/PM"){
            this.selecionaMeridiano = value;
        } else{}
        //para ver se estão pegando os valores certos
        console.log("this.selecionaHoras "+ this.selecionaHoras);
        console.log("this.selecionaMinutos "+ this.selecionaMinutos);
        console.log("this.selecionaMeridiano "+ this.selecionaMeridiano);
    }
    //logica para definir o alarme
    setAlarmeHandle(){
        this.alarme = `${this.selecionaHoras}:${this.selecionaMinutos} ${this.selecionaMeridiano}`;
        this.setAlarme = true;
    }

    clearAlarmeHandle(){
        this.alarme = '';
        this.setAlarme = false;//trocar o botão do alarme
        this.alarmeDisparado = false;//interromper o efeito shake na imagem
        this.toqueAlarme.pause()
        //zerar os valores selecionados anterioemente - foi criado um metodo publico no componente filho
        const elements = this.template.querySelectorAll('c-componente-alarme')//seleciona todos os componentes filho
        Array.from(elements).forEach(element => {//roda um for each nos elementos(componente filho) e chama a funçao resetar do filho
            element.resetar("")
        })
    }
}