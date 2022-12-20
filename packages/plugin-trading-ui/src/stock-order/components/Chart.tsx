import React, { PureComponent } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const data = [
  {
    name: 'Jan',
    green: 4000,
    purple: 2400,
    amt: 2400
  },
  {
    name: 'Feb',
    green: 3000,
    purple: 1398,
    amt: 2210
  },
  {
    name: 'Mar',
    green: 2000,
    purple: 9800,
    amt: 2290
  },
  {
    name: 'Apr',
    green: 2780,
    purple: 3908,
    amt: 2000
  },
  {
    name: 'May',
    green: 1890,
    purple: 4800,
    amt: 2181
  },
  {
    name: 'Jun',
    green: 2390,
    purple: 3800,
    amt: 2500
  },
  {
    name: 'Jul',
    green: 3490,
    purple: 4300,
    amt: 2100
  },
  {
    name: 'Aug',
    green: 3490,
    purple: 4300,
    amt: 2100
  },
  {
    name: 'Sep',
    green: 3490,
    purple: 4300,
    amt: 2100
  },
  {
    name: 'Oct',
    green: 3490,
    purple: 4300,
    amt: 2100
  },
  {
    name: 'Nov',
    green: 3490,
    purple: 4300,
    amt: 2100
  },
  {
    name: 'Dec',
    green: 3490,
    purple: 4300,
    amt: 2100
  }
];

export default class Chart extends PureComponent {
  render() {
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
          <Bar dataKey="green" fill="#82ca9d" />
          <Bar dataKey="purple" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
