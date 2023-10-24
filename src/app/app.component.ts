import { Component,OnInit } from '@angular/core';
import { Renderer2, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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
        if (this.remainingTime === 60) {
            const generateId = Math.ceil(Math.random() * 20);
            console.log("generated Id:", generateId);
        }
        this.remainingTime--;
        if (this.remainingTime <= 10 && !this.isButtonDisabled) {
            this.isButtonDisabled = true;
            this.spinwheel2();
        }
        if (this.remainingTime < 0) {
            this.remainingTime = 60;
            this.isButtonDisabled = false;
            clearInterval(intervalId);
            console.log('Timer expired!');
        }
    }, 1000);
}


  isSpinning: boolean = false;

  updateButtons(){
    if(this.remainingTime <= 10 && !this.isSpinning){
      // this.isSpinning = true;
      // this.spinwheel()
      this.spinwheel2()
      this.isButtonDisabled = true;
      // setTimeout(() => {
      //   this.isSpinning = false;
      // }, 10000);
    }else{
      this.isButtonDisabled = false;
    }
  }

  spinwheel2() {
    const startTime = performance.now();
    const duration = 10000; // 10 seconds in milliseconds
    const wheel = this.el.nativeElement.querySelector(".wheel");
    this.spinWheelAnimation(wheel, startTime, duration);
  }
  
  spinWheelAnimation(wheel: any, startTime: number, duration: number) {
    const currentTime = performance.now();
    const elapsedTime = currentTime - startTime;
  
    if (elapsedTime < duration) {
      const randomValue = Math.floor(Math.random() * 10000);
      this.renderer.setStyle(wheel, "transform", `rotate(${randomValue}deg)`);
      requestAnimationFrame(() => this.spinWheelAnimation(wheel, startTime, duration));
    } else {
      // After 10 seconds, calculate stop angle and stop the wheel
      const field = 'tiger'
      const stopAngle = this.stopAtAngle(field);
      this.renderer.setStyle(wheel, "transition", "none");
      this.renderer.setStyle(wheel, "transform", `rotate(${stopAngle}deg)`);
    }
  }
  
  stopAtAngle(field: string): number {
    let stopAngle: number;

    // Logic to calculate stop angle based on the field
    if (field === 'tiger') {
        stopAngle = 315/* calculate stop angle for tiger */;
    }else if (field === 'lion') {
        stopAngle = 225 /* calculate stop angle for lion */;
    }else if (field === 'dragon') {
        stopAngle = 135 /* calculate stop angle for dragon */;
    }else if (field === 'king') {
        stopAngle = 45/* calculate stop angle for king */;

    } else {
        // Handle other fields if needed
        stopAngle = 90/* default stop angle if field is not recognized */;
    }
    console.log("return stopAngel:",stopAngle)

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
//     this.renderer.setStyle(wheel, 'transform', `rotate(${initialRotation}deg)`);

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
