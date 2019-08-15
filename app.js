//requires lodash, react, reactDOM

const uniqueCards = ['pi','umbrella','watch','skull','mnote', 'thunder', 'hashtag'];
const matchCardsNum = 2;

class MemoryGame extends React.Component{
  constructor(){
		super();
		this.shuffleCards = this.shuffleCards.bind(this);
    this.pickCard = this.pickCard.bind(this);
    this.addWin = this.addWin.bind(this);
   
    // Is this an anti-pattern? Need better solution.
    this.ignoreCardClicks = false;
    
		this.state = { 
      cards : [],
      gamesWon: 0,
      selectedCards: [],
      gameOver: 1
    };

	}
  
  multiplyCards(cards, multiplier){
    let loopTimes = multiplier - 1;
    let multiplied = cards;
    for (var i = 0; i < loopTimes; i++){
      multiplied = _.concat(multiplied,cards);
    }
    
    return multiplied;
  }
  
  shuffleCards(){
    
    
    let multipliedCards = this.multiplyCards(uniqueCards,matchCardsNum);
    let shuffled = _.shuffle(multipliedCards);
    
    //make each card an object with its own state values:
    let cards = shuffled.map(function(val){
      return {
        type: val,
        position: 'unselected'
      }
    });
    //
    //console.log('card type='+cards[1].type);
    
    this.setState({ 
      cards: cards,
      gameOver: 0
    });
    
  }
  
  changeAllPositionsOfSelected(allCards,selectedCards,newPosition){
    for (var v of selectedCards) {
      allCards[v].position=newPosition;
    }
    return allCards;
  }
  
  addWin(){
    let newGamesWon = this.state.gamesWon + 1;
    this.setState({ gamesWon: newGamesWon, gameOver: 1 });
  }
  
  selectedHasSameAttribute(allCards,selectedCards,attribute){
    //console.log('hasSameAttribute '+attribute);
    let eq = allCards[selectedCards[0]][attribute];
    for (var v of selectedCards) {
      if(allCards[v][attribute] !== eq){ return false; }
    }
    return true;
  }
  
  
  checkForMatch(curCards, curSelectedCards){
      
    //console.log('checkForMatch');
    
    // 2 cards selected, check for match
     if( this.selectedHasSameAttribute(curCards,curSelectedCards,'type') ){
        curCards = this.changeAllPositionsOfSelected(curCards,curSelectedCards,"removed");
        //check if won game!

       let winTest =  _.reduce(curCards, function(result, value, key) {
          //console.log('value.position='+value.position);
          //console.log('result='+result);
         
          if(result === value.position){
            return result;
          }else{
            return false;
          }
         //return true;
          
        }, curCards[0].position); 
        
       
       if(winTest !== false){
         this.addWin();
       }
       
      }else{
        curCards = this.changeAllPositionsOfSelected(curCards,curSelectedCards,"unselected");
      }
    
      // curCards transformed only
      return curCards;
  }

  pickCard(index){

    
    
    if(this.ignoreCardClicks !== true){

      let curSelectedCards = _.concat(this.state.selectedCards, index);
      let curCards = this.state.cards;

      //if (curSelectedCards.length !== )
      //console.log('cards stored: '+curSelectedCards.length);

      curCards[curSelectedCards[ curSelectedCards.length-1 ]].position="selected";

      if(curSelectedCards.length === matchCardsNum){

          this.setState({
            
           
            cards: curCards
          })

        let _this = this; //needed for timeout because 'this' changes 
        this.ignoreCardClicks = true;

        let pauseGame = setTimeout(function(){ 
          curCards = _this.checkForMatch(curCards, curSelectedCards);
          curSelectedCards = [];

          _this.ignoreCardClicks = false;

          _this.setState({
            selectedCards: curSelectedCards,
            cards: curCards
          })

        }, 750);

      }else{
        curCards[curSelectedCards[0]].position="selected";

          this.setState({
            selectedCards: curSelectedCards,
            cards: curCards
          });

      }

    }


  }
  
  render(){ 
     let clickEvent = this.pickCard;
    let cardIndex = 0;
     return(
     <div className="memory-app">

       <HomeScreen gameOver={this.state.gameOver} gamesWon={this.state.gamesWon} clickEvent={this.shuffleCards} />
       <div className="cards">
           {this.state.cards.map(function(thisCard) {
            return <Card index={cardIndex++} clickEvent={clickEvent} position={thisCard.position} type={thisCard.type}/>
            })}
       </div> 

      </div>
     )
  }
}

class Card extends React.Component{
 constructor(){
		super();
		this.clickMe = this.clickMe.bind(this);
 }
  clickMe(){
    //call parent function that manages state
    if(this.props.position === 'unselected'){
      this.props.clickEvent(this.props.index);
    }else{
      console.log('cant click me! my position is '+this.props.position);
    }
    
  }
 
   render(){ 
     return (
       <div data-index={this.props.index} data-cardtype={this.props.type} onClick={this.clickMe } className={ 'card card--'+this.props.type+' card--'+this.props.position } > 
        <div className="card-inner"> 
            <div className="card--face card--front"> 
              
            </div> 
            <div className="card--face card--back"> 
               
            </div> 
        </div> 
    </div> 
     ) 
   }
}


class HomeScreen extends React.Component{
   constructor(){
		  super();
		  this.clickMe = this.clickMe.bind(this);
    }
  clickMe(){
    //call parent function that manages state
     this.props.clickEvent(this.props.clickEvent);
    //this.shuffleCards
  } 
     render(){ 
       return (
          <div className={this.props.gameOver ? "homescreen homescreen--visible" : "homescreen homescreen--hidden"}>
            <div className="homescreen--box">
              <h1 className="homescreen__title">Emoji&nbsp;  Match</h1>
              <div className="homescreen-stats">
                Games Won: <strong className="homescreen-number" >{this.props.gamesWon}</strong>
              </div>
              <button className="homescreen--shuffle-button " onClick={this.clickMe} >Start!</button>
           </div>
          </div>
         )
     }
}


ReactDOM.render(<MemoryGame />, document.getElementById('app'));