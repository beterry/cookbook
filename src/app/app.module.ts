import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RecipeGalleryComponent } from './recipe-gallery/recipe-gallery.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { IngredientListComponent } from './ingredient-list/ingredient-list.component';
import { PrepListComponent } from './prep-list/prep-list.component';
import { InstructionsListComponent } from './instructions-list/instructions-list.component';

@NgModule({
  declarations: [
    AppComponent,
    RecipeGalleryComponent,
    HeaderComponent,
    RecipeDetailsComponent,
    ShoppingListComponent,
    IngredientListComponent,
    PrepListComponent,
    InstructionsListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
