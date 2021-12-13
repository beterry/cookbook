import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RecipeGalleryComponent } from './recipe-gallery/recipe-gallery.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { IngredientListComponent } from './ingredient-list/ingredient-list.component';
import { PrepListComponent } from './prep-list/prep-list.component';
import { InstructionsListComponent } from './instructions-list/instructions-list.component';
import { ShoppingListItemComponent } from './shopping-list/shopping-list-item/shopping-list-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';
import { PrepStepComponent } from './recipe-form/prep-step/prep-step.component';
import { InstructionStepComponent } from './recipe-form/instruction-step/instruction-step.component';
import { DropdownDirective } from './directives/dropdown.directive';
import { DialogComponent } from './dialog/dialog.component';
import { LoginComponent } from './login/login.component';
import { UserInterceptorService } from './services/user-interceptor.service';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    RecipeGalleryComponent,
    HeaderComponent,
    RecipeDetailsComponent,
    ShoppingListComponent,
    IngredientListComponent,
    PrepListComponent,
    InstructionsListComponent,
    ShoppingListItemComponent,
    RecipeFormComponent,
    PrepStepComponent,
    InstructionStepComponent,
    DropdownDirective,
    DialogComponent,
    LoginComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: UserInterceptorService,
      multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
