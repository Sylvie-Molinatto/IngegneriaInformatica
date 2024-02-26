from pathlib import Path
from random import Random

if __name__ == '__main__':
    manufacturers = {
        'ManufacturerA': ['Model0', 'Model1', 'Model2'],
        'ManufacturerB': ['Model3', 'Model4', 'Model5', 'Model6', 'Model7'],
        'ManufacturerC': ['Model8', 'Model9', 'Model10']
    }

    # for each model and each year, specify number of sales (EU sales, extraEU sales)
    model_sales = {
        'Model0': {
            2020: (100, 250),
            2021: (99, 85)
        },
        'Model1': {
            2020: (10, 1),
            2021: (2, 3)
        },
        'Model2': {
            2020: (101, 202),
            2021: (123, 124)
        },
        'Model3': {
            2020: (44, 45),
            2021: (11, 12)
        },
        'Model4': {
            2020: (1, 1),
            2021: (1, 1)
        },
        'Model5': {
            2020: (2, 3),
            2021: (5, 0)
        },
        'Model6': {
            2020: (5, 2),
            2021: (2, 2)
        },
        'Model7': {
            2020: (0, 0),
            2021: (0, 0)
        },
        'Model8': {
            2020: (0, 0),
            2021: (0, 0)
        },
        'Model9': {
            2020: (104, 99),
            2021: (200, 200)
        },
        'Model10': {
            2020: (0, 0),
            2021: (0, 0)
        }
    }

    # min, max prices
    prices = {
        'Model0': (100, 5200),
        'Model1': (10, 100),
        'Model2': (100, 5000),
        'Model3': (40, 50),
        'Model4': (10, 100),
        'Model5': (0, 0),
        'Model6': (0, 0),
        'Model7': (0, 0),
        'Model8': (0, 0),
        'Model9': (400, 5405),
        'Model10': (0, 0)
    }

    count = 0
    with open('sales.txt', 'w') as fp:
        with open('motorbikes.txt', 'w') as fd:
            for manuf in manufacturers:
                for model in manufacturers[manuf]:
                    fd.write(f'{model},modelName,{manuf}\n')
                    for year in model_sales[model]:
                        eu_sales, extraeu_sales = model_sales[model][year]
                        price_tuple = prices[model]
                        for idx in range(eu_sales):
                            fp.write(f'{count},bikeID,{model},{year}/01/01,country,{price_tuple[count % 2]},T\n')
                            count += 1
                        for idx in range(extraeu_sales):
                            fp.write(f'{count},bikeID,{model},{year}/01/01,country,{price_tuple[count % 2]},F\n')
                            count += 1