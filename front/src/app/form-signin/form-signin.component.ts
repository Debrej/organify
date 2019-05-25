import {Component, ElementRef, HostListener, NgZone, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-form-signin',
  templateUrl: './form-signin.component.html',
  styleUrls: ['./form-signin.component.css']
})
export class FormSigninComponent implements OnInit {

  @ViewChild('firstNameInput') firstNameInput: ElementRef;
  @ViewChild('lastNameInput') lastNameInput: ElementRef;
  @ViewChild('mailInput') mailInput: ElementRef;
  @ViewChild('pwdInput') pwdInput: ElementRef;
  @ViewChild('pwdConfirmInput') pwdConfirmInput: ElementRef;

  private mail: any;
  private pwd: any;
  private pwdConfirm: any;
  private lastName: any;
  private firstName: any;
  durationSnackBar = 50;

  login():void {
    this._router.navigate(['/', 'login']);
  }

  signIn():void {

    this.firstName = this.firstNameInput.nativeElement.value;
    this.lastName = this.lastNameInput.nativeElement.value;
    this.mail = this.mailInput.nativeElement.value;
    this.pwd = this.pwdInput.nativeElement.value;
    this.pwdConfirm = this.pwdConfirmInput.nativeElement.value;

    if(this.firstName === ""){
      this.renderer.setStyle(this.firstNameInput.nativeElement,'border-bottom', '1px solid #B22222');
    }
    else{
      this.renderer.setStyle(this.firstNameInput.nativeElement,'border-bottom', '1px solid #99987b');
    }
    if(this.lastName === ""){
      this.renderer.setStyle(this.lastNameInput.nativeElement,'border-bottom', '1px solid #B22222');
    }
    else{
      this.renderer.setStyle(this.lastNameInput.nativeElement,'border-bottom', '1px solid #99987b');
    }
    if(this.mail === ""){
      this.renderer.setStyle(this.mailInput.nativeElement,'border-bottom', '1px solid #B22222');
    }
    else{
      this.renderer.setStyle(this.mailInput.nativeElement,'border-bottom', '1px solid #99987b');
    }
    if(this.pwd === ""){
      this.renderer.setStyle(this.pwdInput.nativeElement,'border-bottom', '1px solid #B22222');
    }
    else{
      this.renderer.setStyle(this.pwdInput.nativeElement,'border-bottom', '1px solid #99987b');
    }
    if(this.pwdConfirm === ""){
      this.renderer.setStyle(this.pwdConfirmInput.nativeElement,'border-bottom', '1px solid #B22222');
    }
    else{
      this.renderer.setStyle(this.pwdConfirmInput.nativeElement,'border-bottom', '1px solid #99987b');
    }

    if(this.firstName === "" || this.lastName === "" || this.mail === "" || this.pwd === "" || this.pwdConfirm === ""){
      this.openSnackBar("Empty fields.", this.zone);
    }
    else if (this.pwd !== this.pwdConfirm){
      this.openSnackBar("The passwords do not match", this.zone);
    }
    else{
      this._authService.createOrga(this.firstName, this.lastName, this.mail, this.pwd).subscribe(ret => {
        let data = JSON.parse(JSON.stringify(ret));
        if(data.status === 0){ // if the status is ok
          this.openSnackBar("You can now login", this.zone);
          this._router.navigate(['/', 'login']); // we navigate to the other view
        }
        else if (data.status === 2){
          this.openSnackBar("Could not create the user", this.zone);
        }
        else{
          this.openSnackBar("Server error", this.zone);
        }
      });
    }
  }

  openSnackBar(msg: string, zone: any) {
    zone.run(() => {
      this._snackBar.open(msg, null, {
        duration: this.durationSnackBar * 150,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: 'snack-error'
      });
    });
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event.key);
    // @ts-ignore
    if(event.key == "Enter"){
      this.signIn()
    }
  }

  constructor(private _router: Router, private _authService: AuthService, private _snackBar: MatSnackBar, private zone: NgZone, private renderer: Renderer2) { }

  ngOnInit() {
  }

}
