if (document.body.classList.contains('theme-bright')) {
    // theming
}

// --- loading JSON file ---

/*
 loadJSON(function(response) {
    // Parse JSON string into object
    let actual_JSON = JSON.parse(response);
    console.log(actual_JSON);

    for(let i =1; i< 5; i++){
        let unix_timestamp = actual_JSON[0]["columns"][0][i];
        console.log(unix_timestamp);
        console.log(new Date(unix_timestamp*1000));
    }
}); */

// --- chart containers init ---
/*
let chart_container = new ChartContainer('.chart-container-wrapper-2', {
        name: 'Followers',
        canvas_width: 400,
        canvas_height: 400,

        vertical_axis_labels_step: 50,
    },
    [1542412800000, 1542499200000, 1542585600000, 1542672000000, 1542758400000, 1542844800000,
        1542931200000, 1543017600000, 1543104000000, 1543190400000, 1543276800000, 1543363200000, 1543449600000,
        1543536000000, 1543622400000, 1543708800000, 1543795200000, 1543881600000, 1543968000000, 1544054400000,
        1544140800000, 1544227200000, 1544313600000, 1544400000000, 1544486400000, 1544572800000, 1544659200000,
        1544745600000, 1544832000000, 1544918400000, 1545004800000, 1545091200000, 1545177600000, 1545264000000,
        1545350400000, 1545436800000, 1545523200000,
    ],
    [
        {
            chart_name: 'Joined',
            chart_data: [
                100, 90, 120, 130, 180, 170, 100, 120, 204, 125, 77, 182, 69, 97, 139, 160, 89, 60, 68, 222, 135,
                52, 217, 147, 74, 202, 42, 232, 175, 224, 244, 220, 148, 133, 60, 109, 190],
            line_colour: '#3cc23f',
            // line_width: 3,
        },
        {
            chart_name: 'Left',
            line_colour: '#f34c44',

            chart_data: [
                78, 103, 40, 105, 68, 105, 43, 69, 56, 52, 91, 41, 89, 109, 61, 86, 118, 117, 73, 82, 95, 116, 109,
                51, 86, 55, 66, 118, 61, 88, 117, 84, 95, 88, 57, 84, 69],
        }
    ],
);



let chart_container2 = new ChartContainer('.chart-container-wrapper-1', {
        name: 'Зависимость числа сравнений от размерности массива',
        canvas_width: 1000,
        canvas_height: 500,

        vertical_axis_labels_step: 50,
    },
    [10, 100, 1000, 5000, 10000, 20000, 50000,
    ],
    [
        {
            chart_name: 'Случайный',
            chart_data: [
                34,
                627,
                8459,
                45992,
                96594,
                201838,
                521613,
            ],

            line_colour: 'blue',
        },
        {
            chart_name: 'Упорядоченный',
            line_colour: '#3cc23f',

            chart_data: [
                37,
                822,
                11521,
                69128,
                147860,
                311842,
                835708,
            ]
        },
        {
            chart_name: 'Обратно упорядоченный',
            line_colour: '#f34c44',

            chart_data: [
                24,
                294,
                2994,
                14994,
                29994,
                59994,
                149994,
            ]
        }
    ],
);


let chart_container1 = new ChartContainer('.chart-container-wrapper-3', {
        name: 'Зависимость числа перестановок от размерности массива',
        canvas_width: 1000,
        canvas_height: 500,

        vertical_axis_labels_step: 50,
    },
    [10, 100, 1000, 5000, 10000, 20000, 50000,
    ],
    [
        {
            chart_name: 'Случайный',
            chart_data: [
                8,
                169,
                2545,
                14109,
                30059,
                63746,
                166331,
            ],

            line_colour: 'blue',
        },
        {
            chart_name: 'Упорядоченный',
            line_colour: '#3cc23f',

            chart_data: [
                13,
                261,
                3838,
                23827,
                51463,
                109327,
                295642,
            ]
        },
        {
            chart_name: 'Обратно упорядоченный',
            line_colour: '#f34c44',

            chart_data: [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
            ]
        }
    ],
);

// let
let worst_case_data = [];
for (let i = 0; i < 7; i++) {
    worst_case_data[i] = chart_container1.timeflow_data[i] * Math.log2(chart_container1.timeflow_data[i]);
}

let worst_case_chart = {
    chart_name: 'n*log(n)',
    line_colour: 'yellow',
    chart_data: worst_case_data,
}; */

let chart_container3 = new ChartContainer('.chart-container-wrapper-4', {
        name: 'Followers',
        canvas_width: 400,
        canvas_height: 400,

        vertical_axis_labels_step: 50,

        data: {
            timeflow: [1542412800000, 1542499200000, 1542585600000, 1542672000000, 1542758400000, 1542844800000,
                1542931200000, 1543017600000, 1543104000000, 1543190400000, 1543276800000, 1543363200000, 1543449600000,
                1543536000000, 1543622400000, 1543708800000, 1543795200000, 1543881600000, 1543968000000, 1544054400000,
                1544140800000, 1544227200000, 1544313600000, 1544400000000, 1544486400000, 1544572800000, 1544659200000,
                1544745600000, 1544832000000, 1544918400000, 1545004800000, 1545091200000, 1545177600000, 1545264000000,
                1545350400000, 1545436800000, 1545523200000,
            ],
            charts: [
                {
                    chart_name: 'Joined',
                    line_colour: '#3cc23f',

                    chart_data: [
                        100, 90, 120, 130, 180, 170, 100, 120, 204, 125, 77, 182, 69, 97, 139, 160, 89, 60, 68, 222, 135,
                        52, 217, 147, 74, 202, 42, 232, 175, 224, 244, 220, 148, 133, 60, 109, 190],},
                {
                    chart_name: 'Left',
                    line_colour: '#f34c44',

                    chart_data: [
                        78, 103, 40, 105, 68, 105, 43, 69, 56, 52, 91, 41, 89, 109, 61, 86, 118, 117, 73, 82, 95, 116, 109,
                        51, 86, 55, 66, 118, 61, 88, 117, 84, 95, 88, 57, 84, 69
                    ],
                }
            ]
        }
    },
);
