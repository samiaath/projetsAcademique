import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';



@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  constructor(
    private router: Router
  ){}
  logout():void{
    localStorage.clear();
  this.router.navigate(['/login']) }

}
