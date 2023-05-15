import { LightningElement, api } from 'lwc';

export default class ComponenteAlarme extends LightningElement {
    @api label = '';
    @api opcoes = [];
    @api idUnico = '';

    eventoChangeHandle(event){
        this.callPai(event.target.value);
    }

    callPai(value){//ver se callParent não é um função reservada
        this.dispatchEvent(new CustomEvent('optionhandler', {//lembrar que no componente pao isso que vai ser chamado : optionhandler porem coloque o (on) na frente
            detail: {
                label: this.label,
                value: value
            }
        }));//fim dos dispatch Event acho que é algo como dispachar evento madar para fora
    }
    @api//vai ser criado uma fução pública para resetar os campos do elemento pai
    resetar(value){
        this.template.querySelector('select').value = value;
        this.callPai(value);
    }
}