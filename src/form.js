import {LightningElement, api} from 'lwc';


export default class Form extends LightningElement {
    @api 
    reset() {
        this.template.querySelector('form').reset();
    }
    
    
    handleSubmit(e) {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('submit'));
        setTimeout(() => {
            this.dispatchEvent(new CustomEvent('success'));
        }, 2500);
    }
}