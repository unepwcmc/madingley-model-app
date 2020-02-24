import buildings from "./Buildings";
import {POPULATION, MONEY, FOOD} from "./Resources";
import {SIZE} from "./Map";

export function getMaxPopulation(state) {
    let max = 25;

    for (const [building, buildingState] of Object.entries(state.buildings)) {

        if (buildingState.numberBuilt) {
            const effect = buildingState.effects[POPULATION];
            if (effect && effect.max) {
                max += buildingState.numberBuilt * effect.max;
            }
        }
    }

    return max;
}

export function getIncome(resourceId, state) {
    let total = 0;

    const breakdown = {};

    for (const [building, buildingState] of Object.entries(state.buildings)) {

        if (buildingState.numberBuilt) {
            const effect = buildingState.effects[resourceId];
            if (effect && effect.income) {
                const buildingIncome = buildingState.numberBuilt * effect.income;

                breakdown[building] = buildingIncome;
                total += buildingIncome;
            }
        }
    }

    if (resourceId === MONEY) {
        const taxIncome = computeTaxIncome(state);
        breakdown["taxes"] = taxIncome;
        total += taxIncome;
    }

    if (resourceId === FOOD) {
        const foodEaten = computeFoodEaten(state);
        breakdown["consumption"] = -foodEaten;
        total -= foodEaten;
    }

    return {total, breakdown};
}

export function getHappiness(state) {
    let happiness = 100;
    const breakdown = {};

    //population excess
    const maxPopulation = getMaxPopulation(state);
    const population = state.resources[POPULATION].amount;
    if (population > maxPopulation) {
        const popExcessImpact = (population - maxPopulation) * 10;
        happiness -= popExcessImpact;
        breakdown["population excess"] = popExcessImpact * -1
    } else {
        breakdown["population excess"] = 0;
    }

    //taxes
    const taxes = state.resources.taxes;
    const taxImpact = 30 - taxes;
    breakdown["tax"] = taxImpact;
    happiness += taxImpact;

    //rationing
    const rationing = state.resources.rationing;
    const rationingImpact = rationing - 50;
    breakdown["rationing"] = rationingImpact;
    happiness += rationingImpact;

    //food deficit
    const foodGrowth = getIncome(FOOD, state).total;
    const foodDiff = state.resources[FOOD].amount + foodGrowth;
    if (foodDiff < 0) {
        const foodImpact = Math.floor(foodDiff/10);
        breakdown["food deficit"] = foodImpact;
        happiness += foodImpact;
    } else {
        breakdown["food deficit"] = 0;
    }

    //limit happiness to range of 0-100, need to implement game over on 0 happiness
    if (happiness > 100) {
        happiness = 100;
    }

    if (happiness <= 0) {
        happiness = 0;
    }

    return {amount: happiness, breakdown};
}

export function computeTaxIncome(state) {
    return state.resources.taxes * state.resources[POPULATION].amount; // TODO
}

export function computeFoodEaten(state) {
    //TODO: make food eaten actually proportional to food produced by hunters,
    // requires more thought than I currently have the capacity for
    const foodEatenPerPop = 25 + Math.floor(state.resources.rationing/4);
    return state.resources[POPULATION].amount * foodEatenPerPop;
}

export function canBuy(buildingId, state) {
    const costs = buildings[buildingId].costs;

    for (const [resource, cost] of Object.entries(costs)) {
        if (cost > state.resources[resource].amount)
            return false;
    }

    return true;
}

export function numCanBuy(buildingId, state) {
    const costs = buildings[buildingId].costs;

    let max = Infinity;

    for (const [resource, cost] of Object.entries(costs)) {
        const num = Math.floor(state.resources[resource].amount / cost);
        if (num < max)
            max = num;
    }

    return max;
}

export function getSelection(i, building) {
    const [row, col] = [Math.floor(i / SIZE), i % SIZE];

    switch (buildings[building].selectionSize) {
        case 3:
            if (col === 0) i++;
            if (col === SIZE - 1) i--;
            if (row === 0) i += SIZE;
            if (row === SIZE - 1) i -= SIZE;

            return [
                i - SIZE - 1, i - SIZE, i - SIZE + 1,
                i - 1,        i,        i + 1,
                i + SIZE - 1, i + SIZE, i + SIZE + 1
            ];

        case 2:
            if (col === SIZE - 1) i--;
            if (row === SIZE - 1) i -= SIZE;

            return [
                i,        i + 1,
                i + SIZE, i + SIZE + 1
            ];

        case 1:
            return [i];

        default:
            return [];
    }
}