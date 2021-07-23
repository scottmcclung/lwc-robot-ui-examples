import {LightningElement, api} from 'lwc';


export default class Form extends LightningElement {
    @api 
    reset() {
        this.template.querySelector('form').reset();
    }

    @api
    submit(fields) {
        console.log('submitted fields: ', fields);
        setTimeout(() => {
            this.dispatchEvent(new CustomEvent('success'));
        }, 2500);
    }
    
    
    handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('submit'));
    }
}