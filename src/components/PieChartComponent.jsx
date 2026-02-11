import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartComponent = ({ stats }) => {
    const data = {
        labels: ['Approved', 'Pending', 'Rejected', 'Resolved'],
        datasets: [
            {
                label: '# of Issues',
                data: [stats.approved, stats.pending, stats.rejected, stats.resolved],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)', // Green
                    'rgba(255, 206, 86, 0.6)', // Yellow
                    'rgba(255, 99, 132, 0.6)', // Red
                    'rgba(54, 162, 235, 0.6)', // Blue
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: 'white', // Adjust based on theme
                }
            },
            title: {
                display: true,
                text: 'Issue Status Overview',
                color: 'white',
            },
        },
    };

    return <Pie data={data} options={options} />;
};

export default PieChartComponent;
