import { Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";

export const Chart = ({noise, time}) => {

    const data = {
        labels: time,
        datasets: [
          {
            // label: 'Signal',
            data: noise,
            backgroundColor: 'rgba(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132)',
            borderWidth: 4,
            tension: 0.5,
            pointRadius: 0.02,
            pointHoverRadius: 5
          },
        ],
      };
      
      const options = {
        scales: {
          x: {
            type: 'linear',
            ticks: {
                color: '#32d692',
                stepSize: 0.5
            },
            grid: {
                color: '#ffffff55'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
                color: '#32d692'
            },
            grid: {
                color: '#ffffff55'
            }
          },
        },
        plugins: {
          legend: {
            display: false,
            labels: {
              color: '#32d692'
            }
          }
        }
      };

    return (
        <div className="chart-wrapper">
            <Line data={data} options={options}/>
        </div>
    );
}