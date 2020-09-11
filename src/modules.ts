export interface Ingredient {
    unit: string;
    amount: number;
    ingredient: string;
    special?: string;
}

export interface Recipe {
    name: string;
    category: string;
    ingredients: Array<Ingredient>;
    preparation: string;
    garnish: string;
    glass: string;
}
