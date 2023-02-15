import { colors } from '@erxes/ui/src/styles';
import React, { PureComponent } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
type Props = {
  chartType: string;
};
const COLORS = ['#004c6d', '#346888', '#5886a5'];
const data = [
  {
    name: '1-р сар',
    2023: 1000,
    2022: 2000,
    2021: 3000
  },
  {
    name: '2-р сар',
    2023: 1000,
    2022: 2000,
    2021: 3000
  },
  {
    name: '3-р сар',
    2023: 1000,
    2022: 2000,
    2021: 3000
  },
  {
    name: '4-р сар',
    2023: 1000,
    2022: 2000,
    2021: 3000
  },
  {
    name: '5-р сар',
    2023: 1000,
    2022: 2000,
    2021: 3000
  },
  {
    name: '6-р сар',
    2023: 100,
    2022: 200,
    2021: 500
  },
  {
    name: '7-р сар',
    2023: 200,
    2022: 300,
    2021: 100
  },
  {
    name: '8-р сар',
    2023: 1000,
    2022: 2000,
    2021: 3000
  },
  {
    name: '9-р сар',
    2023: 1000,
    2022: 2000,
    2021: 3000
  },
  {
    name: '10-р сар',
    2023: 1000,
    2022: 2000,
    2021: 3000
  },
  {
    name: '11-р сар',
    2023: 1000,
    2022: 2000,
    2021: 3000
  },
  {
    name: '12-р сар',
    2023: 1,
    2022: 4,
    2021: 5
  }
];
const year = new Date().getFullYear();
const years = Array.from(new Array(3), (v, idx) => year - idx);
const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const PIE_DATA = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 }
];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
export default class Chart extends PureComponent<Props> {
  render() {
    switch (this.props.chartType) {
      case 'line': {
        return (
          <ResponsiveContainer width="100%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 30,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              {years.map((year, index) => {
                return <Bar dataKey={year} fill={COLORS[index]} />;
              })}
            </BarChart>
          </ResponsiveContainer>
        );
      }
      case 'pie': {
        return (
          <ResponsiveContainer width="100%">
            <PieChart width={600} height={300}>
              <Legend layout="vetical" verticalAlign="middle" align="right" />
              <Pie
                data={PIE_DATA}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      }
    }
  }
}
