import { Box } from '@erxes/ui/src/components';
import React, { Component, useCallback } from 'react';
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
  Pie,
  Sector
} from 'recharts';
import { displayValue } from '../../App';
type Props = {
  chartType: string;
  data: any;
  colors: any;
  years: [];
};
const RADIAN = Math.PI / 180;
type State = {
  activeIndex: number;
  activeItem: any;
};
class Chart extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: -1,
      activeItem: null
    };
  }

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
        style={
          {
            //background: 'white',
            //border: '1px solid green',
            //width: '150px'
          }
        }
      >
        {
          <>
            <h5 style={{ textAlign: 'center' }}>
              {payload?.[0]?.payload?.symbol}
            </h5>
            <p>Дүн: {displayValue(payload?.[0]?.payload?.amount, '1')}</p>
            <p>Үнэ: {payload?.[0]?.payload?.price}</p>
            <p>Тоо ширхэг: {payload?.[0]?.payload?.cnt}</p>
            <p>Мөнгөн дүнд эзлэх хувь: </p>
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
  // handleLegendClick = (data, index) => {
  //   console.log(index);
  //   this.setState((prevState)=>{
  //     prevState.activeIndex === index ? null : index
  //   },()=> {
  //     console.log(this.state.activeIndex);
  //   })
  // };
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
        {`${this.props.data[index].symbol} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  renderActiveShape = props => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      midAngle
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius - 40) * cos;
    const sy = cy + (outerRadius - 40) * sin;
    return (
      <Sector
        cx={sx}
        cy={sy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill="red"
      />
    );
  };
  onClick = (data, index) => {
    this.setState({ activeIndex: index });
  };
  handleMouseEnter = (data: any, index: number) => {
    this.setState({
      activeIndex: index
    });
  };

  handleMouseLeave = () => {
    this.setState({
      activeIndex: -1
    });
  };
  render() {
    const { data, chartType, colors, years } = this.props;
    const handleLegendMouseEnter = (data, index) => {
      this.setState({
        activeItem: data.name
      });
    };

    const handleLegendMouseLeave = () => {
      this.setState({
        activeItem: null
      });
    };
    const activeIndex = this.state.activeItem
      ? data.findIndex(item => item.name === this.state.activeItem)
      : undefined;
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
          <ResponsiveContainer width="100%">
            <PieChart>
              {/* <Legend content={this.renderLegend} /> */}
              <Legend
                formatter={(value, entry, index) => (
                  <span className="text-color-class">
                    {data[index].symbol}{' '}
                    {(
                      (data[index].amount /
                        data.reduce((sum, entry) => sum + entry.amount, 0)) *
                      100
                    ).toFixed()}
                    %
                  </span>
                )}
                layout="vertical"
                verticalAlign="middle"
                align="right"
                onMouseEnter={handleLegendMouseEnter}
                onMouseLeave={handleLegendMouseLeave}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={this.renderCustomizedLabel}
                outerRadius={200}
                fill="#8884d8"
                paddingAngle={1}
                dataKey="amount"
                activeIndex={activeIndex}
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
              <Tooltip content={this.renderToolTipstockByAmount} />
            </PieChart>
          </ResponsiveContainer>
        );
      }
    }
  }
}
export default Chart;
