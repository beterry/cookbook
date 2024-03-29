import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeGalleryComponent } from './recipe-gallery/recipe-gallery.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    { path: 'recipes', component: RecipeGalleryComponent },
    { path: 'recipe/details/:id', component: RecipeDetailsComponent },
    { path: 'recipe/:form/:id', component: RecipeFormComponent },
    { path: 'recipe/:form', component: RecipeFormComponent },
    { path: 'list', component: ShoppingListComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'recipes' },
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            // when navigating with browser buttons, reset the page to the top
            scrollPositionRestoration: 'top'
        })
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
