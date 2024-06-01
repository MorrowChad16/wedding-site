import * as React from 'react';
import PageContainer from '../components/PageContainer';
import FoodBox from '../components/food-box';
import potatoes from '../assets/images/potatoes.jpeg';
import veggie from '../assets/images/veggie.jpeg';
import dessert from '../assets/images/dessert.jpeg';
import steak from '../assets/images/steak.jpeg';
import fish from '../assets/images/fish.jpeg';
import vegetarian from '../assets/images/vegetarian.jpeg';
import {
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';
import { getFoodChoice } from '../api/use-guests';

export enum FoodChoice {
    Meat = 'MEAT',
    Fish = 'FISH',
    Vegetarian = 'VEGETARIAN',
}

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
    const [mainChoice, setMainChoice] = React.useState<FoodChoice>();
    const [isLoadingMainChoice, setIsLoadingMainChoice] = React.useState(true);

    React.useEffect(() => {
        const run = async () => {
            const foodChoice = await getFoodChoice(localStorage.getItem('email')!);
            console.log(foodChoice);
            setMainChoice(foodChoice as FoodChoice);
            setIsLoadingMainChoice(false);
        };

        run();
    }, []);

    return (
        <PageContainer>
            {isLoadingMainChoice ? (
                <Box display="flex" justifyContent="center" alignItems="center" margin={'50px'}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2} justifyContent="center">
                    {mainChoice ? (
                        <div>
                            <Grid container justifyContent="center" marginTop={5} marginBottom={5}>
                                <Grid item xs={12} sm={8} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="food-choice-label">Main Dish</InputLabel>
                                        <Select
                                            labelId="food-choice-select-label"
                                            id="food-choice-select-label-id"
                                            value={mainChoice}
                                            label="Main Dish"
                                            onChange={(event) => {
                                                setMainChoice(event.target.value as FoodChoice);
                                            }}
                                        >
                                            {Object.values(FoodChoice).map((choice) => (
                                                <MenuItem key={choice} value={choice}>
                                                    {choice}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Typography
                                    variant="h3"
                                    sx={{ textAlign: 'center', marginBottom: 2 }}
                                >
                                    Main Dish
                                </Typography>
                                <FoodBox
                                    image={foodChoiceData[mainChoice!].image}
                                    imageAlt={foodChoiceData[mainChoice!].imageAlt}
                                    description={foodChoiceData[mainChoice!].description}
                                />
                            </Grid>
                        </div>
                    ) : (
                        <Alert variant="outlined" severity="info">
                            You haven't selected your main dish yet. To do this, you will need to
                            RSVP.
                        </Alert>
                    )}

                    <Grid item>
                        <Typography variant="h3" sx={{ textAlign: 'center', marginBottom: 2 }}>
                            Side Dishes
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            {sideDishes.map((dish, index) => (
                                <FoodBox
                                    key={dish.description}
                                    image={dish.image}
                                    imageAlt={dish.imageAlt}
                                    description={dish.description}
                                    sxOverride={{ marginRight: index === 0 ? 4 : 0 }}
                                />
                            ))}
                        </Box>
                    </Grid>

                    <Grid item>
                        <Typography variant="h3" sx={{ textAlign: 'center', marginBottom: 2 }}>
                            Dessert
                        </Typography>
                        <FoodBox
                            image={dessertObj.image}
                            imageAlt={dessertObj.imageAlt}
                            description={dessertObj.description}
                        />
                    </Grid>
                </Grid>
            )}
        </PageContainer>
    );
}
