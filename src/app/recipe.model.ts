export interface Recipe {
    id: string,
    name: string;
    imageURL: string;
    source: string;
    ingredients: Ingredient[];
    prep: Prep[];
    instructions: Instruction[];
}

export interface Ingredient {
    name: string;
    quantity: number;
    unit?: string;
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