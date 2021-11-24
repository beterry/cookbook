import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeGalleryComponent } from './recipe-gallery/recipe-gallery.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

const routes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    { path: 'recipes', component: RecipeGalleryComponent },
    { path: 'recipe/:id', component: RecipeDetailsComponent },
    { path: 'list', component: ShoppingListComponent },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
