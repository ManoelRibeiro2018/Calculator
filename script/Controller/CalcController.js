class CalcController{

   constructor(){
       this._operation = [];
       this._timeEl = '';
       this._currentDate = '';
       this._locale = 'pt-BR';
       this._displayCalcEl = document.querySelector('#display');
       this._timeEl = document.querySelector('#hora');
       this._dateEl = document.querySelector('#data');
       this.initialize();
       this.initbunttonsEvents();

   } 

   initialize(){
        this.setDisplayTimeDate();

        setInterval(()=>{
            this.setDisplayTimeDate();

        }, 1000);
        
   }

   addEventListenerAll(element, events, fn){

       events.split(' ').forEach(event => {

           element.addEventListener(event, fn, false);

       });

   }
   //metodo para execução de mais de um evento

   initbunttonsEvents(){

       let buttons =  document.querySelectorAll('#buttons > g, #parts > g');

       buttons.forEach((btn, index )=>{

        this.addEventListenerAll(btn,'click drag ', e => {

            let textBtn = btn.className.baseVal.replace('btn-','');

            this.execBtn(textBtn);
     
         });

        this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e =>{
           btn.style.cursor = 'pointer';

       });
      
    });
       
   }

   setDisplayTimeDate(){
       this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
       this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
           day: '2-digit',
           month: 'long',
           year: 'numeric'
           
       });

   }

   clearAll(){

       this._operation = [];
   }

   clearEntry(){

       this._operation.pop();

   }

   isOperator(value){
       return ([ '+', '-', '*', '%', '/'].indexOf(value) > -1);
   }

   getLastOperation(){

      return this._operation[this._operation.length -1];

   }

   setLastOperation(value){

    this._operation[this._operation.length - 1] = value;

   }

   pushOperation(value){

    this._operation.push(value);

    if(this._operation.length > 3){
    

        this.calc();

    }
   
   }

   calc(){

    let last = this._operation.pop();
    let result = eval(this._operation.join(''));

    if(last == '%'){

        result /= 100;

        this._operation=[result];

    }

   

    this._operation = [result, last];

    this.setLastNumberDisplay();

    

   }

   setLastNumberDisplay(){

       let lastNumber;

       for( let i = this._operation.length-1; i >=0; i--){

           if(!this.isOperator(this._operation[i])){
               lastNumber = this._operation[i];
               break;
           }
       }

       this.displayCalc  = lastNumber;
   }

   addOperation(value){

 
       if(isNaN(this.getLastOperation())){
           //just text

                if(this.isOperator(value)){
                    //is Operator 
                    
                        this.setLastOperation(value);

                } else if (isNaN(value)){

                        console.log('asdsa',value);

                        
                } else {

                        this.pushOperation(value);

                        this.setLastNumberDisplay();


                }

       } else {

                if (this.isOperator(value)){

                        this.pushOperation(value);


                } else {

                    let newValue =  this.getLastOperation().toString() + value.toString();
                    this.setLastOperation(parseInt(newValue));
                    
                    this.setLastNumberDisplay();


           }
           
           //just numeric
               
       }
    

       console.log(this._operation);

      //this._operation.push(value);

        


   }

   setErro(){
     this.displayCalc = 'error';
   }

   execBtn(value){

    switch(value){

        case 'ac':
            this.clearAll();
            break;

        case 'ce':
            this.clearEntry();
            break;
            
        case 'soma':
            this.addOperation('+');
            break;
        
        case 'subtracao':
            this.addOperation('-');
            break;

        case 'divisao':
            this.addOperation('/');
            break;
                
        case 'multiplicacao':
            this.addOperation('*');
            break;    
        
        case 'porcento':
             this.addOperation('%');
             break;
        
        case 'ponto':
            break;

        case 'igual':
              break;

        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':

            this.addOperation(parseInt(value));
            break;   
             
            default:
                this.setErro();
                break;



    }
    

   }

   get displayTime(){
       return this._timeEl.innerHTML;

   }

   set displayTime(value){
    return this._timeEl.innerHTML = value;

}

   get displayDate(){
    return this._dateEl.innerHTML;

   }

   set displayDate(value){
    return this._dateEl.innerHTML = value;

   }

   get displayCalc(){
       return this._displayCalcEl.innerHtml;
   }

   set displayCalc(value){
       this._displayCalcEl.innerHTML = value;
   }


   get timeEl(){
       return this._timeEl;
   }

   set timeEl(value){
       this.timeEl = value;
   }

   get currentDate(){
       return new Date();

   }

   set currentDate(value){

       this._currentDate.toLocaleDateString('pt_BR') = value;

   }
   

}