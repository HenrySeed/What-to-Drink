export interface IngredientData {
    name: string;
    taste: string;
    abv: number;
}

export class Ingredient {
    name: string;
    amount: string;
    unit: string;
    ingredient: string;

    constructor(obj: any) {
        if (obj.special) {
            const special: string = obj.special;
            const knownUnits = [
                "dashes",
                "dash",
                "drops",
                "drop",
                "teaspoon",
                "teaspoons",
                "bar spoon",
                "bar spoons"
            ];
            // First split by unit to get the amount
            const usedUnit = knownUnits.filter(val => special.includes(val))[0];
            let [amount, name] = special.split(usedUnit).map(val => val.trim());
            this.amount = amount;
            this.unit = usedUnit;
            this.ingredient = name;
            this.name = name ? name : special;
        } else {
            if (obj.label) {
                this.name = obj.label;
            } else {
                this.name = obj.ingredient;
            }
            this.amount = obj.amount;
            this.unit = obj.unit;
            this.ingredient = obj.ingredient;
        }
    }
}

export class Recipe {
    name: string;
    key: string;
    category: string;
    ingredients: Array<Ingredient>;
    preparation: string;
    garnish: string;
    glass: string;

    constructor(obj: any) {
        this.name = obj.name;
        this.key = obj.name.replace(/ /g, "_");
        this.category = obj.category;
        this.ingredients = obj.ingredients.map(
            (val: any) => new Ingredient(val)
        );
        this.preparation = obj.preparation;
        this.garnish = obj.garnish;
        this.glass = obj.glass;
    }
}
