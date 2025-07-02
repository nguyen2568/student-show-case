const electricitySave = function(cans, bottles)
{
    return (cans * 0.2 + bottles * 0.36).toFixed(2); // Return the electricity saved rounded to two decimal places
}

const co2Save = function(cans, bottles)
{
    return (cans * 0.15 + bottles * 0.04).toFixed(2); // Return the CO2 saved rounded to two decimal places
}

const waterSave = function(cans, bottles)
{
    return (cans * 8 + bottles * 3).toFixed(2); // Return the water saved rounded to two decimal places
}

const lightbulbSave = function(cans, bottles)
{
    return (cans * 4 + bottles * 6).toFixed(2); // Return the lightbulb saved rounded to two decimal places
}

const tvOn = function(cans, bottles)
{
    return (cans * 2 + bottles * 3).toFixed(2); // Return the television saved rounded to two decimal places
}


export default { electricitySave, co2Save, waterSave, lightbulbSave, tvOn };
