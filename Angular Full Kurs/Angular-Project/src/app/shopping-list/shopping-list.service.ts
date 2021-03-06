import { Ingredient } from './../shared/ingredients.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
	private ingredients: Ingredient[] = [
		new Ingredient('Jabłka', 5),
		new Ingredient('Pomidory', 10)
	];

	// zmiana event emitter na Subject
	ingredientsChanged = new Subject<Ingredient[]>();

	startedEditing = new Subject<number>();

	getIngredient(index: number): Ingredient {
		return this.ingredients[index];
	}

	getIngredients(): Ingredient[] {
		return this.ingredients.slice();
	}

	addIngredient(ingredient: Ingredient): void {
		this.ingredients.push(ingredient);
		this.ingredientsChanged.next(this.ingredients.slice());
	}

	addIngredients(ingredients: Ingredient[]): void {
		// ingredients.forEach(ingredient => {
		// 	this.ingredients.push(ingredient);
		// });

		// ... pozwalaja na dodanie kazdego elementu w tablicy, tak zwany 'spread operator'
		this.ingredients.push(...ingredients);
		this.ingredientsChanged.next(this.ingredients.slice());
	}

	updateIngredient(index: number, newIngredient: Ingredient) {
		this.ingredients[index] = newIngredient;
		this.ingredientsChanged.next(this.ingredients.slice());
	}

	deleteIngredient(index: number) {
		this.ingredients.splice(index, 1);
		this.ingredientsChanged.next(this.ingredients.slice());
	}
}
