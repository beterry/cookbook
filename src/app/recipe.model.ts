export interface Recipe {
    id: string,
    name: string;
    imageURL: string;
    ingredients: Ingredient[];
    prep: Prep[];
    instructions: Instruction[];
}

export interface Ingredient {
    name: string;
    quantity: string;
}

export interface Prep {
    name: string;
    description: string;
    ingredients: string[];
}

export interface Instruction {
    text: string;
    ingredients: string[];
    time: string;
}