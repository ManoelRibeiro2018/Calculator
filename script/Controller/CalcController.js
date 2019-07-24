class CalcController{

   constructor(){
       this._audio = new Audio('click.mp3');
       this._audioOnOff= false;
       this._lastOperator = '';
       this._lastNumber = '';
       this._operation = [];
       this._timeEl = '';
       this._currentDate = '';
       this._locale = 'pt-BR';
       this._displayCalcEl = document.querySelector('#display');
       this._timeEl = document.querySelector('#hora');
       this._dateEl = document.querySelector('#data');
       this.initialize();
       this.initbunttonsEvents();
       this.initKeyboard();

   }
   
   parseFromClipboard(){

    document.addEventListener('paste', e=>{

       let text= e.clipboardData.getData('text');

        this.displayCalc = parseFloat(text);

    });
   }

   copyToClipboard(){

    let input = document.createElement('input');

    input.value = this.displayCalc;

    document.body.appendChild(input);

    input.select();

    document.execCommand('Copy');

    input.remove();

   }

   initialize(){
        this.setDisplayTimeDate();

        setInterval(()=>{
            this.setDisplayTimeDate();

        }, 1000);

        this.setLastNumberToDisplay();
        this.parseFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick', e=>{

                this.toggleAudio();

            });
        });
        
   }

   toggleAudio(){

    this._audioOnOff = !this._audioOnOff;

   }

   playAudio(){
       if(this._audioOnOff){
           this._audio.currentTime = 0;
           this._audio.play();

       }
   }

   addEventListenerAll(element, events, fn){

       events.split(' ').forEach(event => {

           element.addEventListener(event, fn, false);

       });

   }   //metodo para execução de mais de um evento

   initKeyboard(){

    document.addEventListener('keyup', e =>{

        this.playAudio();

        switch(e.key){

            case 'escape':
                this.clearAll();
                break;

            case 'Backspace':
                this.clearEntry();
                break;
                
            case '+':            
            case '-':
            case '*':                    
            case '/':             
            case '%':
                this.addOperation(e.key);
                break;
            
            case '.':
            case ',':    
                this.addDot();
                break;

            case 'Enter':
            case '=':    
                this.calc();
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

                this.addOperation(parseInt(e.key));
                break;   

                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
        }
        
        
    });

   }

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
       this._lastNumber = '';
       this._lastOperator = ''
       this.setLastNumberToDisplay();
   }

   clearEntry(){

       this._operation.pop();
       this.setLastNumberToDisplay();

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

   getResult(){
       try{

             return eval(this._operation.join(''));
       }catch(e){
           this.setErro();
       }

   }

   calc(){

    let last = '';
    
    this._lastOperator = this.getLastItem();

    if(this._operation.length < 3){

        let firstItem = this._operation[0];
        this._operation = [firstItem, this._lastOperator, this._lastNumber];

    }

    if(this._operation.length >3) {

        last = this._operation.pop();
        this._lastNumber =  this.getResult();

    }
    
    else if(this._operation.length == 3) {

        this._lastNumber = this.getLastItem(false);

    }

    let result = this.getResult();

    if(last == '%'){

        result /= 100;

        this._operation = [result];

    } else {

        this._operation = [result];

        if(last) this._operation.push(last);

    }

     this.setLastNumberToDisplay();

   }

   getLastItem(isOperator = true){

        let lastItem;

            for( let i = this._operation.length-1; i >=0; i--){

                  if(this.isOperator(this._operation[i])== isOperator){
                    lastItem = this._operation[i];
                    break;
                }

            }
            if(!lastItem){

                lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
                
            }

            return lastItem;

           


    }

   setLastNumberToDisplay(){

       let lastNumber;

       for( let i = this._operation.length-1; i >=0; i--){

           if(!this.isOperator(this._operation[i])){
               lastNumber = this._operation[i];
               break;
           }
       }
       if(!lastNumber) lastNumber = 0;

       this.displayCalc  = lastNumber;
   }

   addOperation(value){

 
       if(isNaN(this.getLastOperation())){
           //just text

                if(this.isOperator(value)){
                    //is Operator 
                    
                        this.setLastOperation(value);

                }  else {

                        this.pushOperation(value);

                        this.setLastNumberToDisplay();


                }

       } else {

                if (this.isOperator(value)){

                        this.pushOperation(value);


                } else {

                    let newValue =  this.getLastOperation().toString() + value.toString();
                    this.setLastOperation(newValue);
                    
                    this.setLastNumberToDisplay();


           }
           
           //just numeric
               
       }
    

   }


   addDot(){

    let lastOperation = this.getLastOperation();

    if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;    

    if(this.isOperator(lastOperation) || !lastOperation){
        this.pushOperation('0.');
    }else{

        this.setLastOperation(lastOperation.toString() + '.');
    }

    this.setLastNumberToDisplay();

   }

   setErro(){
     this.displayCalc = 'error';
   }

   execBtn(value){

    this.playAudio();

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
                this.addDot();
                break;

            case 'igual':
                this.calc();
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

        if(value.toString().length > 10){
            this.setErro();
            return false;

        }
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