var budgetController= (function(){
    
    var Expense=function(id,desc,val){
        this.id=id;
        this.desc=desc;
        this.val=val;
    };
    var Income=function(id,desc,val){
        this.id=id;
        this.desc=desc;
        this.val=val;
    };    
    var data={
        Items: {
            inc:[],
            exp:[]
        },
        total:{
            totalInc:0,
            totalExp:0
        }
    };    
    return{
            addItem:function(type,desc,val){
                var newItem,ID;
                if (data.Items[type].length===0){
                    ID=0;
                }
                else{
                    ID=data.Items[type][data.Items[type].length -1].id+1;
                }   
                if(type==='inc'){
                    newItem=new Income(ID,desc,val);
                }
                else if(type==='exp'){
                    newItem=new Expense(ID,desc,val);
                }
                data.Items[type].push(newItem);
                return data;
                },
            UpdateIE:function(obj,type){
                console.log(obj);
                obj.total.totalExp=0;
                obj.total.totalInc=0;
                for (var i=0;i<obj.Items.inc.length;i++){
                    obj.total.totalInc+=obj.Items.inc[i].val;
                }
                for (var i=0;i<obj.Items.exp.length;i++){
                    obj.total.totalExp+=obj.Items.exp[i].val;
                }
                if (obj.total.totalExp!==0 && obj.total.totalInc!==0){
                    var expPercent=parseInt((obj.total.totalExp/obj.total.totalInc)*100);
                }
                else{
                    expPercent=0;
                }   
                return expPercent;
            },
            Percent:function(obj){
                var Perc=[];
                for(var i=0;i<obj.Items.exp.length;i++){
                var num=obj.Items.exp[i].val;
                var den=obj.total.totalExp;
                var Per=(num/den)*100;
                Perc.push(Per);
                }
                return Per;
            },
            UpdatePerc:function(obj){
                var Perc=[];
                for(var i=0;i<obj.Items.exp.length;i++){
                var index=obj.Items.exp.length -1;
                var num=obj.Items.exp[i].val;
                var den=obj.total.totalExp;
                //console.log(num,den);
                var Per=(num/den)*100;
                Perc.push(Per);
                }
                return Perc;     
            },
            removeItem:function(data,type,id){
                var ids=data.Items[type].map(function(curr){
                    return curr.id
                });
                var index=ids.indexOf(id);
                data.Items[type].splice(index,1);
                console.log(data)
                return data;
    }
}
})();

var UIController= (function(){
  return {
       
        getData:function(){

            return{

                type:document.querySelector('.add__type').value,
                desc:document.querySelector('.add__description').value,
                val:parseInt(document.querySelector('.add__value').value),
            }
        }, 
        display:function(obj,data){  
        var Perc=budgetController.Percent(data); 
         if (obj.type==='inc'){
            element='.income__list';
            var html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div> <div class="right clearfix"> <div class="item__value">+ %val%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }
        else if(obj.type==='exp'){
            element='.expenses__list'
            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div>  <div class="right clearfix"> <div class="item__value">- %val%</div> <div class="item__percentage" id="%nu%">%Per%%</div> <div class="item__delete">     <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>    </div> </div> </div>'
        }
        var ind=data.Items[obj.type].length-1;
        var newHtml=html.replace('%id%',data.Items[obj.type][ind].id);
        var newHtml=newHtml.replace('%desc%',obj.desc);
        var newHtml=newHtml.replace('%val%',this.formatNumber(obj.val));
        var newHtml=newHtml.replace('%nu%',obj.desc);
        var newHtml=newHtml.replace('%Per%',parseInt(Perc));
        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        document.querySelector('.add__description').value='';
        document.querySelector('.add__value').value='';
        document.querySelector('.add__description').focus();
             },
        totalUI:function(obj,Per,bal){
            //var vale=obj.total.totalExp;
           document.querySelector('.budget__income--value').textContent=this.formatNumber(obj.total.totalInc);
           document.querySelector('.budget__expenses--value').textContent=this.formatNumber(obj.total.totalExp);
           if(Per!==undefined){
           document.querySelector('.budget__expenses--percentage').textContent=Per+'%';
           }
           else{
            document.querySelector('.budget__expenses--percentage').textContent=0.00+'%';
           
           }
           var bal=obj.total.totalInc-obj.total.totalExp  
           document.querySelector('.budget__value').textContent=this.formatNumber(bal);
        }, 
        formatNumber:function(val){
            if(val===0){
                var z=0.00;
                return z;
            }
            else{
                console.log('form');
                val=val.toFixed(2);
                values=val.split('.');
                int=values[0];
                dec=values[1];
                if(int.length>3){
                  var   int1=int.substring(0,int.length-3);
                   var  int2=int.substring(int.length-3,4);
                   return int1+','+int2+'.'+dec;

                }
    
            }
        },
            
        
        UpdatePercUI:function(obj){
           var Perc=budgetController.UpdatePerc(obj);
            for(var i=0;i<obj.Items.exp.length;i++){
                var d=obj.Items.exp[i].desc;
                document.getElementById(d).textContent=parseInt(Perc[i]);          
        }
    },
    Date:function(){
        var  now,year,month;
        now=new Date();
        year=now.getFullYear();
        month=now.getMonth();  
        var months=['January','February','March','April','May','June','July','August','September','October','November','December'] ;
        console.log(months[month]+' '+year);
        document.querySelector('.budget__title--month').textContent=months[month]+' '+year; 
    }     
  };   
})();


var MainController=(function(budgetCltr,UICltr){
    function btnPress(){
        var balance,expPercent;
        var input=UICltr.getData();
       // console.log(input);
        data=budgetCltr.addItem(input.type,input.desc,input.val);
        expPercent= budgetCltr.UpdateIE(data,input.type);
        UICltr.totalUI(data,expPercent,balance);
        UICltr.display(input,data);
        UICltr.UpdatePercUI(data);
    };
    function removeElement(event){
        ItemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
        var arr=ItemID.split('-');
        ID=parseInt(arr[1])
        type=arr[0];
        document.getElementById(ItemID).remove();
        data=budgetCltr.removeItem(data,type,ID);
        expPercent= budgetCltr.UpdateIE(data,type);
        UICltr.totalUI(data,expPercent,);
        UICltr.UpdatePercUI(data);
         }
function UpdateBudget(data,type){
    expPercent= budgetCltr.UpdateIE(data,input.type);
        UICltr.totalUI(data,expPercent,balance);
        if(type=='exp')
        UICltr.UpdatePercUI(data);
}


    var event=function(){
        document.querySelector('.budget__income--value').textContent='+0.00';
        document.querySelector('.budget__expenses--value').textContent='-0.00';
        document.querySelector('.add__btn').addEventListener('click',btnPress);
        document.addEventListener('keypress',function(event){
        if(event.keyCode===13 || event.which===13){     
            btnPress();
        }
        document.querySelector('.container').addEventListener('click',removeElement);
    });
 };   
    return {
        init:function(){
            console.log('Application has started');
            UICltr.Date();
            event();
        }
    }; 
})(budgetController,UIController);
var count=0;
MainController.init();

