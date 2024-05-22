import { Bar } from "react-chartjs-2"

export const Histogram = ({data, bins}) => {
    bins = parseInt(bins)
    if (!Array.isArray(data) || !data.length) {
        console.error('Data is undefined');
        return;
    }
    
    const frequencies = new Array(bins).fill(0);
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const binWidth = range / bins;

    data.forEach(value => {
        const index = Math.min(Math.floor((value - min) / binWidth), bins - 1);
        frequencies[index]++;
    });

    const labels = new Array(bins).fill(0).map((_, i) => `${(min + i * binWidth).toFixed(2)} - ${(min + (i + 1) * binWidth).toFixed(2)}`);

    const chartData = {
        labels: labels,
        datasets: [
        {
            label: bins,
            data: frequencies,
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1
        }
    ]
    };

    const options = {
        scales: {
          x: {
            ticks: {
                color: '#32d692',
            },
            grid: {
                color: '#00000055'
            }
          },
          y: {
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
              labels: {
                color: '#32d692'
              }
            }
          }
      };

    return (
        <div className="histogram-wrapper">
            <Bar id="histogram" data={chartData} options={options}/>           
        </div>
    )
}