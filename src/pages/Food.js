import * as React from 'react';
import PageContainer from '../components/PageContainer';
import FoodBox from '../components/food-box';
import potatoes from '../assets/images/potatoes.jpeg';
import veggie from '../assets/images/veggie.jpeg';
import dessert from '../assets/images/dessert.jpeg';
import steak from '../assets/images/steak.jpeg';
import fish from '../assets/images/fish.jpeg';
import vegetarian from '../assets/images/vegetarian.jpeg';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
export var FoodChoice;
(function (FoodChoice) {
    FoodChoice["Meat"] = "Meat";
    FoodChoice["Fish"] = "Fishco";
    FoodChoice["Vegetarian"] = "Vegetarian";
})(FoodChoice || (FoodChoice = {}));
export const foodChoiceData = {
    [FoodChoice.Meat]: {
        image: steak,
        imageAlt: 'Main Steak Dish',
        description: 'steaky steak',
    },
    [FoodChoice.Fish]: {
        image: fish,
        imageAlt: 'Main Fish Dish',
        description: 'fishy fish',
    },
    [FoodChoice.Vegetarian]: {
        image: vegetarian,
        imageAlt: 'Main Vegetarian Dish',
        description: 'veggy veg',
    },
};
export default function Food() {
    const sideDishes = [
        {
            image: potatoes,
            imageAlt: 'Side Potato Dish',
            description: 'mmm potatoes',
        },
        {
            image: veggie,
            imageAlt: 'Side Veggie Dish',
            description: 'eww greens',
        },
    ];
    const dessertObj = {
        image: dessert,
        imageAlt: 'Dessert',
        description: 'holy cow key lime pie',
    };
    const [mainChoice, setMainChoice] = React.useState(FoodChoice.Meat);
    return (React.createElement(PageContainer, null,
        React.createElement("div", null,
            React.createElement(Grid, { container: true, justifyContent: "center", marginBottom: 5 },
                React.createElement(Grid, { item: true, xs: 12, sm: 8, md: 6 },
                    React.createElement(FormControl, { fullWidth: true },
                        React.createElement(InputLabel, { id: "food-choice-label" }, "Food Option"),
                        React.createElement(Select, { labelId: "food-choice-select-label", id: "food-choice-select-label-id", value: mainChoice, label: "Select Option", defaultValue: FoodChoice.Meat, onChange: (event) => {
                                setMainChoice(event.target.value);
                            } }, Object.values(FoodChoice).map((choice) => (React.createElement(MenuItem, { key: choice, value: choice }, choice))))))),
            React.createElement(Grid, { container: true, spacing: 2, justifyContent: "center" },
                React.createElement(Grid, { item: true },
                    React.createElement(Typography, { variant: "h3", sx: { textAlign: 'center', marginBottom: 2 } }, "Main Dish"),
                    React.createElement(FoodBox, { image: foodChoiceData[mainChoice].image, imageAlt: foodChoiceData[mainChoice].imageAlt, description: foodChoiceData[mainChoice].description })),
                React.createElement(Grid, { item: true },
                    React.createElement(Typography, { variant: "h3", sx: { textAlign: 'center', marginBottom: 2 } }, "Side Dishes"),
                    React.createElement(Box, { sx: { display: 'flex', flexDirection: 'row' } }, sideDishes.map((dish, index) => (React.createElement(FoodBox, { key: dish.description, image: dish.image, imageAlt: dish.imageAlt, description: dish.description, sxOverride: { marginRight: index === 0 ? 4 : 0 } }))))),
                React.createElement(Grid, { item: true },
                    React.createElement(Typography, { variant: "h3", sx: { textAlign: 'center', marginBottom: 2 } }, "Dessert"),
                    React.createElement(FoodBox, { image: dessertObj.image, imageAlt: dessertObj.imageAlt, description: dessertObj.description }))))));
}
