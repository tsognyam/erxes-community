import { colors, dimensions } from '@erxes/ui/src/styles';
import styled, { keyframes } from 'styled-components';
import styledTS from 'styled-components-ts';

export const RightMenuContainer = styled.div`
  position: fixed;
  z-index: 2;
  top: 122px;
  right: 22px;
  bottom: 0;
  width: 430px;
  background: ${colors.bgLight};
  white-space: normal;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 24px -6px rgba(9, 30, 66, 0.25),
    0 0 0 1px rgba(9, 30, 66, 0.08);
  padding: ${dimensions.coreSpacing}px;
  justify-content: space-between;
`;

export const FilterButton = styledTS<{ selected?: boolean }>(styled.div)`
  padding: 5px 20px;
  background: ${props =>
    props.selected ? colors.colorSecondary : colors.bgActive};
  color: ${props =>
    props.selected ? colors.colorWhite : colors.textSecondary};
  line-height: 20px;
  width: 100%;
  margin-bottom: 10px;
  position: relative;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;

  &:hover {
    background: ${props =>
      props.selected ? colors.colorPrimaryDark : colors.bgGray};
    cursor: pointer;
  }
`;
export const FormBox = styled.div`
  background: #fff;
  border: 1px solid #eee;
  padding: 20px;
  height: 600px;
  flex-basis: 25%;
  form {
    width: 100%;
  }
`;
export const FilterBox = styled.div`
  overflow: auto;
  height: 100%;
  .Select {
    margin-bottom: 15px;
  }

  input {
    margin-bottom: 20px;
  }
`;

export const CustomRangeContainer = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: flex-end;

  > div {
    flex: 1;
    margin-right: 8px;

    input[type='text'] {
      border: none;
      width: 100%;
      height: 34px;
      padding: 5px 0;
      color: #444;
      border-bottom: 1px solid;
      border-color: #ddd;
      background: none;
      border-radius: 0;
      box-shadow: none;
      font-size: 13px;
    }
  }
`;

export const BarItems = styled.div`
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-left: 10px;
`;

export const StyledTr = styled.tr`
  &:hover {
    background: #f5f5f5;
  }
`;

export const MenuFooter = styled.footer`
  padding: 10px 20px;
`;

export const StockChange = styledTS<{ isIncreased: boolean }>(styled.div)`
  color: ${props =>
    props.isIncreased ? colors.colorCoreGreen : colors.colorCoreRed} !important;
`;
const rotate = keyframes`
0% {
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  visibility: visible;
}

100% {
  -webkit-transform: translate3d(-100%, 0, 0);
  transform: translate3d(-100%, 0, 0);
}
`;
export const StockDataContainer = styled.div`
  width: 100%;
  overflow: hidden;
  background-color: rgba(#000, 0.9);
  padding-left: 100%;
`;
export const StockData = styledTS<{ animationDuration: string }>(styled.div)`
display: inline-block;
white-space: nowrap;
padding-right: 100%;
animation-iteration-count: infinite;
animation-timing-function: linear;
animation-name: ${rotate};
animation-duration: ${props =>
  props.animationDuration ? props.animationDuration : '100s'};
padding-right: 100%;
padding-top:25px;
`;

export const Filter = styled.div`
  width: 700px;
  display: flex;
  align-items: center;
  margin: 0 auto;
  justify-content: space-between;
  padding: ${dimensions.unitSpacing}px 0;
  .Select {
    width: 200px;
  }
`;
export const StockOrderLabel = styled.div`
  width: 1000px;
  display: flex;
  align-items: center;
  margin: 0 auto;
  justify-content: space-between;
  padding: ${dimensions.unitSpacing}px 0;
`;
export const ListContainer = styled.div`
  border-top: 1px solid #eee;
  padding: ${dimensions.unitSpacing}px;
  display: flex;
  align-items: baseline;
`;
export const OrderBookListDiv = styled.div`
  overflow-y: auto;
  height: 600px;
  flex-basis: 25%;
  margin-right: 5px;
`;
export const OrderBookList = styledTS<{ background: string }>(styled.table)`
  border-collapse: collapse;
  border: 1px solid #eee;
  width:100%;
  td {
    border: 1px solid #eee;
  }
  &:last-child {
    margin-right: 0px;
  }
  text-align: center;
  thead {
    th {
      text-align: center;
    }
    position: sticky; 
    top: -1px; 
    z-index: 1;
    tr {
      &:first-child {
        height: 35px;
        background: ${props => props.background};
      }
      &:last-child {
        background:lightgrey;
      }
    }
  }
`;
export const FilterContainer = styledTS<{
  width?: number;
  noPadding?: boolean;
}>(styled.div)`
  padding: ${props => !props.noPadding && '8px'};
  border-radius: ${dimensions.unitSpacing - 2}px;
  border: 1px solid ${colors.borderPrimary};
  flex: ${props => !props.width && 1};
  position: relative;
  width: ${props => props.width && `${props.width}px`};
  margin: ${dimensions.unitSpacing}px;

  > label {
    margin-right: ${dimensions.coreSpacing}px;
  }

  > input {
    border: 0;
    outline: 0;
    width: 100%;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  width: 0px;
  transition: width 1s;

  &:focus-visible {
    outline: none !important;
  }
`;

export const SearchBar = styled(FilterContainer)`
  &:hover {
    ${SearchInput} {
      width: 295px;
    }
  }
`;

export const SearchIcon = styled.div`
  margin: 4px 6px;
`;

export const EmptyContent = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > img {
    width: 300px;
  }

  p {
    text-align: center;
    max-width: 400px;

    b {
      margin: ${dimensions.unitSpacing}px 0;
      display: block;
    }
  }
`;

export const Number = styled.div`
  display: flex;
  justify-content: center;
  font-size: 50px;
  height: 100%;
  align-items: center;
`;

export const ChartTable = styled.div`
  overflow-y: auto;
  height: 90%;
  width: 100%;
  display: block;
`;
export const FinanceAmount = styled.div`
  float: right;
`;
export const Contents = styledTS<{ hasBorder?: boolean }>(styled.div)`
  margin: ${dimensions.unitSpacing}px 0 0 ${dimensions.unitSpacing}px;
  max-height: 100%;
  position: relative;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow-x: auto;
  border: ${props => props.hasBorder && `1px solid ${colors.borderPrimary}`};
  border-radius: ${props => props.hasBorder && `${dimensions.unitSpacing}px`};
  margin: ${props => props.hasBorder && dimensions.unitSpacing * 2}px;

  @-moz-document url-prefix() {
    overflow: hidden;
  }
`;
export const BoxContentContainer = styled.div`
  display: flex;
  h3 {
    margin-left: auto;
    margin-right: auto;
  }
  padding-top: 30px;
  height: 100%;
`;
export const ChartContentContainer = styled.div`
  height: 50vh;
  display: flex;
  flex-direction: column;
  h3 {
    margin-left: auto;
    margin-right: auto;
  }
`;
export const BoxContent = styled.div`
  flex: 1;
  h3 {
    margin-left: 25px;
  }
`;
export const Content = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;

  > form {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
`;
export const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
export const MiddleContent = styled.div`
  align-self: center;
  width: 250px;
`;
export const Widget = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  padding: 10px;
  --webkit-box-shadow: 2px 4px 10px 1px rgba(0, 0, 0, 0.47);
  box-shadow: 2px 4px 10px 1px rgba(201, 201, 201, 0.47);
  border-radius: 10px;
  height: 100px;
`;
export const WidgetItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: end;
  > .title {
    font-weight: bold;
    font-size: 14px;
  }
  > .counter {
    font-size: 28px;
    font-weight: 300;
  }

  > .link {
    width: max-content;
    font-size: 12px;
    border-bottom: 1px solid gray;
  }
`;
export const WidgetContainer = styled.div`
  flex: 6;
`;
export const Widgets = styled.div`
display:flex;
padding:30px 30px 0 30px
gap:20px;
`;
