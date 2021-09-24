import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanvasCompComponent } from './canvas-comp/canvas-comp.component'
import { NotFoundComponent } from './not-found/not-found.component'

const routes: Routes = [
  {path: '', component: CanvasCompComponent, pathMatch: 'full'},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
