import { LoginComponent } from './login/login.component';
import { AgUncountedComponent } from './ag-uncounted/ag-uncounted.component';
import { AgLocationsComponent } from './ag-locations/ag-locations.component';
import { RecountComponent } from './recount/recount.component';
import { AllTagsComponent } from './all-tags/all-tags.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component : LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'agTags', component : AllTagsComponent },
  { path: 'recount', component : RecountComponent },
  { path: 'agLocationProgress', component : AgLocationsComponent },
  { path: 'agUncounted', component : AgUncountedComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
