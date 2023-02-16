import { Box } from '@erxes/ui/src/components';
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
import { displayValue } from '../../App';
type Props = {
  chartType: string;
  data: any;
  colors: any;
};
const year = new Date().getFullYear();
const years = Array.from(new Array(3), (v, idx) => year - idx);
const RADIAN = Math.PI / 180;

export default class Chart extends PureComponent<Props> {
  // renderLegend = (props) => {
  //   const { payload } = props;

  //   return (
  //     <Info>
  //       {
  //         payload.map((entry, index) => (
  //           <li key={`item-${index}`}>{entry.value}</li>
  //         ))
  //       }
  //     </Info>
  //   );
  // }
  renderToolTipstockByAmount = ({ payload }) => {
    return (
      <div
        style={{
          background: 'white',
          border: '1px solid green',
          width: '150px'
        }}
      >
        {
          <>
            <h5 style={{ textAlign: 'center' }}>
              {payload?.[0]?.payload?.symbol}
            </h5>
            <p>Дүн: {displayValue(payload?.[0]?.payload?.amount, '1')}</p>
            <p>Үнэ: {payload?.[0]?.payload?.price}</p>
            <p>Тоо ширхэг: {payload?.[0]?.payload?.cnt}</p>
          </>
        }
      </div>
    );
  };
  CustomTooltip = ({ payload }) => {
    return (
      <div>
        <span>
          <b>{payload?.[0]?.payload?.symbol}</b>
        </span>
      </div>
    );
  };
  renderCustomizedLabel = ({
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
  render() {
    const { data, chartType, colors } = this.props;
    switch (chartType) {
      case 'stockByAmount': {
        return (
          // <ResponsiveContainer width="100%">
          <BarChart
            width={500}
            height={500}
            data={data}
            margin={{
              top: 30,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <XAxis dataKey="symbol" />
            <YAxis />
            <Tooltip content={this.renderToolTipstockByAmount} />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="amount" fill={colors[0]} />;
          </BarChart>
          /* </ResponsiveContainer> */
        );
      }
      case 'userCountByYear': {
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
                return <Bar dataKey={year} fill={colors[index]} />;
              })}
            </BarChart>
          </ResponsiveContainer>
        );
      }
      case 'stockByPercentage': {
        return (
          <PieChart width={500} height={500}>
            {/* <Legend content={this.renderLegend} /> */}
            <Legend
              formatter={(value, entry, index) => (
                <span className="text-color-class">{data[index].symbol}</span>
              )}
              layout="vertical"
              verticalAlign="middle"
              align="right"
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={this.renderCustomizedLabel}
              outerRadius={150}
              fill="#8884d8"
              dataKey="amount"
            >
              {data.map((entry, index) => {
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                );
              })}
            </Pie>
            <Tooltip content={this.CustomTooltip} />
          </PieChart>
        );
      }
    }
  }
}
