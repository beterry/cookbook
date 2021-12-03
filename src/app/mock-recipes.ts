import { Recipe, Ingredient, Prep, Instruction} from './recipe.model';

export const RECIPES: Recipe[] = [
    {
        id: "000",
        name: 'Creamy Cajun Chicken',
        imageURL: 'https://cdn-uploads.mealime.com/uploads/recipe/thumbnail/1479/presentation_099c3610-b0d1-46b1-8402-57817131d4c6.jpeg',
        ingredients: [
            {
                name: 'Chicken Breasts',
                quantity: "1",
            },
            {
                name: 'Chicken Broth',
                quantity: "4 fl oz",
            },
        ],
        prep: [
            {
                name: 'Chicken',
                description: 'Cut the chicken in breast half horizontally to form thin fillets. Season both sides with salt and pepper.',
                ingredients: [
                    '1/4 tsp salt',
                    '1/8 black pepper',
                    '1 chicken breast',
                ]
            },
            {
                name: 'Butter portion 1',
                description: '',
                ingredients: [
                    '2 tbsp butter',
                ]
            },
        ],
        instructions: [
            {
                text: 'Preheat a skillet over medium-high heat',
                ingredients: [],
                time: '',
            },
            {
                text: 'Once the skillet is hot, add butter and swirl to coat the bottom',
                ingredients: [
                    'butter portion 1',
                ],
                time: '',
            },
        ]
    },
    {
        id: "001",
        name: 'Corn Cassarole',
        imageURL: 'https://www.thegunnysack.com/wp-content/uploads/2019/11/Corn-Casserole-Recipe-720x720.jpg',
        ingredients: [
            {
                name: 'Creamed Corn',
                quantity: "1 can",
            },
            {
                name: 'Whole Corn',
                quantity: "1 can",
            },
        ],
        prep: [
            {
                name: 'Corn Mixure',
                description: 'Mix all ingredients together in a large bowl',
                ingredients: [
                    'Creamed Corn',
                    'Canned Corn',
                ]
            },
        ],
        instructions: [
            {
                text: 'Pour the mixture into a large cassarole dish',
                ingredients: [
                    'Corn mixture',
                ],
                time: '',
            },
            {
                text: 'Bake the mixture for 1 hour',
                ingredients: [],
                time: '1 hour'
            },
        ]
    }
]