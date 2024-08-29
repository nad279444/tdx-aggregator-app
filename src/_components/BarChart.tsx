import React from 'react';
import { View } from 'react-native';
import { BarChart, XAxis, YAxis } from 'react-native-svg-charts';

const AggregateBarChart = ({ data, labels }) => {
  const barData = data.map((item) => item.revenue);

  return (
    <View style={{ height: 300, flexDirection: 'row', padding: 20, marginRight: 20 }}>
      <YAxis
        data={barData}
        contentInset={{ top: 10, bottom: 10 }}
        svg={{ fontSize: 10, fill: 'black' }}
        formatLabel={(value) => `${value}k`}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <BarChart
          style={{ flex: 1 }}
          data={barData}
          svg={{ fill: 'green' }}
          contentInset={{ top: 10, bottom: 10 }}
          spacingInner={0.2}
        />
        <XAxis
          style={{ marginTop: 10 }}
          data={labels}
          formatLabel={(value, index) => labels[index]}
          contentInset={{ left: 10, right: 10 }}
          svg={{ fontSize: 10, fill: 'black' }}
        />
      </View>
    </View>
  );
};

export default AggregateBarChart;
