import { Component,OnInit } from '@angular/core';
import { Renderer2, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spinner';
  data:any;
  singleData:any={
    name:'',
    color:'',
    price:'',
    userPrice:''
  };
  val:any;
  display = "none";
  isDialogVisible:boolean= false;
  remainingTime: number = 60; // Initial time in seconds
  isButtonDisabled : boolean = false;
  inputValue: number = 0;
  profitValue: number = this.inputValue * this.singleData.price; // Calculate profitValue
  minimumBets:any;
  showSpinner: boolean = true;
  constructor(private renderer: Renderer2, private el: ElementRef,private http:HttpClient) {}
  

  ngOnInit(): void {
    this.getData();
    this.startTimer();
    this.getMinimumBets();
    this.spinwheel2()
  }


  // this.profitValue = (this.inputValue * this.singleData.price);
  getButtonValue(value:number,event:Event){
    event.preventDefault();
    this.inputValue = value;
  }

  startTimer() {
   
    const intervalId = setInterval(() => {
      if(this.remainingTime === 60){
        const generateId = Math.ceil(Math.random() * 20)
        console.log("generated Id:",generateId)
      }
      this.remainingTime--; // Decrease the remaining time by 1 second
      if (this.remainingTime < 0) {
        // clearInterval(intervalId); // Stop the timer when the remaining time reaches 0
        this.remainingTime = 60;
        
        
        // this.deleteBets()
        console.log('Timer expired!'); // You can execute any function when the timer expires
      }
    this.updateButtons()
    }, 1000); // Run the timer function every 1000 milliseconds (1 second)
  }

  isSpinning: boolean = false;

  updateButtons(){
    if(this.remainingTime <= 10 && !this.isSpinning){
      this.isSpinning = true;
      // this.spinwheel()
      this.spinwheel2()
      this.isButtonDisabled = true;
      setTimeout(() => {
        this.isSpinning = false;
      }, 10000);
    }else{
      this.isButtonDisabled = false;
    }
  }

  spinwheel2(){
    // const minimumData = this.minimumBets
    const randomValue = Math.floor(Math.random() * 10000) 
    let wheel =  this.el.nativeElement.querySelector(".wheel")
    this.renderer.setStyle(wheel,"transform",`rotate(${randomValue}deg)`)
    console.log("random:",randomValue)

    const remainingtime = this.remainingTime
    const fieldsArray = ['tiger','lion','dragon','king']
    // console.log(this.minimumBets[0].field)
    for(const field of fieldsArray){
        if(this.minimumBets.field === field && remainingtime <= 5 && remainingtime > 0){
          const stopAngel = this.stopAtAngle(field)
          this.renderer.setStyle(wheel,"transition","none")
          this.renderer.setStyle(wheel, 'transform',`rotate(${stopAngel}deg)`)
          break;
        }
    } 
  }

  stopAtAngle(field: string): number {
    let stopAngle: number;

    // Logic to calculate stop angle based on the field
    if (field === 'tiger') {
        stopAngle = 45/* calculate stop angle for tiger */;
    } else if (field === 'lion') {
        stopAngle = 120 /* calculate stop angle for lion */;
    } else if (field === 'dragon') {
        stopAngle = 240 /* calculate stop angle for dragon */;
    } else if (field === 'king') {
        stopAngle = 300/* calculate stop angle for king */;
    } else {
        // Handle other fields if needed
        stopAngle = 90/* default stop angle if field is not recognized */;
    }

    return stopAngle;
}


//   spinwheel() {
//     const myselectedValue = this.singleData.id;
//     const userValue = this.singleData.userPrice;
//     const selectedName = this.singleData.name;
//     const totalprice = userValue * this.singleData.price;

//     console.log("my selected value:", myselectedValue);
//     console.log("Selected Name:", selectedName);

//     let wheel = this.el.nativeElement.querySelector('.wheel');
//     let randomValue = Math.floor(Math.random() * 10000); // Random value between 0 and 359
//     console.log("Random Value:", randomValue);

//     // Adjust initial rotation to align with the top side of the wheel
//     let initialRotation = 360 - randomValue;
    // this.renderer.setStyle(wheel, 'transform', `rotate(${initialRotation}deg)`);

//     let relativeDegree =(randomValue % 360);
//     const segmentSize = 360 / this.data.length;
//     const segmentIndex = Math.floor(relativeDegree / segmentSize);
//     console.log("Segment Index:", segmentIndex);

//     const selectedData = this.data[segmentIndex];
//     console.log('Final Data:', selectedData.name);
//     setTimeout(() => {
//       if (selectedData.name === selectedName) {
//         console.log(`Congratulations! You won with ${totalprice} rupees`);
//         // alert(`Congratulations! its ${selectedData.name} You won with ${totalprice} rupees`)
//     } else {
//         console.log(`Sorry, you lose ${userValue} rupees`);
//         // alert(`Sorry,its ${selectedData.name} you lose with ${userValue} rupees`)
//     }
//     }, 5000);
    
// }

  submitForm(event:Event){
    // this.spinwheel();
    event.preventDefault();
    this.addBets();
    this.onCloseHandled();
  }

  addBets(){
    let formdata = new FormData()
     
    formdata.append("price",this.singleData.userPrice)
    formdata.append("id",this.singleData.id)

    this.http.post("http://localhost:3100/addPrice",formdata).subscribe(res=>{
      console.log(res)
    })
  }

  deleteBets(){
    this.http.delete("http://localhost:3100/deletePrice").subscribe(res=>{
      console.log(res)
  })
  }

  openDialog(obj:any){


    this.display = "block";
  //   this.http.get("http://localhost:3100/getData").subscribe(res=>{
  //     this.data = res;
  //  })
  }

  onCloseHandled() {
    this.display = "none";
  }
  getData(){
    this.http.get("http://localhost:3100/getData").subscribe(res=>{
      this.data = res
      // console.log(res)
    })
  }

  getSingleData(id:any){
    this.display = "block"
    // console.log(id)
    this.http.get("http://localhost:3100/getSingleData/"+id).subscribe(res=>{
      this.singleData = res
      this.isDialogVisible = true;
      // console.log(res)
    })
  }

  getMinimumBets(){
    this.http.get("http://localhost:3100/showBetsData").subscribe(res=>{
      this.minimumBets = res
      console.log(this.minimumBets)
    })
  }
  
}
