import { Tooltip } from "chart.js";
import { Line, Scatter } from "react-chartjs-2";

export const Chart = ({signal, id}) => {

    let data;
    if (signal?.discrete) {
      const dataPoints = signal?.data?.map((n, index) => ({x: signal?.time[index], y: n}));
      data = {
          datasets: [
            {
              data: dataPoints,
              backgroundColor: 'rgba(255, 99, 132)',
              borderColor: 'rgba(255, 99, 132)',
              borderWidth: 4,
              // tension: 0.5,
              pointRadius: 2,
              pointHoverRadius: 5
            },
          ],
        };
    } else {
      data = {
          labels: signal?.time,
          datasets: [
            {
              data: signal?.data,
              backgroundColor: 'rgba(255, 99, 132)',
              borderColor: 'rgba(255, 99, 132)',
              borderWidth: 4,
              tension: 0,
              pointRadius: 0.02,
              pointHoverRadius: 5
            },
          ],
        };
    }

      
      const options = {
        animation: {
          duration: 10,
          easing: 'linear'
        },
        scales: {
          x: {
            type: 'linear',
            ticks: {
                color: '#32d692',
                // stepSize: 0.5
            },
            grid: {
                color: '#00000055'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
                color: '#32d692'
            },
            grid: {
                color: '#00000055'
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
            {signal?.discrete ?
              <Scatter id={id} data={data} options={options}/>
            :
              <Line id={id} data={data} options={options}/>
            }
        </div>
    );
}